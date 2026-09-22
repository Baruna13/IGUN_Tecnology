import { point, buffer as turfBuffer, distance as turfDistance, booleanPointInPolygon } from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import type { EligibilityResultDTO, RecommendedSchoolDTO, SchoolDTO } from "../types/school.js";

/** Straight-line (geodesic) distance between two [lng, lat] points, in meters. */
export function distanceMeters(from: [number, number], to: [number, number]): number {
  return turfDistance(point(from), point(to), { units: "kilometers" }) * 1000;
}

/** Circular buffer polygon (the domicile zone) around a school, in meters. */
export function buildZoneBuffer(coordinates: [number, number], radiusMeters: number): Feature<Polygon> {
  return turfBuffer(point(coordinates), radiusMeters / 1000, { units: "kilometers", steps: 64 }) as Feature<Polygon>;
}

/** Authoritative eligibility check: is the home point inside the school's buffer polygon? */
export function isWithinZone(home: [number, number], zone: Feature<Polygon>): boolean {
  return booleanPointInPolygon(point(home), zone);
}

function scoreFromMargin(distance: number, radius: number): number {
  const ratio = distance / radius;
  if (ratio <= 0.5) return 100;
  if (ratio >= 1.5) return 20;
  return Math.round(100 - ((ratio - 0.5) / 1.0) * 80);
}

export function evaluateEligibility(
  home: [number, number],
  school: SchoolDTO,
  radiusMeters?: number
): EligibilityResultDTO {
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

export function recommendSchools(
  home: [number, number],
  schools: SchoolDTO[],
  excludeId?: string,
  limit = 3
): RecommendedSchoolDTO[] {
  const evaluated = schools
    .filter((s) => s.id !== excludeId)
    .map((s) => evaluateEligibility(home, s))
    .filter((r) => r.isEligible)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);

  return evaluated.slice(0, limit).map((r, i) => ({ ...r, rank: i + 1 }));
}
