import { Badge } from "../../components/Badge";
import { formatDistance } from "../../services/spatialAnalysis";
import type { RecommendedSchool } from "../../types/school";

export function RecommendationCard({
  recommendation,
  onView,
}: {
  recommendation: RecommendedSchool;
  onView: () => void;
}) {
  const { school, distanceMeters, rank } = recommendation;

  return (
    <button
      onClick={onView}
      className="text-left p-space-sm bg-surface-container/60 hover:bg-surface-container-high rounded-xl transition-all flex flex-col gap-space-xs w-full"
    >
      <div className="flex items-start justify-between gap-space-xs">
        <div className="min-w-0">
          <div className="flex items-center gap-space-2xs">
            <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">{school.name}</span>
            <Badge tone="warning">Pilihan #{rank}</Badge>
          </div>
          <span className="text-body-sm font-body-sm text-outline truncate block">{school.address}</span>
        </div>
        <Badge tone="success" className="shrink-0">
          Eligible
        </Badge>
      </div>
      <div className="flex items-center justify-between pt-space-2xs font-label-sm text-label-sm">
        <span className="text-on-surface font-semibold flex items-center gap-space-2xs">
          <span className="material-symbols-outlined text-[14px] text-primary">navigation</span>
          {formatDistance(distanceMeters)} (Langsung)
        </span>
        <span className="text-outline">Kuota: {school.quota}</span>
        <span className="text-primary flex items-center gap-space-2xs font-medium">
          Lihat <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </span>
      </div>
    </button>
  );
}
