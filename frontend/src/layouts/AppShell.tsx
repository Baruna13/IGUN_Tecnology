import { useEffect, useState } from "react";
import { HomePage } from "../features/home/HomePage";
import { MapView } from "../features/map/MapView";
import { AnalysisPanel } from "../features/analysis/AnalysisPanel";
import { TopNav } from "./TopNav";
import { MapErrorState, MapLoadingState } from "./MapStatusStates";
import { useSchoolsQuery } from "../hooks/useApiQueries";
import { useSchoolFinderStore } from "../hooks/useSchoolFinderStore";

export function AppShell() {
  const [isHomeOpen, setIsHomeOpen] = useState(true);
  const schoolsQuery = useSchoolsQuery();
  const setSchools = useSchoolFinderStore((s) => s.setSchools);
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const schoolsInStore = useSchoolFinderStore((s) => s.schools);

  useEffect(() => {
    if (schoolsQuery.data) setSchools(schoolsQuery.data);
  }, [schoolsQuery.data, setSchools]);

  const isReady = schoolsInStore.length > 0;
  const openMap = (schoolId?: string) => {
    if (schoolId) selectSchool(schoolId);
    setIsHomeOpen(false);
  };

  return isHomeOpen ? (
    <HomePage schools={schoolsInStore} onOpenMap={openMap} />
  ) : (
    <div className="h-screen w-screen flex flex-col bg-surface overflow-hidden">
      <TopNav onHome={() => setIsHomeOpen(true)} />
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
