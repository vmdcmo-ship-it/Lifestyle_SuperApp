import type { Metadata } from 'next';
import Link from 'next/link';
import { ForgotPasswordForm } from './forgot-password-form';

export const metadata: Metadata = {
  title: 'Quên mật khẩu - Lifestyle Super App',
  description: 'Đặt lại mật khẩu tài khoản Lifestyle Super App.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                <span className="text-2xl font-bold text-white">L</span>
              </div>
              <span className="text-2xl font-bold">Lifestyle</span>
            </Link>
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold">Quên mật khẩu</h1>
          <p className="mb-8 text-center text-muted-foreground">
            Nhập email đăng ký để nhận link đặt lại mật khẩu
          </p>

          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="font-semibold text-purple-600 hover:underline">
            ← Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
