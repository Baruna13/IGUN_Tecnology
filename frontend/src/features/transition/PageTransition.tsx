import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./transition.css";

export type TransitionVariant = "intro" | "toMap" | "toHome";

interface PageTransitionProps {
  variant: TransitionVariant;
  /** Dipanggil saat layar sudah tertutup penuh. Di sinilah halaman diganti. */
  onCovered?: () => void;
  /** Dipanggil saat animasi selesai dan overlay boleh dilepas. */
  onDone: () => void;
}

const CONFIG: Record<
  TransitionVariant,
  { duration: number; coverAt: number | null; label: string; direction: 1 | -1; t0: number }
> = {
  intro: { duration: 2900, coverAt: null, label: "Menyiapkan peta zonasi", direction: 1, t0: 150 },
  toMap: { duration: 2300, coverAt: 700, label: "Mencari sekolah terdekat", direction: 1, t0: 350 },
  toHome: { duration: 2300, coverAt: 700, label: "Kembali ke beranda", direction: -1, t0: 350 },
};

/* ───────────── ikon latar yang ikut bergerak bersama transisi ───────────── */

type IconKind = "pin" | "book" | "compass" | "search" | "school" | "target" | "cap" | "sign" | "ruler";

const ICONS: Array<{
  kind: IconKind;
  left: number; // % dari lebar layar
  top: number; // % dari tinggi layar
  size: number; // px pada layar 1440
  rot: number;
  accent?: boolean;
  delay: number; // ms
}> = [
  { kind: "pin", left: 9, top: 15, size: 58, rot: -14, accent: true, delay: 0 },
  { kind: "book", left: 26, top: 9, size: 46, rot: 10, delay: 80 },
  { kind: "compass", left: 47, top: 6, size: 40, rot: -20, delay: 160 },
  { kind: "search", left: 69, top: 12, size: 48, rot: 12, delay: 60 },
  { kind: "school", left: 89, top: 19, size: 60, rot: -6, delay: 140 },
  { kind: "target", left: 94, top: 47, size: 50, rot: 0, accent: true, delay: 220 },
  { kind: "cap", left: 90, top: 77, size: 56, rot: 14, delay: 100 },
  { kind: "sign", left: 71, top: 88, size: 46, rot: -10, delay: 200 },
  { kind: "pin", left: 50, top: 91, size: 40, rot: 8, delay: 40 },
  { kind: "school", left: 29, top: 83, size: 52, rot: 8, delay: 180 },
  { kind: "ruler", left: 10, top: 79, size: 54, rot: -24, delay: 120 },
  { kind: "target", left: 5, top: 48, size: 44, rot: 0, delay: 260 },
];

function IconSvg({ kind }: { kind: IconKind }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (kind) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
    case "book":
      return (
        <svg {...common}>
          <path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3z" />
          <path d="M21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </svg>
      );
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6" />
          <path d="M16 16l5 5" />
        </svg>
      );
    case "school":
      return (
        <svg {...common}>
          <path d="M4 20V10l8-5 8 5v10z" />
          <path d="M10 20v-5h4v5" />
          <path d="M12 5V2.5h3" />
        </svg>
      );
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      );
    case "cap":
      return (
        <svg {...common}>
          <path d="M2 9l10-5 10 5-10 5z" />
          <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
          <path d="M22 9v6" />
        </svg>
      );
    case "sign":
      return (
        <svg {...common}>
          <path d="M12 3v18" />
          <path d="M5 6h11l3 2.5-3 2.5H5z" />
          <path d="M19 14H8l-3 2.5L8 19h11z" />
        </svg>
      );
    case "ruler":
      return (
        <svg {...common}>
          <rect x="2" y="8" width="20" height="8" rx="1.5" />
          <path d="M6 8v3M10 8v4M14 8v3M18 8v4" />
        </svg>
      );
  }
}

/* ───────────── rute putus-putus yang tergambar: pin asal menuju pin tujuan ───────────── */

const ROUTE = "M120 730 C 420 560, 540 860, 820 650 S 1280 330, 1480 190";
const PIN_PATH = "M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z";

function RouteLayer({ flip, t0 }: { flip: boolean; t0: number }) {
  const begin = `${((t0 + 200) / 1000).toFixed(2)}s`;
  return (
    <svg
      className={`ez-route${flip ? " ez-flip" : ""}`}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <path className="ez-route-base" d={ROUTE} />
      <path className="ez-route-draw" d={ROUTE} pathLength={1} />

      <g transform="translate(120 730)">
        <g className="ez-marker ez-marker-start">
          <g transform="translate(-31.2 -54.6) scale(2.6)">
            <path d={PIN_PATH} fill="rgba(0,179,140,.9)" />
            <circle cx="12" cy="9.5" r="2.6" fill="#595959" />
          </g>
        </g>
      </g>
      <g transform="translate(1480 190)">
        <g className="ez-marker ez-marker-end">
          <g transform="translate(-31.2 -54.6) scale(2.6)">
            <path d={PIN_PATH} fill="rgba(255,255,255,.85)" />
            <circle cx="12" cy="9.5" r="2.6" fill="#595959" />
          </g>
        </g>
      </g>

      <circle r="9" fill="#fff" opacity="0">
        <animateMotion
          path={ROUTE}
          dur="1.3s"
          begin={begin}
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.6 0 0.3 1"
        />
        <animate
          attributeName="opacity"
          values="0;1;1;0"
          keyTimes="0;0.08;0.9;1"
          dur="1.3s"
          begin={begin}
          fill="freeze"
        />
      </circle>
    </svg>
  );
}

/* ───────────── logo Education ZONE ───────────── */

