export default function MyCoinsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white dark:from-gray-900 dark:via-gray-850 dark:to-gray-950">
      {/* Header Skeleton */}
      <section className="bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-600 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-4 h-5 w-32 animate-pulse rounded bg-white/20"></div>
          <div className="h-10 w-64 animate-pulse rounded bg-white/20"></div>
          <div className="mt-2 h-5 w-48 animate-pulse rounded bg-white/20"></div>
        </div>
      </section>

      {/* Content Skeleton */}
      <section className="relative -mt-8 pb-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-4 h-32 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
            <div className="h-96 animate-pulse rounded-3xl bg-gray-200 dark:bg-gray-800"></div>
          </div>
        </div>
      </section>

      {/* Transaction Skeleton */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 h-8 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800"></div>
            <div className="space-y-3 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-700"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
