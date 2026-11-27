import { apiClient } from "./client";
import type { School, SchoolLevel, SchoolStatus } from "../types/school";
import { SCHOOLS } from "../data/schools";
import { SCHOOL_AREA } from "../data/schoolArea";
import { isWithinZone } from "../services/spatialAnalysis";

interface SchoolApiDTO {
  id: string;
  slug: string;
  name: string;
  npsn: string;
  level: SchoolLevel;
  status: "NEGERI" | "SWASTA";
  address: string;
  district: string;
  accreditation: "A" | "B" | "C" | null;
  accreditationScore: number;
  quota: number | null;
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

/** Keeps only schools in Kota Bogor or within the margin around it. */
function onlyInSchoolArea(schools: School[]): School[] {
  return schools.filter((school) => isWithinZone(school.coordinates, SCHOOL_AREA));
}

export async function fetchSchools(): Promise<School[]> {
  try {
    const schools = await apiClient.get<SchoolApiDTO[]>("/schools");
    return onlyInSchoolArea(schools.map(mapSchool));
  } catch {
    return onlyInSchoolArea(SCHOOLS);
  }
}

