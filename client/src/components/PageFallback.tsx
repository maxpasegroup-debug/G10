/** Lightweight route-level Suspense fallback — avoids importing heavy UI. */
export function PageFallback() {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 bg-surface px-4 py-16 text-primary">
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-primary/15 border-t-secondary"
        aria-hidden
      />
      <p className="text-sm font-medium text-primary/65">Loading…</p>
    </div>
  )
}
