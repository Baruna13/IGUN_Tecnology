/**
 * Rebuilds src/data/kecamatan.json: the real kecamatan borders of Kota and
 * Kabupaten Bogor, plus the neighbouring kecamatan that the SPMB rayon tables
 * list as "irisan", from OpenStreetMap (c) OpenStreetMap contributors, ODbL.
 * Run from frontend/:  node scripts/build-kecamatan.mjs
 */
import { writeFileSync } from "node:fs";
import { truncate } from "@turf/turf";
import { overpass, toPolygon } from "./osm.mjs";

const KAB_BOGOR = 3614762112;
const KOTA_BOGOR = 3614745927;
// Irisan in Sukabumi and Cianjur are missing: OSM has no kecamatan borders there.
// Name and bounding box (south,west,north,east), because some names repeat elsewhere.
const NEIGHBOURS = [
  ["Cipayung", "-6.45,106.75,-6.39,106.83"],
  ["Tapos", "-6.48,106.84,-6.37,106.92"],
  ["Bojongsari", "-6.45,106.70,-6.35,106.78"],
  ["Sawangan", "-6.45,106.73,-6.36,106.80"],
];

const admin = `["boundary"="administrative"]["admin_level"="6"]`;
const inside = await overpass(
  `(area(${KAB_BOGOR});area(${KOTA_BOGOR});)->.a;relation${admin}(area.a);out geom;`
);
const neighbours = await overpass(
  `(${NEIGHBOURS.map(([name, box]) => `relation${admin}["name"="${name}"](${box});`).join("")});out geom;`
);

const features = [];
const seen = new Set();
for (const rel of [...inside, ...neighbours]) {
  const polygon = toPolygon(rel, 0.0001);
  if (!polygon || seen.has(rel.id)) continue;
  seen.add(rel.id);
  features.push(truncate(polygon, { precision: 5 }));
}
features.sort((a, b) => a.properties.name.localeCompare(b.properties.name));
writeFileSync(
  new URL("../src/data/kecamatan.json", import.meta.url),
  `{"type":"FeatureCollection","features":[\n${features.map((f) => JSON.stringify(f)).join(",\n")}\n]}\n`
);
console.log(features.length, features.map((f) => f.properties.name).join(", "));
