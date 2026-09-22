const ITEMS: { color: string; label: string }[] = [
  { color: "#4d8eff", label: "Sekolah Terpilih" },
  { color: "#00b954", label: "Domisili (Rumah)" },
  { color: "#eec200", label: "Rekomendasi Terdekat" },
  { color: "#8c909f", label: "Sekolah Lainnya" },
];

export function Legend() {
  return (
    <div className="hidden sm:flex absolute bottom-space-md left-space-md z-[1000] items-center gap-space-md px-space-md py-space-xs glass-panel rounded-full">
      {ITEMS.map((item) => (
        <span key={item.label} className="flex items-center gap-space-2xs text-label-sm font-label-sm text-on-surface-variant">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
