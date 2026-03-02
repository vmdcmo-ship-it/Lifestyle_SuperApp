'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { franchiseService } from '@/lib/franchise.service';
import { regionsService as regionsApi } from '@/lib/regions.service';
import type { FranchisePartner, FranchiseRegion, RegionServiceType } from '@/lib/franchise.service';

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

export default function FranchiseDetailPage(): JSX.Element {
  const params = useParams();
  const id = params?.id as string;

  const [partner, setPartner] = useState<FranchisePartner | null>(null);
  const [regions, setRegions] = useState<{ id: string; code: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [assignRegionId, setAssignRegionId] = useState('');
  const [assignServiceType, setAssignServiceType] = useState<RegionServiceType>('TRANSPORT');
  const [assigning, setAssigning] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadPartner = () => {
    if (!id) return;
    franchiseService
      .getPartnerById(id)
      .then(setPartner)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPartner();
  }, [id]);

  useEffect(() => {
    regionsApi
      .list({ limit: 500 })
      .then((res) => {
        setRegions(res.items.map((r) => ({ id: r.id, code: r.code, name: r.name })));
      })
      .catch(() => setRegions([]));
  }, []);

  const handleAssign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !assignRegionId) return;
    setAssigning(true);
    franchiseService
      .assignRegion(id, {
        regionId: assignRegionId,
        serviceType: assignServiceType,
      })
      .then(() => {
        loadPartner();
        setAssignRegionId('');
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

  if (error || !partner) {
    return (
      <div>
        <Link href="/franchise" className="mb-4 inline-block text-sm text-primary hover:underline">
          ← Quay lại
        </Link>
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error || 'Không tìm thấy đối tác'}
        </div>
      </div>
    );
  }

  const STATUS_LABELS: Record<string, string> = {
    ACTIVE: 'Đang hoạt động',
    INACTIVE: 'Dừng',
    PENDING: 'Chờ duyệt',
  };

  return (
    <div>
      <Link href="/franchise" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại danh sách
      </Link>
      <h1 className="mb-6 text-2xl font-bold">{partner.name}</h1>

      <div className="space-y-6">
        <section className="rounded-lg border bg-background p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Thông tin đối tác</h2>
            <Link href={`/franchise/${id}/edit`} className="text-sm text-primary hover:underline">
              Chỉnh sửa
            </Link>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Mã</dt>
            <dd className="font-mono">{partner.code}</dd>
            <dt className="text-muted-foreground">Email</dt>
            <dd>{partner.contact_email || '—'}</dd>
            <dt className="text-muted-foreground">Số điện thoại</dt>
            <dd>{partner.contact_phone || '—'}</dd>
            <dt className="text-muted-foreground">Trạng thái</dt>
            <dd>
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                  partner.status === 'ACTIVE'
                    ? 'bg-green-100 text-green-800'
                    : partner.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-gray-100 text-gray-600'
                }`}
              >
                {STATUS_LABELS[partner.status] ?? partner.status}
              </span>
            </dd>
            <dt className="text-muted-foreground">Ngày ký HĐ</dt>
            <dd>{partner.contract_signed_at ? formatDate(partner.contract_signed_at) : '—'}</dd>
            <dt className="text-muted-foreground">Ngày hết HĐ</dt>
            <dd>{partner.contract_expires_at ? formatDate(partner.contract_expires_at) : '—'}</dd>
            <dt className="text-muted-foreground">Ngày tạo</dt>
            <dd>{formatDate(partner.created_at)}</dd>
          </dl>
        </section>

        <section className="rounded-lg border bg-background p-4">
          <h2 className="mb-3 font-semibold">Vùng & dịch vụ quản lý</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Đối tác quản lý các vùng sau theo từng loại dịch vụ (Gọi xe, Thức ăn, Bách hóa).
          </p>
          {(partner.regions ?? []).length > 0 ? (
            <div className="mb-4 space-y-2">
              {(partner.regions ?? []).map((r: FranchiseRegion) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between rounded border px-3 py-2"
                >
                  <span>{r.region?.name ?? r.region_id}</span>
                  <span className="rounded bg-primary/10 px-2 py-0.5 text-xs">
                    {SERVICE_OPTIONS.find((o) => o.value === r.service_type)?.label ??
                      r.service_type}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      r.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {r.is_active ? 'Bật' : 'Tắt'}
                  </span>
                  <button
                    type="button"
                    disabled={togglingId !== null}
                    onClick={() => {
                      if (!id) return;
                      setTogglingId(r.id);
                      franchiseService
                        .assignRegion(id, {
                          regionId: r.region_id,
                          serviceType: r.service_type,
                          isActive: !r.is_active,
                        })
                        .then(() => loadPartner())
                        .catch((err) => setError((err as Error).message))
                        .finally(() => setTogglingId(null));
                    }}
                    className="text-xs text-primary hover:underline disabled:opacity-50"
                  >
                    {r.is_active ? 'Ngừng' : 'Bật lại'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mb-4 text-sm text-muted-foreground">Chưa gán vùng nào.</p>
          )}
          <form onSubmit={handleAssign} className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs font-medium">Khu vực</label>
              <select
                value={assignRegionId}
                onChange={(e) => setAssignRegionId(e.target.value)}
                required
                className="rounded border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">-- Chọn khu vực --</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.code} - {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Dịch vụ</label>
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
              {assigning ? 'Đang gán...' : 'Gán vùng'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
