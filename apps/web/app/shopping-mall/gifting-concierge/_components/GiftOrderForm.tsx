'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  DELIVERY_POLICY,
  SERVICE_CITIES,
  GIFT_BOX_TYPES,
  getDeliveryTypes,
  calcExpressFeeKm,
  type DeliveryFeeConfig,
} from '../../_lib/delivery-config';

interface GiftOrderFormProps {
  giftType: 'hamper' | 'flowers';
  action: 'order' | 'send';
  deliveryConfig: DeliveryFeeConfig;
}

const CARD_OPTIONS = [
  { id: 'birthday', label: 'Chúc mừng sinh nhật' },
  { id: 'thankyou', label: 'Cảm ơn' },
  { id: 'congrats', label: 'Chúc mừng' },
  { id: 'getwell', label: 'Chúc sức khỏe' },
  { id: 'custom', label: 'Tùy chỉnh (ghi trong ghi chú)' },
];

export function GiftOrderForm({ giftType, action, deliveryConfig }: GiftOrderFormProps): JSX.Element {
  const DELIVERY_TYPES = getDeliveryTypes(deliveryConfig);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    cityId: '' as string,
    cardOption: 'birthday',
    cardMessage: '',
    giftWrapping: true,
    giftBoxType: 'premium',
    deliveryMethod: 'standard' as 'standard' | 'express',
    distanceKm: 5,
    senderName: '',
    senderPhone: '',
    note: '',
  });

  const isOutOfArea = form.cityId === 'other';
  const expressFee = useMemo(
    () =>
      form.deliveryMethod === 'express'
        ? calcExpressFeeKm(form.distanceKm, deliveryConfig)
        : 0,
    [form.deliveryMethod, form.distanceKm, deliveryConfig]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (isOutOfArea) {
      setError(DELIVERY_POLICY.OUT_OF_AREA_MESSAGE);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/shopping-mall/gift-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, giftType, action, expressFee }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) throw new Error(data.message || 'Gửi thất bại');
      setSubmitted(true);
    } catch (err: unknown) {
      setError((err as Error).message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-8 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h3 className="mb-2 font-serif text-xl font-medium text-amber-200">
          Đơn đặt quà đã được gửi!
        </h3>
        <p className="text-slate-400">
          Đội ngũ concierge sẽ liên hệ xác nhận trong 1-2 giờ làm việc.
        </p>
        <Link
          href="/shopping-mall/gifting-concierge"
          className="mt-6 inline-block text-amber-400 hover:underline"
        >
          ← Quay lại Sử giá tặng quà
        </Link>
      </div>
    );
  }

  const isSendGift = action === 'send';
  const typeLabel = giftType === 'hamper' ? 'Hamper' : 'Hoa tươi';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông báo chính sách giao hàng */}
      <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 px-4 py-3 text-sm text-slate-300">
        <p className="font-medium text-amber-200">Chính sách giao hàng Kodo Mall</p>
        <p className="mt-1">{DELIVERY_POLICY.PREMIUM_SAFETY_NOTE}</p>
        <p className="mt-1 text-slate-500">
          Chúng tôi tập trung trải nghiệm mua hàng nội tỉnh, thành. Không giao qua đơn vị TMĐT
          tầng 3.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}
      <p className="text-slate-400">
        {isSendGift
          ? `Gửi quà ${typeLabel} hộ – điền thông tin người nhận và người gửi`
          : `Đặt ${typeLabel} – điền thông tin giao hàng`}
      </p>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Tỉnh / Thành phố giao hàng *
        </label>
        <select
          required
          value={form.cityId}
          onChange={(e) => setForm((f) => ({ ...f, cityId: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          <option value="">-- Chọn tỉnh/thành --</option>
          {SERVICE_CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {isOutOfArea && (
          <p className="mt-2 text-sm text-amber-400">{DELIVERY_POLICY.OUT_OF_AREA_MESSAGE}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Địa chỉ chi tiết (số nhà, đường, quận) *
        </label>
        <textarea
          rows={2}
          required
          value={form.recipientAddress}
          onChange={(e) => setForm((f) => ({ ...f, recipientAddress: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          placeholder="Ví dụ: 123 Nguyễn Huệ, Q.1"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Họ tên người nhận *
        </label>
        <input
          type="text"
          required
          value={form.recipientName}
          onChange={(e) => setForm((f) => ({ ...f, recipientName: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Số điện thoại người nhận *
        </label>
        <input
          type="tel"
          required
          value={form.recipientPhone}
          onChange={(e) => setForm((f) => ({ ...f, recipientPhone: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          placeholder="0901234567"
        />
      </div>

      {/* --- Tùy chọn gói quà --- */}
      <hr className="border-slate-700" />
      <h3 className="font-serif text-lg text-amber-200">Tùy chọn gói quà</h3>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="giftWrapping"
          checked={form.giftWrapping}
          onChange={(e) => setForm((f) => ({ ...f, giftWrapping: e.target.checked }))}
          className="rounded border-slate-600"
        />
        <label htmlFor="giftWrapping" className="text-sm text-slate-400">
          Gói quà thủ công cao cấp
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Chọn loại hộp quà
        </label>
        <select
          value={form.giftBoxType}
          onChange={(e) => setForm((f) => ({ ...f, giftBoxType: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          {GIFT_BOX_TYPES.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Thiệp chúc mừng (viết thiệp tặng kèm)
        </label>
        <select
          value={form.cardOption}
          onChange={(e) => setForm((f) => ({ ...f, cardOption: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
        >
          {CARD_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Nội dung thiệp (tùy chọn)
        </label>
        <textarea
          rows={2}
          value={form.cardMessage}
          onChange={(e) => setForm((f) => ({ ...f, cardMessage: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          placeholder="Ghi lời chúc in trên thiệp..."
        />
      </div>

      {/* --- Phương thức giao hàng --- */}
      <hr className="border-slate-700" />
      <h3 className="font-serif text-lg text-amber-200">Phương thức giao hàng</h3>
      <div className="space-y-3">
        <label className="flex items-start gap-3 rounded-lg border border-slate-600 p-4 has-[:checked]:border-amber-500/50">
          <input
            type="radio"
            name="delivery"
            value="standard"
            checked={form.deliveryMethod === 'standard'}
            onChange={() => setForm((f) => ({ ...f, deliveryMethod: 'standard' }))}
            className="mt-1 border-slate-600"
          />
          <div>
            <span className="font-medium text-slate-300">{DELIVERY_TYPES.STANDARD.label}</span>
            <p className="text-sm text-slate-500">{DELIVERY_TYPES.STANDARD.description}</p>
            <p className="text-sm text-amber-400">
              Phí: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(DELIVERY_TYPES.STANDARD.feeVnd)}
            </p>
          </div>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-slate-600 p-4 has-[:checked]:border-amber-500/50">
          <input
            type="radio"
            name="delivery"
            value="express"
            checked={form.deliveryMethod === 'express'}
            onChange={() => setForm((f) => ({ ...f, deliveryMethod: 'express' }))}
            className="mt-1 border-slate-600"
          />
          <div className="flex-1">
            <span className="font-medium text-slate-300">{DELIVERY_TYPES.EXPRESS.label}</span>
            <p className="text-sm text-slate-500">{DELIVERY_TYPES.EXPRESS.description}</p>
            {form.deliveryMethod === 'express' && (
              <div className="mt-2 flex items-center gap-2">
                <label className="text-sm text-slate-400">Khoảng cách (km):</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.distanceKm}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, distanceKm: parseInt(e.target.value, 10) || 1 }))
                  }
                  className="w-20 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-slate-200"
                />
                <span className="text-sm text-amber-400">
                  Phí ước tính:{' '}
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(expressFee)}
                </span>
              </div>
            )}
          </div>
        </label>
      </div>

      {isSendGift && (
        <>
          <hr className="border-slate-700" />
          <h3 className="font-serif text-lg text-amber-200">Thông tin người gửi</h3>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Họ tên người gửi *
            </label>
            <input
              type="text"
              required
              value={form.senderName}
              onChange={(e) => setForm((f) => ({ ...f, senderName: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              placeholder="Nguyễn Văn B"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">
              Số điện thoại người gửi *
            </label>
            <input
              type="tel"
              required
              value={form.senderPhone}
              onChange={(e) => setForm((f) => ({ ...f, senderPhone: e.target.value }))}
              className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              placeholder="0907654321"
            />
          </div>
        </>
      )}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-400">
          Ghi chú thêm (tùy chọn)
        </label>
        <textarea
          rows={2}
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2 text-slate-200 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          placeholder="Yêu cầu đặc biệt, giờ giao, hộp theo yêu cầu..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || isOutOfArea}
          className="rounded-lg bg-amber-600 px-8 py-3 font-medium text-white transition-colors hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Đang gửi...' : 'Xác nhận đặt quà'}
        </button>
        <Link
          href="/shopping-mall/gifting-concierge"
          className="rounded-lg border border-slate-600 px-8 py-3 font-medium text-slate-400 transition-colors hover:bg-slate-800"
        >
          Hủy
        </Link>
      </div>
    </form>
  );
}
