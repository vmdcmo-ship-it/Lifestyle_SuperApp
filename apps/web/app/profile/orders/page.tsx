import type { Metadata } from 'next';
import { OrdersContent } from './orders-content';

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi - Lifestyle Super App',
  description: 'Xem lịch sử và theo dõi đơn hàng của bạn.',
  robots: { index: false, follow: false },
};

export default function OrdersPage(): JSX.Element {
  return <OrdersContent />;
}
