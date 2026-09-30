import { useEffect, useMemo, useState } from "react";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import { distanceMeters, formatDistance } from "../../services/spatialAnalysis";
import type { School } from "../../types/school";

type HomePageProps = {
  schools: School[];
  onOpenMap: (schoolId?: string) => void;
};

export function HomePage({ schools, onOpenMap }: HomePageProps) {
  const setHome = useSchoolFinderStore((state) => state.setHome);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

  // Filter data sekolah
  const publicSchools = useMemo(
    () => schools.filter((s) => s.status === "Negeri"),
    [schools]
  );

  const accreditedSchools = useMemo(
    () => publicSchools.filter((s) => s.accreditation === "A"),
    [publicSchools]
  );

  const averageScore = useMemo(() => {
    if (!accreditedSchools.length) return 0;
    const total = accreditedSchools.reduce((sum, s) => sum + s.accreditationScore, 0);
    return Math.round(total / accreditedSchools.length);
  }, [accreditedSchools]);

  // 3 sekolah terdekat — urut otomatis kalau lokasi tersedia
  const nearestSchools = useMemo(() => {
    if (!userCoordinates) return publicSchools.slice(0, 3);
    return [...publicSchools]
      .sort((a, b) => distanceMeters(userCoordinates, a.coordinates) - distanceMeters(userCoordinates, b.coordinates))
      .slice(0, 3);
  }, [publicSchools, userCoordinates]);

  // Ambil lokasi pengguna secara realtime
  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      ({ coords }) => {
        const coordsTuple: [number, number] = [coords.longitude, coords.latitude];
        setUserCoordinates(coordsTuple);
        setHome(coordsTuple, "Lokasi Anda saat ini");
      },
      () => {
        // Tetap bisa dipakai walau lokasi ditolak — tampilkan daftar umum
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [setHome]);

  return (
    <div className="home-page min-h-screen overflow-hidden bg-surface text-on-surface">
      {/* === HEADER / NAVIGASI === */}
      <header className="home-header">
        <a href="#top" aria-label="EduZONE — Kembali ke beranda" className="brand-mark">
          <img
            src="/images/eduzone-logo.png"
            alt="EduZONE Logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </a>

        <nav className="home-nav" aria-label="Navigasi utama">
          <a href="#top" className="is-active">Beranda</a>
          <a href="#keunggulan">Mengapa EduZONE</a>
          <a href="#daftar-sekolah">Sekolah Terdekat</a>
        </nav>

        <button
          type="button"
          className="home-nav-action"
          onClick={() => onOpenMap()}
        >
          <span className="material-symbols-outlined">map</span>
          Buka Peta
        </button>
      </header>

      <main id="top">
        {/* === HERO — BAGIAN UTAMA === */}
        <section className="home-hero page-frame">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" />
              Analisis Zonasi SPMB · Kota Bogor
            </div>

            <h1>
              Temukan Sekolah Negeri<br />
              yang Benar-Benar <em>Jangkauanmu</em>
            </h1>

            <p className="hero-lead">
              EduZONE memetakan jarak rumah ke sekolah, batas zonasi resmi, dan pilihan terbaik —
              semua dalam satu peta yang mudah dipahami. Tanpa tebakan, hanya data.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="button button-primary"
                onClick={() => onOpenMap()}
              >
                Mulai Cek Zonasi
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>

              <a href="#keunggulan" className="text-link">
                Bagaimana cara kerjanya?
                <span className="material-symbols-outlined">expand_more</span>
              </a>
            </div>

            <div className="hero-note">
              <span className="material-symbols-outlined">verified</span>
              Data tersinkron dari server · Pembaruan berkala
            </div>
          </div>

          {/* Ilustrasi Peta */}
          <div className="hero-map-card" aria-label="Pratinjau peta zonasi">
            <div className="map-card-toolbar">
              <span><span className="live-dot" /> Pratinjau Zonasi</span>
              <span className="coordinate-chip">EPSG:4326</span>
            </div>
            <div className="map-illustration">
              <div className="map-grid" />
              <div className="contour contour-one" />
              <div className="contour contour-two" />
              <div className="zone zone-large" />
              <div className="zone zone-small" />
              <div className="map-route" />
              <div className="map-pin school-pin">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div className="map-pin home-pin">
                <span className="material-symbols-outlined">home</span>
              </div>
              <div className="map-label school-label">SMAN 1 Bogor</div>
              <div className="map-label home-label">Rumah Anda</div>
              <div className="map-scale"><span /> 1 km</div>
              <div className="map-compass">U</div>
            </div>
            <div className="map-card-footer">
              <span>
                <span className="material-symbols-outlined">radar</span>
                Radius zonasi: 1.500 m
              </span>
              <span className="material-symbols-outlined">more_horiz</span>
            </div>
          </div>
        </section>

        {/* === STATISTIK === */}
        <section className="stats-strip page-frame" aria-label="Ringkasan Data">
          <div>
            <span className="stat-value">{publicSchools.length || "--"}</span>
            <span className="stat-label">Sekolah Negeri<br />Terdaftar</span>
          </div>
          <div>
            <span className="stat-value">{accreditedSchools.length || "--"}</span>
            <span className="stat-label">Akreditasi A<br />& Lebih</span>
          </div>
          <div>
            <span className="stat-value">{averageScore || "--"}</span>
            <span className="stat-label">Rata-rata<br />Skor Akreditasi</span>
          </div>
          <div className="stats-status">
            <span className="material-symbols-outlined">location_city</span>
            <span>
              <strong>Kota Bogor</strong>
              <small>Jawa Barat · Data Terkini</small>
            </span>
          </div>
        </section>

        {/* === KEUNGGULAN / CARA KERJA === */}
        <section className="insight-section page-frame" id="keunggulan">
          <div className="section-heading">
            <span className="section-kicker">Kenapa EduZONE?</span>
            <h2>Data yang rumit, jadi keputusan yang tenang.</h2>
            <p>
              Tidak perlu paham sistem pemetaan. Cukup lihat peta, pahami jaraknya,
              dan pilih sekolah yang masuk akal.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-panel feature-panel-accent">
              <span className="feature-number">01</span>
              <span className="material-symbols-outlined feature-icon">distance</span>
              <h3>Jarak Sebenarnya</h3>
              <p>
                Hitungan berbasis koordinat peta — bukan perkiraan kasar.
                Lihat berapa meter tepatnya dari rumah ke sekolah.
              </p>
            </article>

            <article className="feature-panel">
              <span className="feature-number">02</span>
              <span className="material-symbols-outlined feature-icon">circle</span>
              <h3>Batas Zonasi Terlihat</h3>
              <p>
                Lingkar radius zonasi langsung di peta. Sesuaikan angka,
                lihat sekolah mana yang masuk batas, dan mana yang belum.
              </p>
            </article>

            <article className="feature-panel">
              <span className="feature-number">03</span>
              <span className="material-symbols-outlined feature-icon">compare_arrows</span>
              <h3>Bandingkan Sekitar</h3>
              <p>
                Lihat daftar sekolah terdekat, urut dari yang paling dekat.
                Cek alamat, akreditasi, dan jaraknya sekaligus.
              </p>
            </article>
          </div>
        </section>

        {/* === DAFTAR SEKOLAH TERDEKAT === */}
        <section className="directory-section page-frame" id="daftar-sekolah">
          <div className="directory-heading">
            <div>
              <span className="section-kicker">Sekilas Pilihan</span>
              <h2>Sekolah Terdekat dari Lokasimu</h2>
              <p className="text-muted">
                {userCoordinates
                  ? "Diurutkan dari yang paling dekat berdasarkan lokasi saat ini"
                  : "Izinkan akses lokasi untuk melihat urutan jarak yang akurat"}
              </p>
            </div>
            <button
              type="button"
              className="text-link"
              onClick={() => onOpenMap()}
            >
              Lihat Semua di Peta
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>

          <div className="school-preview-grid">
            {nearestSchools.map((school, index) => (
              <button
                key={school.id}
                type="button"
                className="school-preview"
                onClick={() => onOpenMap(school.id)}
              >
                <span className={`school-avatar avatar-${index + 1}`}>
                  <span className="material-symbols-outlined">school</span>
                </span>
                <span className="school-preview-copy">
                  <strong>{school.name.replace("SMA Negeri", "SMAN")}</strong>
                  <small>
                    {school.address} · Akreditasi {school.accreditation}
                    {userCoordinates && (
                      <> · {formatDistance(distanceMeters(userCoordinates, school.coordinates))}</>
                    )}
                  </small>
                </span>
                <span className="material-symbols-outlined school-arrow">arrow_outward</span>
              </button>
            ))}
          </div>
        </section>

        {/* === AJAKAN AKHIR === */}
        <section className="home-cta page-frame">
          <div>
            <span className="section-kicker">Siap Mulai?</span>
            <h2>Langkah pertama: pilih lokasi.</h2>
            <p>
              Masukkan alamat rumah atau aktifkan lokasi, lalu lihat sekolah
              mana yang benar-benar berada dalam jangkauan zonasi SPMB.
            </p>
          </div>
          <button
            type="button"
            className="button button-light"
            onClick={() => onOpenMap()}
          >
            Buka Peta & Cek Sekarang
            <span className="material-symbols-outlined">north_east</span>
          </button>
        </section>
      </main>

      {/* === FOOTER === */}
      <footer className="home-footer page-frame">
        <span>© 2026 EduZONE · Kota Bogor</span>
        <span>Sistem Informasi Geografis Zonasi Sekolah</span>
      </footer>
    </div>
  );
}