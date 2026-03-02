'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { pricingTablesService } from '@/lib/pricing-tables.service';
import { regionsService } from '@/lib/regions.service';
import type { PricingServiceType } from '@/lib/pricing-tables.service';

const SERVICE_OPTIONS: Array<{ value: PricingServiceType; label: string }> = [
  { value: 'TRANSPORT', label: 'Gọi xe' },
  { value: 'DELIVERY', label: 'Giao hàng' },
];

export default function EditPricingTablePage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [serviceType, setServiceType] = useState<PricingServiceType>('TRANSPORT');
  const [regionIds, setRegionIds] = useState<string[]>([]);
  const [regions, setRegions] = useState<Array<{ id: string; code: string; name: string }>>([]);
  const [effectiveFrom, setEffectiveFrom] = useState('');
  const [effectiveTo, setEffectiveTo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    regionsService
      .list({ limit: 500 })
      .then((res) => {
        setRegions(res.items.map((r) => ({ id: r.id, code: r.code, name: r.name })));
      })
      .catch(() => setRegions([]));
  }, []);

  useEffect(() => {
    if (!id) return;
    pricingTablesService
      .getById(id)
      .then((t) => {
        setCode(t.code);
        setName(t.name);
        setServiceType(t.serviceType);
        setRegionIds(t.regions.map((r) => r.id));
        setEffectiveFrom(t.effectiveFrom ? t.effectiveFrom.slice(0, 10) : '');
        setEffectiveTo(t.effectiveTo ? t.effectiveTo.slice(0, 10) : '');
        setIsActive(t.isActive);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleRegion = (regionId: string) => {
    setRegionIds((prev) =>
      prev.includes(regionId) ? prev.filter((r) => r !== regionId) : [...prev, regionId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim() || !name.trim()) {
      setError('Vui lòng nhập mã và tên');
      return;
    }
    if (regionIds.length === 0) {
      setError('Chọn ít nhất một vùng địa lý');
      return;
    }
    setSubmitting(true);
    pricingTablesService
      .update(id, {
        code: code.trim(),
        name: name.trim(),
        regionIds,
        effectiveFrom: effectiveFrom ? new Date(effectiveFrom).toISOString() : undefined,
        effectiveTo: effectiveTo ? new Date(effectiveTo).toISOString() : undefined,
        isActive,
      })
      .then(() => router.push(`/pricing/tables/${id}`))
      .catch((err) => {
        setError((err as Error).message || 'Không thể cập nhật');
        setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error && !code) {
    return (
      <div>
        <Link href="/pricing" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        href={`/pricing/tables/${id}`}
        className="mb-4 inline-block text-sm text-primary hover:underline"
      >
        ← Quay lại chi tiết
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa bảng giá</h1>

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
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tên *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Loại dịch vụ</label>
          <p className="rounded-lg border border-muted bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            {SERVICE_OPTIONS.find((o) => o.value === serviceType)?.label ?? serviceType} (không đổi
            được)
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Vùng địa lý áp dụng *</label>
          <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-2">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Hiệu lực từ</label>
            <input
              type="date"
              value={effectiveFrom}
              onChange={(e) => setEffectiveFrom(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Hiệu lực đến</label>
            <input
              type="date"
              value={effectiveTo}
              onChange={(e) => setEffectiveTo(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <label htmlFor="isActive" className="text-sm">
            Kích hoạt
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
          <Link
            href={`/pricing/tables/${id}`}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
