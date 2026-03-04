import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Run to Earn - Chạy bộ kiếm thưởng',
  description: 'Chạy bộ, rèn luyện sức khỏe và nhận thưởng từ cộng đồng Lifestyle',
  alternates: { canonical: '/the-thao/run-to-earn' },
};

export default function RunToEarnPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/the-thao" className="hover:text-foreground">Cộng đồng</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Run to Earn</span>
      </nav>

      <div className="rounded-2xl border bg-card p-8">
        <span className="mb-4 block text-6xl" role="img" aria-hidden>
          🏃
        </span>
        <h1 className="font-heading mb-4 text-2xl font-bold">Run to Earn</h1>
        <p className="mb-6 text-muted-foreground">
          Chạy bộ mỗi ngày, theo dõi quãng đường và nhận thưởng từ cộng đồng. Vừa rèn luyện sức khỏe vừa tích điểm Lifestyle Xu.
        </p>
        <div className="rounded-xl bg-muted/50 p-6">
          <p className="mb-4 text-sm text-muted-foreground">
            Tính năng Run to Earn có trên app Lifestyle. Tải app để bắt đầu.
          </p>
          <Link
            href="/tai-ung-dung"
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tải app Lifestyle
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/the-thao" className="text-sm font-medium text-primary hover:underline">
          ← Về Cộng đồng
        </Link>
        <Link href="/hop-tac" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Hợp tác tài xế
        </Link>
        <Link href="/tai-ung-dung" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Tải ứng dụng
        </Link>
        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
