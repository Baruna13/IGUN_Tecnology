import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";

export function FloatingHint() {
  const school = useSchoolFinderStore((s) => s.getSelectedSchool());

  return (
    <div className="absolute top-space-sm sm:top-space-md left-space-sm sm:left-space-md z-[1000] max-w-[calc(100%-8rem)] sm:max-w-sm">
      <div className="flex items-center gap-space-xs px-space-sm sm:px-space-md py-space-xs sm:py-space-sm glass-panel rounded-2xl">
        <div className="w-8 h-8 rounded-lg bg-primary-container/25 text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px]">school</span>
        </div>
        <div className="min-w-0">
          <p className="text-body-sm font-body-sm text-on-surface font-semibold truncate">{school.name}</p>
          <p className="text-label-sm font-label-sm text-outline truncate">Klik peta / geser pin hijau untuk atur domisili</p>
        </div>
      </div>
    </div>
  );
}
