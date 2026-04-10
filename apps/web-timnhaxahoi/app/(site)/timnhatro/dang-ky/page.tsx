'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { LandlordDisclaimer } from '@/components/timnhatro/landlord-disclaimer';
import { landlordRegister } from '@/lib/landlord-api';
import { isLandlordLoggedIn } from '@/lib/landlord-auth';

export default function TimnhatroDangKyPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLandlordLoggedIn()) {
      router.replace('/timnhatro/tin-cua-toi');
    }
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await landlordRegister({
        email: email.trim(),
        phone: phone.replace(/\s/g, ''),
        password,
        fullName: fullName.trim() || undefined,
      });
      router.push('/timnhatro/tin-cua-toi');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Đăng ký chủ trọ</h1>
      <p className="mt-2 text-sm text-slate-600">
        Đã có tài khoản?{' '}
        <Link href="/timnhatro/dang-nhap" className="font-medium text-[#1e3a8a] hover:underline">
          Đăng nhập
        </Link>
      </p>

      <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Số điện thoại</label>
          <input
            type="tel"
            required
            pattern="[0-9+\s]{8,20}"
            title="8–20 ký tự số, + hoặc khoảng trắng"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Họ tên (tuỳ chọn)</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Mật khẩu (tối thiểu 8 ký tự)</label>
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#1e3a8a] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#172554] disabled:opacity-60"
        >
          {loading ? 'Đang xử lý…' : 'Đăng ký'}
        </button>
      </form>

      <div className="mt-8">
        <LandlordDisclaimer />
      </div>
    </div>
  );
}
