# Smart School Finder — Backend

Express + TypeScript + Prisma API on PostgreSQL/PostGIS. Serves the same
domicile-eligibility and recommendation logic as the frontend's Turf.js
service, so it can become the single source of truth once the frontend is
wired to call it (not done yet — see root `README.md`).

## Prerequisites

- Node.js 20+
- Docker Desktop (for the local Postgres+PostGIS database)

## Setup

```bash
npm install

# 1. Start the database (Postgres 16 + PostGIS, via Docker)
npm run db:up

# 2. Copy env file (already points at the docker-compose credentials)
cp .env.example .env   # skip if .env already exists

# 3. Generate the Prisma client + create tables
npm run prisma:generate
npm run prisma:migrate    # names the migration, e.g. "init"

# 4. Seed placeholder schools + boundaries (same data the frontend uses)
npm run prisma:seed

# 5. Run the API in watch mode
npm run dev
```

The API listens on `http://localhost:4000` by default (see `.env`).

## Endpoints

| Method | Path | Body | Description |
|---|---|---|---|
| GET | `/api/health` | — | Liveness check |
| GET | `/api/schools` | — | List all schools |
| GET | `/api/schools/:id` | — | Single school by id |
| GET | `/api/boundaries` | — | Admin boundaries as a GeoJSON `FeatureCollection` |
| POST | `/api/analysis/eligibility` | `{ schoolId, homeLng, homeLat, radiusMeters? }` | Distance, buffer, point-in-polygon eligibility check |
| POST | `/api/analysis/recommendations` | `{ homeLng, homeLat, excludeSchoolId?, limit? }` | Top-N nearest eligible schools |

Quick test once running:

```bash
curl http://localhost:4000/api/schools
```

## Notes

- `npm run prisma:studio` opens a GUI to browse/edit the database.
- Admin boundary geometry is stored as GeoJSON in a `Json` column for now
  (see the comment at the top of `prisma/schema.prisma` for why, and how to
  upgrade to native PostGIS `geometry` columns + `ST_*` queries later).
- `prisma/seed.ts` currently hardcodes the same placeholder dataset as
  `frontend/src/data/schools.ts`. Once `qgis/schools.geojson` exists for
  real, replace the seed source instead of editing the schema/API.
