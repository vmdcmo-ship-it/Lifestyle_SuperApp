'use client';

import { useState, useEffect } from 'react';
import { batDongSanService, type BdsRentalListing } from '@/lib/bat-dong-san.service';
import { exportToCsv } from '@/lib/utils/export-csv';

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
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

export default function BdsRentalListingsPage(): JSX.Element {
  const [items, setItems] = useState<BdsRentalListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [districtFilter, setDistrictFilter] = useState('');

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params: Record<string, unknown> = { page, limit: 20 };
      if (districtFilter) params.district = districtFilter;
      const res = await batDongSanService.listRentalListings(params);
      const data = res.data ?? (res as { data?: BdsRentalListing[] }).data ?? [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError((err as Error).message || 'Không thể tải danh sách');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, districtFilter]);

  const handleExport = () => {
    if (items.length === 0) return;
    exportToCsv(
      items.map((r) => ({
        title: r.title,
        propertyType: r.propertyType,
        location: r.location,
        price: r.price != null ? `${r.price} triệu/tháng` : '',
        area: r.area != null ? `${r.area} m²` : '',
        createdAt: formatDate(r.createdAt),
      })),
      'bds-rental-listings',
      [
        { key: 'title', header: 'Tiêu đề' },
        { key: 'propertyType', header: 'Loại BDS' },
        { key: 'location', header: 'Khu vực' },
        { key: 'price', header: 'Giá' },
        { key: 'area', header: 'Diện tích' },
        { key: 'createdAt', header: 'Ngày đăng' },
      ],
    );
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Tin cho thuê</h2>
        {!loading && items.length > 0 && (
          <button
            type="button"
            onClick={handleExport}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
          >
            Export CSV
          </button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-4 rounded-lg border bg-muted/30 p-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Quận/Huyện</label>
          <input
            type="text"
            placeholder="Lọc theo quận..."
            value={districtFilter}
            onChange={(e) => {
              setDistrictFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm w-48"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">Đang tải...</div>
      ) : items.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          Chưa có tin cho thuê nào. Dữ liệu từ form đăng tin (web) hoặc backend GET
          /api/v1/bat-dong-san/rental-listings.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium">Loại</th>
                <th className="px-4 py-3 text-left font-medium">Khu vực</th>
                <th className="px-4 py-3 text-left font-medium">Giá</th>
                <th className="px-4 py-3 text-left font-medium">Diện tích</th>
                <th className="px-4 py-3 text-left font-medium">Ngày đăng</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr
                  key={r.id}
                  className="cursor-pointer border-b last:border-0 hover:bg-muted/30"
                  onClick={() => window.open(`${process.env.NEXT_PUBLIC_WEB_APP_URL || 'http://localhost:3000'}/bat-dong-san/nha-cho-thue/${r.id}`, '_blank')}
                >
                  <td className="px-4 py-3 font-medium">{r.title}</td>
                  <td className="px-4 py-3">{r.propertyType}</td>
                  <td className="px-4 py-3">{r.location}</td>
                  <td className="px-4 py-3">
                    {r.price != null ? `${r.price} triệu/tháng` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {r.area != null ? `${r.area} m²` : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(r.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
