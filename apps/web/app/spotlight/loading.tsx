export default function SpotlightLoading(): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700/80 via-purple-600/80 to-pink-600/80">
        <div className="container relative mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto h-10 w-48 animate-pulse rounded-lg bg-white/20" />
            <div className="mx-auto mt-3 h-6 w-96 animate-pulse rounded bg-white/15" />
            <div className="mt-6 flex justify-center gap-4">
              <div className="h-12 w-32 animate-pulse rounded-lg bg-white/25" />
              <div className="h-12 w-36 animate-pulse rounded-lg bg-white/15" />
            </div>
          </div>
        </div>
      </section>

      {/* Findnear skeleton */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-24 min-w-[140px] shrink-0 animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      </div>

      {/* Feed filter bar skeleton */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="h-7 w-32 animate-pulse rounded bg-muted" />
              <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted/70" />
              <div className="mt-3 flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-muted" />
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-10 w-28 animate-pulse rounded-lg bg-muted" />
              <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-md bg-muted/80" />
            ))}
          </div>
        </div>
      </div>

      {/* Video grid skeleton */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border bg-card">
              <div className="aspect-video animate-pulse bg-muted" />
              <div className="space-y-2 p-4">
                <div className="h-5 w-full animate-pulse rounded bg-muted" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted/80" />
                <div className="flex gap-2">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted/60" />
                  <div className="h-4 w-16 animate-pulse rounded bg-muted/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
