import type { Metadata } from 'next';
import Link from 'next/link';
import { MySubscriptionsContent } from './my-subscriptions-content';

export const metadata: Metadata = {
  title: 'Gói của tôi - Lifestyle Super App',
  description: 'Quản lý gói Tiết Kiệm đã đăng ký.',
  robots: { index: false, follow: false },
};

export default function MySubscriptionsPage(): JSX.Element {
  return <MySubscriptionsContent />;
}
