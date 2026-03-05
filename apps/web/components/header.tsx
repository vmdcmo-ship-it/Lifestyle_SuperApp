'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { KodoLogo } from '@/components/kodo-logo';
import { useXuBalance } from '@/lib/hooks/use-xu-balance';
import { NotificationDropdown } from './notification-dropdown';

const NAV_DICH_VU = [
  { label: 'Gọi xe', href: '/ride-hailing' },
  { label: 'Lái hộ', href: '/ride-hailing?service=driver' },
  { label: 'Giao đồ ăn', href: '/food-delivery' },
  { label: 'Mua sắm', href: '/shopping' },
  { label: 'Ví Lifestyle', href: '/wallet' },
  { label: 'Gói Tiết Kiệm', href: '/savings-packages' },
  { label: 'Giới thiệu bạn bè', href: '/referral' },
];

/** Cộng đồng dropdown: Thể thao, tin tức, KODO Wealth, An Cư (đổi "Cộng đồng" → "Thể Thao & Tin tức") */
const NAV_CONG_DONG = [
  { label: 'Thể Thao & Tin tức', href: '/the-thao' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Bất động sản', href: '/bat-dong-san' },
];

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { label: string; href: string }[];
}): JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="brand-text flex items-center gap-1 text-sm font-medium transition-colors hover:opacity-80"
      >
        {label}
        <svg
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border bg-background py-2 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Header(): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const userCoins = useXuBalance(isAuthenticated);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="brand-header sticky top-0 z-50 w-full border-b shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo KODO */}
        <KodoLogo size="sm" withWordmark className="brand-text" />

        {/* Desktop Navigation - Text xanh than */}
        <nav className="brand-text hidden items-center gap-4 md:flex">
          <NavDropdown label="Dịch vụ" items={NAV_DICH_VU} />
          <Link
            href="/spotlight"
            className="brand-text text-sm font-medium transition-colors hover:opacity-80"
          >
            Spotlight
          </Link>
          <Link
            href="/shopping-mall"
            className="brand-text text-sm font-medium transition-colors hover:opacity-80"
          >
            Shopping Mall
          </Link>
          <NavDropdown label="Cộng đồng" items={NAV_CONG_DONG} />
          <Link
            href="/hop-tac"
            className="brand-text text-sm font-medium transition-colors hover:opacity-80"
          >
            Hợp tác
          </Link>
          <Link
            href="/tai-ung-dung"
            className="brand-text text-sm font-medium transition-colors hover:opacity-80"
          >
            Tải ứng dụng
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/spotlight/saved"
                className="brand-text text-sm font-medium transition-colors hover:opacity-80"
              >
                Đã lưu
              </Link>
              <Link
                href="/notifications"
                className="brand-text text-sm font-medium transition-colors hover:opacity-80"
              >
                Thông báo
              </Link>
            </>
          )}
        </nav>

        {/* CTA Buttons & User Section */}
        <div className="flex items-center gap-3">
          {!isLoading && isAuthenticated ? (
            <>
              {/* Notifications (Phase 2.4) */}
              <NotificationDropdown />

              {/* Lifestyle Xu Widget */}
              <Link
                href="/profile/my-coins"
                className="group hidden items-center gap-2 rounded-lg border px-3 py-1.5 transition-all hover:shadow-md hover:scale-105 sm:flex"
                style={{ borderColor: 'rgba(30,58,95,0.4)', backgroundColor: 'rgba(255,255,255,0.4)' }}
                title="Lifestyle Xu của bạn"
              >
                <CoinIcon />
                <span className="brand-text text-sm font-bold">
                  {userCoins.toLocaleString('vi-VN')} Xu
                </span>
              </Link>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ring-2 transition-all hover:ring-4"
                style={{ backgroundColor: '#FFB800' }}
                title="Tài khoản của bạn"
              >
                {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="brand-text hidden text-sm font-medium transition-colors hover:opacity-80 sm:inline-block"
              >
                Đăng nhập
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:scale-105 active:scale-95"
                style={{ backgroundColor: '#1e3a5f' }}
              >
                Đăng ký ngay
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
<button
        type="button"
        className="brand-text inline-flex items-center justify-center rounded-md p-2 transition-colors hover:opacity-80 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu - nền vàng, text xanh than */}
      {isMobileMenuOpen && (
        <div className="brand-text border-t md:hidden" style={{ borderColor: 'rgba(255,183,0,0.5)', backgroundColor: '#FFE066' }}>
          <nav className="container mx-auto flex flex-col space-y-4 px-4 py-4">
            {isAuthenticated && (
              <Link href="/spotlight/saved" className="brand-text text-sm font-medium transition-colors hover:opacity-80" onClick={toggleMobileMenu}>
                Đã lưu
              </Link>
            )}
            {isAuthenticated && (
              <Link href="/notifications" className="brand-text text-sm font-medium transition-colors hover:opacity-80" onClick={toggleMobileMenu}>
                Thông báo
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/profile/my-coins"
                className="brand-text flex items-center gap-2 rounded-lg border px-3 py-2 transition-all hover:shadow-md"
                style={{ borderColor: 'rgba(30,58,95,0.4)' }}
                onClick={toggleMobileMenu}
              >
                <CoinIcon />
                <span className="text-sm font-bold">{userCoins.toLocaleString('vi-VN')} Xu</span>
              </Link>
            )}

            <div>
              <p className="brand-text mb-2 text-xs font-semibold uppercase">Dịch vụ</p>
              <div className="flex flex-wrap gap-2">
                {NAV_DICH_VU.map((item) => (
                  <Link key={item.href} href={item.href} className="brand-text rounded border px-3 py-1.5 text-sm transition-colors hover:opacity-80" style={{ borderColor: 'rgba(30,58,95,0.3)' }} onClick={toggleMobileMenu}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/spotlight" className="brand-text text-sm font-medium" onClick={toggleMobileMenu}>Spotlight</Link>
            <Link href="/shopping-mall" className="brand-text text-sm font-medium" onClick={toggleMobileMenu}>Shopping Mall</Link>
            <div>
              <p className="brand-text mb-2 text-xs font-semibold uppercase">Cộng đồng</p>
              <div className="flex flex-wrap gap-2">
                {NAV_CONG_DONG.map((item) => (
                  <Link key={item.href} href={item.href} className="brand-text rounded border px-3 py-1.5 text-sm transition-colors hover:opacity-80" style={{ borderColor: 'rgba(30,58,95,0.3)' }} onClick={toggleMobileMenu}>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/hop-tac" className="brand-text text-sm font-medium" onClick={toggleMobileMenu}>Hợp tác</Link>
            <Link href="/tai-ung-dung" className="brand-text text-sm font-medium" onClick={toggleMobileMenu}>Tải ứng dụng</Link>
            <div className="border-t pt-3" style={{ borderColor: 'rgba(30,58,95,0.3)' }}>
              {isAuthenticated ? (
                <Link href="/profile" className="brand-text block text-sm font-medium transition-colors hover:opacity-80" onClick={toggleMobileMenu}>Tài khoản</Link>
              ) : (
                <Link href="/login" className="brand-text block text-sm font-medium transition-colors hover:opacity-80" onClick={toggleMobileMenu}>Đăng nhập</Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

/**
 * Coin Icon Component
 * Animated golden coin icon for Lifestyle Xu
 */
function CoinIcon(): JSX.Element {
  return (
    <svg className="h-5 w-5 transition-transform group-hover:rotate-12" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ color: '#FFB800' }}>
      <circle cx="12" cy="12" r="10" fill="currentColor" fillOpacity={0.6} />
      <circle cx="12" cy="12" r="8" fill="currentColor" />
      <path d="M12 6v12M8 9h8M8 15h8" stroke="#1e3a5f" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="#1e3a5f" strokeWidth="1.5" />
    </svg>
  );
}
