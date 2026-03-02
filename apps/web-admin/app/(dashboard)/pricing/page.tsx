'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { pricingTablesService } from '@/lib/pricing-tables.service';
import type { PricingTable } from '@/lib/pricing-tables.service';
import { authService } from '@/lib/auth.service';

const SERVICE_LABELS: Record<string, string> = {
  TRANSPORT: 'Gọi xe',
  DELIVERY: 'Giao hàng',
};

const VEHICLE_LABELS: Record<string, string> = {
  BIKE: 'Xe máy',
  CAR_4_SEATS: 'Xe 4 chỗ',
  CAR_7_SEATS: 'Xe 7 chỗ',
  TRUCK: 'Xe tải',
};

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

export default function PricingPage(): JSX.Element {
  const [tables, setTables] = useState<PricingTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const user = authService.getStoredUser();
  const isCEO = user?.role === 'ADMIN';

  useEffect(() => {
    pricingTablesService
      .list(serviceFilter || undefined)
      .then(setTables)
      .catch((err) => {
        setError((err as Error).message || 'Không thể tải danh sách');
        setTables([]);
      })
      .finally(() => setLoading(false));
  }, [serviceFilter]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Bảng giá dịch vụ</h1>
        {isCEO && (
          <Link
            href="/pricing/tables/new"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Tạo bảng giá
          </Link>
        )}
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        Mỗi bảng giá áp dụng cho 1 hoặc nhiều vùng địa lý. Công thức định giá (hệ số thời tiết, giao
        thông, surge) chỉ CEO được tiếp cận. Quản trị vận hành có thể bật/tắt các công tắc.
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2 text-sm text-muted-foreground">Loại dịch vụ:</label>
        <select
          value={serviceFilter}
          onChange={(e) => setServiceFilter(e.target.value)}
          className="rounded-lg border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Tất cả</option>
          <option value="TRANSPORT">Gọi xe</option>
          <option value="DELIVERY">Giao hàng</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            Đang tải...
          </div>
        ) : tables.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            Chưa có bảng giá nào.
            {isCEO && (
              <>
                {' '}
                <Link href="/pricing/tables/new" className="text-primary hover:underline">
                  Tạo bảng giá đầu tiên
                </Link>
              </>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Mã / Tên</th>
                <th className="px-4 py-3 text-left font-medium">Loại</th>
                <th className="px-4 py-3 text-left font-medium">Vùng áp dụng</th>
                <th className="px-4 py-3 text-left font-medium">Tham số</th>
                <th className="px-4 py-3 text-center font-medium">TT</th>
                <th className="px-4 py-3 text-left font-medium">Hiệu lực</th>
                <th className="px-4 py-3 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <tr key={t.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">{t.code}</span>
                    <div className="font-medium">{t.name}</div>
                  </td>
                  <td className="px-4 py-3">{SERVICE_LABELS[t.serviceType] ?? t.serviceType}</td>
                  <td className="px-4 py-3">
                    {t.regions.length > 0 ? (
                      <span className="flex flex-wrap gap-1">
                        {t.regions.slice(0, 2).map((r) => (
                          <span key={r.id} className="rounded bg-muted px-2 py-0.5 text-xs">
                            {r.name}
                          </span>
                        ))}
                        {t.regions.length > 2 && (
                          <span className="text-muted-foreground">+{t.regions.length - 2}</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {t.params.length > 0 ? (
                      <span className="flex flex-wrap gap-1">
                        {t.params.map((p) => (
                          <span key={p.id} className="rounded bg-primary/10 px-2 py-0.5 text-xs">
                            {VEHICLE_LABELS[p.vehicleType] ?? p.vehicleType}
                          </span>
                        ))}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        t.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.isActive ? 'Bật' : 'Tắt'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {formatDate(t.effectiveFrom)}
                    {t.effectiveTo && ` → ${formatDate(t.effectiveTo)}`}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/pricing/tables/${t.id}`} className="text-primary hover:underline">
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