function CapIcon() {
  return (
    <svg className="ez-cap" viewBox="0 0 100 80" aria-hidden="true">
      <path d="M26 36V50C26 56 37 61 50 61C63 61 74 56 74 50V36L50 48L26 36Z" fill="#E8EDF2" />
      <polygon points="50,12 92,32 50,48 8,32" fill="#fff" />
      <g className="ez-tassel">
        <path d="M50 30 Q30 33 22 44" stroke="#6b6b6b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <rect x="19" y="44" width="6" height="12" rx="2" fill="#fff" />
      </g>
    </svg>
  );
}

function Letters({ text, className }: { text: string; className: string }) {
  return (
    <>
      {Array.from(text).map((ch, i) => (
        <span key={i} className={className} style={{ "--i": i } as CSSProperties} aria-hidden="true">
          {ch}
        </span>
      ))}
    </>
  );
}

function ZoneWord() {
  return (
    <span className="ez-zone" aria-hidden="true">
      <span className="ez-zl" style={{ "--i": 0 } as CSSProperties}>Z</span>
      <span className="ez-o ez-zl" style={{ "--i": 1 } as CSSProperties}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={PIN_PATH} fill="#00B38C" />
          <circle cx="12" cy="9.5" r="2.4" fill="#F4FAFA" />
        </svg>
      </span>
      <span className="ez-zl" style={{ "--i": 2 } as CSSProperties}>N</span>
      <span className="ez-zl" style={{ "--i": 3 } as CSSProperties}>E</span>
    </span>
  );
}

/* ───────────── util ───────────── */

/** Tunggu font logo siap supaya huruf tidak melompat saat animasi berjalan. */
function useFontsReady(maxWait = 1000) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const finish = () => {
      if (!cancelled) setReady(true);
    };
    const timer = window.setTimeout(finish, maxWait);
    if (document.fonts?.load) {
      Promise.all([
        document.fonts.load('1em "Allerta Stencil"', "Education"),
        document.fonts.load('700 1em "Belanosima"', "ZONE"),
      ])
        .then(() => {
          window.clearTimeout(timer);
          finish();
        })
        .catch(finish);
    } else {
      finish();
    }
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [maxWait]);
  return ready;
}

/* ───────────── komponen utama ───────────── */

export function PageTransition({ variant, onCovered, onDone }: PageTransitionProps) {
  const cfg = CONFIG[variant];
  const [reduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const duration = reduced ? 700 : cfg.duration;
  const coverAt = reduced ? (cfg.coverAt === null ? null : 250) : cfg.coverAt;
  const ready = useFontsReady();

  const coveredRef = useRef(onCovered);
  const doneRef = useRef(onDone);
  useEffect(() => {
    coveredRef.current = onCovered;
    doneRef.current = onDone;
  }, [onCovered, onDone]);

  // Jadwal: ganti halaman saat layar tertutup penuh, lepas overlay saat selesai.
  useEffect(() => {
    if (!ready) return;
    const timers: number[] = [];
    if (coverAt !== null) timers.push(window.setTimeout(() => coveredRef.current?.(), coverAt));
    timers.push(window.setTimeout(() => doneRef.current(), duration));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [ready, coverAt, duration]);

  // Kunci scroll selama transisi.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const dir = cfg.direction;
  const iconBase = variant === "intro" ? 100 : 300;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`${cfg.label}`}
      className={`ez-overlay ez-${variant}${ready ? " ez-go" : ""}${reduced ? " ez-reduced" : ""}`}
      style={{ "--dur": `${duration}ms`, "--t0": `${cfg.t0}ms` } as CSSProperties}
    >
      {ready && (
        <>
          {!reduced && (
            <>
              <div className="ez-grid" />
              <div className="ez-ring" style={{ "--k": 0 } as CSSProperties} />
              <div className="ez-ring is-accent" style={{ "--k": 1 } as CSSProperties} />
              <div className="ez-ring" style={{ "--k": 2 } as CSSProperties} />
              <RouteLayer flip={dir === -1} t0={cfg.t0} />
              {ICONS.map((ic, i) => (
                <span
                  key={i}
                  className="ez-icon"
                  style={
                    {
                      left: `${ic.left}%`,
                      top: `${ic.top}%`,
                      width: `clamp(${Math.round(ic.size * 0.6)}px, ${(ic.size / 14.4).toFixed(2)}vw, ${Math.round(
                        ic.size * 1.15
                      )}px)`,
                      color: ic.accent ? "rgba(0,179,140,.62)" : "rgba(255,255,255,.2)",
                      "--fx": `${((ic.left - 50) * 0.55 - dir * 16).toFixed(1)}vw`,
                      "--fy": `${((ic.top - 50) * 0.55).toFixed(1)}vh`,
                      "--cx": `${(50 - ic.left).toFixed(1)}vw`,
                      "--cy": `${(50 - ic.top).toFixed(1)}vh`,
                      "--r": `${ic.rot * 2}deg`,
                      "--r2": `${-ic.rot * 3}deg`,
                      "--d": `${iconBase + ic.delay}ms`,
                      "--o": `${Math.round(ic.delay * 0.6)}ms`,
                      "--fd": `${-ic.delay * 7}ms`,
                    } as CSSProperties
                  }
                >
                  <IconSvg kind={ic.kind} />
                </span>
              ))}
            </>
          )}

          <div className="ez-content">
            <div className="ez-logo">
              <CapIcon />
              <span className="ez-edu">
                <Letters text="Education" className="ez-el" />
              </span>
              <ZoneWord />
            </div>
            <p className="ez-tag">
              {cfg.label}
              <span className="ez-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </p>
            <div className="ez-bar" aria-hidden="true">
              <i />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
