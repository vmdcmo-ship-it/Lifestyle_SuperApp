'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { luckyWheelService } from '@/lib/lucky-wheel.service';
import { toast } from '@/lib/toast';

export default function NewLuckyWheelCampaignPage(): JSX.Element {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const defaultStart = new Date();
  defaultStart.setHours(0, 0, 0, 0);
  const defaultEnd = new Date(defaultStart);
  defaultEnd.setDate(defaultEnd.getDate() + 30);
  const toDatetimeLocal = (d: Date) => d.toISOString().slice(0, 16);

  const [form, setForm] = useState({
    name: '',
    description: '',
    startDate: toDatetimeLocal(defaultStart),
    endDate: toDatetimeLocal(defaultEnd),
    budget: 100000000,
    driverRevenuePerSpin: 100000,
    userTopUpPerSpin: 500000,
    userOrderPerSpin: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    luckyWheelService
      .createCampaign({
        name: form.name,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        budget: form.budget,
        driverRevenuePerSpin: form.driverRevenuePerSpin,
        userTopUpPerSpin: form.userTopUpPerSpin,
        userOrderPerSpin: form.userOrderPerSpin,
      })
      .then((campaign) => {
        toast.success('Đã tạo campaign Lucky Wheel');
        router.push(`/lucky-wheel/${campaign.id}`);
      })
      .catch((err) => {
        const msg = (err as Error).message;
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <Link href="/lucky-wheel" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại Lucky Wheel
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Tạo campaign Lucky Wheel</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-lg border bg-background p-6"
      >
        <div>
          <label className="mb-1 block text-sm font-medium">Tên campaign *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded border px-3 py-2"
            rows={2}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày bắt đầu *</label>
            <input
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày kết thúc *</label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              className="w-full rounded border px-3 py-2"
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Ngân sách (VND)</label>
          <input
            type="number"
            value={form.budget}
            onChange={(e) => setForm((f) => ({ ...f, budget: +e.target.value }))}
            min={0}
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="rounded border p-3">
          <h3 className="mb-2 font-medium">Quy tắc tham gia</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <label>Tài xế: mỗi</label>
              <input
                type="number"
                value={form.driverRevenuePerSpin}
                onChange={(e) => setForm((f) => ({ ...f, driverRevenuePerSpin: +e.target.value }))}
                min={10000}
                step={10000}
                className="w-28 rounded border px-2 py-1"
              />
              <span>đ doanh thu = 1 lượt quay</span>
            </div>
            <div className="flex items-center gap-2">
              <label>User nạp ví: mỗi</label>
              <input
                type="number"
                value={form.userTopUpPerSpin}
                onChange={(e) => setForm((f) => ({ ...f, userTopUpPerSpin: +e.target.value }))}
                min={10000}
                step={100000}
                className="w-28 rounded border px-2 py-1"
              />
              <span>đ = 1 lượt quay</span>
            </div>
            <div className="flex items-center gap-2">
              <label>User giao dịch: mỗi</label>
              <input
                type="number"
                value={form.userOrderPerSpin}
                onChange={(e) => setForm((f) => ({ ...f, userOrderPerSpin: +e.target.value }))}
                min={1}
                className="w-16 rounded border px-2 py-1"
              />
              <span>giao dịch = 1 lượt quay</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : 'Tạo campaign'}
          </button>
          <Link href="/lucky-wheel" className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
