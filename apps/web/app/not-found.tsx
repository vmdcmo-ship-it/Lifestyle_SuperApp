import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Không tìm thấy trang',
  description: 'Trang bạn đang tìm không tồn tại',
};

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="mb-2 text-9xl font-bold text-purple-600">404</h1>
          <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
        </div>

        <h2 className="mb-4 text-3xl font-bold">Không tìm thấy trang</h2>

        <p className="mb-8 text-lg text-muted-foreground">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/"
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Về trang chủ
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-6 py-3 font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
          >
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
}
