import { useMemo, useState } from "react";
import { ADDRESS_SUGGESTIONS } from "../data/addresses";
import { useSchoolFinderStore } from "../hooks/useSchoolFinderStore";

export function TopNav() {
  const schools = useSchoolFinderStore((s) => s.schools);
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const setHome = useSchoolFinderStore((s) => s.setHome);

  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"school" | "address">("school");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (mode === "school") {
      const list = q ? schools.filter((s) => s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)) : schools;
      return list.slice(0, 6);
    }
    const list = q
      ? ADDRESS_SUGGESTIONS.filter((a) => a.label.toLowerCase().includes(q))
      : ADDRESS_SUGGESTIONS;
    return list.slice(0, 6);
  }, [query, mode, schools]);

  return (
    <header className="relative z-50 h-16 shrink-0 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="h-full px-space-md sm:px-space-lg flex items-center gap-space-md">
        <div className="flex items-center gap-space-xs shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-glow-primary">
            <span className="material-symbols-outlined text-[18px] text-on-primary-container">travel_explore</span>
          </div>
          <span className="font-headline-sm text-headline-sm text-on-surface hidden sm:inline">Smart School Finder</span>
        </div>

        <div className="flex-1 max-w-xl relative">
          <div className="flex items-center bg-surface-container-high/70 rounded-xl px-space-sm h-10 gap-space-xs">
            <span className="material-symbols-outlined text-outline text-[18px]">search</span>
            <div className="flex text-label-sm font-label-sm shrink-0 gap-1 pr-space-xs border-r border-white/10 mr-space-xs">
              <button
                onClick={() => setMode("school")}
                className={mode === "school" ? "text-primary font-semibold" : "text-outline"}
              >
                Sekolah
              </button>
              <span className="text-outline">/</span>
              <button
                onClick={() => setMode("address")}
                className={mode === "address" ? "text-primary font-semibold" : "text-outline"}
              >
                Alamat
              </button>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 120)}
              placeholder={mode === "school" ? "Cari sekolah negeri..." : "Cari alamat domisili..."}
              className="bg-transparent w-full text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none"
            />
          </div>

          {isOpen && results.length > 0 && (
            <div className="absolute top-12 left-0 right-0 glass-panel rounded-xl p-space-2xs overflow-hidden">
              {mode === "school"
                ? results.map((school: any) => (
                    <button
                      key={school.id}
                      onMouseDown={() => {
                        selectSchool(school.id);
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-space-sm py-space-xs rounded-lg hover:bg-surface-container-high transition-colors flex flex-col"
                    >
                      <span className="text-body-sm font-body-sm text-on-surface font-medium">{school.name}</span>
                      <span className="text-label-sm font-label-sm text-outline">{school.address}</span>
                    </button>
                  ))
                : results.map((addr: any) => (
                    <button
                      key={addr.label}
                      onMouseDown={() => {
                        setHome(addr.coordinates, addr.label);
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-space-sm py-space-xs rounded-lg hover:bg-surface-container-high transition-colors flex items-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">home_pin</span>
                      <span className="text-body-sm font-body-sm text-on-surface">{addr.label}</span>
                    </button>
                  ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-space-sm shrink-0">
          <button className="hud-button !w-9 !h-9 !rounded-lg">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <div className="flex items-center gap-space-xs pl-space-xs">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container text-label-md font-label-md font-semibold">
              CS
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-label-md font-label-md text-on-surface">Calon Siswa</span>
              <span className="text-label-sm font-label-sm text-outline">Domisili Bogor</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
