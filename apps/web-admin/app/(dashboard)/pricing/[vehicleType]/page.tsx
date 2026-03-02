'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { pricingService } from '@/lib/pricing.service';

const VEHICLE_LABELS: Record<string, string> = {
  BIKE: 'Xe máy',
  CAR_4_SEATS: 'Xe 4 chỗ',
  CAR_7_SEATS: 'Xe 7 chỗ',
  TRUCK: 'Xe tải',
};

export default function EditPricingPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const vehicleType = decodeURIComponent((params?.vehicleType as string) || '');

  const [baseFare, setBaseFare] = useState('');
  const [perKm, setPerKm] = useState('');
  const [perMin, setPerMin] = useState('');
  const [minFare, setMinFare] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!vehicleType) return;
    setLoading(true);
    pricingService
      .list()
      .then((list) => {
        const item = list.find((c) => c.vehicleType === vehicleType);
        if (item) {
          setBaseFare(String(item.baseFare));
          setPerKm(String(item.perKm));
          setPerMin(String(item.perMin));
          setMinFare(String(item.minFare));
          setIsActive(item.isActive);
        } else {
          setError('Không tìm thấy bảng giá. Tạo mới trước.');
        }
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [vehicleType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await pricingService.update(vehicleType, {
        baseFare: parseInt(baseFare, 10),
        perKm: parseInt(perKm, 10),
        perMin: parseInt(perMin, 10),
        minFare: parseInt(minFare, 10),
        isActive,
      });
      router.push('/pricing');
    } catch (err) {
      setError((err as Error).message || 'Không thể cập nhật');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        Đang tải...
      </div>
    );
  }

  return (
    <div>
      <Link href="/pricing" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại
      </Link>

      <h1 className="mb-6 text-2xl font-bold">
        Chỉnh sửa bảng giá: {VEHICLE_LABELS[vehicleType] ?? vehicleType}
      </h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Cước cơ bản (VND)</label>
          <input
            type="number"
            value={baseFare}
            onChange={(e) => setBaseFare(e.target.value)}
            required
            min={0}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Đơn giá/km (VND)</label>
          <input
            type="number"
            value={perKm}
            onChange={(e) => setPerKm(e.target.value)}
            required
            min={0}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Đơn giá/phút (VND)</label>
          <input
            type="number"
            value={perMin}
            onChange={(e) => setPerMin(e.target.value)}
            required
            min={0}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Cước tối thiểu (VND)</label>
          <input
            type="number"
            value={minFare}
            onChange={(e) => setMinFare(e.target.value)}
            required
            min={0}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <label htmlFor="isActive" className="text-sm">
            Kích hoạt
          </label>
        </div>
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang lưu...' : 'Lưu'}
          </button>
          <Link
            href="/pricing"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
