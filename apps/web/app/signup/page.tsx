import type { Metadata } from 'next';
import Link from 'next/link';
import { KodoLogo } from '@/components/kodo-logo';

export const metadata: Metadata = {
  title: 'Đăng ký tài khoản - Lifestyle Super App',
  description:
    'Tạo tài khoản Lifestyle Super App để trải nghiệm giao đồ ăn, đặt xe, mua sắm và nhận ưu đãi độc quyền.',
  robots: {
    index: false, // Don't index auth pages
    follow: false,
  },
};

export default function SignUpPage(): JSX.Element {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          {/* Logo KODO */}
          <div className="mb-8 flex justify-center">
            <KodoLogo size="lg" withWordmark className="[&_span]:!text-slate-900" />
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold">Đăng ký</h1>
          <p className="mb-8 text-center text-muted-foreground">
            Tạo tài khoản để bắt đầu trải nghiệm
          </p>

          {/* Sign Up Form */}
          <form className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium"
              >
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full rounded-lg border bg-background px-4 py-3 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                placeholder="Nguyễn Văn A"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-lg border bg-background px-4 py-3 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                placeholder="email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-medium"
              >
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full rounded-lg border bg-background px-4 py-3 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                placeholder="0123456789"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full rounded-lg border bg-background px-4 py-3 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                placeholder="••••••••"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                Tôi đồng ý với{' '}
                <Link href="/terms" className="text-purple-600 hover:underline">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-purple-600 hover:underline">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95"
            >
              Đăng ký
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">Hoặc</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border bg-background px-4 py-3 font-medium transition-colors hover:bg-accent"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng ký với Google
            </button>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-lg border bg-background px-4 py-3 font-medium transition-colors hover:bg-accent"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng ký với Facebook
            </button>
          </div>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link
              href="/login"
              className="font-semibold text-purple-600 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-3 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            Tích Lifestyle Xu mỗi khi sử dụng dịch vụ
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            Nhận voucher giảm giá và ưu đãi độc quyền
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="text-green-500">✓</span>
            Trải nghiệm đa dịch vụ trong một ứng dụng
          </p>
        </div>
      </div>
    </div>
  );
}
