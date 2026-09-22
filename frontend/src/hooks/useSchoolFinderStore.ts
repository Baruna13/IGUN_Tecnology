import { create } from "zustand";
import { DEFAULT_HOME_COORDINATES, DEFAULT_HOME_LABEL } from "../data/mapDefaults";
import type { HomeLocation, School } from "../types/school";

export interface LayerVisibility {
  buffer: boolean;
  adminBoundary: boolean;
  roads: boolean;
}

interface SchoolFinderState {
  /** Populated from GET /api/schools via setSchools() once the query resolves -- see hooks/useSyncSchoolsIntoStore.ts */
  schools: School[];
  selectedSchoolId: string;
  home: HomeLocation;
  /** User-adjustable simulation radius (meters); null = use the school's official zone radius */
  radiusOverrideMeters: number | null;
  layers: LayerVisibility;
  isLayersPanelOpen: boolean;
  isPickingHome: boolean;

  setSchools: (schools: School[]) => void;
  selectSchool: (id: string) => void;
  setHome: (coordinates: [number, number], label?: string) => void;
  setRadiusOverride: (meters: number) => void;
  toggleLayer: (layer: keyof LayerVisibility) => void;
  toggleLayersPanel: (open?: boolean) => void;
  setPickingHome: (picking: boolean) => void;

  /**
   * Returns the actual School object from the `schools` array (a stable
   * reference that only changes when `selectedSchoolId`/`schools` changes)
   * -- safe to use as a Zustand selector. Only call this once `schools` is
   * known to be non-empty (gate rendering on the schools query first, see
   * AppShell). Do NOT add similar getters that construct new objects/arrays
   * (like eligibility or recommendations); see hooks/useAnalysis.ts for why
   * and how those are memoized instead.
   */
  getSelectedSchool: () => School;
}

export const useSchoolFinderStore = create<SchoolFinderState>((set, get) => ({
  schools: [],
  selectedSchoolId: "",
  home: { coordinates: DEFAULT_HOME_COORDINATES, label: DEFAULT_HOME_LABEL },
  radiusOverrideMeters: null,
  layers: { buffer: true, adminBoundary: true, roads: true },
  isLayersPanelOpen: false,
  isPickingHome: false,

  setSchools: (schools) =>
    set((s) => ({
      schools,
      // Keep the current selection if it still exists in the new data; otherwise default to the first school.
      selectedSchoolId: schools.some((sc) => sc.id === s.selectedSchoolId) ? s.selectedSchoolId : (schools[0]?.id ?? ""),
    })),
  selectSchool: (id) => set({ selectedSchoolId: id, radiusOverrideMeters: null }),
  setHome: (coordinates, label) =>
    set({
      home: { coordinates, label: label ?? "Titik domisili terpilih" },
      isPickingHome: false,
    }),
  setRadiusOverride: (meters) => set({ radiusOverrideMeters: meters }),
  toggleLayer: (layer) => set((s) => ({ layers: { ...s.layers, [layer]: !s.layers[layer] } })),
  toggleLayersPanel: (open) => set((s) => ({ isLayersPanelOpen: open ?? !s.isLayersPanelOpen })),
  setPickingHome: (picking) => set({ isPickingHome: picking }),

  getSelectedSchool: () => {
    const { schools, selectedSchoolId } = get();
    return schools.find((s) => s.id === selectedSchoolId) ?? schools[0];
  },
}));
