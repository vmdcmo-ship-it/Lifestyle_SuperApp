import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/dashboard',
  title: 'Kết quả và tư vấn',
  description:
    'Xem lại điểm gợi ý, danh sách dự án phù hợp và gửi thêm yêu cầu tư vấn sau khi làm trắc nghiệm NOXH.',
  robots: { index: false, follow: false },
});

export default function DashboardPage() {
  return <DashboardView />;
}
