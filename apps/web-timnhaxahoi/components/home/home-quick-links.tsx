import Link from 'next/link';

const LINKS = [
  { href: '/phap-ly', label: 'Wiki pháp lý' },
  { href: '/quiz', label: 'Trắc nghiệm NOXH' },
  { href: '/bang-tinh', label: 'Bảng tính so sánh' },
  { href: '/video', label: 'Video' },
] as const;

/** Dải link ngắn tới các mục thường dùng. */
export function HomeQuickLinks(): JSX.Element {
  return (
    <nav className="mt-10" aria-labelledby="quick-links-heading">
      <h2 id="quick-links-heading" className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500 md:text-left">
        Đi sâu nhanh
      </h2>
      <ul className="mt-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
        {LINKS.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex rounded-full border border-slate-200/90 bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-700 shadow-sm backdrop-blur-sm transition hover:border-brand-navy/25 hover:text-brand-navy"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
