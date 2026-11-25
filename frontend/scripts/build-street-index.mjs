/**
 * Rebuilds src/data/bogorStreets.json: every named street in and around Kota
 * Bogor, from OpenStreetMap (c) OpenStreetMap contributors, ODbL.
 * Run from frontend/:  node scripts/build-street-index.mjs
 *
 * Output rows are [name, "Kelurahan/Desa, Kecamatan", lng, lat]. Segments of
 * one street are merged, but same-named streets in different places (or the
 * same street in another kelurahan) stay separate rows.
 */
import { writeFileSync } from "node:fs";
import { bbox, booleanPointInPolygon, point } from "@turf/turf";
import { overpass, toPolygon } from "./osm.mjs";

// south,west,north,east of SCHOOL_AREA; the app clips to the exact outline.
const BBOX = "-6.737,106.679,-6.459,106.904";
const SKIP = /^(motorway|raceway|services|proposed|construction)|_link$/;
const MERGE_METERS = 250;

const meters = (a, b) => Math.hypot((a[0] - b[0]) * 109_900, (a[1] - b[1]) * 110_600);

const streets = await overpass(`way["highway"]["name"](${BBOX});out geom tags;`);
const admin = await overpass(`relation["boundary"="administrative"]["admin_level"~"^(6|7)$"](${BBOX});out geom;`);

const areas = { 6: [], 7: [] };
for (const rel of admin) {
  const polygon = toPolygon(rel);
  if (polygon) areas[rel.tags.admin_level].push({ polygon, box: bbox(polygon) });
}
function areaName(level, [x, y]) {
  const hit = areas[level].find(
    ({ polygon, box }) => x >= box[0] && x <= box[2] && y >= box[1] && y <= box[3] && booleanPointInPolygon(point([x, y]), polygon)
  );
  return hit?.polygon.properties.name ?? "";
}

const groups = new Map();
for (const way of streets) {
  if (SKIP.test(way.tags.highway)) continue;
  const line = way.geometry.map((p) => [p.lon, p.lat]);
  const middle = line[Math.floor(line.length / 2)];
  const place = [areaName(7, middle), areaName(6, middle)].filter(Boolean).join(", ");
  const name = way.tags.name.replace(/\s+/g, " ").trim();
  const key = `${name.toLowerCase()}|${place}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push({ name, place, line, middle });
}

const rows = [];
for (const segments of groups.values()) {
  while (segments.length) {
    const cluster = [segments.pop()];
    for (let i = 0; i < cluster.length; i++) {
      for (let j = segments.length - 1; j >= 0; j--) {
        if (cluster[i].line.some((a) => segments[j].line.some((b) => meters(a, b) < MERGE_METERS))) {
          cluster.push(...segments.splice(j, 1));
        }
      }
    }
    // Place the row on the segment closest to the middle of the whole street.
    const mean = [0, 1].map((k) => cluster.reduce((sum, s) => sum + s.middle[k], 0) / cluster.length);
    const best = cluster.reduce((a, b) => (meters(a.middle, mean) <= meters(b.middle, mean) ? a : b));
    rows.push([best.name, best.place, +best.middle[0].toFixed(6), +best.middle[1].toFixed(6)]);
  }
}
rows.sort((a, b) => a[0].localeCompare(b[0], "id", { numeric: true }) || a[1].localeCompare(b[1], "id"));
writeFileSync(
  new URL("../src/data/bogorStreets.json", import.meta.url),
  `[\n${rows.map((r) => JSON.stringify(r)).join(",\n")}\n]\n`
);
console.log(`${streets.length} segments -> ${rows.length} streets, ${rows.filter((r) => !r[1]).length} without a place`);
