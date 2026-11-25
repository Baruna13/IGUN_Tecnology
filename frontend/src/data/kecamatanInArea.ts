import { area, feature, featureCollection, intersect } from "@turf/turf";
import type { MultiPolygon, Polygon } from "geojson";
import { KECAMATAN_BORDERS, type KecamatanBorders } from "./kecamatan";
import { SCHOOL_AREA } from "./schoolArea";

/** Ignores kecamatan that only graze the outline. */
const MIN_OVERLAP_SQUARE_METERS = 300_000;

/** Kecamatan shown on the map: every one that reaches into the school area, drawn whole. */
export const KECAMATAN_IN_SCHOOL_AREA: KecamatanBorders = {
  type: "FeatureCollection",
  features: KECAMATAN_BORDERS.features.filter((kecamatan) => {
    const overlap = intersect(
      featureCollection<Polygon | MultiPolygon>([feature(kecamatan.geometry), feature(SCHOOL_AREA.geometry)])
    );
    return overlap !== null && area(overlap) >= MIN_OVERLAP_SQUARE_METERS;
  }),
};
