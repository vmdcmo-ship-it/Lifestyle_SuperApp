import type { Metadata } from 'next';
import Link from 'next/link';
import { SectionCategoryCard } from '@/components/shared/section-category-card';
import { THE_THAO_CATEGORIES } from '@/lib/config/section-categories';

export const metadata: Metadata = {
  title: 'Thể thao - Tennis, Pickleball & Run to Earn',
  description: 'Cộng đồng thể thao - Tin tức Tennis, Pickleball, CLB và Run to Earn',
  alternates: { canonical: '/the-thao' },
};

export default function CongDongPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-gradient-to-br from-emerald-50 to-teal-50 py-16 dark:from-emerald-950 dark:to-teal-950">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Cộng đồng thể thao</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">Kết nối Tennis, Pickleball, Run to Earn</p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {THE_THAO_CATEGORIES.map((item) => (
              <SectionCategoryCard key={item.href} {...item} />
            ))}
          </div>
        </div>
      </section>
      <section className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-4 text-sm text-muted-foreground">Liên kết liên quan</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">
              Trang chủ
            </Link>
            <Link href="/hop-tac" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">
              Hợp tác (tài xế VinFast)
            </Link>
            <Link href="/partner" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">
              Đăng ký đối tác
            </Link>
            <Link href="/ride-hailing" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent">
              Đặt xe
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
