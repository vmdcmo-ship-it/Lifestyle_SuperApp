import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Affiliate - Đối tác liên kết',
  description: 'Chương trình affiliate và theo dõi liên kết Shopee, Booking',
  robots: { index: false, follow: true },
};

export default function AffiliatePage(): JSX.Element {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="font-heading mb-4 text-2xl font-bold">Affiliate & Liên kết</h1>
      <p className="mb-8 text-muted-foreground">
        Trang trung gian cho chương trình affiliate. Liên kết có thể chứa tham số UTM để theo dõi.
      </p>
      <div className="space-y-4 rounded-xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">
          Sử dụng trang này cho tracking: Shopee, Booking, Cross Selling. Thêm query params ?ref=, ?utm_source= khi cần.
        </p>
        <Link href="/" className="inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
