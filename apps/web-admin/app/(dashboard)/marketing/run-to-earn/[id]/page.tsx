'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { runToEarnService } from '@/lib/run-to-earn.service';
import { couponsService } from '@/lib/coupons.service';
import { toast } from '@/lib/toast';
import type { RunToEarnPrize } from '@/lib/run-to-earn.service';
import type { CouponListItem } from '@/lib/coupons.service';

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

function formatMoney(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

const PRIZE_TYPE_LABELS: Record<string, string> = {
  XU: 'Xu',
  VOUCHER: 'Voucher',
  PHYSICAL_GOODS: 'Hiện vật',
};

export default function RunToEarnCampaignDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;
  const [campaign, setCampaign] = useState<Awaited<
    ReturnType<typeof runToEarnService.getCampaignById>
  > | null>(null);
  const [coupons, setCoupons] = useState<CouponListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPrize, setShowAddPrize] = useState(false);
  const [newPrize, setNewPrize] = useState({
    name: '',
    type: 'XU' as const,
    rankFrom: 1,
    rankTo: 1,
    xuAmount: 100,
    couponId: '',
    quantity: 1,
  });
  const [adding, setAdding] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const load = () => {
    if (!id) return;
    Promise.all([
      runToEarnService.getCampaignById(id),
      couponsService.list({ page: 1, limit: 100, activeOnly: true }),
    ])
      .then(([c, couponsRes]) => {
        setCampaign(c);
        setCoupons(couponsRes.data);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpdateStatus = (status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED') => {
    if (!id) return;
    setUpdatingStatus(true);
    runToEarnService
      .updateCampaign(id, { status })
      .then(() => {
        toast.success('Đã cập nhật trạng thái campaign');
        load();
      })
      .catch((err) => {
        const msg = (err as Error).message;
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setUpdatingStatus(false));
  };

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (newPrize.type === 'VOUCHER' && !newPrize.couponId) {
      setError('Vui lòng chọn coupon khi giải thưởng là Voucher.');
      return;
    }
    if (newPrize.type === 'XU' && (newPrize.xuAmount == null || newPrize.xuAmount < 0)) {
      setError('Vui lòng nhập số Xu.');
      return;
    }
    setAdding(true);
    setError('');
    runToEarnService
      .addPrize(id, {
        name: newPrize.name,
        type: newPrize.type,
        rankFrom: newPrize.rankFrom,
        rankTo: newPrize.rankTo,
        xuAmount: newPrize.type === 'XU' ? newPrize.xuAmount : undefined,
        couponId: newPrize.type === 'VOUCHER' ? newPrize.couponId || undefined : undefined,
        quantity: newPrize.quantity,
      })
      .then(() => {
        toast.success('Đã thêm giải thưởng');
        load();
        setShowAddPrize(false);
        setNewPrize({
          name: '',
          type: 'XU',
          rankFrom: 1,
          rankTo: 1,
          xuAmount: 100,
          couponId: '',
          quantity: 1,
        });
      })
      .catch((err) => {
        const msg = (err as Error).message;
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setAdding(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error && !campaign) {
    return (
      <div>
        <Link
          href="/marketing/run-to-earn"
          className="mb-4 inline-block text-sm text-primary hover:underline"
        >
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div>
      <Link
        href="/marketing/run-to-earn"
        className="mb-4 inline-block text-sm text-primary hover:underline"
      >
        ← Quay lại Run to Earn
      </Link>
      <h1 className="mb-6 text-2xl font-bold">{campaign.name}</h1>

      <div className="space-y-6">
        <section className="rounded-lg border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Thông tin campaign</h2>
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                  campaign.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : campaign.status === 'DRAFT'
                      ? 'bg-gray-100 text-gray-700'
                      : campaign.status === 'PAUSED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                }`}
              >
                {campaign.status === 'DRAFT'
                  ? 'Nháp'
                  : campaign.status === 'ACTIVE'
                    ? 'Đang chạy'
                    : campaign.status === 'PAUSED'
                      ? 'Tạm dừng'
                      : 'Kết thúc'}
              </span>
              {campaign.status !== 'ENDED' && (
                <select
                  value={campaign.status}
                  onChange={(e) =>
                    handleUpdateStatus(e.target.value as 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'ENDED')
                  }
                  disabled={updatingStatus}
                  className="rounded border px-2 py-1 text-xs"
                >
                  <option value="DRAFT">Chuyển Nháp</option>
                  <option value="ACTIVE">Bật chạy</option>
                  <option value="PAUSED">Tạm dừng</option>
                  <option value="ENDED">Kết thúc</option>
                </select>
              )}
            </div>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Thời gian</dt>
            <dd>
              {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}
            </dd>
            <dt className="text-muted-foreground">Quy đổi</dt>
            <dd>{campaign.stepsPerXu} bước = 1 Xu</dd>
            <dt className="text-muted-foreground">Ngân sách</dt>
            <dd>{formatMoney(campaign.budget)} đ</dd>
            <dt className="text-muted-foreground">Đã chi</dt>
            <dd>{formatMoney(campaign.budgetUsed)} đ</dd>
          </dl>
        </section>

        <section className="rounded-lg border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Giải thưởng</h2>
            <button
              type="button"
              onClick={() => setShowAddPrize(!showAddPrize)}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
            >
              {showAddPrize ? 'Đóng' : 'Thêm giải'}
            </button>
          </div>

          {showAddPrize && (
            <form onSubmit={handleAddPrize} className="mb-4 rounded border p-4">
              <h4 className="mb-3 font-medium">Thêm giải thưởng</h4>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="mb-1 block text-xs">Tên giải</label>
                  <input
                    type="text"
                    value={newPrize.name}
                    onChange={(e) => setNewPrize((p) => ({ ...p, name: e.target.value }))}
                    className="w-full rounded border px-2 py-1 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs">Loại</label>
                  <select
                    value={newPrize.type}
                    onChange={(e) =>
                      setNewPrize((p) => ({
                        ...p,
                        type: e.target.value as 'XU' | 'VOUCHER' | 'PHYSICAL_GOODS',
                      }))
                    }
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="XU">Xu</option>
                    <option value="VOUCHER">Voucher</option>
                    <option value="PHYSICAL_GOODS">Hiện vật</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs">Hạng từ</label>
                  <input
                    type="number"
                    value={newPrize.rankFrom}
                    onChange={(e) => setNewPrize((p) => ({ ...p, rankFrom: +e.target.value }))}
                    min={1}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs">Hạng đến</label>
                  <input
                    type="number"
                    value={newPrize.rankTo}
                    onChange={(e) => setNewPrize((p) => ({ ...p, rankTo: +e.target.value }))}
                    min={1}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
                {newPrize.type === 'XU' && (
                  <div>
                    <label className="mb-1 block text-xs">Số Xu</label>
                    <input
                      type="number"
                      value={newPrize.xuAmount}
                      onChange={(e) => setNewPrize((p) => ({ ...p, xuAmount: +e.target.value }))}
                      min={1}
                      className="w-full rounded border px-2 py-1 text-sm"
                    />
                  </div>
                )}
                {newPrize.type === 'VOUCHER' && (
                  <div>
                    <label className="mb-1 block text-xs">Chọn coupon</label>
                    <select
                      value={newPrize.couponId}
                      onChange={(e) => setNewPrize((p) => ({ ...p, couponId: e.target.value }))}
                      className="w-full rounded border px-2 py-1 text-sm"
                    >
                      <option value="">— Chọn coupon —</option>
                      {coupons.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} - {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-xs">Số lượng</label>
                  <input
                    type="number"
                    value={newPrize.quantity}
                    onChange={(e) => setNewPrize((p) => ({ ...p, quantity: +e.target.value }))}
                    min={1}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  type="submit"
                  disabled={adding}
                  className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground"
                >
                  {adding ? 'Đang thêm...' : 'Thêm'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddPrize(false)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  Hủy
                </button>
              </div>
            </form>
          )}

          {campaign.prizes?.length === 0 ? (
            <p className="text-sm text-muted-foreground">Chưa có giải. Thêm giải để bắt đầu.</p>
          ) : (
            <div className="space-y-2">
              {(campaign.prizes ?? []).map((p: RunToEarnPrize) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-2 text-muted-foreground">
                      ({PRIZE_TYPE_LABELS[p.type] ?? p.type}) Hạng {p.rankFrom}-{p.rankTo}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    {p.type === 'XU' && p.xuAmount != null && <span>{p.xuAmount} Xu</span>}
                    <span>
                      Đã trao: {p.quantityGiven}/{p.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
