/**
 * Tìm bất động sản - Khách hàng để lại nhu cầu mua/thuê
 * Nền tảng cung cấp và giới thiệu sản phẩm theo yêu cầu
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BdsBreadcrumb } from '../_components/bds-breadcrumb';

export default function TimBatDongSanPage(): JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    type: '' as '' | 'mua' | 'thue' | 'ca-hai',
    location: '',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    if (!form.type) {
      setError('Vui lòng chọn nhu cầu');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/bat-dong-san/find-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          phone: form.phone,
          email: form.email || undefined,
          type: form.type,
          location: form.location || undefined,
          note: form.note || undefined,
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
        <BdsBreadcrumb items={[{ label: 'Tìm bất động sản', href: '/bat-dong-san/tim-bat-dong-san' }]} />
        <section className="mb-12 rounded-2xl border border-green-200 bg-green-50 p-8">
          <h2 className="mb-4 text-xl font-semibold text-green-800">Đã gửi yêu cầu thành công</h2>
          <p className="text-muted-foreground">
            Chúng tôi đã nhận thông tin của bạn. Chuyên viên sẽ liên hệ tư vấn và giới thiệu bất động sản phù hợp trong thời gian sớm nhất.
          </p>
        </section>
        <Link href="/bat-dong-san" className="font-medium text-amber-600 hover:underline">
          ← Về Bất động sản
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <BdsBreadcrumb items={[{ label: 'Tìm bất động sản', href: '/bat-dong-san/tim-bat-dong-san' }]} />
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-800 to-orange-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Tìm bất động sản</h1>
          <p className="max-w-2xl text-amber-100">
            Bạn có nhu cầu mua hoặc thuê bất động sản? Để lại thông tin và yêu cầu. Nền tảng sẽ cung cấp và giới thiệu sản phẩm phù hợp theo nhu cầu của bạn.
          </p>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block font-medium">Họ tên *</label>
            <input
              id="name"
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label htmlFor="phone" className="mb-2 block font-medium">Số điện thoại *</label>
            <input
              id="phone"
              type="tel"
              required
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="0900 000 000"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-2 block font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label htmlFor="type" className="mb-2 block font-medium">Nhu cầu *</label>
            <select
              id="type"
              required
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'mua' | 'thue' | 'ca-hai' }))}
              className="w-full rounded-lg border px-4 py-3"
            >
              <option value="">-- Chọn --</option>
              <option value="mua">Mua nhà/chung cư</option>
              <option value="thue">Thuê nhà/phòng trọ</option>
              <option value="ca-hai">Cả mua và thuê</option>
            </select>
          </div>
          <div>
            <label htmlFor="location" className="mb-2 block font-medium">Khu vực quan tâm</label>
            <input
              id="location"
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="VD: Quận 1 TP.HCM, Quận 7, Bình Thạnh..."
            />
          </div>
          <div>
            <label htmlFor="note" className="mb-2 block font-medium">Yêu cầu chi tiết</label>
            <textarea
              id="note"
              rows={4}
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Mô tả nhu cầu: diện tích, giá, tiện ích..."
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-amber-600 px-8 py-3 font-semibold text-white transition-all hover:bg-amber-700 disabled:opacity-70"
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/bat-dong-san" className="font-medium text-amber-600 hover:underline">
          ← Về Bất động sản
        </Link>
      </p>
    </div>
  );
}
