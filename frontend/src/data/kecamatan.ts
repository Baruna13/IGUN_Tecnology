import type { FeatureCollection, MultiPolygon } from "geojson";
import kecamatanJson from "./kecamatan.json";

export type KecamatanBorders = FeatureCollection<MultiPolygon, { name: string }>;

/** Real kecamatan borders from OpenStreetMap (see scripts/build-kecamatan.mjs). */
export const KECAMATAN_BORDERS = kecamatanJson as unknown as KecamatanBorders;
