import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
const MIN = 600;
const MAX = 3000;
const STEP = 50;
export function RadiusSlider() {
  const school = useSchoolFinderStore((s) => s.getSelectedSchool());
  const override = useSchoolFinderStore((s) => s.radiusOverrideMeters);
  const setRadiusOverride = useSchoolFinderStore((s) => s.setRadiusOverride);
  const value = override ?? school.zoneRadiusMeters;
  return (
    <div className="p-space-sm bg-[#f0fdf4] border border-[#86efac] rounded-xl flex flex-col gap-space-xs">
      <div className="flex items-center justify-between">
        <span className="font-label-md text-label-md text-[#15803d] font-semibold flex items-center gap-space-2xs">
          <span className="material-symbols-outlined text-[16px] text-[#22c55e]">tune</span>
          Simulasi Radius Zonasi
        </span>
        <span className="font-label-md text-label-md text-[#166534] font-bold">{value.toLocaleString("id-ID")} m</span>
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        onChange={(e) => setRadiusOverride(Number(e.target.value))}
        className="w-full h-1.5 bg-[#86efac] rounded-lg appearance-none cursor-pointer accent-[#16a34a]"
      />
      <div className="flex justify-between font-label-sm text-label-sm text-[#166534]">
        <span>Min {(MIN / 1000).toFixed(1)}km</span>
        <span>Standar {(school.zoneRadiusMeters / 1000).toFixed(1)}km</span>
        <span>Max {(MAX / 1000).toFixed(1)}km</span>
      </div>
    </div>
  );
}