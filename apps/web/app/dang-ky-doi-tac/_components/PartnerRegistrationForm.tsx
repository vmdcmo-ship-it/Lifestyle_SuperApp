'use client';

import { useState } from 'react';
import {
  BUSINESS_GROUPS,
  getSubCategoriesForGroup,
} from '@/lib/config/partner-registration';
import type { BusinessGroupId } from '@/lib/config/partner-registration';

interface PartnerRegistrationFormProps {
  /** Prefill nhóm khi vào từ link (vd: ?group=SHOPPING_MALL) */
  defaultGroup?: BusinessGroupId;
  /** Nguồn lead để tracking */
  source?: string;
  /** Gọi API endpoint - mặc định /api/partner/seller-registration */
  apiPath?: string;
  /** Gọi khi user đổi nhóm kinh doanh – dùng để cập nhật hướng dẫn bên cạnh */
  onBusinessGroupChange?: (groupId: BusinessGroupId) => void;
}

export function PartnerRegistrationForm({
  defaultGroup,
  source = 'partner_web',
  apiPath = '/api/partner/seller-registration',
  onBusinessGroupChange,
}: PartnerRegistrationFormProps): JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [businessGroup, setBusinessGroup] = useState<BusinessGroupId>(
    defaultGroup || 'SHOPPING_MALL'
  );

  const subCategories = getSubCategoriesForGroup(businessGroup);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData(e.currentTarget);
      const subCategory = formData.get('subCategory');
      if (!subCategory) {
        setError('Vui lòng chọn ngành kinh doanh chi tiết');
        setLoading(false);
        return;
      }
      const res = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: formData.get('storeName'),
          contactName: formData.get('contactName'),
          contactEmail: formData.get('contactEmail'),
          contactPhone: formData.get('contactPhone'),
          businessGroup,
          subCategory,
          message: formData.get('message'),
          source,
        }),
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
      <div className="rounded-lg border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="font-medium" style={{ color: '#1e3a5f' }}>Đăng ký đã được gửi thành công!</p>
        <p className="mt-2 text-sm" style={{ color: '#4a6b8a' }}>
          Đội ngũ KODO sẽ liên hệ với bạn trong 1-3 ngày làm việc.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nhóm kinh doanh *
        </label>
        <select
          value={businessGroup}
          onChange={(e) => {
            const v = e.target.value as BusinessGroupId;
            setBusinessGroup(v);
            onBusinessGroupChange?.(v);
          }}
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
        >
          {BUSINESS_GROUPS.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label} — {g.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Ngành kinh doanh chi tiết *
        </label>
        <select
          name="subCategory"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
        >
          {subCategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Tên cửa hàng / Thương hiệu *
        </label>
        <input
          name="storeName"
          type="text"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
          placeholder="VD: Luxe Fashion Store"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Người liên hệ *
        </label>
        <input
          name="contactName"
          type="text"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
          placeholder="Họ và tên"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email *
        </label>
        <input
          name="contactEmail"
          type="email"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Số điện thoại *
        </label>
        <input
          name="contactPhone"
          type="tel"
          required
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
          placeholder="0901234567"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Mô tả ngắn về cửa hàng (tùy chọn)
        </label>
        <textarea
          name="message"
          rows={3}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-[#FFB800] focus:outline-none focus:ring-1 focus:ring-[#FFB800]"
          placeholder="Giới thiệu sơ lược về sản phẩm, dịch vụ..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg px-4 py-3 font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: '#FFB800' }}
      >
        {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
      </button>
    </form>
  );
}
