export default function ReferralLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20 dark:from-gray-900 dark:via-gray-850 dark:to-gray-950">
      {/* Banner Skeleton */}
      <div className="h-64 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 animate-pulse"></div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Title Skeleton */}
        <div className="mb-8 space-y-3">
          <div className="h-8 w-3/4 rounded-lg bg-gray-200 animate-pulse dark:bg-gray-700"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse dark:bg-gray-700"></div>
        </div>

        {/* Code Display Skeleton */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-4 h-6 w-48 rounded bg-gray-200 animate-pulse dark:bg-gray-700"></div>
          <div className="h-24 rounded-lg bg-gray-100 animate-pulse dark:bg-gray-750"></div>
        </div>

        {/* Share Buttons Skeleton */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="h-12 rounded-lg bg-gray-200 animate-pulse dark:bg-gray-700"></div>
        </div>

        {/* Stats Skeleton */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <div className="mb-6 h-6 w-40 rounded bg-gray-200 animate-pulse dark:bg-gray-700"></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl bg-gray-100 animate-pulse dark:bg-gray-750"
              ></div>
            ))}
          </div>
        </div>

        {/* How It Works Skeleton */}
        <div className="mb-8 space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="h-6 w-64 rounded bg-gray-200 animate-pulse dark:bg-gray-700 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse dark:bg-gray-700"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full rounded bg-gray-200 animate-pulse dark:bg-gray-700"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse dark:bg-gray-700"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
