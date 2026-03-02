import Link from 'next/link';
import { Suspense, lazy } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ',
  description: 'Khám phá Lifestyle Super App - Giải pháp tổng hợp cho mọi nhu cầu của bạn',
};

// Icons component để tối ưu SVG
function ArrowRightIcon(): JSX.Element {
  return (
    <svg
      className="ml-2 h-5 w-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 7l5 5m0 0l-5 5m5-5H6"
      />
    </svg>
  );
}

export default function HomePage(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Critical, render immediately */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-heading mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Cuộc sống hiện đại
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {' '}
                trong một ứng dụng
              </span>
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Giao đồ ăn, đặt xe, mua sắm, thanh toán và nhiều hơn nữa. 
              Tất cả trong một nền tảng duy nhất.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Bắt đầu ngay
                <ArrowRightIcon />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-8 py-4 text-lg font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
              >
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Load immediately but could be optimized */}
      <Suspense fallback={<div className="py-20" />}>
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-heading mb-4 text-4xl font-bold">Tính năng nổi bật</h2>
              <p className="text-lg text-muted-foreground">
                Khám phá những gì chúng tôi mang lại cho bạn
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              <FeatureCard
                icon="🍔"
                title="Giao đồ ăn"
                description="Đặt món ngay từ hàng ngàn nhà hàng yêu thích"
              />
              <FeatureCard
                icon="🚗"
                title="Đặt xe"
                description="Di chuyển nhanh chóng với nhiều lựa chọn phương tiện"
              />
              <FeatureCard
                icon="🛍️"
                title="Mua sắm"
                description="Khám phá hàng triệu sản phẩm với giá tốt nhất"
              />
              <FeatureCard
                icon="💳"
                title="Ví Lifestyle"
                description="Nạp tiền, thanh toán nhanh với ưu đãi hấp dẫn"
              />
              <FeatureCard
                icon="💰"
                title="Gói Tiết Kiệm"
                description="Combo dịch vụ siêu ưu đãi, tiết kiệm đến 50%"
              />
            </div>
          </div>
        </section>
      </Suspense>

      {/* Stats Section - Lazy load */}
      <Suspense fallback={<div className="border-y bg-muted/50 py-16" />}>
        <section className="border-y bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 text-center md:grid-cols-3">
              <StatCard number="5M+" label="Người dùng" />
              <StatCard number="10K+" label="Đối tác" />
              <StatCard number="50M+" label="Đơn hàng" />
            </div>
          </div>
        </section>
      </Suspense>

      {/* CTA Section - Lazy load, below the fold */}
      <Suspense fallback={<div className="py-20" />}>
        <CTASection />
      </Suspense>
    </div>
  );
}

// Component types
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

interface StatCardProps {
  number: string;
  label: string;
}

// Optimized FeatureCard component
function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-lg">
      <div className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

// Optimized StatCard component
function StatCard({ number, label }: StatCardProps): JSX.Element {
  return (
    <div>
      <div className="mb-2 text-4xl font-bold text-purple-600 md:text-5xl">{number}</div>
      <div className="text-lg text-muted-foreground">{label}</div>
    </div>
  );
}

// CTA Section - Separated for lazy loading
function CTASection(): JSX.Element {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center text-white shadow-2xl">
          <h2 className="font-heading mb-4 text-3xl font-bold md:text-4xl">
            Sẵn sàng trải nghiệm?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Tải ứng dụng ngay hôm nay và nhận voucher giảm giá 100K cho đơn hàng đầu tiên!
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={process.env.NEXT_PUBLIC_APP_STORE_URL || 'https://apps.apple.com/app/lifestyle-super-app/id0000000000'}
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 transition-transform hover:scale-105"
              aria-label="Tải về từ App Store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || 'https://play.google.com/store/apps/details?id=com.lifestyle.superapp'}
              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 transition-transform hover:scale-105"
              aria-label="Tải về từ Google Play"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
              </svg>
              Google Play
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
