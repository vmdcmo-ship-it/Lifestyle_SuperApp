import type { ReactNode } from 'react';
import Link from 'next/link';

type Props = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

/** Khung chung cho trang nội dung tĩnh (giữ typography đồng nhất). */
export function ContentShell({ eyebrow, title, children }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <nav className="mb-8 text-sm text-slate-600">
        <Link href="/" className="font-medium text-brand-navy hover:underline">
          Trang chủ
        </Link>
        <span className="mx-2 text-slate-400">/</span>
        <span className="text-slate-900">{title}</span>
      </nav>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-slate-700 md:text-base">{children}</div>
    </div>
  );
}
