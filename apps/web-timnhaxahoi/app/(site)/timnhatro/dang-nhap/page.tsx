'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { type FormEvent, Suspense, useEffect, useState } from 'react';
import { LandlordDisclaimer } from '@/components/timnhatro/landlord-disclaimer';
import { landlordLogin } from '@/lib/landlord-api';
import { isLandlordLoggedIn } from '@/lib/landlord-auth';

function TimnhatroDangNhapInner(): JSX.Element {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get('next') ?? '/timnhatro/tin-cua-toi';
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLandlordLoggedIn()) {
      router.replace(next.startsWith('/') ? next : '/timnhatro/tin-cua-toi');
    }
  }, [router, next]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await landlordLogin({ identifier: identifier.trim(), password });
      router.push(next.startsWith('/') ? next : '/timnhatro/tin-cua-toi');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">Đăng nhập chủ trọ</h1>
      <p className="mt-2 text-sm text-slate-600">
        Quản lý tin cho thuê trên timnhaxahoi.com. Chưa có tài khoản?{' '}
        <Link href="/timnhatro/dang-ky" className="font-medium text-[#1e3a8a] hover:underline">
          Đăng ký
        </Link>
      </p>

      <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Email hoặc số điện thoại</label>
          <input
            type="text"
            autoComplete="username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 shadow-sm focus:border-[#1e3a8a] focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
          <input
            type="password"
            autoComplete="current-password"
            required
            minLength={8}
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
          {loading ? 'Đang xử lý…' : 'Đăng nhập'}
        </button>
      </form>

      <div className="mt-8">
        <LandlordDisclaimer />
      </div>
    </div>
  );
}

export default function TimnhatroDangNhapPage(): JSX.Element {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-10 text-center text-slate-600">Đang tải…</div>
      }
    >
      <TimnhatroDangNhapInner />
    </Suspense>
  );
}
