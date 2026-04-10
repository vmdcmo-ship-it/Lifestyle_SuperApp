import type { Metadata } from 'next';
import Link from 'next/link';
import { BudgetCompareWidget } from '@/components/home/budget-compare-widget';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/bang-tinh',
  title: 'Bảng tính so sánh',
  description:
    'Ước tính nhanh dự án NOXH và nhà thương mại giá rẻ theo ngân sách — timnhaxahoi.com.',
});

export default function BangTinhPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <nav className="mb-6 text-sm text-slate-600">
        <Link href="/" className="font-medium text-brand-navy hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-900">Bảng tính</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Bảng tính so sánh</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Chọn phân khúc, nhập ngân sách và (tuỳ chọn) vùng — xem dự án trong catalog có khung giá phù hợp. Kết quả mang
          tính tham khảo.
        </p>
      </header>

      <section className="glass-panel rounded-2xl p-6 md:p-8" aria-labelledby="bang-tinh-widget">
        <h2 id="bang-tinh-widget" className="sr-only">
          Biểu mẫu bảng tính
        </h2>
        <BudgetCompareWidget showIntro={false} />
      </section>
    </div>
  );
}
