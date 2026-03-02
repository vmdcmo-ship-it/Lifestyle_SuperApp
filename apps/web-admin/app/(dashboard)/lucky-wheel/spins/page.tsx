'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { luckyWheelService } from '@/lib/lucky-wheel.service';
import type { LuckyWheelSpin } from '@/lib/lucky-wheel.service';

const PARTICIPANT_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'USER', label: 'User' },
  { value: 'DRIVER', label: 'Tài xế' },
];

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function LuckyWheelSpinsPage(): JSX.Element {
  const searchParams = useSearchParams();
  const campaignId = searchParams?.get('campaignId') || '';
  const [participantType, setParticipantType] = useState<string>(
    searchParams?.get('participantType') || '',
  );
  const [data, setData] = useState<{
    data: LuckyWheelSpin[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    setError('');
    const params: Record<string, unknown> = { page, limit: 20 };
    if (campaignId) params.campaignId = campaignId;
    if (participantType) params.participantType = participantType;
    luckyWheelService
      .listSpins(params)
      .then(setData)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [page, campaignId, participantType]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  return (
    <div>
      <Link href="/lucky-wheel" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại Lucky Wheel
      </Link>
      <h1 className="mb-6 text-2xl font-bold">Lịch sử quay</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Đối tượng:</span>
          <select
            value={participantType}
            onChange={(e) => setParticipantType(e.target.value)}
            className="rounded border px-2 py-1 text-sm"
          >
            {PARTICIPANT_OPTIONS.map((o) => (
              <option key={o.value || 'all'} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        {data?.data.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">Chưa có lượt quay nào</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Campaign</th>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Loại</th>
                <th className="px-4 py-3 text-left font-medium">Giải thưởng</th>
                <th className="px-4 py-3 text-left font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {data?.data.map((s) => (
                <tr key={s.id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">{s.campaignName}</td>
                  <td className="px-4 py-3 font-mono text-xs">{s.userId}</td>
                  <td className="px-4 py-3">
                    {s.participantType === 'DRIVER' ? 'Tài xế' : 'User'}
                  </td>
                  <td className="px-4 py-3 font-medium">{s.prizeName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {data.pagination.page} / {data.pagination.totalPages} - Tổng{' '}
            {data.pagination.total}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Trước
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
              disabled={page >= data.pagination.totalPages}
              className="rounded border px-3 py-1 text-sm disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
