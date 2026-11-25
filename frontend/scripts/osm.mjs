/** Shared OpenStreetMap helpers for the data-building scripts in this folder. */
import { lineString, multiPolygon, simplify } from "@turf/turf";

export async function overpass(query) {
  for (let attempt = 1; attempt <= 6; attempt++) {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: { "User-Agent": "generic-gis-client/1.0" },
      body: new URLSearchParams({ data: `[out:json][timeout:150];${query}` }),
    }).catch(() => null);
    if (res?.ok) return (await res.json()).elements;
    console.log(`Overpass busy, retrying (${attempt})`);
    await new Promise((r) => setTimeout(r, attempt * 15_000));
  }
  throw new Error("Overpass unavailable");
}

/**
 * Joins a relation's outer ways into closed rings. A tolerance simplifies each
 * way before joining, so two neighbours still share exactly the same line.
 */
export function toPolygon(rel, tolerance = 0) {
  const ways = rel.members
    .filter((m) => m.type === "way" && m.role !== "inner" && m.geometry)
    .map((m) => m.geometry.map((p) => [p.lon, p.lat]))
    .map((line) =>
      tolerance ? simplify(lineString(line), { tolerance, highQuality: true }).geometry.coordinates : line
    );
  const rings = [];
  while (ways.length) {
    let ring = ways.pop();
    while (String(ring[0]) !== String(ring.at(-1))) {
      const end = String(ring.at(-1));
      const i = ways.findIndex((w) => String(w[0]) === end || String(w.at(-1)) === end);
      if (i < 0) break;
      const [next] = ways.splice(i, 1);
      ring = ring.concat(String(next[0]) === end ? next.slice(1) : next.reverse().slice(1));
    }
    if (ring.length > 3 && String(ring[0]) === String(ring.at(-1))) rings.push([ring]);
  }
  return rings.length ? multiPolygon(rings, { name: rel.tags.name }) : null;
}
