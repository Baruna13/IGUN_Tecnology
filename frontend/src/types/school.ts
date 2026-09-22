export type SchoolLevel = "SMA" | "SMK";
export type SchoolStatus = "Negeri" | "Swasta";

export interface School {
  id: string;
  name: string;
  npsn: string;
  level: SchoolLevel;
  status: SchoolStatus;
  address: string;
  district: string;
  accreditation: "A" | "B" | "C";
  accreditationScore: number;
  quota: number;
  /** Domicile zoning radius in meters, used for the buffer/eligibility check */
  zoneRadiusMeters: number;
  /** [longitude, latitude], matches GeoJSON coordinate order */
  coordinates: [number, number];
}

export interface EligibilityResult {
  school: School;
  distanceMeters: number;
  radiusMeters: number;
  isEligible: boolean;
  /** Positive when inside the zone (headroom), negative when outside (overage) */
  marginMeters: number;
  score: number;
}

export interface RecommendedSchool extends EligibilityResult {
  rank: number;
}

export interface HomeLocation {
  coordinates: [number, number];
  label: string;
}
