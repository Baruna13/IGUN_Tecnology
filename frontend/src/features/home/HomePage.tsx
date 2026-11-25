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

// Lockup "Education ZONE" di hero. Posisi mengikuti desain Figma (kotak 1406 x 212).
function HeroLogo() {
  return (
    <h1 className="ez-hero-logo" aria-label="Education ZONE">
      <img src="/images/home/toga.webp" alt="" className="ez-hero-toga" />
      <span className="ez-hero-education" aria-hidden="true">
        Education
      </span>
      <span className="ez-hero-zone" aria-hidden="true">
        ZONE
      </span>
      <span className="ez-hero-o" />
      <img src="/images/home/hero-pin.svg" alt="" className="ez-hero-pin" />
      <img src="/images/home/hero-pin-base.svg" alt="" className="ez-hero-pin-base" />
      <span className="ez-hero-pin-dot" />
    </h1>
  );
}

const SHEET_SHADOW = "shadow-[0_0_0_1px_rgba(0,0,0,0.23),0_16px_48px_0_rgba(0,0,0,0.35)]";
const NAV_LINK = "text-[12px] sm:text-[15px] md:text-[20px] xl:text-[26px] font-bold tracking-[-0.03em] pb-1 xl:pb-2 border-b-[3px] transition-colors";
const navState = (active: boolean) =>
  active ? "text-[#008d55] border-[#008d55]" : "text-[#7e8482] border-transparent hover:text-[#008d55]";

