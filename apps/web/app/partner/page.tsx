/**
 * Trang Đối tác - Hub đăng ký Tài xế, Nhà hàng, KOC
 * Liên kết chéo: Hợp tác, Đặt xe, Cộng đồng, Trang chủ
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Đăng ký đối tác - Tài xế, Nhà hàng, KOC',
  description:
    'Gia nhập KODO với tư cách tài xế, nhà hàng hoặc KOC/MOL. Ưu đãi thuê mua xe VinFast cho tài xế.',
  alternates: { canonical: '/partner' },
};

function PartnerCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
    >
      <span className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </span>
      <h2 className="mb-2 text-xl font-semibold text-slate-800">{title}</h2>
      <p className="mb-6 flex-1 text-slate-600">{description}</p>
      <span className="inline-flex items-center gap-2 text-amber-600 group-hover:text-amber-500">
        Đăng ký ngay
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

export default function PartnerPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight text-amber-600 md:text-5xl">
            Gia nhập đối tác KODO
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Trở thành tài xế, đối tác nhà hàng hoặc KOC/MOL – xây dựng sự nghiệp cùng KODO.
          </p>
        </div>

        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <PartnerCard
            title="Tài xế"
            description="Thuê mua xe VinFast kinh doanh, ưu đãi đăng ký sớm. Vận hành như Xanh Platform."
            href="/signup/driver"
            icon="🚗"
          />
          <PartnerCard
            title="Đối tác kinh doanh"
            description="Nhà hàng, bách hóa, dịch vụ địa phương, Shopping Mall. Một form thống nhất."
            href="/dang-ky-doi-tac"
            icon="🏪"
          />
          <PartnerCard
            title="KOC / MOL"
            description="Cộng tác viên nội dung, quảng bá dịch vụ và nhận hoa hồng."
            href="/contact?subject=partner-koc"
            icon="📱"
          />
        </div>

        {/* Liên kết chéo */}
        <section className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
          <h2 className="mb-6 text-lg font-semibold text-slate-800">Khám phá thêm</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/hop-tac"
              className="rounded-lg border border-amber-400 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-100"
            >
              Hợp tác thuê mua VinFast
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
              Thể thao
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-amber-200 hover:bg-amber-50"
            >
              Trang chủ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
