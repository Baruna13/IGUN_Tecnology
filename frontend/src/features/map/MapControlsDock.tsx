import { useMap } from "react-leaflet";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import { cn } from "../../utils/cn";

export function MapControlsDock() {
  const map = useMap();
  const home = useSchoolFinderStore((s) => s.home);
  const isLayersPanelOpen = useSchoolFinderStore((s) => s.isLayersPanelOpen);
  const toggleLayersPanel = useSchoolFinderStore((s) => s.toggleLayersPanel);

  return (
    <div className="absolute top-space-sm sm:top-space-md right-space-sm sm:right-space-md z-[1000] flex flex-col gap-space-2xs p-space-2xs glass-panel rounded-2xl">
      <button className="hud-button" title="Perbesar" onClick={() => map.zoomIn()}>
        <span className="material-symbols-outlined text-[20px]">add</span>
      </button>
      <button className="hud-button" title="Perkecil" onClick={() => map.zoomOut()}>
        <span className="material-symbols-outlined text-[20px]">remove</span>
      </button>
      <div className="h-px w-6 bg-surface-container-highest mx-auto my-0.5" />
      <button
        className="hud-button !text-secondary"
        title="Pusatkan ke Domisili"
        onClick={() => map.flyTo([home.coordinates[1], home.coordinates[0]], 15.5, { duration: 1 })}
      >
        <span className="material-symbols-outlined text-[20px]">gps_fixed</span>
      </button>
      <div className="h-px w-6 bg-surface-container-highest mx-auto my-0.5" />
      <button
        className={cn("hud-button", isLayersPanelOpen && "!text-primary !bg-surface-container-high")}
        title="Layer Spasial"
        onClick={() => toggleLayersPanel()}
      >
        <span className="material-symbols-outlined text-[20px]">layers</span>
      </button>
      <button
        className="hud-button"
        title="Layar Penuh"
        onClick={() => {
          const el = document.getElementById("gis-viewport-wrapper");
          if (el) el.requestFullscreen?.();
        }}
      >
        <span className="material-symbols-outlined text-[20px]">fullscreen</span>
      </button>
    </div>
  );
}
