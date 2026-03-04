/**
 * Trang Tải ứng dụng - Giống Be Group
 * Liên kết chéo: Trang chủ, Dịch vụ, Hợp tác – không ngõ cụt
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { AppDownloadSection } from '@/components/shared/app-download-section';

export const metadata: Metadata = {
  title: 'Tải ứng dụng KODO',
  description:
    'Tải ứng dụng KODO để trải nghiệm gọi xe, giao đồ ăn, mua sắm và nhiều dịch vụ tiện ích khác.',
  alternates: { canonical: '/tai-ung-dung' },
};

export default function TaiUngDungPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <AppDownloadSection />
      <section className="border-t bg-slate-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-6 text-slate-400">Khám phá thêm dịch vụ và cơ hội hợp tác</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
            >
              Trang chủ
            </Link>
            <Link
              href="/ride-hailing"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
            >
              Đặt xe
            </Link>
            <Link
              href="/food-delivery"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
            >
              Giao đồ ăn
            </Link>
            <Link
              href="/hop-tac"
              className="rounded-lg border border-cyan-500/50 px-4 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10"
            >
              Hợp tác
            </Link>
            <Link
              href="/partner"
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
            >
              Đăng ký đối tác
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
