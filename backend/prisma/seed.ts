import { PrismaClient } from "@prisma/client";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHOOLS_GEOJSON_PATH = path.resolve(__dirname, "../../qgis/schools.geojson");

/**
 * quota is the official 2024/2025 daya tampung for SMAN 1-10 Bogor (published
 * by SMAN 5 Bogor) and null where no source publishes it.
 * Accreditation, accreditation score, and the domicile zone radius are
 * NOT present in the OSM export (OSM has no PPDB/Dapodik data) -- they are
 * policy/administrative figures kept as reasonable placeholders here until a
 * real source (e.g. Kemdikbud Dapodik, or the school district) is wired in.
 * Everything else below (name, npsn, coordinates, district) comes straight
 * from qgis/schools.geojson.
 */
const POLICY_DEFAULTS: Record<string, { accreditation: "A" | "B" | "C" | null; accreditationScore: number; quota: number | null }> = {
  // Kota Bogor
  "20220342": { accreditation: "A", accreditationScore: 98, quota: 324 }, // SMA Negeri 1 Bogor
  "20238516": { accreditation: "A", accreditationScore: 93, quota: 323 }, // SMA Negeri 2 Bogor
  "20220332": { accreditation: "A", accreditationScore: 95, quota: 320 }, // SMA Negeri 3 Bogor
  "20220334": { accreditation: "A", accreditationScore: 90, quota: 324 }, // SMA Negeri 4 Bogor
  "20238517": { accreditation: "A", accreditationScore: 88, quota: 324 }, // SMA Negeri 5 Bogor
  "20220335": { accreditation: "A", accreditationScore: 84, quota: 324 }, // SMA Negeri 6 Bogor
  "20220336": { accreditation: "A", accreditationScore: 86, quota: 324 }, // SMA Negeri 7 Bogor
  "20220337": { accreditation: "A", accreditationScore: 81, quota: 324 }, // SMA Negeri 8 Bogor
  "20220338": { accreditation: "A", accreditationScore: 89, quota: 324 }, // SMA Negeri 9 Bogor
  "20220341": { accreditation: "A", accreditationScore: 83, quota: 324 }, // SMA Negeri 10 Bogor
  // Kabupaten Bogor (placeholder policy data until Dapodik is wired in). Schools not listed here use DEFAULT_POLICY.
  "20200691": { accreditation: "A", accreditationScore: 80, quota: 431 }, // SMAN 2 Cibinong (daya tampung 2024/25, Tribun Bogor)
  "20232374": { accreditation: "A", accreditationScore: 80, quota: null }, // SMA Negeri 1 Ciomas
  "20200681": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 1 Cileungsi
  "20200603": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 1 Citeureup
  "20270776": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 2 Gunung Putri
  "20232377": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 1 Dramaga
  "69754446": { accreditation: "A", accreditationScore: 80, quota: null }, // SMA Negeri 1 Rancabungur
  "20200676": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 1 Ciampea
  "20200903": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 1 Rumpin
  "20231331": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 1 Gunungsindur
  "20231322": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 1 Babakan Madang
  "69926270": { accreditation: "A", accreditationScore: 80, quota: null }, // SMAN 2 Cileungsi
};
/** Real accreditation (Sekolah Kita, read 2026-11-27): A unless listed; null = not accredited yet. */
const NOT_ACCREDITED_A: Record<string, "B" | null> = {"20232383":"B", "69752279":"B", "69986555":"B", "70055743":null, "70055745":null, "70062856":null, "70062861":null, "70062899":null};
function realAccreditation(npsn: string): "A" | "B" | null {
  return npsn in NOT_ACCREDITED_A ? NOT_ACCREDITED_A[npsn] : "A";
}
const DEFAULT_POLICY = { accreditation: "B" as const, accreditationScore: 80, quota: null };
const DEFAULT_ZONE_RADIUS_METERS = 1500;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface RawSchoolFeature {
  type: "Feature";
  properties: {
    name: string;
    npsn: string;
    level: "SMA" | "SMK";
    status: "NEGERI" | "SWASTA";
    district: string | null;
    subdistrict: string | null;
    address: string | null;
    source: string;
  };
  geometry: { type: "Point"; coordinates: [number, number] };
}

