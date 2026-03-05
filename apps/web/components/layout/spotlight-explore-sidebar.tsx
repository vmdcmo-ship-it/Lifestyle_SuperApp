/**
 * SpotlightExploreSidebar - Cột phải "Khám phá thêm" cho trang Spotlight
 * Cấu trúc: Trang chủ (tiêu đề + icon Home), nhóm con (KODO Wealth, Cộng đồng), v.v.
 */

'use client';

import Link from 'next/link';
import {
  SPOTLIGHT_EXPLORE_LINKS,
  type ExploreLink,
} from '@/lib/config/spotlight-explore-links';

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || '#';
const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#';

function HomeIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function renderItem(item: ExploreLink, variant: 'light' | 'dark'): JSX.Element {
  const isDark = variant === 'dark';
  const linkClass = isDark
    ? 'block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700/50 hover:text-white'
    : 'block rounded-lg px-3 py-2 text-sm font-medium text-[#0D1B2A]/80 transition-colors hover:bg-amber-50 hover:text-[#0D1B2A]';
  const childClass = isDark
    ? 'block rounded-lg px-3 py-1.5 pl-6 text-xs text-slate-400 transition-colors hover:bg-slate-700/50 hover:text-white'
    : 'block rounded-lg px-3 py-1.5 pl-6 text-xs text-muted-foreground transition-colors hover:bg-amber-50 hover:text-[#0D1B2A]';

  if (item.icon === 'home') {
    return (
      <Link
        href={item.href}
        className={`mb-2 flex items-center gap-2 font-semibold ${linkClass}`}
        aria-label="Về trang chủ"
      >
        <HomeIcon className="h-5 w-5 shrink-0 text-amber-600" />
        {item.label}
      </Link>
    );
  }

  if (item.children && item.children.length > 0) {
    return (
      <div className="mb-2">
        <Link href={item.href} className={`font-medium ${linkClass}`}>
          {item.label}
        </Link>
        <div className="mt-0.5 flex flex-col gap-0">
          {item.children.map((child) => (
            <Link key={child.href} href={child.href} className={childClass}>
              <span className="font-medium">{child.label}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <Link href={item.href} className={linkClass}>
      <span className="font-medium">{item.label}</span>
    </Link>
  );
}

interface SpotlightExploreSidebarProps {
  variant?: 'light' | 'dark';
  showAppCta?: boolean;
}

export function SpotlightExploreSidebar({
  variant = 'light',
  showAppCta = true,
}: SpotlightExploreSidebarProps): JSX.Element {
  const isDark = variant === 'dark';
  const cardClass = isDark
    ? 'rounded-xl border border-slate-700/50 bg-slate-800/40 p-4 text-slate-200'
    : 'rounded-xl border border-amber-200/60 bg-white p-4 shadow-sm';
  const headingClass = isDark
    ? 'mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400'
    : 'mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground';

  return (
    <aside className="flex w-full flex-col gap-6">
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
      <div className={cardClass}>
        <h3 className={headingClass}>Khám phá thêm</h3>
        <nav className="flex flex-col gap-0.5" aria-label="Liên kết liên quan">
          {SPOTLIGHT_EXPLORE_LINKS.map((item, i) => (
            <div key={`${item.href}-${i}`}>
              {renderItem(item, variant)}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
