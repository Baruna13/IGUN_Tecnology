import { useEffect, useState } from "react";
import { HomePage } from "../features/home/HomePage";
import { MapView } from "../features/map/MapView";
import { AnalysisPanel } from "../features/analysis/AnalysisPanel";
import { TopNav } from "./TopNav";
import { MapErrorState, MapLoadingState } from "./MapStatusStates";
import { useSchoolsQuery } from "../hooks/useApiQueries";
import { useSchoolFinderStore } from "../hooks/useSchoolFinderStore";
import { OnboardingTutorial } from "../features/tutorial/OnboardingTutorial";
import { useTutorialStore } from "../features/tutorial/useTutorialStore";

export function AppShell() {
  const [isHomeOpen, setIsHomeOpen] = useState(true);
  const schoolsQuery = useSchoolsQuery();
  const setSchools = useSchoolFinderStore((s) => s.setSchools);
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const schoolsInStore = useSchoolFinderStore((s) => s.schools);
  const openTutorial = useTutorialStore((s) => s.openTutorial);

  useEffect(() => {
    if (schoolsQuery.data) setSchools(schoolsQuery.data);
  }, [schoolsQuery.data, setSchools]);

  const isReady = schoolsInStore.length > 0;
  const openMap = (schoolId?: string) => {
    if (schoolId) selectSchool(schoolId);
    setIsHomeOpen(false);
  };

  // Otomatis buka tutorial untuk pengguna baru saat pertama kali masuk ke peta
  useEffect(() => {
    if (!isHomeOpen && isReady) {
      const hasCompleted = localStorage.getItem("eduzone_tutorial_completed");
      if (!hasCompleted) {
        const timer = setTimeout(() => {
          openTutorial();
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [isHomeOpen, isReady, openTutorial]);

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
            <OnboardingTutorial />
          </>
        )}
      </div>
    </div>
  );
}
