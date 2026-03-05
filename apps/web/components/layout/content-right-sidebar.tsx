/**
 * ContentRightSidebar - Cột phải cho cross-selling, banner quảng bá
 * Dùng cho layout 3 cột: trái (nav) | giữa (content) | phải (sidebar)
 * Tối ưu SEO: internal links, CTA
 */

'use client';

import Link from 'next/link';

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || '#';
const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#';

export interface CrossSellLink {
  label: string;
  href: string;
  description?: string;
}

interface ContentRightSidebarProps {
  /** Tiêu đề section */
  title?: string;
  /** Danh sách link cross-sell - quảng bá trang/dịch vụ khác */
  crossSellLinks?: CrossSellLink[];
  /** Có hiển thị CTA tải app */
  showAppCta?: boolean;
  /** Theme: light (mặc định) hoặc dark */
  variant?: 'light' | 'dark';
}

const DEFAULT_CROSS_SELL: CrossSellLink[] = [
  { label: 'Trang chủ', href: '/' },
  { label: 'KODO Wealth', href: '/wealth', description: 'Tài chính & Bảo hiểm' },
  { label: 'Bất động sản', href: '/bat-dong-san', description: 'Tin tức, dự án BDS' },
  { label: 'Spotlight', href: '/spotlight', description: 'Video du lịch & phong cách' },
  { label: 'Cộng đồng', href: '/the-thao', description: 'Thể thao & Run to Earn' },
  { label: 'Hợp tác', href: '/hop-tac', description: 'Thuê mua VinFast' },
  { label: 'Đặt xe', href: '/ride-hailing', description: 'Gọi xe nhanh' },
];

export function ContentRightSidebar({
  title = 'Khám phá thêm',
  crossSellLinks = DEFAULT_CROSS_SELL,
  showAppCta = true,
  variant = 'light',
}: ContentRightSidebarProps): JSX.Element {
  const isDark = variant === 'dark';
  const cardClass = isDark
    ? 'rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-slate-200'
    : 'rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm';
  const linkClass = isDark
    ? 'block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white'
    : 'block rounded-lg px-3 py-2 text-sm font-medium text-[#0D1B2A]/80 transition-colors hover:bg-amber-50 hover:text-[#0D1B2A]';
  const headingClass = isDark
    ? 'mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400'
    : 'mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground';

  return (
    <aside className="flex w-full flex-col gap-6">
      {/* Banner / CTA nhỏ */}
      {showAppCta && (
        <div className={cardClass}>
          <h3 className={headingClass}>Tải ứng dụng</h3>
          <div className="flex flex-col gap-2">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700"
            >
              App Store
            </a>
            <a
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700"
            >
              Google Play
            </a>
          </div>
        </div>
      )}

      {/* Cross-sell links */}
      <div className={cardClass}>
        <h3 className={headingClass}>{title}</h3>
        <nav className="flex flex-col gap-0.5" aria-label="Liên kết liên quan">
          {crossSellLinks.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
