import { Metadata } from 'next';
import { MemberSignupForm } from './member-signup-form';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản | Lifestyle Super App',
  description: 'Đăng ký tài khoản Lifestyle để trải nghiệm đầy đủ dịch vụ: giao đồ ăn, đặt xe, mua sắm và nhiều hơn nữa.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function MemberSignupPage() {
  return <MemberSignupForm />;
}
