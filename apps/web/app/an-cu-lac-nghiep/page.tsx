/**
 * An Cư Lạc Nghiệp - Trang chủ
 * Chính sách nhà ở xã hội cho người lao động thu nhập thấp
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'An Cư Lạc Nghiệp - Nhà ở xã hội cho người lao động',
  description:
    'Chính sách nhà ở xã hội mua và thuê mua. Văn bản quy định, bài viết, dự án tại TP.HCM, Bình Dương. Đăng ký tư vấn.',
  alternates: { canonical: '/an-cu-lac-nghiep' },
};

const BANNERS = [
  {
    src: '',
    alt: 'Nhà ở xã hội',
    title: 'Chính sách nhà ở xã hội',
    description: 'Mua và thuê mua nhà cho người lao động thu nhập thấp',
    href: '/an-cu-lac-nghiep/chinh-sach',
  },
  {
    src: '',
    alt: 'Dự án nhà ở xã hội',
    title: 'Dự án nhà ở xã hội',
    description: 'TP.HCM, Bình Dương và các tỉnh thành',
    href: '/an-cu-lac-nghiep/du-an',
  },
  {
    src: '',
    alt: 'Đăng ký tư vấn',
    title: 'Tư vấn mua nhà',
    description: 'Đăng ký nhận tư vấn về nhà ở xã hội',
    href: '/an-cu-lac-nghiep/tu-van',
  },
];

export default function AnCuLacNghiepPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 py-20 text-white">
        <div className="container relative mx-auto px-4">
          <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            An Cư Lạc Nghiệp
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-200">
            Chính sách nhà ở xã hội cho người lao động thu nhập thấp – mua và thuê mua nhà. 
            Cập nhật văn bản quy định, bài viết và dự án tại Việt Nam.
          </p>
          <Link
            href="/an-cu-lac-nghiep/tu-van"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-emerald-800 transition-all hover:bg-slate-100"
          >
            Đăng ký tư vấn
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Banner Grid */}
      <section className="mt-12">
        <h2 className="mb-6 text-lg font-semibold uppercase tracking-wider text-muted-foreground">
          Khám phá
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BANNERS.map((banner) => (
            <Link
              key={banner.href}
              href={banner.href}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50">
                {banner.src ? (
                  <Image
                    src={banner.src}
                    alt={banner.alt}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-6xl opacity-50">🏘️</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-semibold">{banner.title}</h3>
                  <p className="mt-1 text-sm text-white/90">{banner.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Liên kết chéo */}
      <section className="mt-12 rounded-2xl border bg-muted/30 p-6">
        <p className="mb-4 text-sm text-muted-foreground">Xem thêm</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/an-cu-lac-nghiep/chinh-sach" className="text-sm font-medium text-primary hover:underline">
            Chính sách & Văn bản
          </Link>
          <Link href="/an-cu-lac-nghiep/bai-viet" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Bài viết SEO
          </Link>
          <Link href="/an-cu-lac-nghiep/du-an" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Dự án
          </Link>
          <Link href="/wealth" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            KODO Wealth
          </Link>
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Trang chủ
          </Link>
        </div>
      </section>
    </div>
  );
}
