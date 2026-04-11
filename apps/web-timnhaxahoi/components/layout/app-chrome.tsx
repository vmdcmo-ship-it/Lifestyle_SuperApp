'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { SiteBrand } from '@/components/layout/site-brand';
import { clearLandlordAuth, isLandlordLoggedIn, LANDLORD_AUTH_EVENT } from '@/lib/landlord-auth';

/** Điều hướng chính (6 mục) */
const MAIN_NAV = [
  { href: '/phap-ly', label: 'Wiki Pháp lý' },
  { href: '/du-an', label: 'Nhà ở XH' },
  { href: '/timnhatro', label: 'Nhà trọ' },
  { href: '/chuyen-gia', label: 'Chuyên gia' },
  { href: '/tin-tuc', label: 'Tin tức' },
  { href: '/gioi-thieu', label: 'Giới thiệu' },
] as const;

/** Trắc nghiệm, video, kết quả — gom trong menu phụ */
const MORE_NAV = [
  { href: '/quiz', label: 'Trắc nghiệm' },
  { href: '/video', label: 'Video' },
  { href: '/dashboard', label: 'Kết quả' },
] as const;

function navDropdownClass(isOpen: boolean): string {
  return [
    'absolute right-0 z-50 mt-1 min-w-[11rem] rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
    isOpen ? 'block' : 'hidden',
  ].join(' ');
}

export function AppChrome({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [appMode, setAppMode] = useState(false);
  const [landlordIn, setLandlordIn] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [landlordOpen, setLandlordOpen] = useState(false);

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
        <div className="mx-auto max-w-6xl px-4 py-3 md:flex md:items-center md:justify-between md:gap-4 md:py-2">
          <div className="flex min-h-11 shrink-0 items-center md:min-h-14">
            <SiteBrand />
          </div>
          <nav
            className="mt-3 flex max-w-[100vw] flex-col gap-3 md:mt-0 md:min-w-0 md:flex-1 md:flex-row md:items-center md:justify-end md:gap-3 md:pb-0"
            aria-label="Điều hướng chính"
          >
            {/* Sáu mục điều hướng chính */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-slate-700 md:flex-nowrap md:overflow-x-auto md:py-0.5 [&::-webkit-scrollbar]:h-1">
              {MAIN_NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 whitespace-nowrap hover:text-brand-navy"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-2 md:border-t-0 md:pt-0">
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  aria-controls="nav-more-menu"
                  onClick={() => {
                    setMoreOpen((v) => !v);
                    setLandlordOpen(false);
                  }}
                  className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                >
                  Thêm ▾
                </button>
                <div
                  id="nav-more-menu"
                  role="menu"
                  className={navDropdownClass(moreOpen)}
                >
                  {MORE_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
                      onClick={() => setMoreOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={landlordOpen}
                  aria-haspopup="true"
                  aria-controls="nav-landlord-menu"
                  onClick={() => {
                    setLandlordOpen((v) => !v);
                    setMoreOpen(false);
                  }}
                  className="rounded-md bg-brand-navy px-3 py-1.5 text-sm font-medium text-white hover:opacity-95"
                >
                  Chủ trọ ▾
                </button>
                <div
                  id="nav-landlord-menu"
                  role="menu"
                  className={navDropdownClass(landlordOpen)}
                >
                  {landlordIn ? (
                    <>
                      <Link
                        href="/timnhatro/tin-cua-toi"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
                        onClick={() => setLandlordOpen(false)}
                      >
                        Tin của tôi
                      </Link>
                      <Link
                        href="/timnhatro/dang-tin"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
                        onClick={() => setLandlordOpen(false)}
                      >
                        Đăng tin
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
                        onClick={() => {
                          clearLandlordAuth();
                          syncLandlord();
                          setLandlordOpen(false);
                          router.refresh();
                        }}
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/timnhatro/dang-nhap"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
                        onClick={() => setLandlordOpen(false)}
                      >
                        Đăng nhập
                      </Link>
                      <Link
                        href="/timnhatro/dang-ky"
                        role="menuitem"
                        className="block px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-navy"
                        onClick={() => setLandlordOpen(false)}
                      >
                        Đăng ký chủ trọ
                      </Link>
                    </>
                  )}
                </div>
              </div>
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
