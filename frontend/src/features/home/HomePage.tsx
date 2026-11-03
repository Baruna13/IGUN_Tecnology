import { useEffect, useMemo, useRef, useState } from "react";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import type { School } from "../../types/school";

type HomePageProps = {
  schools: School[];
  onOpenMap: (schoolId?: string) => void;
};

// Hook: fade-in saat elemen masuk viewport
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-4");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// Counter animasi angka
function AnimatedCounter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(el);
        let start = 0;
        const step = Math.max(1, Math.ceil(target / 30));
        const timer = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(start);
          if (start >= target) clearInterval(timer);
        }, 35);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val || target}</span>;
}

// Komponen Logo ZONE dengan pin di dalam O
function ZoneText({ className = "text-[42px] md:text-[68px] lg:text-[78px]" }: { className?: string }) {
  return (
    <span className={`text-[#00B38C] font-extrabold tracking-tight inline-flex items-center select-none ${className}`}>
      Z
      <span className="inline-flex items-center justify-center relative w-[0.82em] h-[0.82em] rounded-full bg-[#00B38C] mx-[0.04em] shadow-sm align-middle">
        <svg viewBox="0 0 24 24" fill="white" className="w-[62%] h-[62%]">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        <span className="w-[3px] h-[3px] md:w-[4px] md:h-[4px] lg:w-[5px] lg:h-[5px] rounded-full bg-[#00B38C] absolute top-[36%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
      </span>
      NE
    </span>
  );
}

// Ikon 3 Gedung Bertingkat Isometric
function CityBuildingIcon({
  className = "text-gray-900",
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      className={`${className} shrink-0`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}
    >
      {/* Gedung Kiri */}
      <path d="M6 22L18 17V58H6V22Z" fill="currentColor" />
      <path d="M18 17L22 19V58H18V17Z" fill="currentColor" opacity="0.75" />
      <rect x="9" y="25" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="13.5" y="25" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="9" y="33" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="13.5" y="33" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="9" y="41" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="13.5" y="41" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="9" y="49" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="13.5" y="49" width="2.5" height="3" rx="0.5" fill="white" />

      {/* Gedung Tengah Tinggi */}
      <path d="M22 10L37 5V58H22V10Z" fill="currentColor" />
      <path d="M37 5L44 9V58H37V5Z" fill="currentColor" opacity="0.75" />
      <rect x="25.5" y="14" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="31" y="14" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="25.5" y="22" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="31" y="22" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="25.5" y="30" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="31" y="30" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="25.5" y="38" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="31" y="38" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="25.5" y="46" width="3" height="3.5" rx="0.5" fill="white" />
      <rect x="31" y="46" width="3" height="3.5" rx="0.5" fill="white" />

      {/* Gedung Kanan Rendah */}
      <path d="M44 26L55 22V58H44V26Z" fill="currentColor" />
      <path d="M55 22L58 24V58H55V22Z" fill="currentColor" opacity="0.75" />
      <rect x="47" y="30" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="51" y="30" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="47" y="38" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="51" y="38" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="47" y="46" width="2.5" height="3" rx="0.5" fill="white" />
      <rect x="51" y="46" width="2.5" height="3" rx="0.5" fill="white" />
    </svg>
  );
}

