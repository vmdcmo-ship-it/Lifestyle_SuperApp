'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <h1 className="text-xl font-bold text-destructive">Có lỗi xảy ra</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Không thể tải trang. Vui lòng thử lại hoặc quay về Dashboard.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Thử lại
        </button>
        <Link href="/" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
          Về Dashboard
        </Link>
      </div>
    </div>
  );
}
