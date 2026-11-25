import { point, buffer as turfBuffer, distance as turfDistance, booleanPointInPolygon, simplify } from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { EligibilityResult, RayonStatus, RecommendedSchool, School } from "../types/school";
import { findKecamatan, rayonStatus, schoolRayon } from "./rayon";

/**
 * Straight-line (geodesic) distance between two [lng, lat] points, in meters.
 * Wraps turf.distance() per the CLAUDE.md spec (straight line distance only).
 */
export function distanceMeters(from: [number, number], to: [number, number]): number {
  return turfDistance(point(from), point(to), { units: "kilometers" }) * 1000;
}

/**
 * Builds a circular buffer polygon (the domicile zone) around a school, in meters.
 */
export function buildZoneBuffer(coordinates: [number, number], radiusMeters: number): Feature<Polygon> {
  return turfBuffer(point(coordinates), radiusMeters / 1000, { units: "kilometers", steps: 64 }) as Feature<Polygon>;
}

/**
 * Confirms a home point falls inside a school's buffer polygon.
 * Used as the authoritative eligibility check (turf.booleanPointInPolygon),
 * with straight-line distance kept only for the human-readable readout.
 */
export function isWithinZone(home: [number, number], zone: Feature<Polygon>): boolean {
  return booleanPointInPolygon(point(home), zone);
}

/**
 * Pushes an area's outline outward by a distance in meters, keeping its
 * overall shape. The outline is simplified to ~100 m first: a margin of
 * kilometers smooths that detail away anyway, and buffering the full outline
 * is about 10x slower.
 */
export function buildAreaBuffer(area: Feature<Polygon>, marginMeters: number): Feature<Polygon> {
  const outline = simplify(area, { tolerance: 0.001, highQuality: true });
  return turfBuffer(outline, marginMeters / 1000, { units: "kilometers", steps: 16 }) as Feature<Polygon>;
}

/**
 * How much of the distance score is kept per rayon status. The Juknis SPMB
 * Jabar 2026 selects by "domisili terdekat pada Rayon yang bersesuaian": a home
 * outside the school's rayon cannot use the domisili route at all. Irisan homes
 * may apply like any other; the lower weight is this app's own estimate of
 * crossing into another area, not an official figure.
 */
const RAYON_WEIGHT: Record<RayonStatus, number> = { utama: 1, irisan: 0.8, luar: 0 };

/**
 * Distance part of the score, 0-100. SPMB has no fixed radius: it ranks by
 * distance until the quota is full, and the cut-off is only known afterwards.
 * The (simulated) radius stands in for that cut-off: 100 up to half of it, 20
 * at 1.5x, then fading towards 0 so that farther is always lower.
 */
function distanceScore(distance: number, radius: number): number {
  const ratio = distance / radius;
  if (ratio <= 0.5) return 100;
  if (ratio <= 1.5) return 100 - (ratio - 0.5) * 80;
  return 20 * (1.5 / ratio);
}

export function evaluateEligibility(home: [number, number], school: School, radiusMeters?: number): EligibilityResult {
  const radius = radiusMeters ?? school.zoneRadiusMeters;
  const dist = distanceMeters(home, school.coordinates);
  const zone = buildZoneBuffer(school.coordinates, radius);
  const homeKecamatan = findKecamatan(home);
  const rayon = schoolRayon(school);
  const status = rayonStatus(homeKecamatan, rayon);
  const eligible = status !== "luar" && isWithinZone(home, zone);
  return {
    school,
    distanceMeters: dist,
    radiusMeters: radius,
    homeKecamatan,
    rayonName: rayon?.name ?? null,
    rayonStatus: status,
    isEligible: eligible,
    marginMeters: radius - dist,
    score: distanceScore(dist, radius) * RAYON_WEIGHT[status],
  };
}

/**
 * The N (default 3) schools with the shortest straight line from home, nearest
 * first. Nothing is filtered out, so there is always a recommendation; each one
 * carries its own eligibility and rayon status.
 */
export function recommendSchools(
  home: [number, number],
  schools: School[],
  excludeId?: string,
  limit = 3
): RecommendedSchool[] {
  return schools
    .filter((s) => s.id !== excludeId)
    .map((school) => ({ school, distance: distanceMeters(home, school.coordinates) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ school }, i) => ({ ...evaluateEligibility(home, school), rank: i + 1 }));
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}
