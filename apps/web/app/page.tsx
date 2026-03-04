import Link from 'next/link';
import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MasterLayout206020 } from '@/components/layout/master-layout-20-60-20';
import { HeroCarousel } from '@/components/shared/hero-carousel';
import { AppDownloadSection } from '@/components/shared/app-download-section';
import { HopTacSection } from '@/components/shared/hop-tac-section';

export const metadata: Metadata = {
  title: 'KODO - The Heartbeat Of Your Lifestyle',
  description:
    'Super App dịch vụ cuộc sống: Gọi xe, Lái hộ, Mua hộ, Thuê xe tự lái, Spotlight - Tất cả trong một nền tảng.',
};

export default function HomePage(): JSX.Element {
  return (
    <MasterLayout206020>
      {/* Hero - Slide Banner dịch vụ chính */}
      <div className="mb-10">
        <h1 className="sr-only">KODO - The Heartbeat Of Your Lifestyle</h1>
        <HeroCarousel autoPlay aspectRatio="16/9" />
      </div>

      {/* Tagline lớn - Apple/Tesla style */}
      <section className="mb-16 text-center">
        <p className="font-heading text-2xl font-light tracking-wide text-slate-600 md:text-3xl lg:text-4xl">
          The Heartbeat Of Your Lifestyle
        </p>
      </section>

      {/* Stats - Giữ lại cho SEO */}
      <section className="mb-16 rounded-2xl border border-slate-200 bg-slate-50 py-12">
        <div className="grid grid-cols-3 gap-6 text-center">
          <StatCard number="5M+" label="Người dùng" />
          <StatCard number="10K+" label="Đối tác" />
          <StatCard number="50M+" label="Đơn hàng" />
        </div>
      </section>

      {/* Hợp tác - Thuê mua VinFast kinh doanh cùng KODO */}
      <HopTacSection />

      {/* Dịch vụ nổi bật - Grid nhanh dưới carousel */}
      <Suspense fallback={<div className="h-48 animate-pulse rounded-2xl bg-slate-200" />}>
        <section className="mb-16">
          <h2 className="mb-6 text-lg font-semibold uppercase tracking-wider text-muted-foreground">
            Dịch vụ chính
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            <ServiceQuickLink
              title="Gọi xe"
              href="/ride-hailing"
              icon="🚗"
            />
            <ServiceQuickLink
              title="Lái hộ"
              href="/ride-hailing?service=driver"
              icon="🍺"
            />
            <ServiceQuickLink
              title="Thuê xe"
              href="/car-rental"
              icon="🔑"
            />
            <ServiceQuickLink
              title="Mua hộ"
              href="/shopping"
              icon="🛒"
            />
            <ServiceQuickLink
              title="Đi chợ hộ"
              href="/shopping?type=grocery"
              icon="🥬"
            />
            <ServiceQuickLink
              title="Điểm quanh bạn"
              href="/spotlight/diem-den"
              icon="📍"
            />
          </div>
        </section>
      </Suspense>

      {/* CTA - Tải App với ảnh minh họa */}
      <Suspense fallback={<div className="h-32" />}>
        <AppDownloadSection className="rounded-2xl" />
      </Suspense>
    </MasterLayout206020>
  );
}

// StatCard - Tốt cho SEO
function StatCard({ number, label }: { number: string; label: string }): JSX.Element {
  return (
    <div>
      <div className="text-3xl font-bold text-amber-600 md:text-4xl">{number}</div>
      <div className="mt-1 text-sm text-slate-600">{label}</div>
    </div>
  );
}

// Service Quick Link - Minimal, elegant
function ServiceQuickLink({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon: string;
}): JSX.Element {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
    >
      <span className="text-4xl transition-transform group-hover:scale-110" role="img" aria-label={title}>
        {icon}
      </span>
      <span className="text-sm font-medium text-slate-700">{title}</span>
    </Link>
  );
}

