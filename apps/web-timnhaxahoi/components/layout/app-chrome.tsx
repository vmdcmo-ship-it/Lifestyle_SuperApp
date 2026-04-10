'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { clearLandlordAuth, isLandlordLoggedIn, LANDLORD_AUTH_EVENT } from '@/lib/landlord-auth';

/** Sáu trang chính — QUY_HOACH_GIAO_DIEN_VA_IA.md */
const MAIN_NAV = [
  { href: '/phap-ly', label: 'Wiki Pháp lý' },
  { href: '/du-an', label: 'Nhà ở XH' },
  { href: '/timnhatro', label: 'Nhà trọ' },
  { href: '/chuyen-gia', label: 'Chuyên gia' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
] as const;

const SECONDARY_NAV = [
  { href: '/quiz', label: 'Trắc nghiệm' },
  { href: '/video', label: 'Video' },
  { href: '/dashboard', label: 'Kết quả' },
] as const;

export function AppChrome({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [appMode, setAppMode] = useState(false);
  const [landlordIn, setLandlordIn] = useState(false);

  const syncLandlord = useCallback(() => {
    setLandlordIn(isLandlordLoggedIn());
  }, []);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setAppMode(q.get('mode') === 'app');
  }, []);

  useEffect(() => {
    syncLandlord();
    window.addEventListener(LANDLORD_AUTH_EVENT, syncLandlord);
    return () => window.removeEventListener(LANDLORD_AUTH_EVENT, syncLandlord);
  }, [syncLandlord]);

  if (appMode) {
    return <div className="min-h-dvh">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 py-3 md:flex md:items-center md:justify-between md:py-2">
          <div className="flex h-11 items-center justify-between md:h-14 md:justify-start">
            <Link href="/" className="bg-brand-gradient bg-clip-text text-lg font-semibold text-transparent">
              timnhaxahoi.com
            </Link>
          </div>
          <nav
            className="mt-3 flex max-w-[100vw] flex-col gap-2 pb-1 md:mt-0 md:flex-row md:flex-wrap md:items-center md:justify-end md:gap-x-1 md:gap-y-2 md:pb-0"
            aria-label="Điều hướng chính"
          >
            <div className="flex flex-wrap justify-end gap-x-3 gap-y-2 text-sm font-medium text-slate-700">
              {MAIN_NAV.map((item) => (
                <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-brand-navy">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="hidden h-4 w-px shrink-0 bg-slate-200 md:mx-1 md:block" aria-hidden />
            <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-slate-500 md:text-sm">
              {SECONDARY_NAV.map((item) => (
                <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-brand-navy">
                  {item.label}
                </Link>
              ))}
            </div>
            <span className="hidden text-slate-300 md:mx-1 md:inline" aria-hidden>
              |
            </span>
            <div className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-slate-600 md:text-sm">
              {landlordIn ? (
                <>
                  <Link href="/timnhatro/tin-cua-toi" className="whitespace-nowrap hover:text-brand-navy">
                    Tin của tôi
                  </Link>
                  <Link href="/timnhatro/dang-tin" className="whitespace-nowrap hover:text-brand-navy">
                    Đăng tin
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      clearLandlordAuth();
                      syncLandlord();
                      router.refresh();
                    }}
                    className="whitespace-nowrap hover:text-brand-navy"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link href="/timnhatro/dang-nhap" className="whitespace-nowrap hover:text-brand-navy">
                    Đăng nhập
                  </Link>
                  <Link href="/timnhatro/dang-ky" className="whitespace-nowrap hover:text-brand-navy">
                    Đăng ký chủ trọ
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} timnhaxahoi.com — Thông tin mang tính tham khảo; tư vấn viên sẽ xác nhận chi tiết.
        </p>
        <p className="mt-2">
          <Link href="/mien-tru-trach-nhiem" className="font-medium text-slate-600 hover:text-brand-navy hover:underline">
            Miễn trừ trách nhiệm và điều khoản sử dụng
          </Link>
        </p>
      </footer>
    </div>
  );
}
