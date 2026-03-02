import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập - Lifestyle Super App',
  description: 'Đăng nhập vào tài khoản Lifestyle Super App để tiếp tục sử dụng dịch vụ.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage(): JSX.Element {
  return <LoginForm />;
}
