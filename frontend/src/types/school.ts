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
  /** BAN-PDM accreditation; null for schools not accredited yet */
  accreditation: "A" | "B" | "C" | null;
  accreditationScore: number;
  /** Official daya tampung (all SPMB routes), 2024/2025; null when no source publishes it */
  quota: number | null;
  /** Domicile zoning radius in meters, used for the buffer/eligibility check */
  zoneRadiusMeters: number;
  /** [longitude, latitude], matches GeoJSON coordinate order */
  coordinates: [number, number];
}

/** SPMB domisili: "utama" = main kecamatan of the school's rayon, "irisan" = bordering, "luar" = cannot apply. */
export type RayonStatus = "utama" | "irisan" | "luar";

export interface EligibilityResult {
  school: School;
  distanceMeters: number;
  radiusMeters: number;
  /** Kecamatan of the home point; null when outside the mapped area */
  homeKecamatan: string | null;
  rayonName: string | null;
  rayonStatus: RayonStatus;
  /** Inside the simulated radius AND allowed by the school's rayon */
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
