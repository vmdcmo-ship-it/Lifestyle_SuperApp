/**
 * SectionSidebarLayout - Layout 3 cột: trái (nav) | giữa (content) | phải (banner/cross-sell)
 * Trái: đề mục section + slide banner 9:16 | Giữa: nội dung chính | Phải: banner nhỏ, cross-selling
 * Responsive: sidebar trái drawer trên mobile, cột phải ẩn trên tablet
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SidebarBannerCarousel } from './sidebar-banner-carousel';
import type { SidebarBanner } from '@/lib/config/sidebar-banners';

export interface SectionNavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
}

interface SectionSidebarLayoutProps {
  /** Tiêu đề section (vd: KODO Wealth) */
  title: string;
  /** Icon/logo - có thể là emoji hoặc component */
  icon?: React.ReactNode;
  /** Danh sách nav item */
  navItems: SectionNavItem[];
  /** Nội dung chính */
  children: React.ReactNode;
  /** Cột phải: banner, cross-sell links (optional) */
  rightSidebar?: React.ReactNode;
  /** Slide banner 9:16 cột trái (tối đa 4) */
  leftBanners?: SidebarBanner[];
  /** Slide banner 9:16 cột phải (tối đa 4) */
  rightBanners?: SidebarBanner[];
}

export function SectionSidebarLayout({
  title,
  icon,
  navItems,
  children,
  rightSidebar,
  leftBanners,
  rightBanners,
}: SectionSidebarLayoutProps): JSX.Element {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string): boolean => {
    if (pathname === href) return true;
    // Trang con: active khi path bắt đầu bằng href (vd: /wealth/knowledge khi href=/wealth)
    if (pathname.startsWith(href + '/')) return true;
    return false;
  };

  const isSectionRoot = (href: string): boolean => {
    const parts = href.split('/').filter(Boolean);
    return parts.length <= 1;
  };

  const isParentActive = (item: SectionNavItem): boolean => {
    if (isSectionRoot(item.href)) {
      return pathname === item.href;
    }
    return (
      isActive(item.href) || (item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href + '/')) ?? false)
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6]">
      {/* Mobile: Nút mở sidebar */}
      <div className="sticky top-16 z-40 flex items-center gap-3 border-b border-amber-200/50 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 rounded-lg p-2 text-[#0D1B2A] transition-colors hover:bg-amber-100/60"
          aria-label="Mở menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-semibold">{title}</span>
        </button>
      </div>

      {/* Overlay mobile khi sidebar mở */}
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Đóng menu"
        />
      )}

      <div className="mx-auto max-w-7xl lg:flex">
      {/* Sidebar dọc - Desktop: luôn hiện, Mobile: drawer */}
      <aside
        className={`
          fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 shrink-0 transform border-r border-amber-200/50 bg-white shadow-lg transition-transform duration-200
          lg:relative lg:top-0 lg:z-0 lg:translate-x-0 lg:border-r
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-full flex-col p-4">
          <div className="mb-4 flex items-center justify-between">
            <Link
              href={navItems[0]?.href ?? '#'}
              className="flex items-center gap-2 font-semibold text-[#0D1B2A]"
            >
              {icon ?? (
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#D4AF37] to-amber-600 text-white">
                  K
                </span>
              )}
              <span>{title}</span>
            </Link>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="rounded p-2 text-[#0D1B2A] hover:bg-amber-100/60 lg:hidden"
              aria-label="Đóng menu"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex-1 space-y-1" aria-label={`${title} menu`}>
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isParentActive(item)
                      ? 'bg-amber-100/80 text-[#0D1B2A]'
                      : 'text-[#0D1B2A]/80 hover:bg-amber-50/80 hover:text-[#0D1B2A]'
                  }`}
                >
                  {item.label}
                </Link>
                {item.children && item.children.length > 0 && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l-2 border-amber-200/50 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`block rounded px-3 py-2 text-xs transition-colors ${
                          pathname === child.href
                            ? 'font-medium text-amber-700'
                            : 'text-[#0D1B2A]/70 hover:text-[#0D1B2A]'
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          {leftBanners && leftBanners.length > 0 && (
            <SidebarBannerCarousel banners={leftBanners} className="mt-4" />
          )}
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="min-w-0 flex-1 px-4 py-6 lg:px-6">{children}</main>

      {/* Cột phải - banner, cross-sell (ẩn trên mobile/tablet) */}
      {(rightSidebar || (rightBanners && rightBanners.length > 0)) && (
        <aside className="sticky top-16 hidden w-64 shrink-0 self-start border-l border-amber-200/50 bg-white/80 p-4 xl:block">
          {rightSidebar}
          {rightBanners && rightBanners.length > 0 && (
            <SidebarBannerCarousel banners={rightBanners} className="mt-6" />
          )}
        </aside>
      )}
      </div>
    </div>
  );
}
