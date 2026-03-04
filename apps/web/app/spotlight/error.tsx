'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SpotlightError({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    console.error('Spotlight error boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-purple-900/20 via-background to-pink-900/10 px-4">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <span className="text-6xl">⭐</span>
          <div className="mx-auto mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <svg
              className="h-8 w-8 text-amber-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-foreground">Có lỗi với Spotlight</h2>
        <p className="mb-6 text-muted-foreground">
          Không thể tải nội dung. Vui lòng thử lại hoặc quay về trang Spotlight.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mx-auto mb-6 max-w-md rounded-lg bg-destructive/10 p-3 text-left">
            <pre className="overflow-auto text-xs text-muted-foreground">{error.message}</pre>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-2.5 font-semibold text-white transition hover:opacity-90"
          >
            Thử lại
          </button>
          <Link
            href="/spotlight"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-5 py-2.5 font-medium transition hover:bg-accent"
          >
            Về Spotlight
          </Link>
        </div>
      </div>
    </div>
  );
}
