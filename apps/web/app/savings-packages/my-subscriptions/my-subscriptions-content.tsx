'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/auth-context';

export function MySubscriptionsContent(): JSX.Element {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

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
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-4xl font-bold">Gói Tiết Kiệm của tôi</h1>
        <div className="rounded-2xl border bg-card p-12 text-center">
          <div className="mb-4 text-6xl">💰</div>
          <p className="mb-2 text-lg font-medium">Chưa đăng ký gói nào</p>
          <p className="mb-8 text-muted-foreground">
            Đăng ký gói Tiết Kiệm để tiết kiệm đến 50% khi sử dụng dịch vụ
          </p>
          <Link
            href="/savings-packages"
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-4 font-semibold text-white shadow-lg hover:shadow-xl"
          >
            Xem các gói Tiết Kiệm
          </Link>
        </div>
      </div>
    </div>
  );
}
