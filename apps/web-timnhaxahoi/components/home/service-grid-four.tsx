import Link from 'next/link';

const items = [
  {
    href: '/timnhatro',
    title: 'Tìm trọ',
    desc: 'Phòng trọ, nhà cho thuê — liên hệ trực tiếp chủ.',
    icon: (
      <svg className="h-8 w-8 text-brand-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <path d="M9 22V12h6v10" />
      </svg>
    ),
  },
  {
    href: '/du-an',
    title: 'Tìm NOXH',
    desc: 'Danh mục nhà ở xã hội, ưu tiên Miền Nam.',
    icon: (
      <svg className="h-8 w-8 text-[#10b981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
      </svg>
    ),
  },
  {
    href: '/phap-ly',
    title: 'Wiki pháp lý',
    desc: 'Điều kiện, thủ tục, hướng dẫn tham khảo.',
    icon: (
      <svg className="h-8 w-8 text-brand-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    href: '/quiz',
    title: 'Tư vấn hồ sơ',
    desc: 'Trắc nghiệm — gợi ý phù hợp NOXH & bước tiếp theo.',
    icon: (
      <svg className="h-8 w-8 text-brand-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
] as const;

export function ServiceGridFour(): JSX.Element {
  return (
    <section className="mt-10" aria-labelledby="services-grid-heading">
      <h2 id="services-grid-heading" className="text-lg font-bold text-slate-900 md:text-xl">
        Dịch vụ cốt lõi
      </h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="glass-panel flex h-full flex-col rounded-xl p-5 transition hover:border-brand-emerald/40 hover:shadow-md"
            >
              {item.icon}
              <span className="mt-3 font-semibold text-slate-900">{item.title}</span>
              <span className="mt-1 text-sm text-slate-600">{item.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
