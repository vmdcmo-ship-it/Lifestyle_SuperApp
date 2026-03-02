'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { regionsService } from '@/lib/regions.service';
import { toast } from '@/lib/toast';
import type { RegionItem, RegionLevel } from '@/lib/regions.service';

const LEVEL_OPTIONS: Array<{ value: RegionLevel; label: string }> = [
  { value: 'PROVINCE', label: 'Tỉnh/Thành phố' },
  { value: 'DISTRICT', label: 'Quận/Huyện' },
  { value: 'AREA', label: 'Khu vực' },
];

export default function EditRegionPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [region, setRegion] = useState<RegionItem | null>(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<RegionLevel>('PROVINCE');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    regionsService
      .getById(id)
      .then((r) => {
        setRegion(r);
        setCode(r.code);
        setName(r.name);
        setLevel(r.level);
        setProvince(r.province ?? '');
        setCity(r.city ?? '');
        setDistrict(r.district ?? '');
        setIsActive(r.is_active);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setError('');
    setSubmitting(true);
    regionsService
      .update(id, {
        code: code.trim(),
        name: name.trim(),
        level,
        province: province.trim() || undefined,
        city: city.trim() || undefined,
        district: district.trim() || undefined,
        isActive,
      })
      .then(() => {
        toast.success('Đã cập nhật khu vực');
        router.push(`/regions/${id}`);
      })
      .catch((err) => {
        const msg = (err as Error).message || 'Không thể cập nhật';
        setError(msg);
        toast.error(msg);
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

  if (error && !region) {
    return (
      <div>
        <Link href="/regions" className="mb-4 inline-block text-sm text-primary hover:underline">
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
        href={`/regions/${id}`}
        className="mb-4 inline-block text-sm text-primary hover:underline"
      >
        ← Quay lại chi tiết
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Chỉnh sửa khu vực</h1>

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
            maxLength={50}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tên *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={200}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Cấp *</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as RegionLevel)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            {LEVEL_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Tỉnh</label>
            <input
              type="text"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Thành phố</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Quận/Huyện</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
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
            href={`/regions/${id}`}
            className="rounded-lg border border-input px-4 py-2 text-sm hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
