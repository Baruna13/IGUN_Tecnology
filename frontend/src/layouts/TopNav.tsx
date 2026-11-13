import { useEffect, useMemo, useState } from "react";
import { ADDRESS_SUGGESTIONS } from "../data/addresses";
import { useSchoolFinderStore } from "../hooks/useSchoolFinderStore";
import { useTutorialStore } from "../features/tutorial/useTutorialStore";
import type { School } from "../types/school";

type SearchAddress = {
  label: string;
  coordinates: [number, number];
  detail?: string;
};

function matchesQuery(value: string, query: string) {
  const normalizedValue = value.toLocaleLowerCase();
  return query
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .every((term) => normalizedValue.includes(term));
}


// Kotak batas Kota Bogor: kiri, atas, kanan, bawah (lon,lat)
const BOGOR_VIEWBOX = "106.70,-6.50,106.90,-6.68";

async function geocodeBogor(query: string, signal: AbortSignal): Promise<SearchAddress[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "5",
    countrycodes: "id",
    viewbox: BOGOR_VIEWBOX,
    bounded: "1",
    "accept-language": "id",
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal });
  if (!res.ok) throw new Error(`Geocoder error ${res.status}`);
  const rows = (await res.json()) as Array<{ display_name: string; lat: string; lon: string }>;
  return rows.map((r) => ({
    label: r.display_name.split(",").slice(0, 3).join(",").trim(),
    detail: r.display_name,
    coordinates: [parseFloat(r.lon), parseFloat(r.lat)] as [number, number],
  }));
}

