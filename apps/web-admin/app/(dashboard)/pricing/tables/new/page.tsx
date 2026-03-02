'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPricingTableSchema } from '@lifestyle/validation';
import { pricingTablesService } from '@/lib/pricing-tables.service';
import { regionsService } from '@/lib/regions.service';
import { toast } from '@/lib/toast';
import type { PricingServiceType } from '@/lib/pricing-tables.service';

const SERVICE_OPTIONS: Array<{ value: PricingServiceType; label: string }> = [
  { value: 'TRANSPORT', label: 'Gọi xe' },
  { value: 'DELIVERY', label: 'Giao hàng' },
];

export default function NewPricingTablePage(): JSX.Element {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState<PricingServiceType>('TRANSPORT');
  const [regionIds, setRegionIds] = useState<string[]>([]);
  const [regions, setRegions] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    regionsService
      .list({ limit: 500 })
      .then((res) => {
        setRegions(res.items.map((r) => ({ id: r.id, code: r.code, name: r.name })));
      })
      .catch(() => setRegions([]));
  }, []);

  const toggleRegion = (id: string) => {
    setRegionIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const raw = { code: code.trim(), name: name.trim(), serviceType, regionIds };
    const parsed = createPricingTableSchema.safeParse(raw);
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
    pricingTablesService
      .create(parsed.data)
      .then(() => {
        toast.success('Đã tạo bảng giá');
        router.push('/pricing');
      })
      .catch((err) => {
        const msg = (err as Error).message || 'Không thể tạo bảng giá';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div>
      <Link href="/pricing" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Tạo bảng giá mới</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Mã *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setFieldErrors((p) => ({ ...p, code: '' }));
            }}
            required
            placeholder="VD: PT-HN-001"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.code ? 'border-destructive' : 'border-input'} bg-background`}
          />
          {fieldErrors.code && <p className="mt-1 text-xs text-destructive">{fieldErrors.code}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tên *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setFieldErrors((p) => ({ ...p, name: '' }));
            }}
            required
            placeholder="VD: Bảng giá Hà Nội - Gọi xe"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.name ? 'border-destructive' : 'border-input'} bg-background`}
          />
          {fieldErrors.name && <p className="mt-1 text-xs text-destructive">{fieldErrors.name}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Loại dịch vụ</label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as PricingServiceType)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          >
            {SERVICE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Vùng địa lý áp dụng *</label>
          <div
            className={`max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2 ${fieldErrors.regionIds ? 'border-destructive' : ''}`}
          >
            {regions.map((r) => (
              <label key={r.id} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={regionIds.includes(r.id)}
                  onChange={() => toggleRegion(r.id)}
                />
                <span className="text-sm">
                  {r.code} - {r.name}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang tạo...' : 'Tạo bảng giá'}
          </button>
          <Link href="/pricing" className="rounded-lg border px-4 py-2 text-sm hover:bg-muted">
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
