/**
 * Trang Hợp tác - Thuê để sở hữu xe máy, ô tô điện VinFast vận hành dịch vụ cùng KODO Platform
 * Thông điệp: Xây dựng tương lai và sự nghiệp cùng KODO
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Hợp tác - Thuê để sở hữu xe VinFast vận hành dịch vụ cùng KODO Platform',
  description:
    'Thuê để sở hữu xe máy, ô tô điện VinFast tham gia vận hành dịch vụ cùng KODO Platform. Ưu đãi chiết khấu cho tài xế đăng ký sớm.',
  alternates: { canonical: '/hop-tac' },
};

export default function HopTacPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight text-slate-800 md:text-5xl">
            Xây dựng tương lai và sự nghiệp{' '}
            <span className="text-amber-600">
              cùng KODO
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Thuê để sở hữu xe máy, ô tô điện VinFast tham gia vận hành dịch vụ cùng KODO Platform.
          </p>
        </section>

        {/* Chính sách & Ưu đãi */}
        <section className="mb-16 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-8">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              Chính sách thuê để sở hữu VinFast
            </h2>
            <ul className="space-y-3 text-slate-600">
              <li>• Xe máy điện VinFast – linh hoạt trả góp</li>
              <li>• Ô tô điện VinFast – ưu đãi cho đối tác KODO</li>
              <li>• Hỗ trợ vốn, hỗ trợ lãi suất đặc biệt</li>
              <li>• Bảo trì, bảo dưỡng ưu tiên</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-8">
            <h2 className="mb-4 text-xl font-semibold text-amber-700">
              Ưu đãi tài xế đăng ký sớm
            </h2>
            <ul className="space-y-3 text-slate-700">
              <li>• Chiết khấu đặc biệt cho 100 tài xế đầu tiên</li>
              <li>• Miễn phí phí gia nhập năm đầu</li>
              <li>• Hỗ trợ hoa hồng cao hơn trong 6 tháng đầu</li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl border border-slate-200 bg-slate-50 p-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            Sẵn sàng vận hành kinh doanh cùng KODO?
          </h2>
          <p className="mb-8 text-slate-600">
            Đăng ký ngay để nhận tư vấn và ưu đãi dành riêng cho tài xế.
          </p>
          <Link
            href="/signup/driver"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-amber-600 hover:scale-105"
          >
            Đăng ký tài xế ngay
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </section>

        {/* Liên kết chéo - Không ngõ cụt */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
          <h2 className="mb-6 text-lg font-semibold text-slate-800">Khám phá thêm</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50"
            >
              Trang chủ
            </Link>
            <Link
              href="/partner"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50"
            >
              Đăng ký đối tác
            </Link>
            <Link
              href="/ride-hailing"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50"
            >
              Đặt xe
            </Link>
            <Link
              href="/the-thao"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50"
            >
              Cộng đồng
            </Link>
            <Link
              href="/tai-ung-dung"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50"
            >
              Tải ứng dụng
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
