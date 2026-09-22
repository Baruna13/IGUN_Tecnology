import type { Feature, FeatureCollection, Polygon } from "geojson";

/**
 * Simplified placeholder district (kecamatan) boundaries around Bogor.
 * These are approximate shapes for UI/demo purposes only -- swap for the
 * real Kemendagri/OSM administrative boundary export via QGIS (see
 * docs/QGIS_WORKFLOW.md) before shipping.
 */
export const ADMIN_BOUNDARIES: FeatureCollection<Polygon, { name: string }> = {
  type: "FeatureCollection",
  features: [
    feature("Kec. Bogor Tengah", [
      [106.786, -6.589],
      [106.804, -6.589],
      [106.807, -6.602],
      [106.792, -6.611],
      [106.782, -6.603],
      [106.786, -6.589],
    ]),
    feature("Kec. Bogor Utara", [
      [106.79, -6.578],
      [106.812, -6.575],
      [106.814, -6.589],
      [106.804, -6.589],
      [106.786, -6.589],
      [106.788, -6.581],
      [106.79, -6.578],
    ]),
    feature("Kec. Bogor Timur", [
      [106.804, -6.589],
      [106.814, -6.589],
      [106.816, -6.605],
      [106.807, -6.602],
      [106.804, -6.589],
    ]),
    feature("Kec. Bogor Selatan", [
      [106.782, -6.603],
      [106.792, -6.611],
      [106.807, -6.602],
      [106.8, -6.622],
      [106.778, -6.624],
      [106.775, -6.611],
      [106.782, -6.603],
    ]),
    feature("Kec. Tanah Sareal", [
      [106.775, -6.578],
      [106.79, -6.578],
      [106.788, -6.581],
      [106.786, -6.589],
      [106.782, -6.603],
      [106.775, -6.611],
      [106.766, -6.595],
      [106.775, -6.578],
    ]),
    feature("Kec. Bogor Barat", [
      [106.766, -6.595],
      [106.775, -6.578],
      [106.79, -6.578],
      [106.788, -6.581],
      [106.786, -6.589],
      [106.775, -6.611],
      [106.76, -6.6],
      [106.756, -6.585],
      [106.766, -6.595],
    ]),
  ],
};

function feature(name: string, ring: [number, number][]): Feature<Polygon, { name: string }> {
  return {
    type: "Feature",
    properties: { name },
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
  };
}
