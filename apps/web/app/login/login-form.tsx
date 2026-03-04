'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KodoLogo } from '@/components/kodo-logo';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Vui lòng nhập email hoặc số điện thoại';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      const { authService } = await import('../../lib/services/auth.service');
      await authService.login(formData.emailOrPhone, formData.password);
      router.push('/');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Đăng nhập thất bại' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.vmd.asia';
    window.location.href = `${apiUrl}/api/v1/auth/${provider}`;
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border bg-card p-8 shadow-lg">
          {/* Logo KODO */}
          <div className="mb-8 text-center">
            <KodoLogo size="lg" withWordmark className="justify-center [&_span]:!text-slate-900" />
          </div>

          <h1 className="mb-2 text-center text-3xl font-bold">Đăng nhập</h1>
          <p className="mb-8 text-center text-muted-foreground">
            Chào mừng bạn quay trở lại!
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone */}
            <div>
              <label htmlFor="emailOrPhone" className="mb-2 block text-sm font-medium">
                Email hoặc số điện thoại
              </label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.emailOrPhone ? 'border-red-500' : 'border-gray-300'
                } bg-background px-4 py-3 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-gray-600`}
                placeholder="email@example.com hoặc 0123456789"
              />
              {errors.emailOrPhone && (
                <p className="mt-1 text-xs text-red-500">{errors.emailOrPhone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } bg-background px-4 py-3 transition-colors focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20 dark:border-gray-600`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-600/20"
              />
              <label htmlFor="rememberMe" className="text-sm text-muted-foreground">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
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
              onClick={() => handleSocialLogin('google')}
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
              Đăng nhập với Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              className="flex w-full items-center justify-center gap-3 rounded-lg border bg-background px-4 py-3 font-medium transition-colors hover:bg-accent"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng nhập với Facebook
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{' '}
            <Link
              href="/signup"
              className="font-semibold text-purple-600 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
          <Link href="/help" className="hover:text-foreground">
            Trợ giúp
          </Link>
          <Link href="/terms" className="hover:text-foreground">
            Điều khoản
          </Link>
          <Link href="/privacy" className="hover:text-foreground">
            Bảo mật
          </Link>
        </div>
      </div>
    </div>
  );
}
