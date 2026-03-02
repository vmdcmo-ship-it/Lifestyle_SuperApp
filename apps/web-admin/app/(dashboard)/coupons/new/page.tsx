'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCouponSchema } from '@lifestyle/validation';
import { couponsService } from '@/lib/coupons.service';
import { toast } from '@/lib/toast';

export default function NewCouponPage(): JSX.Element {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT'>('FIXED_AMOUNT');
  const [discountValue, setDiscountValue] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [perUserLimit, setPerUserLimit] = useState('1');
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 16);
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    const raw = {
      code,
      title,
      description: description || undefined,
      discountType,
      discountValue: discountValue ? parseInt(discountValue, 10) : 0,
      maxDiscount: maxDiscount ? parseInt(maxDiscount, 10) : undefined,
      minOrderAmount: minOrderAmount ? parseInt(minOrderAmount, 10) : undefined,
      usageLimit: usageLimit ? parseInt(usageLimit, 10) : undefined,
      perUserLimit: parseInt(perUserLimit, 10) || 1,
      startDate,
      endDate,
    };
    const parsed = createCouponSchema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      setFieldErrors(
        Object.fromEntries(
          Object.entries(issues).map(([k, v]) => [k, Array.isArray(v) ? (v[0] ?? '') : String(v)]),
        ),
      );
      setError(parsed.error.errors[0]?.message ?? 'Vui lòng kiểm tra lại thông tin');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...parsed.data,
        startDate: new Date(parsed.data.startDate).toISOString(),
        endDate: new Date(parsed.data.endDate).toISOString(),
      };
      await couponsService.create(payload);
      toast.success('Đã tạo coupon thành công');
      router.push('/coupons');
    } catch (err) {
      const msg = (err as Error).message || 'Không thể tạo coupon';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link href="/coupons" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Quay lại
      </Link>

      <h1 className="mb-6 text-2xl font-bold">Thêm coupon mới</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Mã coupon *</label>
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setFieldErrors((e2) => ({ ...e2, code: '' }));
            }}
            required
            placeholder="VD: WELCOME2026"
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.code ? 'border-destructive' : 'border-input'} bg-background`}
          />
          {fieldErrors.code && <p className="mt-1 text-xs text-destructive">{fieldErrors.code}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Tiêu đề *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setFieldErrors((e2) => ({ ...e2, title: '' }));
            }}
            required
            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.title ? 'border-destructive' : 'border-input'} bg-background`}
          />
          {fieldErrors.title && (
            <p className="mt-1 text-xs text-destructive">{fieldErrors.title}</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Mô tả</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Loại giảm *</label>
            <select
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as any)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="FIXED_AMOUNT">Giảm số tiền (VNĐ)</option>
              <option value="PERCENTAGE">Giảm theo %</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Giá trị giảm * {discountType === 'PERCENTAGE' ? '(%)' : '(VNĐ)'}
            </label>
            <input
              type="number"
              value={discountValue}
              onChange={(e) => {
                setDiscountValue(e.target.value);
                setFieldErrors((e2) => ({ ...e2, discountValue: '' }));
              }}
              required
              min={1}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary ${fieldErrors.discountValue ? 'border-destructive' : 'border-input'} bg-background`}
            />
            {fieldErrors.discountValue && (
              <p className="mt-1 text-xs text-destructive">{fieldErrors.discountValue}</p>
            )}
          </div>
        </div>
        {discountType === 'PERCENTAGE' && (
          <div>
            <label className="mb-1 block text-sm font-medium">Giảm tối đa (VNĐ)</label>
            <input
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(e.target.value)}
              min={0}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium">Đơn hàng tối thiểu (VNĐ)</label>
          <input
            type="number"
            value={minOrderAmount}
            onChange={(e) => setMinOrderAmount(e.target.value)}
            min={0}
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Giới hạn sử dụng</label>
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              min={1}
              placeholder="Không giới hạn"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Lượt/người</label>
            <input
              type="number"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(e.target.value)}
              min={1}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Bắt đầu *</label>
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Kết thúc *</label>
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang tạo...' : 'Tạo coupon'}
          </button>
          <Link
            href="/coupons"
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Hủy
          </Link>
        </div>
      </form>
    </div>
  );
}
