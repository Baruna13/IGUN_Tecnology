import type { FeatureCollection, Polygon } from "geojson";
import { apiClient } from "./client";
import type { School, SchoolLevel, SchoolStatus } from "../types/school";

interface SchoolApiDTO {
  id: string;
  slug: string;
  name: string;
  npsn: string;
  level: SchoolLevel;
  status: "NEGERI" | "SWASTA";
  address: string;
  district: string;
  accreditation: "A" | "B" | "C";
  accreditationScore: number;
  quota: number;
  zoneRadiusMeters: number;
  coordinates: [number, number];
}

function toFrontendStatus(status: "NEGERI" | "SWASTA"): SchoolStatus {
  return status === "NEGERI" ? "Negeri" : "Swasta";
}

function mapSchool(dto: SchoolApiDTO): School {
  return {
    id: dto.id,
    name: dto.name,
    npsn: dto.npsn,
    level: dto.level,
    status: toFrontendStatus(dto.status),
    address: dto.address,
    district: dto.district,
    accreditation: dto.accreditation,
    accreditationScore: dto.accreditationScore,
    quota: dto.quota,
    zoneRadiusMeters: dto.zoneRadiusMeters,
    coordinates: dto.coordinates,
  };
}

export async function fetchSchools(): Promise<School[]> {
  const schools = await apiClient.get<SchoolApiDTO[]>("/schools");
  return schools.map(mapSchool);
}

export async function fetchBoundaries(): Promise<FeatureCollection<Polygon, { name: string }>> {
  return apiClient.get<FeatureCollection<Polygon, { name: string }>>("/boundaries");
}
