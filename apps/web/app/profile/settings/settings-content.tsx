'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';
import { ProfileLayout } from '../profile-layout';

export function SettingsContent(): JSX.Element {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState(true);

  if (!authLoading && !isAuthenticated) {
    router.replace('/login');
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProfileLayout title="Cài đặt">
      <div className="space-y-6">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Bảo mật</h2>
          <Link
            href="/profile/settings/change-password"
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-medium transition-colors hover:bg-accent"
          >
            <span>🔐</span>
            Đổi mật khẩu
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Trang đổi mật khẩu sẽ sớm được cập nhật.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Thông báo</h2>
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <span>Nhận thông báo khuyến mãi và cập nhật</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="h-5 w-5 rounded border-purple-600 text-purple-600 focus:ring-purple-500"
            />
          </label>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Ứng dụng</h2>
          <p className="text-sm text-muted-foreground">
            Tải ứng dụng Lifestyle trên điện thoại để trải nghiệm đầy đủ tính năng.
          </p>
          <div className="mt-4 flex gap-4">
            <Link
              href={process.env.NEXT_PUBLIC_APP_STORE_URL || '#'}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              App Store
            </Link>
            <Link
              href={process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#'}
              className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Google Play
            </Link>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}
