import { useEffect, useMemo, useState } from "react";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import { distanceMeters, formatDistance } from "../../services/spatialAnalysis";
import type { School } from "../../types/school";

type HomePageProps = {
  schools: School[];
  onOpenMap: (schoolId?: string) => void;
};

export function HomePage({ schools, onOpenMap }: HomePageProps) {
  const setHome = useSchoolFinderStore((s) => s.setHome);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

  const publicSchools = useMemo(() => schools.filter((s) => s.status === "Negeri"), [schools]);
  const accreditedSchools = useMemo(() => publicSchools.filter((s) => s.accreditation === "A"), [publicSchools]);
  const averageScore = useMemo(() => {
    if (!accreditedSchools.length) return 0;
    return Math.round(accreditedSchools.reduce((s, x) => s + x.accreditationScore, 0) / accreditedSchools.length);
  }, [accreditedSchools]);
  const nearestSchools = useMemo(() => {
    if (!userCoordinates) return publicSchools.slice(0, 3);
    return [...publicSchools]
      .sort((a, b) => distanceMeters(userCoordinates, a.coordinates) - distanceMeters(userCoordinates, b.coordinates))
      .slice(0, 3);
  }, [publicSchools, userCoordinates]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const id = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const t: [number, number] = [coords.longitude, coords.latitude];
        setUserCoordinates(t);
        setHome(t, "Lokasi Anda saat ini");
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [setHome]);

  const features = [
    { num: "01", icon: "person_pin_circle", title: "Jarak sebenarnya",     desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah." },
    { num: "02", icon: "radio_button_checked", title: "Batas Zonasi Terlihat", desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah." },
    { num: "03", icon: "compare_arrows",    title: "Bandingkan Sekitar",    desc: "Hitungan berbasis koordinat peta, bukan perkiraan kasar. Lihat berapa meter tepatnya dari rumah ke sekolah." },
  ];

  return (  
    <div className="pg">

      {/* ── NAVBAR — putih, terpisah ── */}
      <header className="pg-nav">
        <a href="#top" className="pg-brand">
          <img src="/images/eduzone-logo.png" alt="EduZONE" />
        </a>
        <nav>
          <a href="#top"     className="pg-navlink active">Beranda</a>
          <a href="#kenapa"  className="pg-navlink">Mengapa EduZone</a>
          <a href="#sekolah" className="pg-navlink">Sekolah Terdekat</a>
        </nav>
      </header>

      <main>

        {/* ── HERO — box dengan margin dari navbar ── */}
        <div className="pg-hero-wrap">
          <section className="pg-hero" id="top">
            <div className="pg-hero-bg" />
            <div className="pg-hero-body">
              <div className="pg-hero-title-row">
                <span className="material-symbols-outlined pg-hero-cap">school</span>
                <h1>
                  Education&nbsp;<span className="pg-hero-brand">Z<span className="pg-hero-o">O</span>NE</span>
                </h1>
              </div>
              <p>
                EDU ZONE Kota Bogor menggabungkan analitik geospasial Ina-Geoportal, simulasi catchment area
                poligon 1.500m, dan kalkulasi jarak geodesik gerbang-ke-gerbang untuk memverifikasi peluang
                lolos pendaftaran sekolah negeri secara transparan.
              </p>
            </div>
          </section>
        </div>

        {/* ── GIS CARD ── */}
        <div className="pg-gis-wrap">
          <div className="pg-gis-card">
            <div className="pg-gis-copy">
              <h2>Simulasi Peta Zonasi Interaktif<br />Berbasis Koordinat Nyata</h2>
              <p>
                Peta interaktif EDU ZONE Kota Bogor memproyeksikan kontur radius buffer,
                densitas pendaftar per kelurahan, dan pergeseran ambang kelulusan secara
                dinamis. Anda dapat langsung menggeser titik pin lokasi rumah untuk melihat
                perubahan probabilitas secara instan.
              </p>
              <button className="pg-gis-btn" onClick={() => onOpenMap()}>
                <span className="material-symbols-outlined">map</span>
                Buka GIS Map Explorer
              </button>
            </div>
            <div className="pg-map-preview">
              <div className="pg-map-bg">
                <div className="pg-mg" />
                <div className="pg-mc pg-mc1" /><div className="pg-mc pg-mc2" />
                <div className="pg-mz pg-mz1" /><div className="pg-mz pg-mz2" />
                <div className="pg-mr pg-mr1" /><div className="pg-mr pg-mr2" />
                <div className="pg-mp pg-mp-s"><span className="material-symbols-outlined">school</span></div>
                <div className="pg-mp pg-mp-h"><span className="material-symbols-outlined">home</span></div>
                <div className="pg-mscale"><span />1 km</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KENAPA EDUZONE ── */}
        <section className="pg-why pg-w" id="kenapa">
          <div className="pg-why-left">
            <span className="pg-kicker">Kenapa EduZone?</span>
            <h2>Data yang rumit, jadi<br />keputusan yang tenang.</h2>
            <p>
              Menentukan sekolah berdasar sistem zonasi kini lebih tenang tanpa rasa cemas.
              Kami mengolah titik koordinat presisi untuk menyajikan data jarak real-time,
              visualisasi batas zonasi yang jelas, serta analisis komparasi sekolah sekitar
              membantu Anda mengambil keputusan terbaik bagi pendidikan buah hati dengan cepat dan tepat.
            </p>
            <div className="pg-stats">
              <div className="pg-stat"><strong>{publicSchools.length || 27}</strong><span>Sekolah Negeri<br />Terdaftar</span></div>
              <div className="pg-stat"><strong>{accreditedSchools.length || 7}</strong><span>Akreditasi A<br />&amp; Lebih</span></div>
              <div className="pg-stat"><strong>{averageScore || 91}</strong><span>Rata-rata Skor<br />Akreditasi</span></div>
            </div>
            <div className="pg-city">
              <span className="material-symbols-outlined">apartment</span>
              <span><strong>Kota Bogor</strong><small>Jawa Barat</small></span>
            </div>
          </div>
          <div className="pg-why-right">
            {features.map((f) => (
              <article key={f.num} className="pg-feat">
                <span className="pg-feat-num">{f.num}</span>
                <span className="material-symbols-outlined pg-feat-icon">{f.icon}</span>
                <div><h3>{f.title}</h3><p>{f.desc}</p></div>
              </article>
            ))}
          </div>
        </section>

        {/* ── SEKOLAH TERDEKAT ── */}
        {nearestSchools.length > 0 && (
          <section className="pg-schools pg-w" id="sekolah">
            <div className="pg-schools-head">
              <div>
                <span className="pg-kicker">Sekilas Pilihan</span>
                <h2>Sekolah Terdekat dari Lokasimu</h2>
                <p>{userCoordinates ? "Diurutkan dari yang paling dekat" : "Izinkan akses lokasi untuk urutan yang akurat"}</p>
              </div>
              <button className="pg-textbtn" onClick={() => onOpenMap()}>
                Lihat Semua di Peta <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="pg-sgrid">
              {nearestSchools.map((s, i) => (
                <button key={s.id} className="pg-scard" onClick={() => onOpenMap(s.id)}>
                  <span className={`pg-savatar pg-sa${i + 1}`}><span className="material-symbols-outlined">school</span></span>
                  <span className="pg-scopy">
                    <strong>{s.name.replace("SMA Negeri", "SMAN")}</strong>
                    <small>{s.address} · Akreditasi {s.accreditation}{userCoordinates && <> · {formatDistance(distanceMeters(userCoordinates, s.coordinates))}</>}</small>
                  </span>
                  <span className="material-symbols-outlined pg-sarrow">arrow_outward</span>
                </button>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="pg-footer">
        <div className="pg-w pg-footer-inner">
          <div className="pg-footer-city">
            <span className="material-symbols-outlined">apartment</span>
            <span>
              <strong>Kota Bogor</strong>
              <small>Jawa Barat</small>
            </span>
          </div>
          <div className="pg-footer-brand">
            <span className="material-symbols-outlined pg-footer-grad-icon">school</span>
            <img src="/images/eduzone-logo.png" alt="EduZONE" className="pg-footer-logo" />
          </div>
          <div className="pg-footer-line" />
        </div>
      </footer>

    </div>
  );
}
