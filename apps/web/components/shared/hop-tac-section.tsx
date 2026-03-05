/**
 * Section Hợp tác - Thuê để sở hữu xe VinFast vận hành dịch vụ cùng KODO Platform
 * Hiển thị trong cột 60% trang chủ
 */

import Link from 'next/link';

export function HopTacSection(): JSX.Element {
  return (
    <section className="mb-16 overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50">
      <div className="grid gap-8 p-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="font-heading mb-2 text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Hợp tác cùng KODO
          </h2>
          <p className="mb-4 text-slate-600">
            Thuê để sở hữu xe máy, ô tô điện VinFast tham gia vận hành dịch vụ cùng KODO Platform.
          </p>
          <ul className="mb-6 space-y-2 text-sm text-slate-600">
            <li>• Ưu đãi chiết khấu cho tài xế đăng ký sớm</li>
            <li>• Chính sách thuê để sở hữu linh hoạt</li>
            <li>• Tham gia vận hành dịch vụ cùng KODO Platform</li>
          </ul>
          <Link
            href="/hop-tac"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-3 font-semibold text-white transition-all hover:bg-amber-600"
          >
            Tìm hiểu thêm
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="flex h-32 w-48 items-center justify-center rounded-xl border border-amber-200 bg-amber-100/50">
            <span className="text-5xl opacity-60">🚗</span>
          </div>
        </div>
      </div>
    </section>
  );
}
