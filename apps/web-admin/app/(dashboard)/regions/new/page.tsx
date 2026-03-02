'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { regionsService } from '@/lib/regions.service';
import { toast } from '@/lib/toast';
import type { RegionLevel } from '@/lib/regions.service';

const LEVEL_OPTIONS: Array<{ value: RegionLevel; label: string }> = [
  { value: 'PROVINCE', label: 'Tỉnh/Thành phố' },
  { value: 'DISTRICT', label: 'Quận/Huyện' },
  { value: 'AREA', label: 'Khu vực' },
];

export default function NewRegionPage(): JSX.Element {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [level, setLevel] = useState<RegionLevel>('PROVINCE');
  const [parentId, setParentId] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    regionsService
      .create({
        code: code.trim(),
        name: name.trim(),
        level,
        parentId: parentId.trim() || undefined,
        province: province.trim() || undefined,
        city: city.trim() || undefined,
        district: district.trim() || undefined,
        isActive,
      })
      .then(() => {
        toast.success('Đã tạo khu vực thành công');
        router.push('/regions');
      })
      .catch((err) => {
        const msg = (err as Error).message || 'Không thể tạo khu vực';
        setError(msg);
        toast.error(msg);
        setSubmitting(false);
      });
  };

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Thêm khu vực địa lý</h1>

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
            placeholder="VD: HN"
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
            placeholder="VD: Hà Nội"
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
        <div>
          <label className="mb-1 block text-sm font-medium">Vùng cha (UUID, tùy chọn)</label>
          <input
            type="text"
            value={parentId}
            onChange={(e) => setParentId(e.target.value)}
            placeholder="Để trống nếu là cấp cao nhất"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
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
            {submitting ? 'Đang tạo...' : 'Tạo khu vực'}
          </button>
          <Link
            href="/regions"
            className="rounded-lg border border-input px-4 py-2 text-sm hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
