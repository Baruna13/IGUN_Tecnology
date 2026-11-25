import { bbox, booleanPointInPolygon, point } from "@turf/turf";
import { KECAMATAN_BORDERS } from "../data/kecamatan";
import { RAYONS, type Rayon } from "../data/rayon";
import type { RayonStatus, School } from "../types/school";

const KECAMATAN = KECAMATAN_BORDERS.features.map((feature) => ({ feature, box: bbox(feature) }));

/** "Kec. Rancabungur, Kab. Bogor" and "Ranca Bungur" are the same kecamatan. */
function key(kecamatan: string): string {
  return kecamatan
    .toLowerCase()
    .replace(/^kec\. /, "")
    .replace(/, kab.*$/, "")
    .replace(/[^a-z]/g, "");
}

const includes = (list: string[], kecamatan: string) => list.some((name) => key(name) === key(kecamatan));

/** Points exactly on a border can miss both neighbours, so a miss is retried ~50 m around. */
const SLIVER_DEGREES = 0.00045;

/** Kecamatan containing a [lng, lat] point, or null outside the mapped area. */
export function findKecamatan([lng, lat]: [number, number]): string | null {
  const s = SLIVER_DEGREES;
  for (const [dx, dy] of [[0, 0], [s, 0], [-s, 0], [0, s], [0, -s]]) {
    const name = kecamatanAt(lng + dx, lat + dy);
    if (name) return name;
  }
  return null;
}

function kecamatanAt(lng: number, lat: number): string | null {
  const hit = KECAMATAN.find(
    ({ feature, box }) =>
      lng >= box[0] && lng <= box[2] && lat >= box[1] && lat <= box[3] && booleanPointInPolygon(point([lng, lat]), feature)
  );
  return hit?.feature.properties.name ?? null;
}

/** The rayon a school belongs to: the one whose main kecamatan include the school's. */
export function schoolRayon(school: School): Rayon | null {
  return RAYONS.find((rayon) => includes(rayon.utama, school.district)) ?? null;
}

export function rayonStatus(homeKecamatan: string | null, rayon: Rayon | null): RayonStatus {
  if (!homeKecamatan || !rayon) return "luar";
  if (includes(rayon.utama, homeKecamatan)) return "utama";
  return includes(rayon.irisan, homeKecamatan) ? "irisan" : "luar";
}
