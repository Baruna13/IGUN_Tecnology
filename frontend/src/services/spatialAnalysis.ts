import { point, buffer as turfBuffer, distance as turfDistance, booleanPointInPolygon } from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { EligibilityResult, RecommendedSchool, School } from "../types/school";

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
 * Scores an eligibility result 0-100: full marks well inside the zone,
 * tapering as the home approaches or exceeds the radius.
 */
function scoreFromMargin(distance: number, radius: number): number {
  const ratio = distance / radius;
  if (ratio <= 0.5) return 100;
  if (ratio >= 1.5) return 20;
  // Linear falloff between 100 (at 0.5x radius) and 20 (at 1.5x radius)
  return Math.round(100 - ((ratio - 0.5) / 1.0) * 80);
}

export function evaluateEligibility(home: [number, number], school: School, radiusMeters?: number): EligibilityResult {
  const radius = radiusMeters ?? school.zoneRadiusMeters;
  const dist = distanceMeters(home, school.coordinates);
  const zone = buildZoneBuffer(school.coordinates, radius);
  const eligible = isWithinZone(home, zone);
  return {
    school,
    distanceMeters: dist,
    radiusMeters: radius,
    isEligible: eligible,
    marginMeters: radius - dist,
    score: scoreFromMargin(dist, radius),
  };
}

/**
 * Calculates distance to every school, filters to eligible ones, sorts by
 * nearest, and returns the top N (default 3) as ranked recommendations.
 */
export function recommendSchools(
  home: [number, number],
  schools: School[],
  excludeId?: string,
  limit = 3
): RecommendedSchool[] {
  const evaluated = schools
    .filter((s) => s.id !== excludeId)
    .map((s) => evaluateEligibility(home, s))
    .filter((r) => r.isEligible)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return evaluated.slice(0, limit).map((r, i) => ({ ...r, rank: i + 1 }));
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${Math.round(meters)} m`;
}
