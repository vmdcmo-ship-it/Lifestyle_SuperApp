'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { luckyWheelService } from '@/lib/lucky-wheel.service';
import { couponsService } from '@/lib/coupons.service';
import { toast } from '@/lib/toast';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { LuckyWheelCampaign, LuckyWheelPrize } from '@/lib/lucky-wheel.service';
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
  VOUCHER: 'Voucher',
  WALLET_CREDIT: 'Tiền ví',
  PHYSICAL_GOODS: 'Hiện vật',
  NO_PRIZE: 'Chúc may mắn',
};

export default function LuckyWheelCampaignDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;
  const [campaign, setCampaign] = useState<
    (LuckyWheelCampaign & { prizes: LuckyWheelPrize[] }) | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPrize, setShowAddPrize] = useState(false);
  const [coupons, setCoupons] = useState<CouponListItem[]>([]);
  const [campaignStats, setCampaignStats] = useState<{
    spinCount: number;
    creditGrantsCount: number;
    prizeStats: Array<{
      id: string;
      name: string;
      type: string;
      quantity: number | null;
      quantityGiven: number;
      weight: number;
    }>;
  } | null>(null);
  const [newPrize, setNewPrize] = useState({
    name: '',
    type: 'VOUCHER' as const,
    weight: 10,
    quantity: 100,
    amountVnd: 10000,
    couponId: '',
    valueJson: {} as Record<string, unknown>,
  });
  const [adding, setAdding] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletePrizeConfirm, setDeletePrizeConfirm] = useState<{
    prizeId: string;
    prizeName: string;
  } | null>(null);

  const load = () => {
    if (!id) return;
    Promise.all([
      luckyWheelService.getCampaignById(id),
      luckyWheelService.getCampaignStats(id),
      couponsService.list({ page: 1, limit: 100, activeOnly: true }),
    ])
      .then(([c, stats, couponsRes]) => {
        setCampaign(c);
        setCampaignStats(stats);
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
    luckyWheelService
      .updateCampaign(id, { status })
      .then(() => load())
      .catch((err) => setError((err as Error).message))
      .finally(() => setUpdatingStatus(false));
  };

  const handleDeletePrize = async () => {
    if (!id || !deletePrizeConfirm) return;
    await luckyWheelService.deletePrize(id, deletePrizeConfirm.prizeId);
    toast.success('Đã xóa giải thưởng');
    setDeletePrizeConfirm(null);
    load();
  };

  const handleAddPrize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    if (newPrize.type === 'VOUCHER' && !newPrize.couponId) {
      setError('Vui lòng chọn coupon khi giải thưởng là Voucher.');
      return;
    }
    setAdding(true);
    setError('');
    const valueJson: Record<string, unknown> = {};
    if (newPrize.type === 'WALLET_CREDIT') valueJson.amountVnd = newPrize.amountVnd;
    if (newPrize.type === 'VOUCHER' && newPrize.couponId) valueJson.couponId = newPrize.couponId;

    luckyWheelService
      .addPrize(id, {
        name: newPrize.name,
        type: newPrize.type,
        weight: newPrize.weight,
        quantity: newPrize.quantity || undefined,
        valueJson: Object.keys(valueJson).length ? valueJson : undefined,
      })
      .then(() => {
        toast.success('Đã thêm giải thưởng');
        load();
        setShowAddPrize(false);
        setNewPrize({
          name: '',
          type: 'VOUCHER',
          weight: 10,
          quantity: 100,
          amountVnd: 10000,
          couponId: '',
          valueJson: {},
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

  if (error || !campaign) {
    return (
      <div>
        <Link
          href="/lucky-wheel"
          className="mb-4 inline-block text-sm text-primary hover:underline"
        >
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Không tìm thấy campaign'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/lucky-wheel" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại Lucky Wheel
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
            <dt className="text-muted-foreground">Ngân sách</dt>
            <dd>{formatMoney(campaign.budget)} đ</dd>
            <dt className="text-muted-foreground">Tài xế</dt>
            <dd>Mỗi {formatMoney(campaign.driverRevenuePerSpin)}đ doanh thu = 1 lượt quay</dd>
            <dt className="text-muted-foreground">User nạp ví</dt>
            <dd>Mỗi {formatMoney(campaign.userTopUpPerSpin)}đ = 1 lượt quay</dd>
            <dt className="text-muted-foreground">User giao dịch</dt>
            <dd>Mỗi {campaign.userOrderPerSpin} giao dịch = 1 lượt quay</dd>
            {campaignStats && (
              <>
                <dt className="text-muted-foreground mt-3 pt-2 border-t">Lượt đã tích</dt>
                <dd>{campaignStats.creditGrantsCount.toLocaleString()}</dd>
                <dt className="text-muted-foreground">Lượt đã quay</dt>
                <dd>{campaignStats.spinCount.toLocaleString()}</dd>
                <dt className="text-muted-foreground">Ngân sách đã dùng</dt>
                <dd>{formatMoney(campaign.budgetUsed)} đ</dd>
              </>
            )}
          </dl>
        </section>

        {campaignStats && campaignStats.prizeStats.length > 0 && (
          <section className="rounded-lg border bg-background p-4">
            <h2 className="mb-3 font-semibold">Thống kê giải thưởng đã trao</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Giải</th>
                    <th className="px-4 py-2 text-left font-medium">Loại</th>
                    <th className="px-4 py-2 text-right font-medium">Đã trao</th>
                    <th className="px-4 py-2 text-right font-medium">Tổng</th>
                    <th className="px-4 py-2 text-right font-medium">Trọng số</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignStats.prizeStats.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-4 py-2 font-medium">{p.name}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {PRIZE_TYPE_LABELS[p.type] ?? p.type}
                      </td>
                      <td className="px-4 py-2 text-right">{p.quantityGiven}</td>
                      <td className="px-4 py-2 text-right">
                        {p.quantity != null ? p.quantity : '∞'}
                      </td>
                      <td className="px-4 py-2 text-right">{p.weight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

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
                        type: e.target.value as
                          | 'VOUCHER'
                          | 'WALLET_CREDIT'
                          | 'PHYSICAL_GOODS'
                          | 'NO_PRIZE',
                      }))
                    }
                    className="w-full rounded border px-2 py-1 text-sm"
                  >
                    <option value="VOUCHER">Voucher</option>
                    <option value="WALLET_CREDIT">Tiền ví</option>
                    <option value="PHYSICAL_GOODS">Hiện vật</option>
                    <option value="NO_PRIZE">Chúc may mắn</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs">Trọng số (xác suất)</label>
                  <input
                    type="number"
                    value={newPrize.weight}
                    onChange={(e) => setNewPrize((p) => ({ ...p, weight: +e.target.value }))}
                    min={1}
                    className="w-full rounded border px-2 py-1 text-sm"
                  />
                </div>
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
                {newPrize.type === 'WALLET_CREDIT' && (
                  <div>
                    <label className="mb-1 block text-xs">Số tiền (VNĐ)</label>
                    <input
                      type="number"
                      value={newPrize.amountVnd}
                      onChange={(e) => setNewPrize((p) => ({ ...p, amountVnd: +e.target.value }))}
                      min={1000}
                      step={1000}
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
                          {c.code} - {c.title} (
                          {c.discountType === 'PERCENTAGE'
                            ? `${c.discountValue}%`
                            : `${c.discountValue.toLocaleString()}đ`}
                          )
                        </option>
                      ))}
                    </select>
                  </div>
                )}
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
              {campaign.prizes?.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded border px-3 py-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{p.name}</span>
                    <span className="ml-2 text-muted-foreground">
                      ({PRIZE_TYPE_LABELS[p.type] ?? p.type})
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span>Trọng số: {p.weight}</span>
                    <span>
                      Đã trao: {p.quantityGiven}
                      {p.quantity != null ? `/${p.quantity}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex gap-2">
          <Link
            href={`/lucky-wheel/spins?campaignId=${id}`}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Xem lịch sử quay
          </Link>
        </div>
      </div>
    </div>
  );
}
