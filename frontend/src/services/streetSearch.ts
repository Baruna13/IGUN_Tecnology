import { SCHOOL_AREA } from "../data/schoolArea";
import { distanceMeters, isWithinZone } from "./spatialAnalysis";

export interface Street {
  name: string;
  /** "Kelurahan/Desa, Kecamatan" */
  place: string;
  coordinates: [number, number];
  nameWords: string[];
  placeWords: string[];
}

const STREET_PREFIX = /^(jalan|jln|jl|jalam|gang|gg)$/;
const ROAD = /^(jalan|jln|jl)$/;
const ALLEY = /^(gang|gg)$/;

function words(text: string): string[] {
  return text
    .toLocaleLowerCase("id")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

/** Drops a leading "Jalan"/"Jl."/"Gang" and "Raya", so "jl mawar", "mawar" and "Jalan Raya Mawar" are the same name. */
function coreWords(text: string): string[] {
  const all = words(text);
  const core = all.length > 1 && STREET_PREFIX.test(all[0]) ? all.slice(1) : all;
  return core.length > 1 && core[0] === "raya" ? core.slice(1) : core;
}

/** Streets inside the school area only (see scripts/build-street-index.mjs for the source). */
export async function loadStreets(): Promise<Street[]> {
  const rows = (await import("../data/bogorStreets.json")).default as [string, string, number, number][];
  return rows
    .map(([name, place, lng, lat]) => ({
      name,
      place,
      coordinates: [lng, lat] as [number, number],
      nameWords: coreWords(name),
      placeWords: words(place),
    }))
    .filter((street) => isWithinZone(street.coordinates, SCHOOL_AREA));
}

/**
 * Every street matching the query. Each word must start a word of the street
 * name, or of its place ("mawar ciomas"). Exact names come first, then names
 * starting with the query, then the rest; ties are ordered nearest first.
 */
export function searchStreets(streets: Street[], query: string, near: [number, number]): Street[] {
  // A house number does not help find the street.
  const wanted = coreWords(query.replace(/\b(no|nomor)\b\.?\s*\d+\S*/i, " "));
  if (wanted.join("").length < 2 || (wanted.length === 1 && STREET_PREFIX.test(wanted[0]))) return [];

  const asked = words(query)[0];
  const startsAny = (list: string[], word: string) => list.some((w) => w.startsWith(word));
  return streets
    .flatMap((street) => {
      const inName = wanted.filter((word) => startsAny(street.nameWords, word));
      const matches =
        inName.length > 0 && wanted.every((word) => inName.includes(word) || startsAny(street.placeWords, word));
      if (!matches) return [];
      const inOrder = inName.every((word, i) => street.nameWords[i]?.startsWith(word));
      const exact = inOrder && street.nameWords.join(" ") === inName.join(" ");
      // Asking for a "Jalan" lists alleys of the same name after the roads, and the other way around.
      const otherKind = ROAD.test(asked) ? ALLEY.test(words(street.name)[0]) : ALLEY.test(asked) && ROAD.test(words(street.name)[0]);
      const rank = (exact ? 0 : inOrder ? 2 : 4) + (otherKind ? 1 : 0);
      return [{ street, rank, distance: distanceMeters(near, street.coordinates) }];
    })
    .sort((a, b) => a.rank - b.rank || a.distance - b.distance)
    .map((r) => r.street);
}
