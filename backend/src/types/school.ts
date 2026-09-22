export interface SchoolDTO {
  id: string;
  slug: string;
  name: string;
  npsn: string;
  level: "SMA" | "SMK";
  status: "NEGERI" | "SWASTA";
  address: string;
  district: string;
  accreditation: "A" | "B" | "C";
  accreditationScore: number;
  quota: number;
  zoneRadiusMeters: number;
  coordinates: [number, number]; // [lng, lat]
}

export interface EligibilityResultDTO {
  school: SchoolDTO;
  distanceMeters: number;
  radiusMeters: number;
  isEligible: boolean;
  marginMeters: number;
  score: number;
}

export interface RecommendedSchoolDTO extends EligibilityResultDTO {
  rank: number;
}
