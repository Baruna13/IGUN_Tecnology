import { useState } from "react";
import { Badge } from "../../components/Badge";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import { useEligibility, useRecommendations, useRoadRoute } from "../../hooks/useAnalysis";
import { formatDuration } from "../../services/roadRoute";
import { formatDistance } from "../../services/spatialAnalysis";
import { RecommendationCard } from "../recommendation/RecommendationCard";
import { RadiusSlider } from "./RadiusSlider";
import { cn } from "../../utils/cn";
import { ZONASI_CUTOFFS } from "../../data/spmbHistory";
import { RAPOR_RESULTS } from "../../data/raporHistory";

const score2 = (n: number) => n.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
import { useTutorialStore, TUTORIAL_STEPS } from "../tutorial/useTutorialStore";

export function AnalysisPanel() {
  const school = useSchoolFinderStore((s) => s.getSelectedSchool());
  const eligibility = useEligibility();
  const recommendations = useRecommendations();
  const roadRoute = useRoadRoute();
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const home = useSchoolFinderStore((s) => s.home);
  const homeSource = useSchoolFinderStore((s) => s.homeSource);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const isTutorialOpen = useTutorialStore((s) => s.isOpen);
  const currentStep = useTutorialStore((s) => s.currentStep);
  const activeStepId = isTutorialOpen ? TUTORIAL_STEPS[currentStep]?.id : null;

  const isSimulatedGreen = activeStepId === "eligibility-green";
  const isSimulatedRed = activeStepId === "eligibility-red";

  const isEligibleEffective = isSimulatedGreen
    ? true
    : isSimulatedRed
    ? false
    : eligibility.isEligible;

  const isOutsideRayon = eligibility.rayonStatus === "luar";
  const verdictLabel = isEligibleEffective
    ? "MEMENUHI SYARAT"
    : isSimulatedRed || isOutsideRayon
    ? "TIDAK MEMENUHI SYARAT"
    : "DI LUAR RADIUS SIMULASI";
  const rayonLabel = !eligibility.homeKecamatan
    ? "Domisili di luar wilayah rayon Bogor"
    : `Kec. ${eligibility.homeKecamatan} ${
        { utama: "masuk", irisan: "irisan", luar: "di luar" }[eligibility.rayonStatus]
      } Rayon ${eligibility.rayonName ?? "sekolah ini"}`;

  const cutoff = ZONASI_CUTOFFS[school.npsn];
  const rapor = RAPOR_RESULTS[school.npsn];

  const marginLabel = isSimulatedRed
    ? "+1.02 km Headroom"
    : eligibility.marginMeters >= 0
    ? `+${formatDistance(eligibility.marginMeters)} headroom`
    : `${formatDistance(Math.abs(eligibility.marginMeters))} melebihi batas`;

  return (
    <div
      className={cn(
        "z-[1000] flex flex-col glass-panel overflow-hidden",
        "fixed inset-x-0 bottom-0 rounded-t-2xl transition-[max-height] duration-300",
        mobileExpanded ? "max-h-[80vh]" : "max-h-[220px]",
        "lg:absolute lg:inset-x-auto lg:bottom-space-md lg:top-space-md lg:right-space-md lg:w-[400px] lg:max-h-none lg:rounded-2xl"
      )}
    >
      <button
        onClick={() => setMobileExpanded((v) => !v)}
        className="lg:hidden flex items-center justify-center py-space-xs shrink-0"
      >
        <span className="w-10 h-1.5 rounded-full bg-surface-container-highest" />
      </button>
      <div className="overflow-y-auto px-space-md pb-space-md lg:p-space-md flex flex-col gap-space-md">
        <div className="flex items-center justify-between -mx-space-md -mt-space-2xs lg:-mt-space-md px-space-md py-space-sm bg-surface-container/40 rounded-t-2xl">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-secondary animate-pulse" />
            <span className="font-label-md text-label-md text-[#1f2937] font-semibold">Analisis Domisili SPMB</span>
          </div>
          <Badge tone={homeSource === "gps" ? "success" : "neutral"}>
            {homeSource === "gps" ? "GPS Aktif" : homeSource === "manual" ? "Lokasi Manual" : "GPS Nonaktif"}
          </Badge>
        </div>

        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-start justify-between gap-space-xs">
            <div>
              <div className="flex items-center gap-space-2xs">
                <span className="font-headline-md text-headline-md text-[#1f2937] font-bold">{school.name}</span>
                <span className="material-symbols-outlined text-primary text-[16px]" title="Sekolah Negeri Terverifikasi">
                  verified
                </span>
              </div>
              <p className="text-body-sm font-body-sm text-outline mt-0.5">{school.address}</p>
            </div>
            <Badge tone="primary" className="shrink-0">
              SMA {school.status}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-space-xs mt-space-2xs">
            <Badge tone="warning">
              {school.accreditation ? `Akreditasi ${school.accreditation}` : "Belum terakreditasi"}
            </Badge>
            <Badge>NPSN: {school.npsn}</Badge>
            <Badge>
              {school.quota === null ? "Daya tampung: belum ada data" : `Daya tampung 2024/25: ${school.quota} kursi`}
            </Badge>
          </div>
        </div>

        <div
          id="tutorial-eligibility-box"
          className={cn(
            "p-space-md rounded-xl flex flex-col gap-space-sm transition-all duration-300",
            isEligibleEffective
              ? "bg-[#f0fdf4] border border-[#86efac]"
              : "bg-[#fee2e2] border border-[#fca5a5]"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isEligibleEffective ? "bg-[#dcfce7] text-[#166534]" : "bg-[#fecaca] text-[#dc2626]"
                )}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isEligibleEffective ? "check_circle" : "cancel"}
                </span>
              </span>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "font-headline-sm text-headline-sm font-bold",
                    isEligibleEffective ? "text-[#166534]" : "text-[#dc2626]"
                  )}
                >
                  {verdictLabel}
                </span>
                <span className="font-label-sm text-label-sm text-[#1f2937]">Jalur Domisili SPMB</span>
              </div>
            </div>
            <span
              className={cn(
                "font-headline-lg text-headline-lg font-extrabold",
                isEligibleEffective ? "text-[#166534]" : "text-[#dc2626]"
              )}
            >
              {isSimulatedRed ? "20.0" : eligibility.score.toFixed(1)}
              <span className="font-body-sm text-body-sm text-outline font-normal">/100</span>
            </span>
          </div>
          <div className={cn("h-px", isEligibleEffective ? "bg-[#86efac]" : "bg-[#fca5a5]")} />
          <div className="grid grid-cols-2 gap-space-xs text-left">
            <div
              className={cn(
                "flex flex-col p-space-xs rounded-lg border",
                isEligibleEffective
                  ? "bg-[#ffffff]/70 border-[#86efac]/60"
                  : "bg-[#ffffff]/70 border-[#fca5a5]/60"
              )}
            >
              <span className="font-label-sm text-label-sm text-outline">Jarak Garis Lurus</span>
              <span
                className={cn(
                  "font-headline-sm text-headline-sm font-semibold mt-0.5",
                  isEligibleEffective ? "text-[#166534]" : "text-[#dc2626]"
                )}
              >
                {formatDistance(eligibility.distanceMeters)}
              </span>
              <span
                className={cn(
                  "font-label-sm text-label-sm mt-0.5",
                  isEligibleEffective ? "text-[#166534]" : "text-[#dc2626]"
                )}
              >
                {marginLabel}
              </span>
            </div>
            <div
              className={cn(
                "flex flex-col p-space-xs rounded-lg border",
                isEligibleEffective
                  ? "bg-[#ffffff]/70 border-[#86efac]/60"
                  : "bg-[#ffffff]/70 border-[#fca5a5]/60"
              )}
            >
              <span className="font-label-sm text-label-sm text-outline">Batas Radius Zona</span>
              <span
                className={cn(
                  "font-headline-sm text-headline-sm font-semibold mt-0.5",
                  isEligibleEffective ? "text-[#166534]" : "text-[#dc2626]"
                )}
              >
                {formatDistance(eligibility.radiusMeters)}
              </span>
              <span
                className={cn(
                  "font-label-sm text-label-sm mt-0.5",
                  isEligibleEffective ? "text-[#166534]" : "text-[#dc2626]"
                )}
              >
                {isSimulatedRed ? "+1.02 km Headroom" : "Simulasi aktif"}
              </span>
            </div>
          </div>
          {/* Jarak lewat jalan (motor): pembanding saja, skor tetap memakai garis lurus */}
          <div className="flex items-start gap-space-xs p-space-xs rounded-lg border bg-[#ffffff]/70 border-[#c4b5fd] font-label-sm text-label-sm text-[#1f2937]">
            <span className="material-symbols-outlined text-[18px] text-[#7c3aed] shrink-0">two_wheeler</span>
            {roadRoute.data ? (
              <span>
                Lewat jalan ({roadRoute.data.profile}): <strong>{formatDistance(roadRoute.data.meters)}</strong>, sekitar{" "}
                {formatDuration(roadRoute.data.seconds)}.{" "}
                {roadRoute.data.meters > eligibility.distanceMeters &&
                  `${formatDistance(roadRoute.data.meters - eligibility.distanceMeters)} lebih jauh dari garis lurus. `}
                Skor SPMB tetap dihitung dari garis lurus.
              </span>
            ) : roadRoute.isError ? (
              <span>Rute jalan tidak bisa dimuat saat ini. Skor tetap dihitung dari garis lurus.</span>
            ) : (
              <span className="text-outline">Mencari rute jalan terdekat...</span>
            )}
          </div>
          <div className="flex flex-col gap-space-2xs font-label-sm text-label-sm text-[#1f2937] px-space-2xs pt-space-2xs">
            <span className="flex items-center gap-space-2xs truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> {home.label}
            </span>
            <span className="flex items-center gap-space-2xs">
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  { utama: "bg-[#16a34a]", irisan: "bg-[#eab308]", luar: "bg-[#dc2626]" }[eligibility.rayonStatus]
                )}
              />
              {rayonLabel}
            </span>
          </div>
        </div>

        {/* Riwayat jarak zonasi: hanya informasi, tidak memengaruhi skor */}
        <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-[#f8fafc] border border-[#e2e8f0] font-label-sm text-label-sm text-[#334155]">
          <span className="material-symbols-outlined text-[16px] text-[#64748b] shrink-0">history</span>
          {cutoff ? (
            <span>
              Jalur zonasi {cutoff.year}: siswa terjauh yang diterima tinggal{" "}
              {cutoff.approximate ? `sekitar ${formatDistance(cutoff.meters)} (perkiraan pihak sekolah)` : formatDistance(cutoff.meters)} dari
              sekolah.
              Rumahmu {formatDistance(eligibility.distanceMeters)},{" "}
              <strong>
                {eligibility.distanceMeters <= cutoff.meters
                  ? "masih di dalam jarak tersebut"
                  : `${formatDistance(eligibility.distanceMeters - cutoff.meters)} lebih jauh`}
              </strong>
              .
            </span>
          ) : (
            <span>Data jarak penerimaan zonasi tahun lalu belum tersedia untuk sekolah ini.</span>
          )}
        </div>

        {/* Riwayat jalur rapor: hanya informasi, tidak memengaruhi skor */}
        <div className="flex items-start gap-space-xs p-space-sm rounded-xl bg-[#f8fafc] border border-[#e2e8f0] font-label-sm text-label-sm text-[#334155]">
          <span className="material-symbols-outlined text-[16px] text-[#64748b] shrink-0">grading</span>
          {rapor ? (
            <span>
              Jalur rapor {rapor.year}: skor akhir terendah yang diterima <strong>{score2(rapor.low)}</strong>
              {rapor.high !== undefined && `, tertinggi ${score2(rapor.high)}`}.{" "}
              {rapor.source === "Databoks" ? (
                <>
                  Sekolah membuka {rapor.totalSeats} kursi untuk semua jalur, dengan {rapor.applicants?.toLocaleString("id-ID")}{" "}
                  pendaftar. Skor akhir = 50% rata-rata rapor semester 1-5 + 50% tes terstandar. Sumber: daftar kelulusan Disdik
                  Jabar, dirangkum Databoks.
                </>
              ) : (
                <>Skala skor 2025 berbeda dengan 2026.</>
              )}
            </span>
          ) : (
            <span>Data nilai jalur rapor tahun lalu belum tersedia untuk sekolah ini.</span>
          )}
        </div>

        <RadiusSlider />

                {!eligibility.isEligible && (
          <div className="flex flex-col gap-space-sm">
            {/* === Bagian Rekomendasi === */}
            <div className="flex flex-col gap-space-2xs">
              <span className="font-headline-sm text-headline-sm text-[#111827] font-bold">
                Rekomendasi Sekolah Alternatif
              </span>
              <span className="font-label-sm text-label-sm text-[#374151]">
                Berdasarkan jarak garis lurus terdekat
              </span>
            </div>
            
            {recommendations.length > 0 ? (
              <div className="flex flex-col gap-space-xs">
                {recommendations.map((rec) => (
                  <RecommendationCard key={rec.school.id} recommendation={rec} onView={() => selectSchool(rec.school.id)} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm font-body-sm text-[#1f2937] font-medium mt-space-2xs">
                Tidak ada sekolah lain.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}