'use client';

import { useState } from 'react';

export function WealthConsultingForm(): JSX.Element {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/wealth/consulting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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
      <div className="py-8 text-center">
        <div className="mb-4 text-5xl">✓</div>
        <h3 className="mb-2 text-xl font-semibold text-[#0D1B2A]">
          Đăng ký thành công!
        </h3>
        <p className="text-muted-foreground">
          Chuyên gia sẽ liên hệ với bạn trong 24-48 giờ. Bạn cũng có thể tải bản kế hoạch mẫu qua email.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-[#0D1B2A]">
          Họ và tên *
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          placeholder="Nguyễn Văn A"
        />
      </div>
      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#0D1B2A]">
          Số điện thoại *
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          placeholder="0901234567"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#0D1B2A]">
          Email *
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          placeholder="email@example.com"
        />
      </div>
      <div>
        <label htmlFor="note" className="mb-2 block text-sm font-medium text-[#0D1B2A]">
          Nhu cầu tư vấn (tùy chọn)
        </label>
        <textarea
          id="note"
          rows={3}
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          className="w-full rounded-lg border border-amber-200 px-4 py-2 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          placeholder="Ví dụ: Tư vấn bảo hiểm nhân thọ, kế hoạch nghỉ hưu..."
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#D4AF37] px-4 py-3 font-semibold text-[#0D1B2A] transition-all hover:bg-amber-500 disabled:opacity-70"
      >
        {loading ? 'Đang gửi...' : 'Gửi đăng ký'}
      </button>
    </form>
  );
}
