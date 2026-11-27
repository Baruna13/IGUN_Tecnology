/**
 * Real road route from home to school by motorcycle, for comparison with the
 * straight-line distance. It is information only: SPMB measures domicile
 * distance as a straight line, so the score keeps using that.
 *
 * Primary: Valhalla on the FOSSGIS public server (OpenStreetMap roads,
 * "motorcycle" costing). Fallback: the OSRM demo server ("driving" profile, no
 * motorcycle profile there). Both are free public services with fair-use
 * limits; the home and school coordinates are sent to them.
 */
export interface RoadRoute {
  meters: number;
  seconds: number;
  /** Route geometry as [lat, lng] pairs, ready for Leaflet */
  path: [number, number][];
  profile: "motor" | "mobil";
}

type LngLat = [number, number];

const VALHALLA_URL = "https://valhalla1.openstreetmap.de/route";
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

/** Decodes a Google-style encoded polyline (Valhalla uses precision 6). */
function decodePolyline(encoded: string, precision = 6): [number, number][] {
  const factor = 10 ** precision;
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    for (const axis of [0, 1]) {
      let result = 0;
      let shift = 0;
      let byte: number;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += delta;
      else lng += delta;
    }
    points.push([lat / factor, lng / factor]);
  }
  return points;
}

async function valhallaRoute(from: LngLat, to: LngLat, signal?: AbortSignal): Promise<RoadRoute> {
  const body = {
    locations: [
      { lon: from[0], lat: from[1] },
      { lon: to[0], lat: to[1] },
    ],
    costing: "motorcycle",
    units: "kilometers",
    directions_type: "none",
  };
  const res = await fetch(`${VALHALLA_URL}?json=${encodeURIComponent(JSON.stringify(body))}`, { signal });
  if (!res.ok) throw new Error(`Valhalla ${res.status}`);
  const data = await res.json();
  const leg = data?.trip?.legs?.[0];
  if (!leg?.shape) throw new Error("Valhalla: no route");
  return {
    meters: data.trip.summary.length * 1000,
    seconds: data.trip.summary.time,
    path: decodePolyline(leg.shape, 6),
    profile: "motor",
  };
}

async function osrmRoute(from: LngLat, to: LngLat, signal?: AbortSignal): Promise<RoadRoute> {
  const res = await fetch(`${OSRM_URL}/${from[0]},${from[1]};${to[0]},${to[1]}?overview=full&geometries=geojson`, { signal });
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route) throw new Error("OSRM: no route");
  return {
    meters: route.distance,
    seconds: route.duration,
    path: (route.geometry.coordinates as LngLat[]).map(([lng, lat]) => [lat, lng]),
    profile: "mobil",
  };
}

export async function fetchRoadRoute(from: LngLat, to: LngLat, signal?: AbortSignal): Promise<RoadRoute> {
  try {
    return await valhallaRoute(from, to, signal);
  } catch (err) {
    if (signal?.aborted) throw err;
    return osrmRoute(from, to, signal);
  }
}

export function formatDuration(seconds: number): string {
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} menit`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} jam ${m} menit` : `${h} jam`;
}
