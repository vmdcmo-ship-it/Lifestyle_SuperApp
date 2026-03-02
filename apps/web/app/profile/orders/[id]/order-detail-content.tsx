'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { ProfileLayout } from '../../profile-layout';
import { ordersService } from '@/lib/services/orders.service';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Đang chuẩn bị',
  DELIVERING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

interface OrderDetailContentProps {
  orderId: string;
}

export function OrderDetailContent({ orderId }: OrderDetailContentProps): JSX.Element {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isAuthenticated) return;

    ordersService
      .getById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setIsLoading(false));
  }, [orderId, isAuthenticated, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <ProfileLayout title="Chi tiết đơn hàng">
      <div className="rounded-2xl border bg-card p-6">
        <Link
          href="/profile/orders"
          className="mb-6 inline-flex items-center gap-2 text-purple-600 hover:underline"
        >
          ← Quay lại đơn hàng
        </Link>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
          </div>
        ) : !order ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Không tìm thấy đơn hàng</p>
            <Link href="/profile/orders" className="mt-4 inline-block text-purple-600 hover:underline">
              Quay lại danh sách
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-bold">#{order.id?.slice(0, 8) ?? orderId}</h2>
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium ${
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

            {order.createdAt && (
              <p className="text-sm text-muted-foreground">
                Đặt lúc: {new Date(order.createdAt).toLocaleString('vi-VN')}
              </p>
            )}

            {order.totalAmount != null && (
              <p className="text-lg font-semibold">
                Tổng tiền:{' '}
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                  order.totalAmount
                )}
              </p>
            )}

            {order.items?.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">Sản phẩm</h3>
                <ul className="space-y-2">
                  {order.items.map((item: any) => (
                    <li key={item.id ?? item.productId} className="flex justify-between text-sm">
                      <span>
                        {item.name ?? item.productName} x {item.quantity ?? 1}
                      </span>
                      {item.price != null && (
                        <span>
                          {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                          }).format(item.price * (item.quantity ?? 1))}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
