'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { KodoLogo } from '@/components/kodo-logo';

export function MemberSignupForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreedToTerms: false,
    agreedToPrivacy: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'Vui lòng nhập họ';
    if (!formData.lastName) newErrors.lastName = 'Vui lòng nhập tên';
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[3-9][0-9]{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ thường';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 số';
    } else if (!/[@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt (@$!%*?&)';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'Bạn phải đồng ý với Điều khoản sử dụng';
    }
    
    if (!formData.agreedToPrivacy) {
      newErrors.agreedToPrivacy = 'Bạn phải đồng ý với Chính sách bảo mật';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Call API
      const response = await fetch('/api/auth/register/member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/signup/verify-otp?phone=' + formData.phoneNumber);
      } else {
        const data = await response.json();
        setErrors({ submit: data.message || 'Đăng ký thất bại' });
      }
    } catch (error) {
      setErrors({ submit: 'Có lỗi xảy ra, vui lòng thử lại' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // TODO: Implement OAuth flow
    console.log('Social login with:', provider);
    window.location.href = `/api/auth/social/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4 dark:from-gray-900 dark:via-gray-850 dark:to-gray-950">
      <div className="mx-auto max-w-md">
        {/* Logo & Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <KodoLogo size="lg" withWordmark className="[&_span]:!text-gray-900 dark:[&_span]:!text-gray-100" />
          </div>
          <h1 className="mb-2 text-3xl font-bold">Đăng ký tài khoản</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Tạo tài khoản để bắt đầu trải nghiệm
          </p>
        </div>

        {/* Signup Form Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
          {/* Social Login Buttons */}
          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
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
              onClick={() => handleSocialLogin('facebook')}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-blue-600 bg-blue-600 px-4 py-3 font-semibold text-white transition-all hover:bg-blue-700"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng ký với Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                Hoặc đăng ký với email
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  } bg-white px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
                  placeholder="Nguyễn"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full rounded-lg border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  } bg-white px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
                  placeholder="Văn A"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                } bg-white px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
                placeholder="0912345678"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } bg-white px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } bg-white px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Tối thiểu 8 ký tự, chứa chữ hoa, chữ thường và số
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full rounded-lg border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } bg-white px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700`}
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Referral Code (Optional) */}
            <div>
              <label className="mb-1 block text-sm font-medium">
                Mã giới thiệu (Tùy chọn)
              </label>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-purple-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700"
                placeholder="LIFESTYLE"
                maxLength={8}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  checked={formData.agreedToTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">
                  Tôi đồng ý với{' '}
                  <Link href="/terms" className="text-purple-600 hover:underline">
                    Điều khoản sử dụng
                  </Link>
                </span>
              </label>
              {errors.agreedToTerms && (
                <p className="text-xs text-red-500">{errors.agreedToTerms}</p>
              )}

              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="agreedToPrivacy"
                  checked={formData.agreedToPrivacy}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm">
                  Tôi đồng ý với{' '}
                  <Link href="/privacy" className="text-purple-600 hover:underline">
                    Chính sách bảo mật
                  </Link>
                </span>
              </label>
              {errors.agreedToPrivacy && (
                <p className="text-xs text-red-500">{errors.agreedToPrivacy}</p>
              )}
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
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">Đã có tài khoản? </span>
            <Link href="/login" className="font-semibold text-purple-600 hover:underline">
              Đăng nhập
            </Link>
          </div>

          {/* Driver Signup Link */}
          <div className="mt-4 text-center">
            <Link
              href="/signup/driver"
              className="text-sm text-gray-600 hover:text-purple-600 dark:text-gray-400"
            >
              Đăng ký làm tài xế đối tác →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
