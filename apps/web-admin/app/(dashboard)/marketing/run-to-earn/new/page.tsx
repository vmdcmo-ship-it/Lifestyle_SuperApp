'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { runToEarnService } from '@/lib/run-to-earn.service';
import { toast } from '@/lib/toast';

export default function NewRunToEarnCampaignPage(): JSX.Element {
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
    stepsPerXu: 1000,
    budget: 5000000,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    runToEarnService
      .createCampaign({
        name: form.name,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.endDate,
        stepsPerXu: form.stepsPerXu,
        budget: form.budget,
      })
      .then((campaign) => {
        toast.success('Đã tạo campaign Run to Earn');
        router.push(`/marketing/run-to-earn/${campaign.id}`);
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
      <Link
        href="/marketing/run-to-earn"
        className="mb-4 inline-block text-sm text-primary hover:underline"
      >
        ← Quay lại Run to Earn
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Tạo campaign Run to Earn</h1>

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
        <div className="rounded border p-3">
          <h3 className="mb-2 font-medium">Quy tắc quy đổi</h3>
          <div className="flex items-center gap-2 text-sm">
            <label>Mỗi</label>
            <input
              type="number"
              value={form.stepsPerXu}
              onChange={(e) => setForm((f) => ({ ...f, stepsPerXu: Math.max(1, +e.target.value) }))}
              min={1}
              className="w-24 rounded border px-2 py-1"
            />
            <span>bước chân = 1 Xu</span>
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
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? 'Đang tạo...' : 'Tạo campaign'}
          </button>
          <Link
            href="/marketing/run-to-earn"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
