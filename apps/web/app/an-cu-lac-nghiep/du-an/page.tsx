/**
 * An Cư Lạc Nghiệp - Dự án nhà ở xã hội
 * Giới thiệu các dự án tại TP.HCM, Bình Dương và các tỉnh thành
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dự án nhà ở xã hội - TP.HCM, Bình Dương',
  description:
    'Danh sách dự án nhà ở xã hội tại Việt Nam: TP.HCM, Bình Dương, Đồng Nai. Giá, vị trí, đăng ký tư vấn.',
  alternates: { canonical: '/an-cu-lac-nghiep/du-an' },
};

const DU_AN = [
  { name: 'Khu nhà ở xã hội Hóc Môn', location: 'TP.HCM', area: 'Hóc Môn', status: 'Đang mở bán', image: null },
  { name: 'Nhà ở xã hội Củ Chi', location: 'TP.HCM', area: 'Củ Chi', status: 'Sắp mở bán', image: null },
  { name: 'Nhà ở xã hội Dĩ An', location: 'Bình Dương', area: 'Dĩ An', status: 'Đang mở bán', image: null },
  { name: 'Nhà ở xã hội Thuận An', location: 'Bình Dương', area: 'Thuận An', status: 'Triển khai', image: null },
  { name: 'Nhà ở xã hội Long Thành', location: 'Đồng Nai', area: 'Long Thành', status: 'Dự kiến', image: null },
];

export default function DuAnPage(): JSX.Element {
  return (
    <div className="min-h-screen">
      {/* Banner */}
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Dự án nhà ở xã hội</h1>
          <p className="max-w-2xl text-emerald-100">
            Giới thiệu các dự án nhà ở xã hội tại Việt Nam – TP.HCM, Bình Dương, Đồng Nai và các tỉnh thành khác.
          </p>
        </div>
      </section>

      {/* Grid dự án với banner placeholder */}
      <section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {DU_AN.map((d) => (
            <div key={d.name} className="overflow-hidden rounded-2xl border bg-card">
              <div className="relative aspect-[16/9] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/40 dark:to-teal-900/40">
                {d.image ? (
                  <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl">🏘️</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                  <span className="text-xs font-medium uppercase">{d.location}</span>
                  <h3 className="font-semibold">{d.name}</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="mb-2 text-sm text-muted-foreground">{d.area}</p>
                <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  {d.status}
                </span>
                <Link
                  href="/an-cu-lac-nghiep/tu-van"
                  className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:underline"
                >
                  Đăng ký tư vấn →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Link href="/an-cu-lac-nghiep" className="text-sm font-medium text-emerald-600 hover:underline">
          ← Về tổng quan An Cư Lạc Nghiệp
        </Link>
      </div>
    </div>
  );
}
