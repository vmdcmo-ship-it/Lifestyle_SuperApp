import type { Metadata } from 'next';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Đăng nhập | Web Admin',
  description: 'Đăng nhập vào trang quản trị',
  robots: { index: false, follow: false },
};

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <LoginForm />
    </div>
  );
}
