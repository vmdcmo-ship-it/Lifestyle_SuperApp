export default function WalletLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Hero Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-4 h-12 w-64 animate-pulse rounded-lg bg-white/20"></div>
            <div className="mx-auto h-6 w-96 animate-pulse rounded-lg bg-white/20"></div>
          </div>
        </div>
      </section>

      {/* Balance Skeleton */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Main Balance Card Skeleton */}
            <div className="mb-8 h-64 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"></div>

            {/* Quick Stats Skeleton */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
                ></div>
              ))}
            </div>

            {/* Payment Methods Skeleton */}
            <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-4 h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700"
                  ></div>
                ))}
              </div>
            </div>

            {/* Transaction History Skeleton */}
            <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
              <div className="mb-6 flex items-center justify-between">
                <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-700"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
