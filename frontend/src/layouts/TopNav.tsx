import { useMemo, useState } from "react";
import { ADDRESS_SUGGESTIONS } from "../data/addresses";
import { useSchoolFinderStore } from "../hooks/useSchoolFinderStore";

// === TIPE DATA — KASIH TAU TYPESCRIPT BENTUK DATANYA ===
type School = {
  id: string;
  name: string;
  address: string;
};

type AddressSuggestion = {
  label: string;
  coordinates: [number, number];
};

export function TopNav({ onHome }: { onHome: () => void }) {
  // Kasih tau bentuk datanya ke TypeScript
  const schools = useSchoolFinderStore((s) => s.schools) as School[];
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const setHome = useSchoolFinderStore((s) => s.setHome);

  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"school" | "address">("school");
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (mode === "school") {
      const list = q
        ? schools.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.address.toLowerCase().includes(q)
          )
        : schools;
      return list.slice(0, 6);
    }
    const list = q
      ? (ADDRESS_SUGGESTIONS as AddressSuggestion[]).filter((a) =>
          a.label.toLowerCase().includes(q)
        )
      : (ADDRESS_SUGGESTIONS as AddressSuggestion[]);
    return list.slice(0, 6);
  }, [query, mode, schools]);

  return (
    <header className="relative z-50 h-16 shrink-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border-b border-emerald-100/50 dark:border-emerald-900/30">
      <div className="h-full px-space-md sm:px-space-lg flex items-center gap-space-md">
        {/* === LOGO + NAMA APLIKASI === */}
        <div className="flex items-center gap-space-xs shrink-0">
          <button
            type="button"
            onClick={onHome}
            className="flex items-center gap-2 bg-transparent border-0 p-0 transition-opacity hover:opacity-80"
            aria-label="EduZONE — Kembali ke beranda"
          >
            <img
              src="/images/eduzone-logo.png"
              alt="Logo EduZONE"
              className="h-9 w-auto object-contain"
            />
            <span className="hidden sm:inline font-headline-sm text-gray-800 dark:text-white font-semibold tracking-tight">
              EduZONE
            </span>
          </button>
          <button
            type="button"
            onClick={onHome}
            className="sm:hidden bg-transparent border-0 p-0 text-label-sm font-label-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors"
          >
            Kembali
          </button>
        </div>

        {/* === PENCARIAN === */}
        <div className="flex-1 max-w-xl relative">
          <div className="flex items-center bg-gray-50/80 dark:bg-gray-800/50 rounded-xl px-space-sm h-10 gap-space-xs border border-gray-200/60 dark:border-gray-700/40">
            <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[18px]">search</span>

            <div className="flex text-label-sm font-label-sm shrink-0 gap-1 pr-space-xs border-r border-gray-200/60 dark:border-gray-700/40 mr-space-xs">
              <button
                onClick={() => setMode("school")}
                className={
                  mode === "school"
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                }
              >
                Sekolah
              </button>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <button
                onClick={() => setMode("address")}
                className={
                  mode === "address"
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                }
              >
                Alamat
              </button>
            </div>

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setTimeout(() => setIsOpen(false), 120)}
              placeholder={
                mode === "school"
                  ? "Cari sekolah negeri..."
                  : "Cari alamat domisili..."
              }
              className="bg-transparent w-full text-body-md text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {/* === HASIL PENCARIAN === */}
          {isOpen && results.length > 0 && (
            <div className="absolute top-12 left-0 right-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-space-2xs overflow-hidden shadow-lg border border-gray-200/60 dark:border-gray-700/40">
              {mode === "school"
                ? (results as School[]).map((school) => (
                    <button
                      key={school.id}
                      onMouseDown={() => {
                        selectSchool(school.id);
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-space-sm py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-body-sm font-medium text-gray-800 dark:text-gray-100">
                        {school.name}
                      </span>
                      <span className="text-label-sm text-gray-500 dark:text-gray-400">
                        {school.address}
                      </span>
                    </button>
                  ))
                : (results as AddressSuggestion[]).map((addr) => (
                    <button
                      key={addr.label}
                      onMouseDown={() => {
                        setHome(addr.coordinates, addr.label);
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-space-sm py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">home_pin</span>
                      <span className="text-body-sm text-gray-700 dark:text-gray-200">
                        {addr.label}
                      </span>
                    </button>
                  ))}
            </div>
          )}
        </div>

        {/* === PROFIL PENGGUNA === */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200/60 dark:border-gray-700/40">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              Ez
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                EduZONE Pengguna
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Kota Bogor
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}