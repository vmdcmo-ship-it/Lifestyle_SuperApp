/**
 * MasterLayout206020 - Layout 3 cột theo tỷ lệ 20/60/20
 * Cột trái: Partner & Loyalty Hub
 * Cột giữa: Main Service Showcase (The Flow)
 * Cột phải: Ecosystem & Community (The Magnets)
 * Tuân thủ spec KODO - Dark theme + Neon gradient, phong cách Apple/Tesla
 */

'use client';

import Link from 'next/link';

interface MasterLayout206020Props {
  /** Nội dung cột giữa - thường là HeroCarousel + nội dung chính */
  children: React.ReactNode;
  /** Nội dung cột trái - Partner & Loyalty (optional, có default) */
  leftSidebar?: React.ReactNode;
  /** Nội dung cột phải - Ecosystem & Community (optional, có default) */
  rightSidebar?: React.ReactNode;
}

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || '#';
const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#';

/**
 * CTA Tải App - Luôn nổi bật theo spec
 */
function CtaDownloadApp(): JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <Link
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-800 shadow transition-all hover:bg-slate-200"
        aria-label="Tải App từ App Store"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01z" />
        </svg>
        Tải App
      </Link>
      <Link
        href="/partner"
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-semibold transition-all hover:border-slate-300 hover:bg-slate-50"
        style={{ color: '#1e3a5f' }}
        aria-label="Gia nhập đối tác"
      >
        Gia nhập ngay
      </Link>
    </div>
  );
}

/**
 * Sidebar trái mặc định - Partner & Loyalty Hub
 */
function DefaultLeftSidebar(): JSX.Element {
  return (
    <aside className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Đối tác
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            href="/signup/driver"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            Tài xế
          </Link>
          <Link
            href="/dang-ky-doi-tac?group=FOOD_DELIVERY"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            Nhà hàng / Đối tác
          </Link>
          <Link
            href="/partner?type=koc"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            KOC / MOL
          </Link>
        </nav>
      </div>
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Loyalty & Referral
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            href="/profile/my-coins"
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium transition-colors hover:border-slate-300 hover:bg-slate-50"
            style={{ color: '#1e3a5f' }}
          >
            Tích lũy điểm
          </Link>
          <Link
            href="/referral"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            Giới thiệu bạn bè
          </Link>
        </nav>
      </div>
      <CtaDownloadApp />
    </aside>
  );
}

/**
 * Sidebar phải mặc định - Ecosystem & Community
 */
function DefaultRightSidebar(): JSX.Element {
  return (
    <aside className="flex flex-col gap-6">
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Ecosystem
        </h3>
        <nav className="flex flex-col gap-2">
          <Link
            href="/spotlight"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            Spotlight
          </Link>
          <Link
            href="/the-thao/run-to-earn"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            Run to Earn
          </Link>
          <Link
            href="/wealth"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            Wealth
          </Link>
          <Link
            href="/the-thao/clb-ban-chuyen-nghiep/tennis"
            className="rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-amber-50 hover:border-amber-200"
          >
            KODO Sport
          </Link>
        </nav>
      </div>
      <CtaDownloadApp />
    </aside>
  );
}

export function MasterLayout206020({
  children,
  leftSidebar,
  rightSidebar,
}: MasterLayout206020Props): JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-[1920px] gap-0">
        {/* Cột trái 20% - Sticky */}
        <div className="sticky top-16 hidden w-[20%] min-w-[200px] max-w-[260px] shrink-0 flex-col self-start border-r border-slate-200 bg-slate-50/50 p-6 lg:flex">
          {leftSidebar ?? <DefaultLeftSidebar />}
        </div>

        {/* Cột giữa 60% - Main content */}
        <div className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:w-[60%] lg:max-w-[960px]">
          {children}
        </div>

        {/* Cột phải 20% - Sticky */}
        <div className="sticky top-16 hidden w-[20%] min-w-[200px] max-w-[260px] shrink-0 flex-col self-start border-l border-slate-200 bg-slate-50/50 p-6 xl:flex">
          {rightSidebar ?? <DefaultRightSidebar />}
        </div>
      </div>
    </div>
  );
}
