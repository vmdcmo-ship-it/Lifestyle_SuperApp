'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/contexts/auth-context';
import { useXuBalance } from '@/lib/hooks/use-xu-balance';
import { NotificationDropdown } from './notification-dropdown';

export function Header(): JSX.Element {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const userCoins = useXuBalance(isAuthenticated);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
            <span className="text-xl font-bold text-white">L</span>
          </div>
          <span className="text-xl font-bold">Lifestyle</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/spotlight"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Spotlight
          </Link>
          {isAuthenticated && (
            <>
              <Link
                href="/spotlight/saved"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Đã lưu
              </Link>
              <Link
                href="/notifications"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Thông báo
              </Link>
            </>
          )}
          <Link
            href="/food-delivery"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Giao đồ ăn
          </Link>
          <Link
            href="/ride-hailing"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Đặt xe
          </Link>
          <Link
            href="/shopping"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Mua sắm
          </Link>
          <Link
            href="/wallet"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Ví Lifestyle
          </Link>
          <Link
            href="/savings-packages"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Gói Tiết Kiệm
          </Link>
          <Link
            href="/referral"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            👥 Giới thiệu
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Về chúng tôi
          </Link>
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
                className="group hidden items-center gap-2 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-1.5 transition-all hover:shadow-md hover:scale-105 dark:border-amber-800 dark:from-amber-950 dark:to-yellow-950 sm:flex"
                title="Lifestyle Xu của bạn"
              >
                <CoinIcon />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {userCoins.toLocaleString('vi-VN')} Xu
                </span>
              </Link>

              {/* User Avatar */}
              <Link
                href="/profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-semibold text-white ring-2 ring-purple-200 transition-all hover:ring-4 dark:ring-purple-800"
                title="Tài khoản của bạn"
              >
                {user?.firstName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
              >
                Đăng nhập
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105 active:scale-95"
              >
                Đăng ký ngay
              </Link>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container mx-auto flex flex-col space-y-3 px-4 py-4">
            <Link
              href="/spotlight"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              Spotlight
            </Link>
            {isAuthenticated && (
              <Link
                href="/spotlight/saved"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={toggleMobileMenu}
              >
                Đã lưu
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/notifications"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={toggleMobileMenu}
              >
                Thông báo
              </Link>
            )}
            {isAuthenticated && (
              <Link
                href="/profile/my-coins"
                className="flex items-center gap-2 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2 transition-all hover:shadow-md dark:border-amber-800 dark:from-amber-950 dark:to-yellow-950"
                onClick={toggleMobileMenu}
              >
                <CoinIcon />
                <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                  {userCoins.toLocaleString('vi-VN')} Xu
                </span>
              </Link>
            )}

            <Link
              href="/food-delivery"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              Giao đồ ăn
            </Link>
            <Link
              href="/ride-hailing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              Đặt xe
            </Link>
            <Link
              href="/shopping"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              Mua sắm
            </Link>
            <Link
              href="/wallet"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              Ví Lifestyle
            </Link>
            <Link
              href="/savings-packages"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              Gói Tiết Kiệm
            </Link>
            <Link
              href="/referral"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              👥 Giới thiệu
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={toggleMobileMenu}
            >
              Về chúng tôi
            </Link>
            <div className="border-t pt-3">
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  className="block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={toggleMobileMenu}
                >
                  Tài khoản
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="block text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={toggleMobileMenu}
                >
                  Đăng nhập
                </Link>
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
    <svg
      className="h-5 w-5 text-amber-500 transition-transform group-hover:rotate-12"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" className="fill-amber-400" />
      <circle cx="12" cy="12" r="8" className="fill-amber-500" />
      <path
        d="M12 6v12M8 9h8M8 15h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="stroke-amber-600"
      />
      <circle cx="12" cy="12" r="10" className="fill-none stroke-amber-600" strokeWidth="1.5" />
    </svg>
  );
}
