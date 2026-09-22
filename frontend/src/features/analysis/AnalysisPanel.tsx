import { useState } from "react";
import { Badge } from "../../components/Badge";
import { useSchoolFinderStore } from "../../hooks/useSchoolFinderStore";
import { useEligibility, useRecommendations } from "../../hooks/useAnalysis";
import { formatDistance } from "../../services/spatialAnalysis";
import { RecommendationCard } from "../recommendation/RecommendationCard";
import { RadiusSlider } from "./RadiusSlider";
import { cn } from "../../utils/cn";

export function AnalysisPanel() {
  const school = useSchoolFinderStore((s) => s.getSelectedSchool());
  const eligibility = useEligibility();
  const recommendations = useRecommendations();
  const selectSchool = useSchoolFinderStore((s) => s.selectSchool);
  const home = useSchoolFinderStore((s) => s.home);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const marginLabel = eligibility.isEligible
    ? `+${formatDistance(eligibility.marginMeters)} headroom`
    : `${formatDistance(Math.abs(eligibility.marginMeters))} melebihi batas`;

  return (
    <div
      className={cn(
        "z-[1000] flex flex-col glass-panel overflow-hidden",
        // Mobile: bottom sheet
        "fixed inset-x-0 bottom-0 rounded-t-2xl transition-[max-height] duration-300",
        mobileExpanded ? "max-h-[80vh]" : "max-h-[220px]",
        // Desktop: floating right panel
        "lg:absolute lg:inset-x-auto lg:bottom-space-md lg:top-space-md lg:right-space-md lg:w-[400px] lg:max-h-none lg:rounded-2xl"
      )}
    >
      {/* Mobile drag handle */}
      <button
        onClick={() => setMobileExpanded((v) => !v)}
        className="lg:hidden flex items-center justify-center py-space-xs shrink-0"
      >
        <span className="w-10 h-1.5 rounded-full bg-surface-container-highest" />
      </button>

      <div className="overflow-y-auto px-space-md pb-space-md lg:p-space-md flex flex-col gap-space-md">
        {/* Status bar */}
        <div className="flex items-center justify-between -mx-space-md -mt-space-2xs lg:-mt-space-md px-space-md py-space-sm bg-surface-container/40 rounded-t-2xl">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-secondary animate-pulse" />
            <span className="font-label-md text-label-md text-on-surface font-semibold">Analisis Domisili SPMB</span>
          </div>
          <Badge tone="success">GPS Aktif</Badge>
        </div>

        {/* School header */}
        <div className="flex flex-col gap-space-2xs">
          <div className="flex items-start justify-between gap-space-xs">
            <div>
              <div className="flex items-center gap-space-2xs">
                <span className="font-headline-md text-headline-md text-on-surface font-bold">{school.name}</span>
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
            <Badge tone="warning">Akreditasi {school.accreditation} (Skor {school.accreditationScore})</Badge>
            <Badge>NPSN: {school.npsn}</Badge>
            <Badge>Kuota SPMB: {school.quota} kursi</Badge>
          </div>
        </div>

        {/* Verdict */}
        <div
          className={cn(
            "p-space-md rounded-xl flex flex-col gap-space-sm",
            eligibility.isEligible
              ? "bg-gradient-to-br from-secondary/15 via-surface-container-high/60 to-surface-container-low"
              : "bg-gradient-to-br from-error/15 via-surface-container-high/60 to-surface-container-low"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  eligibility.isEligible ? "bg-secondary/20 text-secondary" : "bg-error/20 text-error"
                )}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {eligibility.isEligible ? "check_circle" : "cancel"}
                </span>
              </span>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "font-headline-sm text-headline-sm font-bold",
                    eligibility.isEligible ? "text-secondary" : "text-error"
                  )}
                >
                  {eligibility.isEligible ? "MEMENUHI SYARAT" : "TIDAK MEMENUHI SYARAT"}
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Jalur Domisili SPMB</span>
              </div>
            </div>
            <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
              {eligibility.score.toFixed(1)}
              <span className="font-body-sm text-body-sm text-outline font-normal">/100</span>
            </span>
          </div>
          <div className="h-px bg-surface-container-highest" />
          <div className="grid grid-cols-2 gap-space-xs text-left">
            <div className="flex flex-col bg-surface-container-lowest/60 p-space-xs rounded-lg">
              <span className="font-label-sm text-label-sm text-outline">Jarak Garis Lurus</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5">
                {formatDistance(eligibility.distanceMeters)}
              </span>
              <span
                className={cn(
                  "font-label-sm text-label-sm mt-0.5",
                  eligibility.isEligible ? "text-secondary" : "text-error"
                )}
              >
                {marginLabel}
              </span>
            </div>
            <div className="flex flex-col bg-surface-container-lowest/60 p-space-xs rounded-lg">
              <span className="font-label-sm text-label-sm text-outline">Batas Radius Zona</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold mt-0.5">
                {formatDistance(eligibility.radiusMeters)}
              </span>
              <span className="font-label-sm text-label-sm text-primary mt-0.5">Simulasi aktif</span>
            </div>
          </div>
          <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant px-space-2xs pt-space-2xs">
            <span className="flex items-center gap-space-2xs truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" /> {home.label}
            </span>
          </div>
        </div>

        <RadiusSlider />

        {!eligibility.isEligible && (
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Rekomendasi Sekolah Alternatif</span>
              <span className="font-label-sm text-label-sm text-outline">Berdasarkan Jarak</span>
            </div>
            {recommendations.length > 0 ? (
              <div className="flex flex-col gap-space-xs">
                {recommendations.map((rec) => (
                  <RecommendationCard key={rec.school.id} recommendation={rec} onView={() => selectSchool(rec.school.id)} />
                ))}
              </div>
            ) : (
              <p className="text-body-sm font-body-sm text-outline">
                Tidak ada sekolah lain dalam radius zonasi dari domisili ini.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
