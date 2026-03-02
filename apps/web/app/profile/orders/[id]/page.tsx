import type { Metadata } from 'next';
import { OrderDetailContent } from './order-detail-content';

export const metadata: Metadata = {
  title: 'Chi tiết đơn hàng - Lifestyle Super App',
  description: 'Xem chi tiết đơn hàng của bạn.',
  robots: { index: false, follow: false },
};

interface OrderDetailPageProps {
  params: { id: string };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps): JSX.Element {
  return <OrderDetailContent orderId={params.id} />;
}
