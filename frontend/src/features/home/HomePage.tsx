import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import type { School } from "../../types/school";
import "./home.css";

type HomePageProps = {
  schools: School[];
  /** true setelah layar transisi selesai; animasi masuk baru dimulai saat ini. */
  ready?: boolean;
  onOpenMap: (schoolId?: string) => void;
};

// Hook: elemen meluncur masuk (dari kiri/kanan) saat terlihat di viewport.
// Animasi baru jalan setelah transisi halaman (intro / kembali dari peta) selesai,
// jadi tidak terpotong oleh layar transisi.
function useSlideIn<T extends HTMLElement = HTMLDivElement>(ready: boolean, delay = 0, from: "left" | "right" = "left") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("opacity-100", "translate-x-0");
          el.classList.remove("opacity-0", "-translate-x-[35vw]", "translate-x-[35vw]", "-translate-x-24");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ready, delay, from]);
  return ref;
}

// Counter animasi angka
function AnimatedCounter({ target, ready = true, delay = 0 }: { target: number; ready?: boolean; delay?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;
    let timer: number | undefined;
    let wait: number | undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.unobserve(el);
        wait = window.setTimeout(() => {
          let start = 0;
          const step = Math.max(1, Math.ceil(target / 30));
          timer = window.setInterval(() => {
            start = Math.min(start + step, target);
            setVal(start);
            if (start >= target) window.clearInterval(timer);
          }, 35);
        }, delay);
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      window.clearTimeout(wait);
      window.clearInterval(timer);
    };
  }, [target, ready, delay]);
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

