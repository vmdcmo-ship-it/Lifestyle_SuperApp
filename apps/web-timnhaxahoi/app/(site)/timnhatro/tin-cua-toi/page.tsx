'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { LandlordDisclaimer } from '@/components/timnhatro/landlord-disclaimer';
import {
  fetchMyListings,
  landlordLogout,
  softDeleteListing,
  type LandlordListing,
} from '@/lib/landlord-api';
import { isLandlordLoggedIn } from '@/lib/landlord-auth';

function formatVnd(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n) + ' đ/tháng';
}

export default function TimnhatroTinCuaToiPage(): JSX.Element {
  const router = useRouter();
  const [items, setItems] = useState<LandlordListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isLandlordLoggedIn()) {
      router.replace('/timnhatro/dang-nhap?next=/timnhatro/tin-cua-toi');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetchMyListings({ page: 1, limit: 50 });
      setItems(res.items ?? []);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'UNAUTHORIZED') {
        router.replace('/timnhatro/dang-nhap?next=/timnhatro/tin-cua-toi');
        return;
      }
      setError(msg);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const onHide = async (id: string) => {
    if (!window.confirm('Ẩn tin khỏi trang công khai? Bạn có thể liên hệ vận hành nếu cần khôi phục.')) {
      return;
    }
    setBusyId(id);
    try {
      await softDeleteListing(id);
      await load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tin của tôi</h1>
          <p className="mt-1 text-sm text-slate-600">Quản lý tin cho thuê đã đăng.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/timnhatro/dang-tin"
            className="rounded-lg bg-[#1e3a8a] px-4 py-2 text-sm font-medium text-white hover:bg-[#172554]"
          >
            + Đăng tin mới
          </Link>
          <button
            type="button"
            onClick={() => {
              landlordLogout();
              router.push('/timnhatro');
              router.refresh();
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      ) : null}

      {loading ? (
        <p className="mt-10 text-center text-slate-600">Đang tải…</p>
      ) : items.length === 0 ? (
        <p className="mt-10 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center text-slate-600">
          Bạn chưa có tin nào.{' '}
          <Link href="/timnhatro/dang-tin" className="font-medium text-[#1e3a8a] hover:underline">
            Đăng tin đầu tiên
          </Link>
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium">Giá</th>
                <th className="px-4 py-3 text-left font-medium">Hết hạn SĐT</th>
                <th className="px-4 py-3 text-left font-medium">Công khai</th>
                <th className="px-4 py-3 text-left font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <td className="max-w-[200px] px-4 py-3 font-medium text-slate-900">{row.title}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatVnd(row.priceMonthly)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                    {new Date(row.expiresAt).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-0.5 text-xs ${
                        row.visiblePublic ? 'bg-green-100 text-green-900' : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {row.visiblePublic ? 'Hiển thị' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Link
                      href={`/timnhatro/${row.slug}`}
                      className="mr-2 text-[#1e3a8a] hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem
                    </Link>
                    <Link href={`/timnhatro/sua/${row.id}`} className="mr-2 text-[#1e3a8a] hover:underline">
                      Sửa
                    </Link>
                    {row.visiblePublic ? (
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => void onHide(row.id)}
                        className="text-red-700 hover:underline disabled:opacity-50"
                      >
                        Ẩn
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10">
        <LandlordDisclaimer />
      </div>
    </div>
  );
}
