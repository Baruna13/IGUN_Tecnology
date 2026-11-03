import { useEffect, useState, useCallback, useRef } from "react";
import { useTutorialStore, TUTORIAL_STEPS } from "./useTutorialStore";

interface ShapeDetails {
  type: "pill" | "circle" | "rounded-rect";
  x: number;
  y: number;
  w: number;
  h: number;
  rx: number;
  ry: number;
  cx?: number;
  cy?: number;
  r?: number;
}

interface TargetGeometry {
  rect: DOMRect | null;
  shape: ShapeDetails;
  clipPathD: string;
  dot: { x: number; y: number };
  card: { x: number; y: number; width: number };
  pathD: string;
  borderRadius: string;
}

function getRoundedRectPath(x: number, y: number, w: number, h: number, rx: number, ry: number): string {
  const rX = Math.min(rx, w / 2);
  const rY = Math.min(ry, h / 2);
  return `M ${x + rX} ${y} H ${x + w - rX} A ${rX} ${rY} 0 0 1 ${x + w} ${y + rY} V ${y + h - rY} A ${rX} ${rY} 0 0 1 ${x + w - rX} ${y + h} H ${x + rX} A ${rX} ${rY} 0 0 1 ${x} ${y + h - rY} V ${y + rY} A ${rX} ${rY} 0 0 1 ${x + rX} ${y} Z`;
}