export function HomePage({ schools, ready = true, onOpenMap }: HomePageProps) {
  const setHomeFromGps = useSchoolFinderStore((s) => s.setHomeFromGps);
  const clearGpsHome = useSchoolFinderStore((s) => s.clearGpsHome);
  const [activeNav, setActiveNav] = useState("beranda");

  // Deteksi lokasi user untuk data akurat
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setHomeFromGps([coords.longitude, coords.latitude]);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) clearGpsHome();
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }, [setHomeFromGps, clearGpsHome]);

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
      icon: "/images/home/pin-card.svg",
    },
    {
      num: "02",
      title: "Batas Zonasi Terlihat",
      desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah.",
      icon: "/images/home/zone-ring.svg",
    },
    {
      num: "03",
      title: "Bandingkan Sekitar",
      desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah.",
      icon: "/images/home/compare.svg",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-gray-900 font-sans antialiased selection:bg-[#00B38C] selection:text-white">
      {/* ── TOP NAVBAR ── */}
      <header className="sticky top-0 z-50 bg-white">
        <div className="h-[60px] sm:h-[76px] md:h-[100px] xl:h-[132px] pl-2 pr-[3.5%] flex items-center justify-between gap-4">
          <a href="#beranda" className="h-full shrink-0 select-none" onClick={() => setActiveNav("beranda")}>
            <img src="/images/eduzone-logo.png" alt="EduZONE" className="h-full w-auto object-contain" />
          </a>

          <nav className="flex items-center gap-2.5 sm:gap-4 md:gap-7 xl:gap-8">
            <a
              href="#beranda"
              onClick={() => setActiveNav("beranda")}
              className={`font-[Karla] px-1 xl:px-2.5 ${NAV_LINK} ${navState(activeNav === "beranda")}`}
            >
              Beranda
            </a>
            <a
              href="#kenapa"
              onClick={() => setActiveNav("kenapa")}
              className={`font-[Inter] ${NAV_LINK} ${navState(activeNav === "kenapa")}`}
            >
              Mengapa EduZone
            </a>
            <button
              type="button"
              onClick={() => {
                setActiveNav("sekolah");
                onOpenMap();
              }}
              className={`font-[Karla] cursor-pointer ${NAV_LINK} ${navState(activeNav === "sekolah")}`}
            >
              Sekolah Terdekat
            </button>
          </nav>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="w-[93%] max-w-[1680px] mx-auto flex flex-col gap-12 md:gap-16 xl:gap-[93px] pb-16 xl:pb-[101px]">
        {/* ── 1. HERO SECTION ── */}
        <section id="beranda" className="scroll-mt-[76px] md:scroll-mt-[100px] xl:scroll-mt-[132px]">
          <div className={`ez-hero ${enterLeft(ready)}`}>
            <HeroLogo />
            <p className="ez-hero-text">
              EDU ZONE Kota Bogor menggabungkan analitik geospasial Ina-Geoportal, simulasi catchment area poligon
              1.500m, dan kalkulasi jarak geodesik gerbang-ke-gerbang untuk memverifikasi peluang lolos pendaftaran
              sekolah negeri secara transparan.
            </p>
          </div>
        </section>

        {/* ── 2. GIS SIMULATION CARD ── */}
        <section>
          <div
            className={`bg-[rgba(0,0,0,0.76)] rounded-[26px] ${SHEET_SHADOW} px-6 py-8 md:p-12 xl:px-[7.7%] xl:py-[62px] grid grid-cols-1 lg:grid-cols-[530fr_543fr] gap-8 lg:gap-[9%] items-center ${enterLeft(ready)}`}
            style={{ "--d": "150ms" } as CSSProperties}
          >
            <div className="font-[Inter] text-white">
              <h2 className="font-bold text-[24px] md:text-[28px] xl:text-[32px] leading-[1.21]">
                Simulasi Peta Zonasi Interaktif Berbasis Koordinat Nyata
              </h2>
              <p className="text-[16px] md:text-[19px] xl:text-[24px] leading-[1.21] mt-6 xl:mt-8 mb-8 xl:mb-9 xl:max-w-[505px]">
                Peta interaktif EDU ZONE Kota Bogor memproyeksikan kontur radius buffer, densitas pendaftar per
                kelurahan, dan pergeseran ambang kelulusan secara dinamis. Anda dapat langsung menggeser titik pin
                lokasi rumah untuk melihat perubahan probabilitas secara instan.
              </p>
              <button
                type="button"
                onClick={() => onOpenMap()}
                className="bg-[#00b38c] hover:bg-[#009b79] font-[Karla] font-bold text-[18px] xl:text-[24px] h-[56px] xl:h-[66px] w-full max-w-[440px] px-5 xl:pl-[54px] rounded-[18px] flex items-center gap-4 xl:gap-6 transition-colors active:scale-95 cursor-pointer"
              >
                <img src="/images/home/map-icon.svg" alt="" width={38} height={37} className="shrink-0" />
                Buka GIS Map Explorer
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenMap()}
              aria-label="Buka Peta"
              className="block w-full aspect-[543/412] border-4 border-[#00b38c] rounded-[23px] overflow-hidden cursor-pointer transition-transform hover:scale-[1.015]"
            >
              <img
                src="/images/home/map-preview.webp"
                alt="Pratinjau Peta Interaktif"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover block"
              />
            </button>
          </div>
        </section>

        {/* ── 3. KENAPA EDUZONE SECTION ── */}
        <section id="kenapa" className="scroll-mt-[92px] md:scroll-mt-[116px] xl:scroll-mt-[148px]">
          <div className="grid grid-cols-1 lg:grid-cols-[725fr_629fr] gap-10 lg:gap-[50px]">
            {/* Kolom Kiri: Penjelasan, Statistik & Kota Bogor */}
            <div className="font-[Inter] flex flex-col">
              <span ref={whyLabelRef} className="text-[#1b8058] font-bold text-[18px] xl:text-[24px] leading-[1.21] block opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                Kenapa EduZone?
              </span>
              <h2 ref={whyTitleRef} className="font-['Allerta_Stencil'] font-normal text-black text-[36px] md:text-[46px] xl:text-[58px] leading-[1.28] tracking-[-0.06em] opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                Data yang rumit, jadi<br />keputusan yang tenang.
              </h2>
              <p ref={whyDescRef} className="text-black/[0.59] text-[16px] md:text-[19px] xl:text-[25px] leading-[1.21] mt-5 mb-10 opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                Menentukan sekolah berdasar sistem zonasi kini lebih tenang tanpa rasa cemas. Kami mengolah titik koordinat
                presisi untuk menyajikan data jarak real-time, visualisasi batas zonasi yang jelas, serta analisis
                komparasi sekolah sekitar membantu Anda mengambil keputusan terbaik bagi pendidikan buah hati dengan
                cepat dan tepat.
              </p>

              <div ref={whyStatsRef} className="mt-auto max-w-[703px] border-y border-[#1b8058] py-8 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-0 opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                {[
                  { value: publicSchools.length || 27, label: <>Sekolah Negeri<br />Terdaftar</> },
                  { value: accreditedSchools.length || 7, label: <>Akreditasi A<br />& Lebih</> },
                  { value: averageScore, label: <>Rata-rata<br />Skor Akreditasi</> },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 xl:gap-4 sm:min-h-[63px] ${i > 0 ? "sm:border-l border-[#1b8058] sm:pl-4" : ""}`}
                  >
                    <strong className="text-[#1b8058] font-bold text-[32px] xl:text-[40px] leading-none">
                      <AnimatedCounter target={stat.value} ready={ready} delay={650} />
                    </strong>
                    <span className="text-black/[0.59] text-[13px] xl:text-[15px] leading-[1.21]">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Badge Kota Bogor */}
              <div ref={whyCityRef} className="mt-8 xl:mt-12 pb-6 xl:pb-8 w-full max-w-[383px] border-b border-[#1b8058] flex items-center gap-6 xl:gap-[43px] opacity-0 -translate-x-24 transition-all duration-700 ease-out">
                <img src="/images/home/building.webp" alt="" className="w-[84px] h-[84px] xl:w-[123px] xl:h-[123px] shrink-0" />
                <div>
                  <strong className="text-[#1b8058] font-bold text-[30px] xl:text-[40px] leading-[1.21] block whitespace-nowrap">
                    Kota Bogor
                  </strong>
                  <span className="text-black/[0.59] text-[18px] xl:text-[25px] leading-[1.21] block">Jawa Barat</span>
                </div>
              </div>
            </div>

            {/* Kolom Kanan: 3 Kartu Gelap (01, 02, 03) */}
            <div className="flex flex-col gap-[23px]">
              {features.map((f, idx) => (
                <article
                  key={f.num}
                  ref={whyCardRefs[idx]}
                  className={`font-[Inter] bg-[rgba(0,0,0,0.7)] rounded-[26px] ${SHEET_SHADOW} px-6 py-5 xl:px-8 xl:py-[22px] xl:min-h-[261px] opacity-0 translate-x-[35vw] transition-all duration-1000 ease-out`}
                >
                  <div className="text-[rgba(0,179,140,0.85)] font-bold text-[32px] xl:text-[40px] leading-[1.21]">{f.num}</div>
                  <div className="h-[38px] mt-3.5 mb-3.5 flex items-center">
                    <img src={f.icon} alt="" />
                  </div>
                  <h3 className="text-white font-bold text-[20px] xl:text-[24px] leading-[1.21]">{f.title}</h3>
                  <p className="text-white text-[16px] xl:text-[20px] leading-[1.21] mt-3 xl:mt-4">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER GELAP ── */}
      <footer className="bg-[#595959] text-white pt-11 pb-8 w-full">
        <div className="w-[93%] max-w-[1680px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-14">
            {/* Kolom 1: Brand */}
            <div className="md:col-span-5 flex flex-col items-start font-[Inter]">
              <div className="flex items-center gap-[21px] pl-[9px]">
                <img src="/images/home/building-footer.webp" alt="" className="w-[59px] h-[59px]" />
                <div>
                  <strong className="font-bold text-[28px] leading-[1.21] block">Kota Bogor</strong>
                  <span className="text-white/[0.59] text-[17.5px] leading-[1.21] block">Jawa Barat</span>
                </div>
              </div>
              <img src="/images/home/footer-logo.webp" alt="Education ZONE" className="w-[323px] max-w-full h-auto" />
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
