import { create } from "zustand";

export interface TutorialStepConfig {
  id: string;
  targetId: string;
  text: string;
}

export const TUTORIAL_STEPS: TutorialStepConfig[] = [
  {
    id: "search",
    targetId: "tutorial-search-bar",
    text: "Fitur pencarian ini memiliki dua mode yang bisa kamu pilih. Jika kamu memilih Sekolah, sistem akan membantu mencari lokasi Sekolah Negeri. Sedangkan jika kamu memilih Alamat, sistem akan mendeteksi dan mencari alamat rumahmu. Pastikan kamu memilih mode yang sesuai sebelum mengetikkan kata kunci pencarian.",
  },
  {
    id: "school-card",
    targetId: "tutorial-school-card",
    text: "Kartu Sekolah ini menampilkan nama sekolah yang berhasil ditemukan dari pencarianmu.",
  },
  {
    id: "legend",
    targetId: "tutorial-legend-bar",
    text: "Bagian ini adalah Legenda Peta yang menjelaskan arti warna titik (pin) lokasi. Kamu bisa melihat penanda untuk Sekolah Terpilih (biru), titik Domisili/Rumah (hijau), Rekomendasi Terdekat (kuning), dan Sekolah Lainnya (hitam) agar peta lebih mudah dipahami.",
  },
  {
    id: "radius-circle",
    targetId: "tutorial-radius-circle",
    text: "Lingkaran Biru ini menandakan radius zonasi dari sekolah yang dipilih. Jika titik rumahmu berada di dalam lingkaran ini, artinya lokasi rumahmu masih masuk ke dalam cakupan area zonasi sekolah tersebut",
  },
  {
    id: "eligibility-green",
    targetId: "tutorial-eligibility-box",
    text: 'Kotak hijau ini menunjukkan hasil analisis domisili. Jika rumahmu masuk dalam zonasi, akan muncul status "MEMENUHI SYARAT" lengkap dengan informasi jarak garis lurus dari rumah ke sekolah serta batas maksimal radius zonasinya.',
  },
  {
    id: "eligibility-red",
    targetId: "tutorial-eligibility-box",
    text: 'Kotak merah ini menunjukkan hasil analisis jika rumahmu tidak masuk zonasi. Akan muncul status "TIDAK MEMENUHI SYARAT" karena jarak domisili rumah ke sekolah melebihi batas maksimal radius zona yang ditentukan.',
  },
];

interface TutorialState {
  isOpen: boolean;
  currentStep: number;
  openTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  closeTutorial: () => void;
  skipTutorial: () => void;
}

export const useTutorialStore = create<TutorialState>((set) => ({
  isOpen: false,
  currentStep: 0,
  openTutorial: () => set({ isOpen: true, currentStep: 0 }),
  nextStep: () =>
    set((state) => {
      if (state.currentStep >= TUTORIAL_STEPS.length - 1) {
        localStorage.setItem("eduzone_tutorial_completed", "true");
        return { isOpen: false, currentStep: 0 };
      }
      return { currentStep: state.currentStep + 1 };
    }),
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  closeTutorial: () => {
    localStorage.setItem("eduzone_tutorial_completed", "true");
    set({ isOpen: false });
  },
  skipTutorial: () => {
    localStorage.setItem("eduzone_tutorial_completed", "true");
    set({ isOpen: false });
  },
}));
