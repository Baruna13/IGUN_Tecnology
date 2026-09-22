export function MapLoadingState({ label }: { label: string }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-space-sm">
        <span className="w-10 h-10 rounded-full border-2 border-surface-container-highest border-t-primary animate-spin" />
        <p className="text-body-sm font-body-sm text-outline">{label}</p>
      </div>
    </div>
  );
}

export function MapErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface px-space-lg">
      <div className="flex flex-col items-center gap-space-sm text-center max-w-sm">
        <span className="material-symbols-outlined text-error text-[32px]">cloud_off</span>
        <p className="font-headline-sm text-headline-sm text-on-surface font-semibold">Gagal memuat data sekolah</p>
        <p className="text-body-sm font-body-sm text-outline">{message}</p>
        <p className="text-label-sm font-label-sm text-outline">
          Pastikan backend jalan di <code className="text-primary">http://localhost:4000</code>
        </p>
        <button
          onClick={onRetry}
          className="mt-space-xs px-space-md py-space-xs rounded-lg bg-primary-container text-on-primary-container font-label-md text-label-md font-semibold hover:opacity-90 transition-opacity"
        >
          Coba lagi
        </button>
      </div>
    </div>
  );
}
