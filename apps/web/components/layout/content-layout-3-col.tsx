/**
 * ContentLayout3Col - Layout 3 cột cho trang nội dung (bài viết, tin tức, pháp lý...)
 * Trái: Đề mục/nav + slide banner 9:16 | Giữa: Nội dung chính | Phải: Cross-sell, banner, CTA
 * Dùng cho news, content, training, phap-ly, the-thao, spotlight, ride-hailing,...
 */

'use client';

import Link from 'next/link';
import { ContentRightSidebar } from './content-right-sidebar';
import { SidebarBannerCarousel } from './sidebar-banner-carousel';
import type { CrossSellLink } from './content-right-sidebar';
import type { SidebarBanner } from '@/lib/config/sidebar-banners';

interface ContentLayout3ColProps {
  children: React.ReactNode;
  /** Cột trái: đề mục (optional - có default) */
  leftNav?: { label: string; href: string }[];
  /** Cột phải - custom hoặc dùng default */
  rightSidebar?: React.ReactNode;
  /** Cross-sell links khi dùng default right sidebar */
  crossSellLinks?: CrossSellLink[];
  /** Slide banner 9:16 cột trái (tối đa 4) */
  leftBanners?: SidebarBanner[];
  /** Slide banner 9:16 cột phải (tối đa 4) */
  rightBanners?: SidebarBanner[];
}

const DEFAULT_LEFT_NAV = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tin tức', href: '/the-thao/tin-tuc' },
  { label: 'KODO Wealth', href: '/wealth' },
  { label: 'Bất động sản', href: '/bat-dong-san' },
  { label: 'Spotlight', href: '/spotlight' },
  { label: 'Cộng đồng', href: '/the-thao' },
  { label: 'Hợp tác', href: '/hop-tac' },
  { label: 'Pháp lý', href: '/phap-ly' },
];

export function ContentLayout3Col({
  children,
  leftNav = DEFAULT_LEFT_NAV,
  rightSidebar,
  crossSellLinks,
  leftBanners,
  rightBanners,
}: ContentLayout3ColProps): JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-7xl">
        {/* Cột trái - Đề mục + slide banner */}
        <aside className="sticky top-16 hidden w-56 shrink-0 self-start border-r border-border bg-muted/30 p-4 lg:block">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Đề mục
          </h3>
          <nav className="flex flex-col gap-0.5" aria-label="Menu">
            {leftNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {leftBanners && leftBanners.length > 0 && (
            <SidebarBannerCarousel banners={leftBanners} className="mt-4" />
          )}
        </aside>

        {/* Cột giữa - Nội dung */}
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">{children}</main>

        {/* Cột phải - Cross-sell + slide banner */}
        <aside className="sticky top-16 hidden w-64 shrink-0 self-start border-l border-border bg-muted/20 p-4 xl:block">
          {rightSidebar ?? (
            <ContentRightSidebar
              title="Khám phá thêm"
              crossSellLinks={crossSellLinks}
              showAppCta
              variant="light"
            />
          )}
          {rightBanners && rightBanners.length > 0 && (
            <SidebarBannerCarousel banners={rightBanners} className="mt-6" />
          )}
        </aside>
      </div>
    </div>
  );
}