async function loadSchoolsFromGeoJson() {
  const raw = await readFile(SCHOOLS_GEOJSON_PATH, "utf-8");
  const geojson = JSON.parse(raw) as { features: RawSchoolFeature[] };
  return geojson.features.map((f) => {
    const p = f.properties;
    const policy = { ...DEFAULT_POLICY, ...POLICY_DEFAULTS[p.npsn], accreditation: realAccreditation(p.npsn) };
    return {
      slug: slugify(p.name),
      name: p.name,
      npsn: p.npsn,
      level: p.level,
      status: p.status,
      address: p.address ?? `${p.district ?? "Bogor"}`,
      district: p.district ?? "Kota Bogor",
      accreditation: policy.accreditation,
      accreditationScore: policy.accreditationScore,
      quota: policy.quota,
      zoneRadiusMeters: DEFAULT_ZONE_RADIUS_METERS,
      longitude: f.geometry.coordinates[0],
      latitude: f.geometry.coordinates[1],
    };
  });
}

const ADMIN_BOUNDARIES: { name: string; ring: [number, number][] }[] = [
  {
    name: "Kec. Bogor Tengah",
    ring: [
      [106.786, -6.589],
      [106.804, -6.589],
      [106.807, -6.602],
      [106.792, -6.611],
      [106.782, -6.603],
      [106.786, -6.589],
    ],
  },
  {
    name: "Kec. Bogor Utara",
    ring: [
      [106.79, -6.578],
      [106.812, -6.575],
      [106.814, -6.589],
      [106.804, -6.589],
      [106.786, -6.589],
      [106.788, -6.581],
      [106.79, -6.578],
    ],
  },
  {
    name: "Kec. Bogor Timur",
    ring: [
      [106.804, -6.589],
      [106.814, -6.589],
      [106.816, -6.605],
      [106.807, -6.602],
      [106.804, -6.589],
    ],
  },
  {
    name: "Kec. Bogor Selatan",
    ring: [
      [106.782, -6.603],
      [106.792, -6.611],
      [106.807, -6.602],
      [106.8, -6.622],
      [106.778, -6.624],
      [106.775, -6.611],
      [106.782, -6.603],
    ],
  },
  {
    name: "Kec. Tanah Sareal",
    ring: [
      [106.775, -6.578],
      [106.79, -6.578],
      [106.788, -6.581],
      [106.786, -6.589],
      [106.782, -6.603],
      [106.775, -6.611],
      [106.766, -6.595],
      [106.775, -6.578],
    ],
  },
  {
    name: "Kec. Bogor Barat",
    ring: [
      [106.766, -6.595],
      [106.775, -6.578],
      [106.79, -6.578],
      [106.788, -6.581],
      [106.786, -6.589],
      [106.775, -6.611],
      [106.76, -6.6],
      [106.756, -6.585],
      [106.766, -6.595],
    ],
  },
];

async function main() {
  const schools = await loadSchoolsFromGeoJson();

  console.log(`Loaded ${schools.length} real public SMA points from qgis/schools.geojson`);

  // Clear out any leftover placeholder rows from earlier dummy seeding so
  // stale fake schools don't linger alongside the real dataset.
  console.log("Clearing existing schools table...");
  await prisma.school.deleteMany();

  console.log("Seeding schools...");
  for (const school of schools) {
    await prisma.school.upsert({
      where: { npsn: school.npsn },
      update: school,
      create: school,
    });
  }

  console.log("Seeding admin boundaries (still placeholder polygons -- see docs/CLAUDE.md QGIS workflow)...");
  for (const boundary of ADMIN_BOUNDARIES) {
    await prisma.adminBoundary.upsert({
      where: { name: boundary.name },
      update: { geometry: { type: "Polygon", coordinates: [boundary.ring] } },
      create: { name: boundary.name, geometry: { type: "Polygon", coordinates: [boundary.ring] } },
    });
  }

  console.log(`Done: ${schools.length} schools (real), ${ADMIN_BOUNDARIES.length} boundaries (placeholder).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
