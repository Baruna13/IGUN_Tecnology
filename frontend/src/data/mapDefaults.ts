/**
 * Frontend-only defaults for the initial map view and starting home marker.
 * Actual school and boundary data now comes from the backend API
 * (see src/api/schoolsApi.ts) -- this file no longer holds a schools array.
 */
export const DEFAULT_HOME_COORDINATES: [number, number] = [106.7975, -6.5951];
export const DEFAULT_HOME_LABEL = "Jl. Pangrango No. 14";

/** Centroid of the seeded Kota + Kabupaten Bogor schools; used to init the map viewport. */
export const MAP_CENTER: [number, number] = [-6.5302, 106.8005];
export const MAP_DEFAULT_ZOOM = 10;
