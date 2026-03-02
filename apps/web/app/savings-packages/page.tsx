import type { Metadata } from 'next';
import Link from 'next/link';
import { SavingsPackagesContent } from './savings-content';

export const dynamic = 'force-dynamic';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Gói Tiết Kiệm - Combo Dịch Vụ Ưu Đãi',
  description:
    'Tiết kiệm đến 50% với các gói combo dịch vụ. Giao đồ ăn, đặt xe, mua sắm với giá siêu hời. Đăng ký gói định kỳ để nhận thêm ưu đãi.',
  keywords: [
    'gói tiết kiệm',
    'combo dịch vụ',
    'gói đăng ký',
    'ưu đãi',
    'subscription',
    'bundle deals',
  ],
  openGraph: {
    title: 'Gói Tiết Kiệm - Combo Dịch Vụ Ưu Đãi | Lifestyle Super App',
    description:
      'Tiết kiệm đến 50% với các gói combo dịch vụ. Đăng ký ngay!',
    type: 'website',
    url: '/savings-packages',
    images: [
      {
        url: '/og-savings-packages.png',
        width: 1200,
        height: 630,
        alt: 'Gói Tiết Kiệm',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gói Tiết Kiệm - Combo Dịch Vụ Ưu Đãi',
    description: 'Tiết kiệm đến 50% với các gói combo dịch vụ.',
    images: ['/twitter-savings-packages.png'],
  },
  alternates: {
    canonical: '/savings-packages',
  },
};

export default function SavingsPackagesPage(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 dark:from-green-950 dark:via-emerald-950 dark:to-teal-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
              <span>💰</span>
              Tiết kiệm đến 50%
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Gói Tiết Kiệm
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {' '}
                Siêu Ưu Đãi
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Combo dịch vụ, gói đăng ký định kỳ với mức giá cực kỳ hời. 
              Sử dụng càng nhiều, tiết kiệm càng lớn!
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#packages"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
              >
                Xem gói ngay
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-8 py-4 text-lg font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
              >
                Cách hoạt động
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <SavingsPackagesContent />
    </div>
  );
}
