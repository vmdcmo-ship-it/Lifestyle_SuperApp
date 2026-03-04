/**
 * GiftWidget - Bộ công cụ đặt quà & chọn phương thức giao (Car/Bike)
 * Luôn hiển thị ở cột phải (20%) với icon xe hơi sang trọng
 */

'use client';

import Link from 'next/link';

export function GiftWidget(): JSX.Element {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg" style={{ backgroundColor: '#FFE066' }}>
          <LuxuryCarIcon className="h-7 w-7" style={{ color: '#1e3a5f' }} />
        </div>
        <div>
          <h3 className="font-serif text-base font-semibold" style={{ color: '#1e3a5f' }}>
            Sứ giả tặng quà
          </h3>
          <p className="text-xs" style={{ color: '#4a6b8a' }}>
            Gói quà • Thiệp • Giao xe hơi
          </p>
        </div>
      </div>

      <p className="text-sm" style={{ color: '#1e3a5f' }}>
        Đặt Hamper, hoa tươi và quà tặng cao cấp. Chọn gói quà thủ công, thiệp
        chúc mừng và giao hàng bằng xe hơi Premium.
      </p>

      <div className="space-y-2">
        <Link
          href="/shopping-mall/gifting-concierge"
          className="flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium text-white transition-colors hover:opacity-90"
          style={{ backgroundColor: '#FFB800' }}
        >
          <GiftIcon className="h-5 w-5" />
          Order Now
        </Link>
        <Link
          href="/shopping-mall/gifting-concierge?action=send"
          className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors hover:bg-slate-100"
          style={{ borderColor: '#1e3a5f', color: '#1e3a5f' }}
        >
          <SendIcon className="h-5 w-5" />
          Gửi quà hộ
        </Link>
      </div>

      <div className="border-t border-slate-200 pt-3">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: '#4a6b8a' }}>
          Phương thức giao
        </p>
        <div className="flex gap-2">
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs" style={{ color: '#1e3a5f' }}>
            🚗 Xe hơi
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs" style={{ color: '#1e3a5f' }}>
            🏍️ Xe máy
          </span>
        </div>
      </div>
    </div>
  );
}

function LuxuryCarIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 17h14v-5H5v5Zm0-7 2-4h10l2 4" />
      <path d="M7 17v2M17 17v2" />
    </svg>
  );
}

function GiftIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect width="20" height="5" x="2" y="7" />
      <path d="M12 22V7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7Z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7Z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
