/**
 * Loading skeleton for Ride Hailing page
 * Provides visual feedback while page content loads
 */

export default function RideHailingLoading(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-20 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 h-20 animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto mb-8 h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <div className="h-14 w-40 animate-pulse rounded-lg bg-muted" />
              <div className="h-14 w-40 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-96 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-6 w-64 animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border bg-card p-6"
              >
                <div className="mb-4 h-12 w-12 rounded bg-muted" />
                <div className="mb-2 h-6 w-3/4 rounded bg-muted" />
                <div className="h-4 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Types Skeleton */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="mb-4 h-10 w-64 animate-pulse rounded bg-muted" />
            <div className="h-6 w-96 animate-pulse rounded bg-muted" />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border bg-card p-6"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Steps Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mx-auto h-10 w-96 animate-pulse rounded bg-muted" />
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-muted" />
                <div className="mx-auto mb-2 h-6 w-32 animate-pulse rounded bg-muted" />
                <div className="mx-auto h-4 w-48 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="border-y bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 text-center md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="mx-auto mb-2 h-12 w-32 animate-pulse rounded bg-muted" />
                <div className="mx-auto h-6 w-24 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-12 text-center">
            <div className="mx-auto mb-4 h-10 w-3/4 animate-pulse rounded bg-white/20" />
            <div className="mx-auto mb-8 h-6 w-2/3 animate-pulse rounded bg-white/20" />
            <div className="mx-auto h-14 w-48 animate-pulse rounded-lg bg-white/30" />
          </div>
        </div>
      </section>
    </div>
  );
}
