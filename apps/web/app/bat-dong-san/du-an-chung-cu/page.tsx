/**
 * Dự án chung cư nổi bật - Các dự án chung cư uy tín
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { BdsBreadcrumb } from '../_components/bds-breadcrumb';
import { DU_AN_CHUNG_CU_STATIC, getProjectStatusClass } from '@/lib/config/bat-dong-san-projects';

export const metadata: Metadata = {
  title: 'Dự án chung cư nổi bật - Bất động sản',
  description:
    'Các dự án chung cư uy tín tại TP.HCM, Hà Nội. Đang mở bán, sắp ra mắt. Cập nhật thông tin dự án mới nhất.',
  keywords: [
    'dự án chung cư',
    'chung cư TP.HCM',
    'chung cư Hà Nội',
    'căn hộ đang mở bán',
  ],
  alternates: { canonical: '/bat-dong-san/du-an-chung-cu' },
  openGraph: {
    title: 'Dự án chung cư nổi bật',
    description: 'Các dự án chung cư uy tín đang mở bán, sắp ra mắt.',
    url: '/bat-dong-san/du-an-chung-cu',
    type: 'website',
  },
};

export default function DuAnChungCuPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      <BdsBreadcrumb items={[{ label: 'Dự án chung cư nổi bật', href: '/bat-dong-san/du-an-chung-cu' }]} />
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-800 to-orange-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Dự án chung cư nổi bật</h1>
          <p className="max-w-2xl text-amber-100">
            Các dự án chung cư uy tín tại TP.HCM, Hà Nội và các thành phố lớn. Đang mở bán, sắp ra mắt.
          </p>
        </div>
      </section>

      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DU_AN_CHUNG_CU_STATIC.map((da) => (
            <div
              key={da.id}
              className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100">
                <span className="text-5xl opacity-60">🏢</span>
              </div>
              <div className="p-6">
                <h3 className="font-semibold">{da.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{da.location}</p>
                {da.priceRange && (
                  <p className="mt-1 text-sm font-medium text-amber-700">{da.priceRange}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${getProjectStatusClass(da.status)}`}>
                    {da.statusLabel}
                  </span>
                  {da.developer && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                      {da.developer}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-xl border bg-muted/30 p-6">
        <p className="mb-4 text-muted-foreground">
          Bạn đang tìm mua chung cư? Để lại nhu cầu để nhận tư vấn dự án phù hợp.
        </p>
        <Link
          href="/bat-dong-san/tim-bat-dong-san"
          className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition-all hover:bg-amber-700"
        >
          Tìm bất động sản theo nhu cầu
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
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