export function HomePage({ schools, ready = true, onOpenMap }: HomePageProps) {
  const setHome = useSchoolFinderStore((s) => s.setHome);
  const [activeNav, setActiveNav] = useState("beranda");

  // Deteksi lokasi user untuk data akurat
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setHome([coords.longitude, coords.latitude], "Lokasi Anda saat ini");
      },
      () => { },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }, [setHome]);

  const publicSchools = useMemo(() => schools.filter((s) => s.status === "Negeri"), [schools]);
  const accreditedSchools = useMemo(() => publicSchools.filter((s) => s.accreditation === "A"), [publicSchools]);
  const averageScore = useMemo(() => {
    if (!accreditedSchools.length) return 91;
    return Math.round(accreditedSchools.reduce((s, x) => s + (x.accreditationScore || 85), 0) / accreditedSchools.length);
  }, [accreditedSchools]);

  // Kotak hero & kartu GIS: meluncur dari kiri setiap beranda selesai ditampilkan
  // (buka pertama & kembali dari Sekolah Terdekat). Dipicu oleh `ready`, bukan scroll.
  const enterLeft = (on: boolean) => `ez-enter-left${on ? " is-on" : ""}`;
  // Section "Kenapa EduZone": berurutan, kolom kiri dari kiri lalu kartu kanan dari kanan
  const whyLabelRef = useSlideIn<HTMLSpanElement>(ready, 0);
  const whyTitleRef = useSlideIn<HTMLHeadingElement>(ready, 180);
  const whyDescRef = useSlideIn<HTMLParagraphElement>(ready, 360);
  const whyStatsRef = useSlideIn(ready, 540);
  const whyCityRef = useSlideIn(ready, 720);
  const whyCard1Ref = useSlideIn<HTMLElement>(ready, 900, "right");
  const whyCard2Ref = useSlideIn<HTMLElement>(ready, 1080, "right");
  const whyCard3Ref = useSlideIn<HTMLElement>(ready, 1260, "right");
  const whyCardRefs = [whyCard1Ref, whyCard2Ref, whyCard3Ref];

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
    <div className="min-h-screen overflow-x-clip bg-white text-gray-900 font-sans antialiased selection:bg-[#00B38C] selection:text-white">
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
              className={`text-[14.5px] md:text-[16px] font-bold tracking-tight pb-1 transition-colors ${activeNav === "beranda"
                ? "text-[#00B38C] border-b-2 border-[#00B38C]"
                : "text-gray-600 hover:text-[#00B38C]"
                }`}
            >
              Beranda
            </a>
            <a
              href="#kenapa"
              onClick={() => setActiveNav("kenapa")}
              className={`text-[14.5px] md:text-[16px] font-semibold tracking-tight pb-1 transition-colors ${activeNav === "kenapa"
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
              className={`text-[14.5px] md:text-[16px] font-semibold tracking-tight pb-1 bg-transparent border-0 cursor-pointer transition-colors ${activeNav === "sekolah"
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
        <section id="beranda" className="w-[94%] max-w-[1680px] mx-auto pt-4 md:pt-14 pb-8 md:pb-14">
          <div
            className={`relative h-[480px] md:h-[540px] lg:h-[580px] rounded-[28px] overflow-hidden flex flex-col items-center justify-center text-center p-6 md:p-14 lg:p-16 shadow-2xl ${enterLeft(ready)}`}
          >
            {/* Foto Globe Latar Belakang */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.10) 100%, rgba(0,0,0,0.10) 100%), url('/images/hero-map.jpg')`,
              }}
            />

            {/* Isi Konten Hero */}
            <div className="relative z-10 max-w-[960px] flex flex-col items-center">


            </div>
          </div>
        </section>

        {/* ── 2. GIS SIMULATION CARD ── */}
        <section className="w-[94%] max-w-[1680px] mx-auto pb-8 md:pb-10">
          <div
            className={`bg-[#CFCFCF] rounded-[26px] p-8 md:p-12 lg:p-14 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ${enterLeft(ready)}`}
            style={{
              "--d": "150ms",
              backgroundColor: "#CFCFCF"
            } as CSSProperties}
          >
            {/* Kolom Kiri: Teks & Tombol */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h2 className="text-gray-900 font-bold text-[26px] md:text-[32px] lg:text-[36px] leading-[1.22] tracking-tight">
                Simulasi Peta Zonasi Interaktif<br />Berbasis Koordinat Nyata
              </h2>
              <p className="text-gray-800 text-[14.5px] md:text-[16px] lg:text-[17px] leading-relaxed mt-4 mb-8 max-w-[680px]">
                Peta interaktif EDU ZONE Kota Bogor memproyeksikan kontur radius buffer, densitas pendaftar per kelurahan,
                dan pergeseran ambang kelulusan secara dinamis. Anda dapat langsung menggeser titik pin lokasi rumah untuk
                melihat perubahan probabilitas secara instan.
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => onOpenMap()}
                  className="bg-[#00B38C] hover:bg-[#449a78] text-white font-bold text-[14.5px] md:text-[16px] py-3.5 px-8 rounded-xl inline-flex items-center gap-3 transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
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
        <section id="kenapa" className="w-[94%] max-w-[1680px] mx-auto pb-6 md:pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Kolom Kiri: Penjelasan, Statistik & Kota Bogor */}
            <div className="lg:col-span-7 flex flex-col">
              <span ref={whyLabelRef} className="text-[#00B38C] font-bold text-[15px] md:text-[16px] tracking-wide mb-2.5 block opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                Kenapa EduZone?
              </span>
              <h2 ref={whyTitleRef} className="text-gray-900 font-extrabold text-[36px] md:text-[46px] lg:text-[54px] leading-[1.14] tracking-tight mb-5 opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                Data yang rumit, jadi<br />keputusan yang tenang.
              </h2>
              <p ref={whyDescRef} className="text-gray-600 text-[15px] md:text-[16.5px] lg:text-[17.5px] leading-relaxed mb-8 max-w-[720px] opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                Menentukan sekolah berdasar sistem zonasi kini lebih tenang tanpa rasa cemas. Kami mengolah titik koordinat
                presisi untuk menyajikan data jarak real-time, visualisasi batas zonasi yang jelas, serta analisis
                komparasi sekolah sekitar membantu Anda mengambil keputusan terbaik bagi pendidikan buah hati dengan
                cepat dan tepat.
              </p>

              <div ref={whyStatsRef} className="opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                {/* Garis Pembatas Atas Statistik */}
                <div className="border-t border-gray-300 w-full mb-8" />

                {/* Tiga Statistik Berjajar */}
                <div className="flex items-start justify-between gap-6 max-w-[560px]">
                  <div>
                    <strong className="text-[#00B38C] font-extrabold text-[34px] md:text-[44px] lg:text-[50px] leading-none block">
                      <AnimatedCounter target={publicSchools.length || 27} ready={ready} delay={650} />
                    </strong>
                    <span className="text-gray-500 text-[12.5px] md:text-[14px] lg:text-[14.5px] font-medium leading-tight block mt-2">
                      Sekolah Negeri<br />Terdaftar
                    </span>
                  </div>
                  <div>
                    <strong className="text-[#00B38C] font-extrabold text-[34px] md:text-[44px] lg:text-[50px] leading-none block">
                      <AnimatedCounter target={accreditedSchools.length || 7} ready={ready} delay={650} />
                    </strong>
                    <span className="text-gray-500 text-[12.5px] md:text-[14px] lg:text-[14.5px] font-medium leading-tight block mt-2">
                      Akreditasi A<br />& Lebih
                    </span>
                  </div>
                  <div>
                    <strong className="text-[#00B38C] font-extrabold text-[34px] md:text-[44px] lg:text-[50px] leading-none block">
                      <AnimatedCounter target={averageScore} ready={ready} delay={650} />
                    </strong>
                    <span className="text-gray-500 text-[12.5px] md:text-[14px] lg:text-[14.5px] font-medium leading-tight block mt-2">
                      Rata-rata<br />Skor Akreditasi
                    </span>
                  </div>
                </div>

                {/* Garis Pembatas Bawah Statistik */}
                <div className="border-t border-gray-300 w-full mt-8 mb-8" />

              </div>

              {/* Badge Kota Bogor */}
              <div ref={whyCityRef} className="flex items-center gap-4 opacity-0 -translate-x-24 transition-all duration-700 ease-out">
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
              {features.map((f, idx) => (
                <article
                  key={f.num}
                  ref={whyCardRefs[idx]}
                  className="bg-[#404040] rounded-[20px] p-7 md:p-8 lg:p-9 shadow-lg hover:bg-[#464646] opacity-0 translate-x-[35vw] transition-all duration-1000 ease-out"
                >
                  <div className="text-[#00B38C] font-extrabold text-[22px] md:text-[26px] leading-none mb-">
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
      <footer className="bg-[#484848] text-white pt-14 pb-8 w-full border-t border-gray-600">
        <div className="w-[94%] max-w-[1680px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-14">
            {/* Kolom 1: Brand & deskripsi */}
            <div className="md:col-span-5 flex flex-col items-start gap-5">
              <div className="flex items-center gap-3 select-none">
                <svg className="w-7 h-7 text-white" viewBox="0 0 100 80" fill="none">
                  <polygon points="50,12 92,32 50,48 8,32" fill="#FFFFFF" />
                  <path d="M26 36V50C26 56 37 61 50 61C63 61 74 56 74 50V36L50 48L26 36Z" fill="#FFFFFF" />
                </svg>
                <div className="flex items-center font-bold text-[20px] md:text-[24px] text-white">
                  Education&nbsp;
                  <ZoneText className="text-[20px] md:text-[24px]" />
                </div>
              </div>

              <p className="text-gray-300 text-[14px] md:text-[15px] leading-relaxed max-w-[460px]">
                Simulasi zonasi sekolah negeri di Kota Bogor berbasis koordinat peta. Cek jarak rumah ke sekolah,
                lihat batas zonasi, dan bandingkan sekolah di sekitar sebelum mendaftar.
              </p>

              <div className="flex items-center gap-3.5">
                <CityBuildingIcon size={36} className="text-gray-300" />
                <div>
                  <strong className="text-white font-bold text-[17px] leading-none block">Kota Bogor</strong>
                  <small className="text-gray-400 text-[13px] block mt-1">Jawa Barat</small>
                </div>
              </div>
            </div>

            {/* Kolom 2: Navigasi */}
            <nav className="md:col-span-3" aria-label="Navigasi footer">
              <h3 className="text-white font-bold text-[16px] mb-4">Jelajahi</h3>
              <ul className="flex flex-col gap-3 text-[14px] md:text-[15px]">
                <li>
                  <a
                    href="#beranda"
                    onClick={() => setActiveNav("beranda")}
                    className="text-gray-300 hover:text-[#00B38C] transition-colors"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#kenapa"
                    onClick={() => setActiveNav("kenapa")}
                    className="text-gray-300 hover:text-[#00B38C] transition-colors"
                  >
                    Mengapa EduZone
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenMap()}
                    className="text-gray-300 hover:text-[#00B38C] transition-colors bg-transparent border-0 p-0 cursor-pointer text-left"
                  >
                    Sekolah Terdekat
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onOpenMap()}
                    className="text-gray-300 hover:text-[#00B38C] transition-colors bg-transparent border-0 p-0 cursor-pointer text-left"
                  >
                    Buka GIS Map Explorer
                  </button>
                </li>
              </ul>
            </nav>

            {/* Kolom 3: Sumber data & teknologi */}
            <div className="md:col-span-4">
              <h3 className="text-white font-bold text-[16px] mb-4">Sumber data dan teknologi</h3>
              <ul className="flex flex-col gap-3 text-[14px] md:text-[15px]">
                <li>
                  <a
                    href="https://www.openstreetmap.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#00B38C] transition-colors"
                  >
                    OpenStreetMap, lokasi sekolah dan peta dasar
                  </a>
                </li>
                <li>
                  <a
                    href="https://tanahair.indonesia.go.id/portal-web"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#00B38C] transition-colors"
                  >
                    Ina-Geoportal, referensi data geospasial
                  </a>
                </li>
                <li>
                  <a
                    href="https://leafletjs.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#00B38C] transition-colors"
                  >
                    Leaflet, peta interaktif
                  </a>
                </li>
                <li>
                  <a
                    href="https://turfjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#00B38C] transition-colors"
                  >
                    Turf.js, hitung jarak dan zona
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Garis pembatas + catatan bawah */}
          <div className="w-full border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <p className="text-gray-400 text-[13px] leading-relaxed max-w-[820px]">
              Hasil simulasi bersifat perkiraan. Akreditasi, kuota, dan radius zonasi masih berupa data estimasi.
              Ketentuan resmi pendaftaran mengikuti SPMB dari Dinas Pendidikan setempat.
            </p>
            <p className="text-gray-400 text-[13px] shrink-0">
              &copy; {new Date().getFullYear()} EduZONE, IGUN Technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
