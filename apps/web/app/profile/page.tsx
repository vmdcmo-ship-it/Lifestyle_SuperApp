import type { Metadata } from 'next';
import { ProfileContent } from './profile-content';

export const metadata: Metadata = {
  title: 'Tài khoản của tôi - Lifestyle Super App',
  description: 'Quản lý thông tin tài khoản, đơn hàng và cài đặt của bạn.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage(): JSX.Element {
  return <ProfileContent />;
}
