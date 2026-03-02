/**
 * Loading skeleton for Savings Packages page
 */

export default function SavingsPackagesLoading(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
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

      {/* Benefits Skeleton */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-96 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-6 w-64 animate-pulse rounded bg-muted" />
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border bg-card"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Packages Skeleton */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-6 w-96 animate-pulse rounded bg-muted" />
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[500px] animate-pulse rounded-2xl border bg-card"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
