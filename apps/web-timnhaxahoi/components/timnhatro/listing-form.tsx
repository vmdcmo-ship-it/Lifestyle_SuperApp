'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { LandlordDisclaimer } from '@/components/timnhatro/landlord-disclaimer';
import {
  createListing,
  updateListing,
  type CreateListingBody,
  type LandlordListing,
} from '@/lib/landlord-api';

function localDefaultExpires(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return localDefaultExpires();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToIso(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Ngày giờ hết hạn không hợp lệ.');
  }
  return d.toISOString();
}

type Props = {
  mode: 'create' | 'edit';
  initial: LandlordListing | null;
  listingId?: string;
  onSuccess: (listing: LandlordListing) => void;
};

export function ListingForm({ mode, initial, listingId, onSuccess }: Props): JSX.Element {
  const defaults = useMemo(() => {
    if (initial) {
      return {
        title: initial.title,
        description: initial.description ?? '',
        province: initial.province ?? '',
        district: initial.district ?? '',
        addressLine: initial.addressLine ?? '',
        priceMonthly: String(initial.priceMonthly),
        areaM2: initial.areaM2 != null ? String(initial.areaM2) : '',
        contactPhone: initial.contactPhone,
        expiresAt: isoToDatetimeLocal(initial.expiresAt),
      };
    }
    return {
      title: '',
      description: '',
      province: '',
      district: '',
      addressLine: '',
      priceMonthly: '',
      areaM2: '',
      contactPhone: '',
      expiresAt: localDefaultExpires(),
    };
  }, [initial]);

  const [title, setTitle] = useState(defaults.title);
  const [description, setDescription] = useState(defaults.description);
  const [province, setProvince] = useState(defaults.province);
  const [district, setDistrict] = useState(defaults.district);
  const [addressLine, setAddressLine] = useState(defaults.addressLine);
  const [priceMonthly, setPriceMonthly] = useState(defaults.priceMonthly);
  const [areaM2, setAreaM2] = useState(defaults.areaM2);
  const [contactPhone, setContactPhone] = useState(defaults.contactPhone);
  const [expiresAt, setExpiresAt] = useState(defaults.expiresAt);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const price = Number.parseInt(priceMonthly.replace(/\s/g, ''), 10);
    if (Number.isNaN(price) || price < 0) {
      setError('Giá (VND/tháng) không hợp lệ.');
      return;
    }
    let expiresIso: string;
    try {
      expiresIso = datetimeLocalToIso(expiresAt);
    } catch (err) {
      setError((err as Error).message);
      return;
    }
    const body: CreateListingBody = {
      title: title.trim(),
      description: description.trim() || undefined,
      province: province.trim() || undefined,
      district: district.trim() || undefined,
      addressLine: addressLine.trim() || undefined,
      priceMonthly: price,
      contactPhone: contactPhone.replace(/\s/g, ''),
      expiresAt: expiresIso,
    };
    const a = areaM2.trim();
    if (a) {
      const area = Number.parseInt(a, 10);
      if (!Number.isNaN(area) && area > 0) {
        body.areaM2 = area;
      }
    }

    setLoading(true);
    try {
      let result: LandlordListing;
      if (mode === 'create') {
        result = await createListing(body);
      } else {
        if (!listingId) {
          setError('Thiếu mã tin.');
          return;
        }
        result = await updateListing(listingId, body);
      }
      onSuccess(result);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'UNAUTHORIZED') {
        setError('Phiên đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700">Tiêu đề *</label>
        <input
          required
          minLength={3}
          maxLength={255}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Mô tả</label>
        <textarea
          rows={5}
          maxLength={20000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Tỉnh/TP</label>
          <input
            type="text"
            maxLength={255}
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Quận/Huyện</label>
          <input
            type="text"
            maxLength={255}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Địa chỉ đầy đủ</label>
        <input
          type="text"
          maxLength={2000}
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Giá (VNĐ/tháng) *</label>
          <input
            type="text"
            inputMode="numeric"
            required
            value={priceMonthly}
            onChange={(e) => setPriceMonthly(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Diện tích (m²)</label>
          <input
            type="text"
            inputMode="numeric"
            value={areaM2}
            onChange={(e) => setAreaM2(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Số điện thoại hiển thị *</label>
        <input
          type="tel"
          required
          pattern="[0-9+\s]{8,20}"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Hết hạn hiển thị SĐT *</label>
        <input
          type="datetime-local"
          required
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
        />
        <p className="mt-1 text-xs text-slate-500">
          Sau thời điểm này số điện thoại sẽ ẩn trên trang công khai; nội dung tin có thể được giữ thêm tối đa 30 ngày.
        </p>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#1e3a8a] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#172554] disabled:opacity-60"
        >
          {loading ? 'Đang lưu…' : mode === 'create' ? 'Đăng tin' : 'Cập nhật'}
        </button>
      </div>

      <LandlordDisclaimer />
    </form>
  );
}
