'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}): JSX.Element {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-xl font-bold text-destructive">Có lỗi xảy ra</h1>
      <p className="mt-2 text-sm text-muted-foreground">Ứng dụng gặp sự cố. Vui lòng thử lại.</p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Thử lại
        </button>
        <a href="/" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
          Về Dashboard
        </a>
      </div>
    </div>
  );
}
