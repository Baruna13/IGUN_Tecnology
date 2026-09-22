import type { School as PrismaSchool } from "@prisma/client";
import type { SchoolDTO } from "../types/school.js";

export function toSchoolDTO(school: PrismaSchool): SchoolDTO {
  return {
    id: school.id,
    slug: school.slug,
    name: school.name,
    npsn: school.npsn,
    level: school.level,
    status: school.status,
    address: school.address,
    district: school.district,
    accreditation: school.accreditation,
    accreditationScore: school.accreditationScore,
    quota: school.quota,
    zoneRadiusMeters: school.zoneRadiusMeters,
    coordinates: [school.longitude, school.latitude],
  };
}
