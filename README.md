# Smart School Finder

WebGIS decision-support app for checking SPMB/zonasi domicile eligibility
against a chosen public high school, and recommending the nearest eligible
alternatives when the home address falls outside the zone.

## Status

| Part | Status |
|---|---|
| `frontend/` | ✅ Working — React + TS + Vite + Tailwind + Leaflet + Turf.js, map-first floating UI (no permanent sidebar), full client-side spatial analysis. Real school locations, placeholder boundaries/addresses |
| `backend/` | ✅ Working — Express + Prisma + PostgreSQL/PostGIS API, same real school data, seeded from `qgis/schools.geojson`. Not yet called by the frontend (still separate) |
| `database/` | Provisioned via `backend/docker-compose.yml` (Postgres 16 + PostGIS) |
| `qgis/` | `schools.geojson` — 10 real public SMA in Bogor, cleaned/deduped from an OSM export (`schools_raw_osm.geojson`). Boundaries and roads not sourced yet |
| `docs/` | `CLAUDE.md` (original spec), `UI_GUIDELINE.md` (design tokens from the Stitch mockup) |

The frontend currently runs on **real school locations** (10 public SMA in
Bogor, sourced from OpenStreetMap via `qgis/schools.geojson`) but the
kecamatan boundary polygons and the address-search list are still
**placeholder data**. All spatial math — distance, buffer, point-in-polygon,
and the top-3 recommendation ranking — is real and computed client-side with
Turf.js, so the logic will not change once the remaining placeholders
(boundaries, geocoding) are replaced; only those data sources will.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Then open the printed local URL (defaults to http://localhost:5173).

## What's implemented (frontend)

- **Map-first layout**: fixed top nav (logo + unified school/address search +
  user menu) with the map filling the rest of the viewport. No permanent
  sidebar — all controls float over the map, per the design brief.
- **Leaflet map** on a CARTO dark basemap (real OSM-derived tiles, not the
  static SVG mockup from Stitch) with:
  - Placeholder kecamatan boundary polygons
  - A live domicile buffer polygon (Turf `buffer`) around the selected school
  - School markers (selected / top-3 recommended / passive), a draggable
    home marker, and a distance connector line
  - Smooth `flyTo` pan/zoom when a school is selected
- **Spatial analysis service** (`src/services/spatialAnalysis.ts`): wraps
  `turf.distance`, `turf.buffer`, and `turf.booleanPointInPolygon` exactly as
  specified, plus a 0–100 eligibility score and the nearest-3-eligible-schools
  recommender.
- **Floating analysis panel**: school detail, eligibility verdict
  (Eligible/green vs Not Eligible/red), radius simulation slider (600m–3km),
  and the top-3 recommendation cards — becomes a bottom sheet on mobile.
- **Floating map controls**: zoom, locate-home, layer toggles, fullscreen,
  plus a floating legend.

## Next steps

1. Wire the frontend to the backend API (React Query) instead of its local
   `src/data/schools.ts` copy — see `backend/README.md` for the endpoints.
2. Get a real kecamatan boundary export (and roads, if wanted) into
   `qgis/` — same OSM → QGIS → GeoJSON pipeline used for the schools.
3. Replace the placeholder address list with a real geocoder.
4. Replace the estimated accreditation/quota figures in
   `backend/prisma/seed.ts` with real Dapodik/PPDB data once available.
