'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { regionsService } from '@/lib/regions.service';
import type { RegionItem, RegionServiceConfig, RegionServiceType } from '@/lib/regions.service';

const SERVICE_OPTIONS: Array<{ value: RegionServiceType; label: string }> = [
  { value: 'TRANSPORT', label: 'Gọi xe' },
  { value: 'FOOD', label: 'Thức ăn, quán ăn' },
  { value: 'GROCERY', label: 'Bách hóa, siêu thị' },
];

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

export default function RegionDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;

  const [region, setRegion] = useState<RegionItem | null>(null);
  const [services, setServices] = useState<RegionServiceConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignServiceType, setAssignServiceType] = useState<RegionServiceType>('TRANSPORT');
  const [assigning, setAssigning] = useState(false);

  const loadRegion = () => {
    if (!id) return;
    regionsService
      .getById(id)
      .then((r) => {
        setRegion(r);
        setServices(r.services ?? []);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRegion();
  }, [id]);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setAssigning(true);
    regionsService
      .assignService(id, { serviceType: assignServiceType })
      .then(() => {
        loadRegion();
        setAssignServiceType('TRANSPORT');
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setAssigning(false));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  if (error || !region) {
    return (
      <div>
        <Link href="/regions" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Không tìm thấy khu vực'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/regions" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>
      <h1 className="mb-6 text-2xl font-bold">{region.name}</h1>

      <div className="space-y-6">
        <section className="rounded-lg border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Thông tin khu vực</h2>
            <Link href={`/regions/${id}/edit`} className="text-sm text-primary hover:underline">
              Chỉnh sửa
            </Link>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Mã</dt>
            <dd className="font-mono">{region.code}</dd>
            <dt className="text-muted-foreground">Cấp</dt>
            <dd>
              {region.level === 'PROVINCE' && 'Tỉnh/Thành phố'}
              {region.level === 'DISTRICT' && 'Quận/Huyện'}
              {region.level === 'AREA' && 'Khu vực'}
            </dd>
            <dt className="text-muted-foreground">Tỉnh</dt>
            <dd>{region.province || '—'}</dd>
            <dt className="text-muted-foreground">Thành phố</dt>
            <dd>{region.city || '—'}</dd>
            <dt className="text-muted-foreground">Quận/Huyện</dt>
            <dd>{region.district || '—'}</dd>
            <dt className="text-muted-foreground">Trạng thái</dt>
            <dd>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                  region.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {region.is_active ? 'Bật' : 'Tắt'}
              </span>
            </dd>
            <dt className="text-muted-foreground">Ngày tạo</dt>
            <dd>{formatDate(region.created_at)}</dd>
          </dl>
        </section>

        <section className="rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Dịch vụ theo khu vực</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Các dịch vụ Gọi xe, Thức ăn, Bách hóa áp dụng cho khu vực này.
          </p>
          {services.length > 0 ? (
            <div className="mb-4 space-y-2">
              {services.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded border px-3 py-2"
                >
                  <span>
                    {SERVICE_OPTIONS.find((o) => o.value === s.service_type)?.label ??
                      s.service_type}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      s.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {s.is_active ? 'Bật' : 'Tắt'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Từ {formatDate(s.effective_from)}
                  </span>
                  <button
                    type="button"
                    disabled={assigning}
                    onClick={() => {
                      if (!id) return;
                      setAssigning(true);
                      regionsService
                        .assignService(id, { serviceType: s.service_type, isActive: !s.is_active })
                        .then(() => loadRegion())
                        .catch((err) => setError((err as Error).message))
                        .finally(() => setAssigning(false));
                    }}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    {s.is_active ? 'Ngừng' : 'Bật lại'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-sm text-muted-foreground">Chưa gán dịch vụ nào.</p>
          )}
          <form onSubmit={handleAssign} className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Thêm dịch vụ</label>
              <select
                value={assignServiceType}
                onChange={(e) => setAssignServiceType(e.target.value as RegionServiceType)}
                className="rounded border border-input bg-background px-3 py-2 text-sm"
              >
                {SERVICE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={assigning}
              className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {assigning ? 'Đang gán...' : 'Gán dịch vụ'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
