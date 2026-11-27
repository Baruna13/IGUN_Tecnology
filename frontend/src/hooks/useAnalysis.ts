import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchRoadRoute } from "../services/roadRoute";
import { evaluateEligibility, recommendSchools } from "../services/spatialAnalysis";
import { useSchoolFinderStore } from "./useSchoolFinderStore";

/**
 * Computes the eligibility result for the currently selected school,
 * memoized on its actual inputs. Calling store getters directly inside a
 * `useStore(s => s.getEligibility())` selector returns a brand-new object
 * every render, which trips useSyncExternalStore into an infinite update
 * loop -- so the computation lives here instead, outside the store.
 */
export function useEligibility() {
  const home = useSchoolFinderStore((s) => s.home);
  const radiusOverrideMeters = useSchoolFinderStore((s) => s.radiusOverrideMeters);
  const school = useSchoolFinderStore((s) => s.getSelectedSchool());

  return useMemo(
    () => evaluateEligibility(home.coordinates, school, radiusOverrideMeters ?? undefined),
    [home, school, radiusOverrideMeters]
  );
}

/** Same rationale as useEligibility: memoized, not recomputed on every render. */
export function useRecommendations() {
  const schools = useSchoolFinderStore((s) => s.schools);
  const home = useSchoolFinderStore((s) => s.home);
  const school = useSchoolFinderStore((s) => s.getSelectedSchool());

  return useMemo(() => recommendSchools(home.coordinates, schools, school.id, 3), [home, schools, school.id]);
}

/**
 * Motorcycle road route from home to the selected school (see services/roadRoute.ts).
 * Cached per home/school pair; coordinates are rounded (~1 m) for the cache key.
 */
export function useRoadRoute() {
  const home = useSchoolFinderStore((s) => s.home);
  const school = useSchoolFinderStore((s) => s.getSelectedSchool());
  const from = home.coordinates;
  const to = school.coordinates;
  const round = (n: number) => Math.round(n * 1e5) / 1e5;

  return useQuery({
    queryKey: ["road-route", round(from[0]), round(from[1]), round(to[0]), round(to[1])],
    queryFn: ({ signal }) => fetchRoadRoute(from, to, signal),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
