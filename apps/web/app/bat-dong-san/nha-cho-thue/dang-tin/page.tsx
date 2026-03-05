/**
 * Đăng tin cho thuê - Form chủ nhà / môi giới đăng tin
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

const PROPERTY_TYPES = [
  'Phòng trọ',
  'Căn hộ chung cư',
  'Nhà nguyên căn',
  'Nhà mặt phố',
  'Căn hộ mini',
  'Khác',
];

export default function DangTinPage(): JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    type: 'owner' as 'owner' | 'agent',
    title: '',
    propertyType: '',
    location: '',
    price: '',
    area: '',
    description: '',
    contactNote: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bat-dong-san/rental-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || undefined,
          type: form.type,
          title: form.title,
          propertyType: form.propertyType,
          location: form.location,
          price: form.price ? Number(form.price) : undefined,
          area: form.area ? Number(form.area) : undefined,
          description: form.description,
          contactNote: form.contactNote || undefined,
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
      <div className="min-h-screen">
        <section className="mb-12 rounded-2xl border border-green-200 bg-green-50 p-8">
          <h2 className="mb-4 text-xl font-semibold text-green-800">Đăng tin thành công</h2>
          <p className="text-muted-foreground">
            Tin của bạn đã được gửi. Đội ngũ sẽ xem xét và liên hệ trong thời gian sớm nhất. Tin đăng sẽ hiển thị sau khi được duyệt.
          </p>
        </section>
        <Link href="/bat-dong-san/nha-cho-thue" className="font-medium text-amber-600 hover:underline">
          ← Về Nhà cho thuê
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="mb-12">
        <h1 className="font-heading mb-4 text-3xl font-bold">Đăng tin cho thuê</h1>
        <p className="text-muted-foreground">
          Điền thông tin bất động sản cho thuê. Chủ nhà và môi giới đều có thể đăng tin.
        </p>
      </section>

      <section className="rounded-xl border bg-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <p className="mb-3 font-medium">Bạn đăng tin với tư cách</p>
            <div className="flex gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="owner"
                  checked={form.type === 'owner'}
                  onChange={() => setForm((f) => ({ ...f, type: 'owner' }))}
                />
                Chủ nhà
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="type"
                  value="agent"
                  checked={form.type === 'agent'}
                  onChange={() => setForm((f) => ({ ...f, type: 'agent' }))}
                />
                Môi giới
              </label>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Họ tên *</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium">Số điện thoại *</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="0900 000 000"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Tiêu đề tin *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="VD: Cho thuê phòng trọ Quận 1, giá rẻ"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Loại bất động sản *</label>
              <select
                required
                value={form.propertyType}
                onChange={(e) => setForm((f) => ({ ...f, propertyType: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option value="">-- Chọn --</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block font-medium">Khu vực *</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="VD: Quận 1, TP.HCM"
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Giá thuê (triệu/tháng)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="VD: 5"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium">Diện tích (m²)</label>
              <input
                type="number"
                min={0}
                value={form.area}
                onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                className="w-full rounded-lg border px-4 py-3"
                placeholder="VD: 25"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Mô tả chi tiết *</label>
            <textarea
              required
              rows={5}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Mô tả bất động sản: vị trí, tiện ích, giá..."
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Ghi chú liên hệ</label>
            <input
              type="text"
              value={form.contactNote}
              onChange={(e) => setForm((f) => ({ ...f, contactNote: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Giờ liên hệ, ưu tiên gọi điện..."
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-70"
          >
            {loading ? 'Đang gửi...' : 'Đăng tin'}
          </button>
        </form>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/bat-dong-san/nha-cho-thue" className="font-medium text-amber-600 hover:underline">
          ← Về Nhà cho thuê
        </Link>
      </p>
    </div>
  );
}
