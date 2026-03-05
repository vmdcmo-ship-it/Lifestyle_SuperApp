/**
 * Bất động sản - Trang chủ
 * Tổng quan các mục: Tin tức BDS, Nhà ở xã hội, Dự án chung cư, Nhà cho thuê, Tìm BDS
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { BdsBreadcrumb } from './_components/bds-breadcrumb';

export const metadata: Metadata = {
  title: 'Bất động sản - Tin tức, dự án, mua bán cho thuê',
  description:
    'Tin bất động sản, nhà ở xã hội, dự án chung cư nổi bật, nhà cho thuê. Đăng tin và tìm kiếm bất động sản theo nhu cầu.',
  keywords: [
    'bất động sản',
    'tin bất động sản',
    'nhà ở xã hội',
    'chung cư',
    'nhà cho thuê',
    'mua nhà',
    'đăng tin cho thuê',
  ],
  alternates: { canonical: '/bat-dong-san' },
  openGraph: {
    title: 'Bất động sản - Tin tức, dự án, mua bán cho thuê',
    description: 'Tin bất động sản, nhà ở xã hội, chung cư, đăng tin cho thuê, tìm kiếm theo nhu cầu.',
    url: '/bat-dong-san',
    type: 'website',
  },
};

const SECTIONS = [
  {
    title: 'Tin Bất Động Sản',
    description: 'Tin tức bất động sản, thiết kế phong cách báo chí. Dự án, chính sách pháp luật, SEO bất động sản.',
    href: '/bat-dong-san/tin-bat-dong-san',
  },
  {
    title: 'Nhà ở xã hội',
    description: 'Chính sách nhà ở xã hội cho người lao động. Dự án, quy định, hỗ trợ mua thuê mua.',
    href: '/bat-dong-san/nha-o-xa-hoi',
  },
  {
    title: 'Dự án chung cư nổi bật',
    description: 'Các dự án chung cư uy tín, đang triển khai tại các thành phố lớn.',
    href: '/bat-dong-san/du-an-chung-cu',
  },
  {
    title: 'Nhà cho thuê',
    description: 'Nơi chủ nhà, môi giới đăng tin cho thuê nhà. Tìm phòng trọ, căn hộ cho thuê.',
    href: '/bat-dong-san/nha-cho-thue',
  },
  {
    title: 'Tìm bất động sản',
    description: 'Khách hàng có nhu cầu mua, thuê để lại thông tin. Nền tảng cung cấp và giới thiệu theo yêu cầu.',
    href: '/bat-dong-san/tim-bat-dong-san',
  },
];

export default function BatDongSanPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <BdsBreadcrumb items={[{ label: 'Tổng quan', href: '/bat-dong-san' }]} />
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-900 via-orange-900 to-slate-900 py-20 text-white">
        <div className="container relative mx-auto px-4">
          <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            Bất động sản
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-slate-200">
            Tin tức, dự án, nhà ở xã hội, nhà cho thuê. Đăng tin và tìm kiếm bất động sản theo nhu cầu của bạn.
          </p>
        </div>
      </section>

      {/* Section Grid */}
      <section className="mt-12">
        <h2 className="mb-6 text-lg font-semibold uppercase tracking-wider text-muted-foreground">
          Khám phá
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-amber-300"
            >
              <div className="flex h-full flex-col">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-2xl">
                  🏠
                </div>
                <h3 className="font-semibold text-slate-800 group-hover:text-amber-700">{section.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600">{section.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-600 group-hover:gap-2">
                  Xem chi tiết
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-8">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Bạn cần tìm hoặc đăng tin bất động sản?</h2>
            <p className="mt-1 text-muted-foreground">
              Đăng tin cho thuê miễn phí. Để lại nhu cầu, chúng tôi sẽ giới thiệu sản phẩm phù hợp.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/bat-dong-san/nha-cho-thue/dang-tin"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition-all hover:bg-amber-700"
            >
              Đăng tin cho thuê
            </Link>
            <Link
              href="/bat-dong-san/tim-bat-dong-san"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-600 px-6 py-3 font-semibold text-amber-700 transition-all hover:bg-amber-50"
            >
              Tìm theo nhu cầu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
