import { useEffect, useRef } from "react";
import L from "leaflet";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";

const LAYER_LABELS: Record<string, string> = {
  buffer: "Zona Radius Domisili",
  adminBoundary: "Batas Kecamatan",
};

export function LayersPanel() {
  const panelRef = useRef<HTMLDivElement>(null);
  const isOpen = useSchoolFinderStore((s) => s.isLayersPanelOpen);
  const layers = useSchoolFinderStore((s) => s.layers);
  const toggleLayer = useSchoolFinderStore((s) => s.toggleLayer);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    L.DomEvent.disableClickPropagation(panel);
    L.DomEvent.disableScrollPropagation(panel);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div ref={panelRef} className="absolute top-1/2 -translate-y-1/2 left-[4.25rem] sm:left-20 z-[1000] w-64 max-w-[calc(100vw-5rem)] p-space-md glass-panel rounded-2xl flex flex-col gap-space-sm">
      <div className="flex items-center justify-between">
        <span className="font-headline-sm text-headline-sm text-on-surface">Layer Spasial</span>
        <span className="material-symbols-outlined text-outline text-[16px]">tune</span>
      </div>
      <div className="flex flex-col gap-space-xs font-label-md text-label-md">
        {(Object.keys(layers) as Array<keyof typeof layers>).map((key) => (
          <label key={key} className="flex items-center justify-between cursor-pointer text-on-surface hover:text-primary">
            <span>{LAYER_LABELS[key]}</span>
            <input
              type="checkbox"
              checked={layers[key]}
              onChange={() => toggleLayer(key)}
              className="accent-primary w-4 h-4"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
