import L from "leaflet";

const svgWrap = (html: string, size: number) =>
  L.divIcon({
    html,
    className: "school-marker-icon",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });

/** Large glowing blue pin for the currently selected/target school. */
export function selectedSchoolIcon() {
  return svgWrap(
    `<div style="position:relative;width:44px;height:44px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:9999px;background:rgba(77,142,255,0.25);filter:blur(6px);animation:pulseGlow 2.4s ease-in-out infinite;"></div>
      <div style="position:relative;width:28px;height:28px;border-radius:9999px;background:#4d8eff;border:3px solid #d8e2ff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(77,142,255,0.6);">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#00285d"><path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/></svg>
      </div>
    </div>
    <style>@keyframes pulseGlow{0%,100%{transform:scale(0.85);opacity:0.8}50%{transform:scale(1.15);opacity:0.3}}</style>`,
    44
  );
}

/** Muted grey dot for non-recommended, non-selected schools. */
export function passiveSchoolIcon() {
  return svgWrap(
    `<div style="width:16px;height:16px;border-radius:9999px;background:#2e3544;border:2px solid #8c909f;"></div>`,
    16
  );
}

/** Amber glowing marker with a rank number for top-3 recommendations. */
export function recommendedSchoolIcon(rank: number) {
  return svgWrap(
    `<div style="position:relative;width:30px;height:30px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:9999px;background:rgba(238,194,0,0.25);filter:blur(5px);"></div>
      <div style="position:relative;width:22px;height:22px;border-radius:9999px;background:#eec200;border:2px solid #070e1c;display:flex;align-items:center;justify-content:center;font:700 11px 'Inter',sans-serif;color:#3c2f00;">${rank}</div>
    </div>`,
    30
  );
}

/** Green glowing home/domicile marker, draggable. */
export function homeIcon() {
  return svgWrap(
    `<div style="position:relative;width:40px;height:40px;display:flex;align-items:center;justify-content:center;cursor:grab;">
      <div style="position:absolute;inset:0;border-radius:9999px;background:rgba(74,225,118,0.28);filter:blur(6px);animation:pulseGlow 2s ease-in-out infinite;"></div>
      <div style="position:relative;width:26px;height:26px;border-radius:9999px;background:#00b954;border:2.5px solid #ffffff;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(74,225,118,0.5);">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#003915"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
      </div>
    </div>`,
    40
  );
}
