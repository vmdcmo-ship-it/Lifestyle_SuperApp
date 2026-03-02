/**
 * Loading skeleton for Coins page
 */

export default function CoinsLoading(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-12 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 h-16 w-16 animate-pulse rounded-full bg-muted" />
            <div className="mb-4 h-12 animate-pulse rounded-lg bg-muted" />
            <div className="mx-auto mb-6 h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="h-12 w-32 animate-pulse rounded-lg bg-muted" />
              <div className="h-12 w-32 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* Balance Skeleton */}
      <section className="border-b py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 h-10 w-64 animate-pulse rounded bg-muted mx-auto" />
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <div className="h-48 animate-pulse rounded-2xl bg-muted md:col-span-2" />
            <div className="space-y-4">
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
              <div className="h-20 animate-pulse rounded-xl bg-muted" />
            </div>
          </div>
        </div>
      </section>

      {/* How to Earn Skeleton */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-96 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-6 w-64 animate-pulse rounded bg-muted" />
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
