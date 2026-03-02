'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry)
    console.error('Error caught by error boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-10 w-10 text-destructive"
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
          <h2 className="mb-2 text-3xl font-bold">Đã có lỗi xảy ra</h2>
          <p className="text-lg text-muted-foreground">
            Rất tiếc, đã xảy ra lỗi không mong muốn. Vui lòng thử lại.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mx-auto mb-6 max-w-2xl rounded-lg bg-destructive/10 p-4 text-left">
            <p className="mb-2 font-mono text-sm font-semibold">Error Details:</p>
            <pre className="overflow-auto text-xs text-muted-foreground">
              {error.message}
            </pre>
            {error.digest && (
              <p className="mt-2 text-xs text-muted-foreground">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Thử lại
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-6 py-3 font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
          >
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
