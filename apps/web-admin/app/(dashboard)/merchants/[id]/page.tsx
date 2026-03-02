'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { merchantsService } from '@/lib/merchants.service';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { toast } from 'sonner';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
}

export default function MerchantDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;

  const [merchant, setMerchant] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [confirmState, setConfirmState] = useState<'approve' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchMerchant = useCallback(() => {
    if (!id) return;
    merchantsService
      .getById(id)
      .then(setMerchant)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchMerchant();
  }, [id, fetchMerchant]);

  const handleVerify = useCallback(
    async (action: 'APPROVED' | 'REJECTED') => {
      if (!id) return;
      setVerifyLoading(true);
      try {
        await merchantsService.verify(
          id,
          action,
          action === 'REJECTED' ? rejectReason.trim() || 'Không đạt yêu cầu xét duyệt' : undefined,
        );
        toast.success(action === 'APPROVED' ? 'Đã duyệt cửa hàng' : 'Đã từ chối cửa hàng');
        setConfirmState(null);
        setLoading(true);
        fetchMerchant();
      } catch (err) {
        toast.error((err as Error).message);
      } finally {
        setVerifyLoading(false);
      }
    },
    [id, fetchMerchant, rejectReason],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error || !merchant) {
    return (
      <div>
        <Link href="/merchants" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Không tìm thấy cửa hàng'}
        </div>
      </div>
    );
  }

  const m = merchant as {
    name: string;
    merchantNumber: string;
    type: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: { fullAddress?: string; city?: string; district?: string };
    rating?: { overall: number; totalReviews: number };
    stats?: { totalOrders: number; totalRevenue: number };
    status: string;
    createdAt: string;
  };

  return (
    <div>
      <Link href="/merchants" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{m.name}</h1>
        {m.status === 'PENDING' && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmState('approve')}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              Duyệt
            </button>
            <button
              type="button"
              onClick={() => setConfirmState('reject')}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
            >
              Từ chối
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <section className="rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Thông tin cơ bản</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Mã cửa hàng</dt>
            <dd className="font-mono">{m.merchantNumber}</dd>
            <dt className="text-muted-foreground">Loại</dt>
            <dd>{m.type}</dd>
            <dt className="text-muted-foreground">Trạng thái</dt>
            <dd>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                  m.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : m.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : m.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-muted text-muted-foreground'
                }`}
              >
                {m.status}
              </span>
            </dd>
            <dt className="text-muted-foreground">Điện thoại</dt>
            <dd>{m.phone || '—'}</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{m.email || '—'}</dd>
            <dt className="text-muted-foreground">Địa chỉ</dt>
            <dd>{m.address?.fullAddress || '—'}</dd>
            <dt className="text-muted-foreground">Ngày tạo</dt>
            <dd>{formatDate(m.createdAt)}</dd>
          </dl>
        </section>

        <section className="rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Thống kê</h2>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Tổng đơn hàng</dt>
            <dd>{m.stats?.totalOrders ?? '—'}</dd>
            <dt className="text-muted-foreground">Doanh thu</dt>
            <dd>{m.stats?.totalRevenue != null ? formatCurrency(m.stats.totalRevenue) : '—'}</dd>
            <dt className="text-muted-foreground">Đánh giá</dt>
            <dd>
              {m.rating?.overall ?? '—'} ({m.rating?.totalReviews ?? 0} đánh giá)
            </dd>
          </dl>
        </section>
      </div>

      <ConfirmDialog
        open={confirmState === 'approve'}
        title="Duyệt cửa hàng"
        message="Bạn có chắc muốn duyệt cửa hàng này?"
        confirmLabel="Duyệt"
        variant="primary"
        loading={verifyLoading}
        onConfirm={() => handleVerify('APPROVED')}
        onCancel={() => setConfirmState(null)}
      />
      <ConfirmDialog
        open={confirmState === 'reject'}
        title="Từ chối cửa hàng"
        message="Bạn có chắc muốn từ chối cửa hàng này? Có thể nhập lý do bên dưới."
        confirmLabel="Từ chối"
        variant="danger"
        loading={verifyLoading}
        onConfirm={() => handleVerify('REJECTED')}
        onCancel={() => {
          setConfirmState(null);
          setRejectReason('');
        }}
        extraContent={
          <textarea
            placeholder="Lý do từ chối (tùy chọn)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="mt-3 w-full rounded border border-input bg-background px-3 py-2 text-sm"
            rows={3}
          />
        }
      />
    </div>
  );
}
