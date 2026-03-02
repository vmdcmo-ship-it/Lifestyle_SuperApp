import { Metadata } from 'next';
import { MyCoinsContent } from './my-coins-content';

export const metadata: Metadata = {
  title: 'Lifestyle Xu của tôi - Quản lý điểm tích lũy | Lifestyle Super App',
  description:
    'Xem số dư Lifestyle Xu, lịch sử tích điểm và đổi quà của bạn. Quản lý điểm thưởng một cách dễ dàng.',
  robots: {
    index: false, // Không index trang cá nhân
    follow: false,
  },
};

export default function MyCoinsPage() {
  return <MyCoinsContent />;
}
