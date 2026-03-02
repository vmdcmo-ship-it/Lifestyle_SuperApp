import type { Metadata } from 'next';
import Link from 'next/link';
import { CoinsPageContent } from './coins-content';

export const dynamic = 'force-dynamic';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Lifestyle Xu - Tích điểm & Đổi quà',
  description:
    'Quản lý Lifestyle Xu của bạn. Kiểm tra số dư, lịch sử giao dịch và đổi xu lấy voucher, quà tặng hấp dẫn.',
  keywords: [
    'lifestyle xu',
    'tích điểm',
    'đổi quà',
    'loyalty program',
    'voucher',
    'rewards',
  ],
  openGraph: {
    title: 'Lifestyle Xu - Tích điểm & Đổi quà | Lifestyle Super App',
    description:
      'Quản lý Lifestyle Xu. Kiểm tra số dư, lịch sử giao dịch và đổi xu lấy quà.',
    type: 'website',
    url: '/coins',
  },
  alternates: {
    canonical: '/coins',
  },
};

export default function CoinsPage(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-12 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-amber-100 p-4 dark:bg-amber-900">
              <svg
                className="h-12 w-12 text-amber-500"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="10" className="fill-amber-400" />
                <circle cx="12" cy="12" r="8" className="fill-amber-500" />
                <path
                  d="M12 6v12M8 9h8M8 15h8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="stroke-amber-600"
                />
              </svg>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Lifestyle Xu
            </h1>
            <p className="mb-6 text-lg text-muted-foreground">
              Tích xu mỗi khi sử dụng dịch vụ, đổi xu lấy voucher và quà tặng hấp dẫn
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="#redemption"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Đổi quà ngay
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-6 py-3 font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
              >
                Cách tích xu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <CoinsPageContent />
    </div>
  );
}
