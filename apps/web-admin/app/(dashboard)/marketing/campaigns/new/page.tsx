'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCampaignSchema } from '@lifestyle/validation';
import { marketingService } from '@/lib/marketing.service';
import { toast } from '@/lib/toast';

export default function NewCampaignPage(): JSX.Element {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const raw = {
      name,
      description: description || undefined,
      startDate,
      endDate,
      budget: budget ? parseInt(budget, 10) : undefined,
    };
    const parsed = createCampaignSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      setFieldErrors(
        Object.fromEntries(
          Object.entries(issues).map(([k, v]) => [k, Array.isArray(v) ? (v[0] ?? '') : String(v)]),
        ),
      );
      setError(parsed.error.errors[0]?.message ?? 'Vui lòng kiểm tra lại thông tin');
      return;
    }
    setSubmitting(true);
    try {
      await marketingService.createCampaign({
        name: parsed.data.name,
        description: parsed.data.description,
        startDate: parsed.data.startDate,
        endDate: parsed.data.endDate,
        budget: parsed.data.budget,
      });
      toast.success('Đã tạo chiến dịch');
      router.push('/marketing/campaigns');
    } catch (err) {
      const msg = (err as Error).message || 'Không thể tạo chiến dịch';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link
        href="/marketing/campaigns"
        className="mb-4 inline-block text-sm text-primary hover:underline"
      >
        ← Chiến dịch
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Tạo chiến dịch mới</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Tên chiến dịch *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((prev) => ({ ...prev, name: '' }));
            }}
            required
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.name ? 'border-destructive' : 'border-input'} bg-background`}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày bắt đầu *</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setFieldErrors((prev) => ({ ...prev, startDate: '', endDate: '' }));
              }}
              required
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.startDate ? 'border-destructive' : 'border-input'} bg-background`}
            />
            {fieldErrors.startDate && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.startDate}</p>
            )}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Ngày kết thúc *</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setFieldErrors((prev) => ({ ...prev, endDate: '' }));
              }}
              required
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.endDate ? 'border-destructive' : 'border-input'} bg-background`}
            />
            {fieldErrors.endDate && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.endDate}</p>
            )}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Ngân sách (VND)</label>
          <input
            type="number"
            value={budget}
            onChange={(e) => {
              setBudget(e.target.value);
              setFieldErrors((prev) => ({ ...prev, budget: '' }));
            }}
            min={0}
            placeholder="Tùy chọn"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.budget ? 'border-destructive' : 'border-input'} bg-background`}
          />
          {fieldErrors.budget && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.budget}</p>
          )}
        </div>
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang tạo...' : 'Tạo chiến dịch'}
          </button>
          <Link
            href="/marketing/campaigns"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
