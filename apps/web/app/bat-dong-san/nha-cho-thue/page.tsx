/**
 * Nhà cho thuê - Nơi chủ nhà, môi giới đăng tin cho thuê
 * Tin cho thuê nhà, phòng trọ, căn hộ
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { BdsBreadcrumb } from '../_components/bds-breadcrumb';
import { NhaChoThueListings } from './_components/nha-cho-thue-listings';

export const metadata: Metadata = {
  title: 'Nhà cho thuê - Đăng tin cho thuê nhà, phòng trọ',
  description:
    'Nơi chủ nhà và môi giới bất động sản đăng tin cho thuê. Phòng trọ, căn hộ, nhà nguyên căn. Xem tin cho thuê mới nhất.',
  keywords: [
    'nhà cho thuê',
    'phòng trọ',
    'căn hộ cho thuê',
    'đăng tin cho thuê',
    'cho thuê nhà',
  ],
  alternates: { canonical: '/bat-dong-san/nha-cho-thue' },
  openGraph: {
    title: 'Nhà cho thuê - Đăng tin miễn phí',
    description: 'Đăng tin cho thuê nhà, phòng trọ, căn hộ. Xem tin cho thuê mới nhất.',
    url: '/bat-dong-san/nha-cho-thue',
    type: 'website',
  },
};

export default function NhaChoThuePage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <BdsBreadcrumb items={[{ label: 'Nhà cho thuê', href: '/bat-dong-san/nha-cho-thue' }]} />
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-800 to-orange-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Nhà cho thuê</h1>
          <p className="max-w-2xl text-amber-100">
            Nơi chủ nhà và môi giới bất động sản đăng tin cho thuê nhà, phòng trọ, căn hộ. Tiếp cận khách hàng có nhu cầu thuê.
          </p>
        </div>
      </section>

      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-100 text-4xl">
            🏠
          </div>
          <h2 className="mb-2 text-xl font-semibold">Chủ nhà cho thuê</h2>
          <p className="mb-6 text-muted-foreground">
            Bạn có nhà, phòng trọ, căn hộ cho thuê? Đăng tin miễn phí để tìm khách thuê nhanh chóng.
          </p>
          <Link
            href="/bat-dong-san/nha-cho-thue/dang-tin"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition-all hover:bg-amber-700"
          >
            Đăng tin cho thuê
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>

        <div className="rounded-xl border bg-card p-8">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-amber-100 text-4xl">
            🤝
          </div>
          <h2 className="mb-2 text-xl font-semibold">Môi giới bất động sản</h2>
          <p className="mb-6 text-muted-foreground">
            Đối tác môi giới đăng tin sản phẩm cho thuê. Mở rộng kênh tiếp cận khách hàng tiềm năng.
          </p>
          <Link
            href="/bat-dong-san/nha-cho-thue/dang-tin"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-amber-600 px-5 py-3 font-semibold text-amber-600 transition-all hover:bg-amber-50"
          >
            Đăng tin môi giới
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Danh sách tin cho thuê */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-semibold">Tin cho thuê mới nhất</h2>
        <NhaChoThueListings />
      </section>

      <section className="rounded-xl border bg-muted/30 p-6">
        <p className="mb-4 text-muted-foreground">
          Bạn đang tìm nhà, phòng trọ cho thuê? Để lại thông tin và nhu cầu, chúng tôi sẽ giới thiệu tin phù hợp.
        </p>
        <Link
          href="/bat-dong-san/tim-bat-dong-san"
          className="font-medium text-amber-600 hover:underline"
        >
          Tìm bất động sản theo nhu cầu →
        </Link>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/bat-dong-san" className="font-medium text-amber-600 hover:underline">
          ← Về Bất động sản
        </Link>
      </p>
    </div>
  );
}