function getCirclePath(cx: number, cy: number, r: number): string {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`;
}

export function OnboardingTutorial() {
  const { isOpen, currentStep, nextStep, skipTutorial } = useTutorialStore();
  const [geo, setGeo] = useState<TargetGeometry | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const calculateGeometry = useCallback(() => {
    if (!isOpen) return;
    const stepConfig = TUTORIAL_STEPS[currentStep];
    if (!stepConfig) return;

    let targetEl: HTMLElement | SVGElement | null = null;
    let targetRect: DOMRect | null = null;

    if (stepConfig.id === "radius-circle") {
      targetEl =
        document.querySelector<SVGElement>(".tutorial-buffer-zone") ||
        document.querySelector<SVGElement>('#gis-viewport path[stroke="#4d8eff"]') ||
        document.querySelector<SVGElement>('path[stroke="#4d8eff"]');
    } else {
      targetEl = document.getElementById(stepConfig.targetId);
    }

    if (targetEl) {
      targetRect = targetEl.getBoundingClientRect();
    }

    const cardWidth = Math.min(420, window.innerWidth - 32);
    const cardHeight = cardRef.current?.offsetHeight || 190;
    const padding = 20;

    let dotX = 0;
    let dotY = 0;
    let cardLeft = 0;
    let cardTop = 0;
    let pathD = "";
    let borderRadius = "16px";
    let shape: ShapeDetails = { type: "rounded-rect", x: 0, y: 0, w: 0, h: 0, rx: 16, ry: 16 };
    let innerCutoutPath = "";

    const outerRectPath = `M 0 0 H ${window.innerWidth} V ${window.innerHeight} H 0 Z`;

    if (stepConfig.id === "search") {
      // Step 1: Kotak Pencarian berbentuk PILL (rounded-full)
      const x = targetRect ? targetRect.left : window.innerWidth / 2 - 200;
      const y = targetRect ? targetRect.top : 12;
      const w = targetRect ? targetRect.width : 400;
      const h = targetRect ? targetRect.height : 44;
      const rx = h / 2;
      const ry = h / 2;

      shape = { type: "pill", x, y, w, h, rx, ry };
      innerCutoutPath = getRoundedRectPath(x, y, w, h, rx, ry);
      borderRadius = "9999px";

      dotX = x + w / 2;
      dotY = y + h;
      cardLeft = Math.max(padding, Math.min(window.innerWidth - cardWidth - padding, dotX - cardWidth + 90));
      cardTop = dotY + 70;
      cardTop = Math.max(padding, Math.min(cardTop, window.innerHeight - cardHeight - padding));

      const cornerY = cardTop + 36;
      const cardRight = cardLeft + cardWidth;
      pathD = `M ${dotX} ${dotY} L ${dotX} ${cornerY} L ${cardRight} ${cornerY}`;
    } else if (stepConfig.id === "school-card") {
      // Step 2: Kartu Sekolah berbentuk ROUNDED RECTANGLE (rounded-2xl / 16px)
      const x = targetRect ? targetRect.left : 24;
      const y = targetRect ? targetRect.top : 80;
      const w = targetRect ? targetRect.width : 320;
      const h = targetRect ? targetRect.height : 60;
      const rx = 16;
      const ry = 16;

      shape = { type: "rounded-rect", x, y, w, h, rx, ry };
      innerCutoutPath = getRoundedRectPath(x, y, w, h, rx, ry);
      borderRadius = "16px";

      dotX = x + w;
      dotY = y + h / 2;
      cardLeft = Math.max(padding, x + 16);
      cardTop = y + h + 36;
      cardTop = Math.max(padding, Math.min(cardTop, window.innerHeight - cardHeight - padding));

      const cornerX = cardLeft + cardWidth;
      pathD = `M ${dotX} ${dotY} L ${cornerX} ${dotY} L ${cornerX} ${cardTop}`;
    } else if (stepConfig.id === "legend") {
      // Step 3: Legenda Peta berbentuk PILL (rounded-full)
      const x = targetRect ? targetRect.left : 24;
      const y = targetRect ? targetRect.top : window.innerHeight - 64;
      const w = targetRect ? targetRect.width : 440;
      const h = targetRect ? targetRect.height : 40;
      const rx = h / 2;
      const ry = h / 2;

      shape = { type: "pill", x, y, w, h, rx, ry };
      innerCutoutPath = getRoundedRectPath(x, y, w, h, rx, ry);
      borderRadius = "9999px";

      dotX = x + w;
      dotY = y + h / 2;

      cardLeft = Math.max(padding, Math.min(window.innerWidth - cardWidth - padding, dotX + 80));
      // Pastikan bagian bawah kartu tidak meluncur ke luar layar
      const legendBottom = y + h;
      cardTop = Math.max(padding, Math.min(legendBottom, window.innerHeight - padding) - cardHeight);

      pathD = `M ${dotX} ${dotY} L ${cardLeft} ${dotY}`;
    } else if (stepConfig.id === "radius-circle") {
      // Step 4: Lingkaran Radius Zonasi berbentuk CIRCLE (lingkaran sempurna)
      let cx = window.innerWidth * 0.46;
      let cy = window.innerHeight * 0.48;
      let r = 130;

      if (targetRect && targetRect.width > 20) {
        cx = targetRect.left + targetRect.width / 2;
        cy = targetRect.top + targetRect.height / 2;
        r = targetRect.width / 2;
      }

      shape = { type: "circle", x: cx - r, y: cy - r, w: r * 2, h: r * 2, rx: r, ry: r, cx, cy, r };
      innerCutoutPath = getCirclePath(cx, cy, r);
      borderRadius = "50%";

      // Titik di keliling lingkaran kiri bawah (~225°)
      dotX = cx - r * 0.58;
      dotY = cy + r * 0.62;

      cardLeft = Math.max(padding, Math.min(window.innerWidth - cardWidth - padding, dotX + 65));
      cardTop = Math.max(padding, Math.min(dotY + 40, window.innerHeight - cardHeight - padding));

      const cornerY = cardTop + 36;
      pathD = `M ${dotX} ${dotY} L ${dotX} ${cornerY} L ${cardLeft} ${cornerY}`;
    } else if (stepConfig.id === "eligibility-green" || stepConfig.id === "eligibility-red") {
      // Step 5 & 6: Kotak Analisis SPMB Hijau & Merah berbentuk ROUNDED RECTANGLE (12px)
      const x = targetRect ? targetRect.left : window.innerWidth - 380;
      const y = targetRect ? targetRect.top : 260;
      const w = targetRect ? targetRect.width : 360;
      const h = targetRect ? targetRect.height : 170;
      const rx = 12;
      const ry = 12;

      shape = { type: "rounded-rect", x, y, w, h, rx, ry };
      innerCutoutPath = getRoundedRectPath(x, y, w, h, rx, ry);
      borderRadius = "12px";

      dotX = x;
      dotY = y + h - 24;

      cardLeft = Math.max(padding, dotX - cardWidth - 55);
      cardTop = Math.max(padding, Math.min(dotY - 30, window.innerHeight - cardHeight - padding));

      const cornerY = cardTop + 40;
      const cardRight = cardLeft + cardWidth;
      pathD = `M ${dotX} ${dotY} L ${dotX} ${cornerY} L ${cardRight} ${cornerY}`;
    }

    const clipPathD = `${outerRectPath} ${innerCutoutPath}`;

    setGeo({
      rect: targetRect,
      shape,
      clipPathD,
      dot: { x: dotX, y: dotY },
      card: { x: cardLeft, y: cardTop, width: cardWidth },
      pathD,
      borderRadius,
    });
  }, [isOpen, currentStep]);

  useEffect(() => {
    if (!isOpen) return;

    calculateGeometry();
    const timer = setTimeout(calculateGeometry, 100);
    const timer2 = setTimeout(calculateGeometry, 300);

    const handleResize = () => calculateGeometry();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize, true);

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize, true);
    };
  }, [isOpen, currentStep, calculateGeometry]);

  // Navigasi Keyboard
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        skipTutorial();
      } else if (e.key === "Enter" || e.key === " ") {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault();
          nextStep();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextStep, skipTutorial]);

  if (!isOpen || !geo) return null;

  const currentStepData = TUTORIAL_STEPS[currentStep];
  const isRedStep = currentStepData.id === "eligibility-red";
  const s = geo.shape;

  return (
    <div className="fixed inset-0 z-[2000] pointer-events-auto select-none transition-all duration-300">
      {/* ── 1. SVG Definitions untuk ClipPath dan Mask Berbentuk Asli (Pill, Circle, Rounded-Rect) ── */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[1999]">
        <defs>
          {/* ClipPath dengan fillRule evenodd untuk melubangi bentuk persis elemen */}
          <clipPath id="tutorial-spotlight-clip" clipPathUnits="userSpaceOnUse">
            <path d={geo.clipPathD} fillRule="evenodd" />
          </clipPath>

          {/* Mask cadangan: Putih = terlihat blur, Hitam = lubang bening bebas blur */}
          <mask id="tutorial-spotlight-mask" maskUnits="userSpaceOnUse">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {s.type === "circle" ? (
              <circle cx={s.cx} cy={s.cy} r={s.r} fill="black" />
            ) : (
              <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={s.rx} ry={s.ry} fill="black" />
            )}
          </mask>

          {/* Filter Drop Shadow untuk Garis dan Titik */}
          <filter id="tut-drop-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.45)" />
          </filter>
        </defs>
      </svg>

      {/* ── 2. Fullscreen Backdrop Blur dengan Lubang Bentuk Presisi ── */}
      <div
        onClick={nextStep}
        style={{
          clipPath: `path(evenodd, '${geo.clipPathD}')`,
          WebkitClipPath: `path(evenodd, '${geo.clipPathD}')`,
          mask: "url(#tutorial-spotlight-mask)",
          WebkitMask: "url(#tutorial-spotlight-mask)",
        }}
        className="absolute inset-0 backdrop-blur-[4px] bg-black/25 cursor-pointer transition-all duration-300 pointer-events-auto"
        title="Klik di mana saja untuk lanjut"
      />

      {/* ── 3. Bingkai Bercahaya yang Mengikuti Bentuk Asli Target ── */}
      <div
        style={{
          position: "absolute",
          left: `${s.x - 3}px`,
          top: `${s.y - 3}px`,
          width: `${s.w + 6}px`,
          height: `${s.h + 6}px`,
          borderRadius: geo.borderRadius,
        }}
        className={`pointer-events-none border-[2.5px] border-white/95 transition-all duration-300 z-[2003] ${isRedStep
          ? "shadow-[0_0_0_3px_rgba(239,68,68,0.5),0_10px_35px_rgba(0,0,0,0.35)]"
          : s.type === "circle"
            ? "shadow-[0_0_0_4px_rgba(77,142,255,0.45),0_10px_35px_rgba(0,0,0,0.35)]"
            : "shadow-[0_0_0_3px_rgba(0,179,140,0.45),0_10px_35px_rgba(0,0,0,0.35)]"
          }`}
      />

      {/* ── 4. SVG Leader Line & Titik Putih Penunjuk ── */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[2004]">
        {/* Garis penunjuk siku-siku */}
        <path
          d={geo.pathD}
          stroke="#FFFFFF"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#tut-drop-shadow)"
        />

        {/* Titik bulat putih pada elemen target */}
        <circle
          cx={geo.dot.x}
          cy={geo.dot.y}
          r={5}
          fill="#FFFFFF"
          filter="url(#tut-drop-shadow)"
        />
      </svg>

      {/* ── 5. Kartu Dialog Tutorial ── */}
      <div
        ref={cardRef}
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam kartu memicu backdrop
        style={{
          position: "absolute",
          left: `${geo.card.x}px`,
          top: `${geo.card.y}px`,
          width: `${geo.card.width}px`,
        }}
        className="z-[2005] bg-white rounded-2xl shadow-[0_22px_65px_-12px_rgba(0,0,0,0.45)] border border-gray-100 p-5 sm:p-6 flex flex-col justify-between transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-auto"
      >
        {/* Tombol Tutup (X) di pojok kanan atas */}
        <button
          type="button"
          onClick={skipTutorial}
          className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-700 transition-colors w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
          title="Tutup panduan"
          aria-label="Tutup"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        <p className="text-[#27272a] text-[13.5px] sm:text-[14px] leading-[1.65] font-normal pr-5">
          {currentStepData.text}
        </p>

        <div className="flex items-center justify-between mt-5 pt-1">
          <button
            type="button"
            onClick={skipTutorial}
            className="text-[12px] text-gray-500 hover:text-gray-800 transition-colors cursor-pointer bg-transparent border-0 p-0 underline-offset-2 hover:underline"
          >
            Klik disini untuk lewati panduan
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="bg-[#00B38C] hover:bg-[#009E7A] active:scale-95 text-white font-semibold text-[13.5px] px-7 py-1.5 rounded-full transition-all shadow-sm cursor-pointer"
          >
            Oke
          </button>
        </div>
      </div>
    </div>
  );
}
