'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 font-sans text-slate-800">
        <h1 className="text-lg font-semibold">Đã xảy ra lỗi</h1>
        <p className="max-w-md text-center text-sm text-slate-600">Vui lòng thử tải lại trang.</p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Thử lại
        </button>
      </body>
    </html>
  );
}
