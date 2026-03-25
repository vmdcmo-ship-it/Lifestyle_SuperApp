'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useState } from 'react';

export function AppChrome({ children }: { children: ReactNode }) {
  const [appMode, setAppMode] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setAppMode(q.get('mode') === 'app');
  }, []);

  if (appMode) {
    return <div className="min-h-dvh">{children}</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="bg-brand-gradient bg-clip-text text-lg font-semibold text-transparent">
            timnhaxahoi.com
          </Link>
          <nav className="flex flex-wrap justify-end gap-x-4 gap-y-2 text-sm text-slate-600">
            <Link href="/quiz" className="hover:text-brand-navy">
              Trắc nghiệm
            </Link>
            <Link href="/du-an" className="hover:text-brand-navy">
              Dự án
            </Link>
            <Link href="/phap-ly" className="hover:text-brand-navy">
              Pháp lý
            </Link>
            <Link href="/video" className="hover:text-brand-navy">
              Video
            </Link>
            <Link href="/dashboard" className="hover:text-brand-navy">
              Kết quả
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-slate-200 bg-slate-50 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} timnhaxahoi.com — Thông tin mang tính tham khảo; tư vấn viên sẽ xác nhận chi tiết.
      </footer>
    </div>
  );
}
