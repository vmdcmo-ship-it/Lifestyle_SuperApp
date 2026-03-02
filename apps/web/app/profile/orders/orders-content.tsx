'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { ProfileLayout } from '../profile-layout';
import { ordersService } from '@/lib/services/orders.service';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Đang chuẩn bị',
  DELIVERING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export function OrdersContent(): JSX.Element {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isAuthenticated) return;

    ordersService
      .getMyOrders({ page: 1, limit: 20 })
      .then((res) => setOrders(res?.data ?? []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProfileLayout title="Đơn hàng của tôi">
      <div className="rounded-2xl border bg-card p-6">
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mb-4 text-6xl">📦</div>
            <p className="mb-2 text-lg font-medium">Chưa có đơn hàng nào</p>
            <p className="mb-6 text-muted-foreground">Đặt món hoặc mua sắm để bắt đầu!</p>
            <Link
              href="/food-delivery"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white hover:shadow-lg"
            >
              Đặt đồ ăn ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/profile/orders/${order.id}`}
                className="block rounded-xl border p-4 transition-colors hover:bg-accent"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold">#{order.id?.slice(0, 8) ?? order.id}</span>
                    <span className="ml-3 text-sm text-muted-foreground">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('vi-VN')
                        : ''}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      order.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : order.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300'
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {order.totalAmount
                    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                        order.totalAmount
                      )
                    : ''}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
