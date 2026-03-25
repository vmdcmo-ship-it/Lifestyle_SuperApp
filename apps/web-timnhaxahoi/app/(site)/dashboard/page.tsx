import type { Metadata } from 'next';
import { DashboardView } from '@/components/dashboard/dashboard-view';

export const metadata: Metadata = {
  title: 'Kết quả & tư vấn',
  description: 'Xem điểm tham khảo, dự án gợi ý và gửi yêu cầu tư vấn sâu sau trắc nghiệm NOXH.',
};

export default function DashboardPage() {
  return <DashboardView />;
}
