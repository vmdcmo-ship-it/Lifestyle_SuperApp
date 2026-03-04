/**
 * Thuê xe tự lái - Liên kết với Hợp tác VinFast và Đặt xe
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thuê xe tự lái - VinFast & KODO',
  description:
    'Thuê xe tự lái để di chuyển. Đối tác tài xế: thuê mua xe VinFast kinh doanh cùng KODO.',
  alternates: { canonical: '/car-rental' },
};

export default function CarRentalPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-br from-slate-50 to-slate-100 py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-4xl font-bold">Thuê xe tự lái</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Tự do di chuyển với xe thuê. Đối tác tài xế: thuê mua xe VinFast để kinh doanh cùng KODO.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            <Link
              href="/ride-hailing"
              className="group flex flex-col rounded-2xl border bg-card p-8 transition-all hover:shadow-lg"
            >
              <span className="mb-4 text-5xl">🚗</span>
              <h2 className="mb-2 text-xl font-semibold group-hover:text-primary">Đặt xe có tài xế</h2>
              <p className="mb-6 text-muted-foreground">
                Gọi xe, lái hộ – di chuyển an toàn không cần tự lái.
              </p>
              <span className="text-primary font-medium">Xem dịch vụ đặt xe →</span>
            </Link>
            <Link
              href="/hop-tac"
              className="group flex flex-col rounded-2xl border border-cyan-200 bg-cyan-50/50 p-8 transition-all hover:shadow-lg dark:border-cyan-800 dark:bg-cyan-950/30"
            >
              <span className="mb-4 text-5xl">⚡</span>
              <h2 className="mb-2 text-xl font-semibold text-cyan-700 group-hover:text-cyan-600 dark:text-cyan-400">
                Hợp tác thuê mua VinFast
              </h2>
              <p className="mb-6 text-muted-foreground">
                Tài xế: thuê mua xe máy, ô tô điện VinFast để vận hành kinh doanh cùng KODO.
              </p>
              <span className="font-medium text-cyan-600 dark:text-cyan-400">Tìm hiểu Hợp tác →</span>
            </Link>
          </div>
          <div className="mt-12 text-center">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
