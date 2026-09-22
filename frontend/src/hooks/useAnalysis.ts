import { useMemo } from "react";
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
