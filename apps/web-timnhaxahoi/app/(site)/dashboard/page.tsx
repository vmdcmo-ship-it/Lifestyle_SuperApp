import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/dashboard',
  title: 'Kết quả và tư vấn',
  description:
    'Xem điểm tham khảo, dự án gợi ý và gửi yêu cầu tư vấn sâu sau trắc nghiệm NOXH — trang cá nhân sau quiz.',
  robots: { index: false, follow: false },
});

export default function DashboardPage() {
  return <DashboardView />;
}
