'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ordersService } from '@/lib/orders.service';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
}

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PREPARING: 'Đang chuẩn bị',
  READY: 'Sẵn sàng',
  PICKED_UP: 'Đã lấy',
  DELIVERING: 'Đang giao',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export default function OrderDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    ordersService
      .getById(id)
      .then(setOrder)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div>
        <Link href="/orders" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Không tìm thấy đơn hàng'}
        </div>
      </div>
    );
  }

  const o = order as {
    orderNumber: string;
    type: string;
    status: string;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    totalAmount: number;
    currency: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      totalPrice: number;
      note?: string;
    }>;
    delivery?: { address?: string; note?: string };
    merchant?: { name: string; phone?: string; full_address?: string };
    timestamps?: { created?: string; confirmed?: string; delivered?: string; cancelled?: string };
    cancelReason?: string;
  };

  return (
    <div>
      <Link href="/orders" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Đơn hàng {o.orderNumber}</h1>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
            o.status === 'COMPLETED' || o.status === 'DELIVERED'
              ? 'bg-green-100 text-green-800'
              : o.status === 'CANCELLED'
                ? 'bg-gray-100 text-gray-600'
                : 'bg-amber-100 text-amber-800'
          }`}
        >
          {STATUS_LABEL[o.status] ?? o.status}
        </span>
      </div>

      <div className="space-y-6">
        <section className="rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Thông tin đơn hàng</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Loại</dt>
            <dd>{o.type}</dd>
            <dt className="text-muted-foreground">Cửa hàng</dt>
            <dd>{o.merchant?.name ?? '—'}</dd>
            <dt className="text-muted-foreground">Địa chỉ giao</dt>
            <dd>{o.delivery?.address ?? '—'}</dd>
            <dt className="text-muted-foreground">Ghi chú giao hàng</dt>
            <dd>{o.delivery?.note || '—'}</dd>
            {o.timestamps?.created && (
              <>
                <dt className="text-muted-foreground">Ngày tạo</dt>
                <dd>{formatDate(o.timestamps.created)}</dd>
              </>
            )}
          </dl>
        </section>

        <section className="rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Chi tiết sản phẩm</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-2 text-left font-medium">Sản phẩm</th>
                <th className="pb-2 text-right font-medium">SL</th>
                <th className="pb-2 text-right font-medium">Đơn giá</th>
                <th className="pb-2 text-right font-medium">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {o.items?.map(
                (item: { name: string; quantity: number; price: number; totalPrice: number }) => (
                  <tr key={item.name + item.quantity} className="border-b last:border-0">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(item.price)}</td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(item.totalPrice)}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end gap-4 border-t pt-4 text-sm">
            <span className="text-muted-foreground">Tạm tính:</span>
            <span>{formatCurrency(o.subtotal ?? 0)}</span>
          </div>
          {o.deliveryFee != null && o.deliveryFee > 0 && (
            <div className="flex justify-end gap-4 text-sm">
              <span className="text-muted-foreground">Phí giao hàng:</span>
              <span>{formatCurrency(o.deliveryFee)}</span>
            </div>
          )}
          <div className="mt-1 flex justify-end gap-4 font-semibold">
            <span className="text-muted-foreground">Tổng cộng:</span>
            <span>{formatCurrency(o.totalAmount)}</span>
          </div>
        </section>

        {o.cancelReason && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h2 className="mb-2 font-semibold text-amber-800">Lý do hủy</h2>
            <p className="text-sm text-amber-900">{o.cancelReason}</p>
          </section>
        )}
      </div>
    </div>
  );
}
