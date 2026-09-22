import { useEffect } from "react";
import { MapView } from "../features/map/MapView";
import { AnalysisPanel } from "../features/analysis/AnalysisPanel";
import { TopNav } from "./TopNav";
import { MapErrorState, MapLoadingState } from "./MapStatusStates";
import { useSchoolsQuery } from "../hooks/useApiQueries";
import { useSchoolFinderStore } from "../hooks/useSchoolFinderStore";

export function AppShell() {
  const schoolsQuery = useSchoolsQuery();
  const setSchools = useSchoolFinderStore((s) => s.setSchools);
  const schoolsInStore = useSchoolFinderStore((s) => s.schools);

  useEffect(() => {
    if (schoolsQuery.data) setSchools(schoolsQuery.data);
  }, [schoolsQuery.data, setSchools]);

  const isReady = schoolsInStore.length > 0;

  return (
    <div className="h-screen w-screen flex flex-col bg-surface overflow-hidden">
      <TopNav />
      <div id="gis-viewport-wrapper" className="relative flex-1 min-h-0 flex">
        {schoolsQuery.isLoading && <MapLoadingState label="Memuat data sekolah dari server..." />}
        {schoolsQuery.isError && (
          <MapErrorState
            message={schoolsQuery.error instanceof Error ? schoolsQuery.error.message : "Terjadi kesalahan."}
            onRetry={() => schoolsQuery.refetch()}
          />
        )}
        {isReady && (
          <>
            <MapView />
            <AnalysisPanel />
          </>
        )}
      </div>
    </div>
  );
}