// Ikon Topi Toga Miring Putih
function HeroMortarboardIcon({ className = "w-16 h-16 md:w-22 md:h-22 lg:w-26 lg:h-26" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="capShadow" x="-20%" y="-20%" width="150%" height="150%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.35)" />
        </filter>
      </defs>
      <g filter="url(#capShadow)" transform="rotate(-6 50 40)">
        <path d="M26 36V50C26 56 37 61 50 61C63 61 74 56 74 50V36L50 48L26 36Z" fill="#F1F5F9" />
        <polygon points="50,12 92,32 50,48 8,32" fill="#FFFFFF" />
        <circle cx="50" cy="30" r="3" fill="#E2E8F0" />
        <path d="M50 30 Q30 33 22 44" stroke="#FFFFFF" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <rect x="19" y="44" width="6" height="12" rx="2" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export function HomePage({ schools, onOpenMap }: HomePageProps) {
  const setHome = useSchoolFinderStore((s) => s.setHome);
  const [activeNav, setActiveNav] = useState("beranda");

  // Deteksi lokasi user untuk data akurat
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setHome([coords.longitude, coords.latitude], "Lokasi Anda saat ini");
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }, [setHome]);

  const publicSchools = useMemo(() => schools.filter((s) => s.status === "Negeri"), [schools]);
  const accreditedSchools = useMemo(() => publicSchools.filter((s) => s.accreditation === "A"), [publicSchools]);
  const averageScore = useMemo(() => {
    if (!accreditedSchools.length) return 91;
    return Math.round(accreditedSchools.reduce((s, x) => s + (x.accreditationScore || 85), 0) / accreditedSchools.length);
  }, [accreditedSchools]);

  const heroRef = useFadeIn();
  const gisRef = useFadeIn();
  const whyRef = useFadeIn();

  const features = [
    {
      num: "01",
      title: "Jarak sebenarnya",
      desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah.",
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 7.2c0 7.3-8 11.8-8 11.8z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Batas Zonasi Terlihat",
      desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah.",
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="8" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Bandingkan Sekitar",
      desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah.",
      icon: (
        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-[#00B38C] selection:text-white">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all">
        <div className="w-[94%] max-w-[1680px] mx-auto h-[76px] md:h-[84px] flex items-center justify-between">
          {/* Logo EduZONE */}
          <a href="#beranda" className="flex items-center select-none" onClick={() => setActiveNav("beranda")}>
            <img src="/images/eduzone-logo.png" alt="EduZONE" className="h-[48px] md:h-[56px] w-auto object-contain" />
          </a>

          {/* Navigasi Kanan */}
          <nav className="flex items-center gap-8 md:gap-11">
            <a
              href="#beranda"
              onClick={() => setActiveNav("beranda")}
              className={`text-[14.5px] md:text-[16px] font-bold tracking-tight pb-1 transition-colors ${
                activeNav === "beranda"
                  ? "text-[#00B38C] border-b-2 border-[#00B38C]"
                  : "text-gray-600 hover:text-[#00B38C]"
              }`}
            >
              Beranda
            </a>
            <a
              href="#kenapa"
              onClick={() => setActiveNav("kenapa")}
              className={`text-[14.5px] md:text-[16px] font-semibold tracking-tight pb-1 transition-colors ${
                activeNav === "kenapa"
                  ? "text-[#00B38C] border-b-2 border-[#00B38C]"
                  : "text-gray-600 hover:text-[#00B38C]"
              }`}
            >
              Mengapa EduZone
            </a>
            <button
              type="button"
              onClick={() => {
                setActiveNav("sekolah");
                onOpenMap();
              }}
              className={`text-[14.5px] md:text-[16px] font-semibold tracking-tight pb-1 bg-transparent border-0 cursor-pointer transition-colors ${
                activeNav === "sekolah"
                  ? "text-[#00B38C] border-b-2 border-[#00B38C]"
                  : "text-gray-600 hover:text-[#00B38C]"
              }`}
            >
              Sekolah Terdekat
            </button>
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="w-full">
        {/* ── 1. HERO SECTION ── */}
        <section id="beranda" className="w-[94%] max-w-[1680px] mx-auto pt-4 md:pt-6 pb-8 md:pb-12">
          <div
            ref={heroRef}
            className="relative h-[480px] md:h-[540px] lg:h-[580px] rounded-[28px] overflow-hidden flex flex-col items-center justify-center text-center p-6 md:p-14 lg:p-16 shadow-2xl opacity-0 translate-y-4 transition-all duration-700 ease-out"
          >
            {/* Foto Globe Latar Belakang */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.14) 0%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0.72) 100%), url('/images/hero-map.jpeg')`,
              }}
            />

            {/* Isi Konten Hero */}
            <div className="relative z-10 max-w-[960px] flex flex-col items-center">
              <div className="flex items-center justify-center gap-3 md:gap-5 mb-5 select-none">
                <HeroMortarboardIcon />
                <h1 className="text-white font-extrabold text-[42px] md:text-[66px] lg:text-[78px] leading-tight tracking-tight drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
                  Education&nbsp;
                  <ZoneText className="text-[42px] md:text-[66px] lg:text-[78px]" />
                </h1>
              </div>

              <p className="text-white/95 text-[15px] md:text-[17.5px] lg:text-[19px] font-medium leading-[1.75] max-w-[900px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.75)] px-4">
                EDU ZONE Kota Bogor menggabungkan analitik geospasial Ina-Geoportal, simulasi catchment area poligon 1.500m,
                dan kalkulasi jarak geodesik gerbang-ke-gerbang untuk memverifikasi peluang lolos pendaftaran sekolah negeri
                secara transparan.
              </p>
            </div>
          </div>
        </section>

        {/* ── 2. GIS SIMULATION CARD ── */}
        <section className="w-[94%] max-w-[1680px] mx-auto pb-14 md:pb-18">
          <div
            ref={gisRef}
            className="bg-[#404040] rounded-[26px] p-8 md:p-12 lg:p-14 shadow-xl opacity-0 translate-y-4 transition-all duration-700 ease-out grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Kolom Kiri: Teks & Tombol */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h2 className="text-white font-bold text-[26px] md:text-[32px] lg:text-[36px] leading-[1.22] tracking-tight">
                Simulasi Peta Zonasi Interaktif<br />Berbasis Koordinat Nyata
              </h2>
              <p className="text-gray-300 text-[14.5px] md:text-[16px] lg:text-[17px] leading-relaxed mt-4 mb-8 max-w-[680px]">
                Peta interaktif EDU ZONE Kota Bogor memproyeksikan kontur radius buffer, densitas pendaftar per kelurahan,
                dan pergeseran ambang kelulusan secara dinamis. Anda dapat langsung menggeser titik pin lokasi rumah untuk
                melihat perubahan probabilitas secara instan.
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => onOpenMap()}
                  className="bg-[#00B38C] hover:bg-[#009e7a] text-white font-bold text-[14.5px] md:text-[16px] py-3.5 px-8 rounded-xl inline-flex items-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                    <line x1="8" y1="2" x2="8" y2="18" />
                    <line x1="16" y1="6" x2="16" y2="22" />
                  </svg>
                  Buka GIS Map Explorer
                </button>
              </div>
            </div>

            {/* Kolom Kanan: Pratinjau Peta */}
            <div
              onClick={() => onOpenMap()}
              className="lg:col-span-5 border-[3px] border-[#2ec4b6] rounded-[22px] overflow-hidden shadow-lg cursor-pointer transition-transform hover:scale-[1.015] bg-[#edf6f4] relative group"
            >
              <img
                src="/images/map-preview.jpg"
                alt="Pratinjau Peta Interaktif"
                className="w-full h-[260px] md:h-[320px] lg:h-[360px] object-cover block"
              />
              <div className="absolute inset-0 bg-[#00B38C]/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-gray-900/85 text-white text-sm font-semibold px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-sm shadow-md">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Buka Peta
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. KENAPA EDUZONE SECTION ── */}
        <section id="kenapa" className="w-[94%] max-w-[1680px] mx-auto pb-18 md:pb-24">
          <div
            ref={whyRef}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start opacity-0 translate-y-4 transition-all duration-700 ease-out"
          >
            {/* Kolom Kiri: Penjelasan, Statistik & Kota Bogor */}
            <div className="lg:col-span-7 flex flex-col">
              <span className="text-[#00B38C] font-bold text-[15px] md:text-[16px] tracking-wide mb-2.5 block">
                Kenapa EduZone?
              </span>
              <h2 className="text-gray-900 font-extrabold text-[36px] md:text-[46px] lg:text-[54px] leading-[1.14] tracking-tight mb-5">
                Data yang rumit, jadi<br />keputusan yang tenang.
              </h2>
              <p className="text-gray-600 text-[15px] md:text-[16.5px] lg:text-[17.5px] leading-relaxed mb-8 max-w-[720px]">
                Menentukan sekolah berdasar sistem zonasi kini lebih tenang tanpa rasa cemas. Kami mengolah titik koordinat
                presisi untuk menyajikan data jarak real-time, visualisasi batas zonasi yang jelas, serta analisis
                komparasi sekolah sekitar membantu Anda mengambil keputusan terbaik bagi pendidikan buah hati dengan
                cepat dan tepat.
              </p>

              {/* Garis Pembatas Atas Statistik */}
              <div className="border-t border-gray-300 w-full mb-8" />

              {/* Tiga Statistik Berjajar */}
              <div className="flex items-start justify-between gap-6 max-w-[560px]">
                <div>
                  <strong className="text-[#00B38C] font-extrabold text-[34px] md:text-[44px] lg:text-[50px] leading-none block">
                    <AnimatedCounter target={publicSchools.length || 27} />
                  </strong>
                  <span className="text-gray-500 text-[12.5px] md:text-[14px] lg:text-[14.5px] font-medium leading-tight block mt-2">
                    Sekolah Negeri<br />Terdaftar
                  </span>
                </div>
                <div>
                  <strong className="text-[#00B38C] font-extrabold text-[34px] md:text-[44px] lg:text-[50px] leading-none block">
                    <AnimatedCounter target={accreditedSchools.length || 7} />
                  </strong>
                  <span className="text-gray-500 text-[12.5px] md:text-[14px] lg:text-[14.5px] font-medium leading-tight block mt-2">
                    Akreditasi A<br />& Lebih
                  </span>
                </div>
                <div>
                  <strong className="text-[#00B38C] font-extrabold text-[34px] md:text-[44px] lg:text-[50px] leading-none block">
                    <AnimatedCounter target={averageScore} />
                  </strong>
                  <span className="text-gray-500 text-[12.5px] md:text-[14px] lg:text-[14.5px] font-medium leading-tight block mt-2">
                    Rata-rata<br />Skor Akreditasi
                  </span>
                </div>
              </div>

              {/* Garis Pembatas Bawah Statistik */}
              <div className="border-t border-gray-300 w-full mt-8 mb-8" />

              {/* Badge Kota Bogor */}
              <div className="flex items-center gap-4">
                <CityBuildingIcon size={48} className="text-gray-900" />
                <div>
                  <strong className="text-[#00A877] font-extrabold text-[22px] md:text-[26px] lg:text-[28px] leading-tight block">
                    Kota Bogor
                  </strong>
                  <small className="text-gray-500 text-[13.5px] md:text-[15px] font-normal block mt-1">
                    Jawa Barat
                  </small>
                </div>
              </div>

              {/* Garis Pembatas Bawah Kota Bogor */}
              <div className="border-t border-gray-300 w-full mt-8" />
            </div>

            {/* Kolom Kanan: 3 Kartu Gelap (01, 02, 03) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              {features.map((f) => (
                <article
                  key={f.num}
                  className="bg-[#404040] rounded-[20px] p-7 md:p-8 lg:p-9 shadow-lg transition-all hover:bg-[#464646]"
                >
                  <div className="text-[#00B38C] font-extrabold text-[22px] md:text-[26px] leading-none mb-3.5">
                    {f.num}
                  </div>
                  <div className="mb-3.5 text-white">
                    {f.icon}
                  </div>
                  <h3 className="text-white font-bold text-[17px] md:text-[19px] lg:text-[20px] mb-2.5 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-gray-300 text-[13.5px] md:text-[14.5px] lg:text-[15px] leading-relaxed">
                    {f.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER GELAP ── */}
      <footer className="bg-[#484848] text-white pt-12 pb-16 w-full border-t border-gray-600">
        <div className="w-[94%] max-w-[1680px] mx-auto flex flex-col items-start gap-5">
          {/* Kota Bogor */}
          <div className="flex items-center gap-3.5">
            <CityBuildingIcon size={36} className="text-gray-300" />
            <div>
              <strong className="text-white font-bold text-[17px] leading-none block">
                Kota Bogor
              </strong>
              <small className="text-gray-400 text-[13px] block mt-1">
                Jawa Barat
              </small>
            </div>
          </div>

          {/* Logo EduZONE di Footer */}
          <div className="flex items-center gap-3 mt-1 select-none">
            <svg className="w-7 h-7 text-white" viewBox="0 0 100 80" fill="none">
              <polygon points="50,12 92,32 50,48 8,32" fill="#FFFFFF" />
              <path d="M26 36V50C26 56 37 61 50 61C63 61 74 56 74 50V36L50 48L26 36Z" fill="#FFFFFF" />
            </svg>
            <div className="flex items-center font-bold text-[20px] md:text-[24px] text-white">
              Education&nbsp;
              <ZoneText className="text-[20px] md:text-[24px]" />
            </div>
          </div>

          {/* Garis Horizontal Pembatas */}
          <div className="w-full border-t border-white/20 mt-4" />
        </div>
      </footer>
    </div>
  );
}