export function TopNav({ onHome }: { onHome: () => void }) {
  // Kasih tau bentuk datanya ke TypeScript
  const schools = useSchoolFinderStore((s) => s.schools) as School[];
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const setHome = useSchoolFinderStore((s) => s.setHome);
  const focusMap = useSchoolFinderStore((s) => s.focusMap);
  const openTutorial = useTutorialStore((s) => s.openTutorial);

  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"school" | "address">("school");
  const [isOpen, setIsOpen] = useState(false);
  const [remoteAddresses, setRemoteAddresses] = useState<SearchAddress[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Cari alamat sungguhan (Nominatim) dengan jeda 600 ms agar tidak membanjiri server
  useEffect(() => {
    const q = query.trim();
    if (mode !== "address" || q.length < 3) {
      setRemoteAddresses([]);
      setIsSearching(false);
      return;
    }
    const controller = new AbortController();
    setIsSearching(true);
    const timer = setTimeout(() => {
      geocodeBogor(q, controller.signal)
        .then((rows) => setRemoteAddresses(rows))
        .catch((err) => {
          if (err?.name !== "AbortError") setRemoteAddresses([]);
        })
        .finally(() => {
          if (!controller.signal.aborted) setIsSearching(false);
        });
    }, 600);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, mode]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (mode === "school") {
      const negeri = schools.filter((school) => school.status === "Negeri");
      return (q
        ? negeri.filter((school) => matchesQuery(`${school.name} ${school.address} ${school.district}`, q))
        : negeri
      ).slice(0, 6);
    }

    const addresses: SearchAddress[] = [
      ...remoteAddresses,
      ...ADDRESS_SUGGESTIONS,
      ...schools.map((school) => ({
        label: school.address,
        coordinates: school.coordinates,
        detail: school.name,
      })),
    ];
    const uniqueAddresses = addresses.filter(
      (address, index) => addresses.findIndex((item) => item.label === address.label) === index
    );
    // Hasil geocoder sudah cocok dengan kata kunci di server, jadi tidak difilter ulang
    const remoteLabels = new Set(remoteAddresses.map((a) => a.label));
    const matched = q
      ? uniqueAddresses.filter(
          (a) => remoteLabels.has(a.label) || matchesQuery(`${a.label} ${a.detail ?? ""}`, q)
        )
      : uniqueAddresses;
    return matched.slice(0, 8);
  }, [query, mode, schools, remoteAddresses]);

  return (
    <header className="relative z-[1100] h-auto min-h-16 sm:h-16 shrink-0 bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border-b border-emerald-100/50 dark:border-emerald-900/30">
      <div className="min-h-16 h-auto sm:h-full px-space-md sm:px-space-lg flex flex-wrap items-center gap-x-space-md gap-y-0">
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
        <div className="relative order-last basis-full min-w-0 flex-1 max-w-xl pb-space-xs sm:order-none sm:basis-auto sm:pb-0">
          <div
            id="tutorial-search-bar"
            className="flex items-center bg-gray-50/90 dark:bg-gray-800/80 rounded-full px-4 h-11 gap-space-xs border border-gray-300 dark:border-gray-600 shadow-sm transition-all"
          >
            <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 text-[18px]">search</span>

            <div className="flex text-label-sm font-label-sm shrink-0 gap-1 pr-space-xs border-r border-gray-300 dark:border-gray-600 mr-space-xs">
              <button
                type="button"
                onClick={() => setMode("school")}
                className={
                  mode === "school"
                    ? "text-[#00B38C] dark:text-[#00B38C] font-semibold"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                }
              >
                Sekolah
              </button>
              <span className="text-gray-300 dark:text-gray-600">/</span>
              <button
                type="button"
                onClick={() => setMode("address")}
                className={
                  mode === "address"
                    ? "text-[#00B38C] dark:text-[#00B38C] font-semibold"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                }
              >
                Alamat
              </button>
            </div>

            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIsOpen(true);          // buka dropdown setiap kali mengetik
              }}
              onClick={() => setIsOpen(true)}   // buka lagi saat input diklik
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
              role="combobox"
              aria-expanded={isOpen}
              aria-autocomplete="list"
              placeholder={
                mode === "school"
                  ? "Cari Sekolah Negeri..."
                  : "Cari alamat domisili..."
              }
              className="bg-transparent min-w-0 flex-1 text-body-md text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none"
            />
          </div>

          {/* === HASIL PENCARIAN === */}
          {isOpen && query.trim() && (
            <div role="listbox" onMouseDown={(e) => e.preventDefault()} className="absolute top-12 left-0 right-0 max-h-[min(60vh,24rem)] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl p-space-2xs shadow-xl border border-gray-200/80 dark:border-gray-700/40 z-50">
              {isSearching && mode === "address" && (
                <p className="px-space-sm py-2 text-label-sm text-gray-500 dark:text-gray-400" role="status">
                  Mencari alamat...
                </p>
              )}
              {results.length === 0 && !isSearching && (
                <p className="px-space-sm py-3 text-body-sm text-gray-500 dark:text-gray-400" role="status">
                  Hasil tidak ditemukan, coba kata kunci lain
                </p>
              )}
              {mode === "school"
                ? (results as School[]).map((school) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected="false"
                      key={school.id}
                      onClick={() => {
                        selectSchool(school.id);
                        focusMap([...school.coordinates]);
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full min-w-0 text-left px-space-sm py-2 rounded-xl hover:bg-emerald-50 focus-visible:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:focus-visible:bg-emerald-900/20 focus-visible:outline-none transition-colors flex flex-col gap-0.5"
                    >
                      <span className="text-body-sm font-medium text-gray-800 dark:text-gray-100">
                        {school.name}
                      </span>
                      <span className="text-label-sm text-gray-500 dark:text-gray-400">
                        {school.address}
                      </span>
                    </button>
                  ))
                : (results as SearchAddress[]).map((addr, i) => (
                    <button
                      type="button"
                      role="option"
                      aria-selected="false"
                      key={`${addr.label}-${i}`}
                      onClick={() => {
                        setHome(addr.coordinates, addr.label);
                        focusMap([...addr.coordinates]);
                        setQuery("");
                        setIsOpen(false);
                      }}
                      className="w-full min-w-0 text-left px-space-sm py-2 rounded-xl hover:bg-emerald-50 focus-visible:bg-emerald-50 dark:hover:bg-emerald-900/20 dark:focus-visible:bg-emerald-900/20 focus-visible:outline-none transition-colors flex items-center gap-space-xs"
                    >
                      <span className="material-symbols-outlined text-[16px] text-emerald-500">home_pin</span>
                      <span className="min-w-0 flex flex-col text-left">
                        <span className="text-body-sm text-gray-700 dark:text-gray-200">{addr.label}</span>
                        {addr.detail && <span className="text-label-sm text-gray-500 dark:text-gray-400">{addr.detail}</span>}
                      </span>
                    </button>
                  ))}
            </div>
          )}
        </div>

        {/* === TOMBOL PANDUAN & PROFIL PENGGUNA === */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={openTutorial}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-semibold text-xs transition-all border border-emerald-200 dark:border-emerald-800 shadow-sm cursor-pointer"
            title="Buka Panduan Tutorial Pengguna Baru"
          >
            <span className="material-symbols-outlined text-[16px]">help</span>
            <span className="hidden sm:inline">Panduan</span>
          </button>

          <button
            className="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
            title="Notifikasi"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200/60 dark:border-gray-700/40">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              CS
            </div>
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                Calon Siswa
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Domisili Bogor
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}