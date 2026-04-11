import Link from 'next/link';

function IconBuilding(): JSX.Element {
  return (
    <svg className="h-9 w-9 md:h-10 md:w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
      <path d="M9 9h.01M9 13h.01M9 17h.01M13 13h.01M13 17h.01" />
    </svg>
  );
}

function IconHomeDoor(): JSX.Element {
  return (
    <svg className="h-9 w-9 md:h-10 md:w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <path d="M9 22V12h6v10" />
      <path d="M12 16h.01" />
    </svg>
  );
}

function IconChevron(): JSX.Element {
  return (
    <svg className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

/** Hai kênh chính — liên kết tới NOXH và tìm nhà trọ. */
export function TwoPillarGate(): JSX.Element {
  return (
    <section className="mt-8 md:mt-10" aria-labelledby="two-pillars-heading">
      <div className="mb-5 text-center md:mb-6 md:text-left">
        <h2 id="two-pillars-heading" className="text-lg font-bold text-slate-900 md:text-xl">
          Hai kênh — chọn điểm vào
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 md:max-w-xl">
          Mỗi kênh là không gian riêng: dự án &amp; lộ trình dài hạn, hoặc thuê trọ gần bạn — chạm để mở.
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-2 md:gap-5">
        <li>
          <Link
            href="/du-an"
            className="pillar-card group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white/90 via-white/70 to-emerald-50/80 p-6 shadow-md outline-none ring-brand-navy/0 transition duration-200 hover:-translate-y-0.5 hover:border-brand-emerald/35 hover:shadow-lg hover:ring-2 hover:ring-brand-emerald/20 focus-visible:ring-2 focus-visible:ring-brand-navy md:min-h-[240px] md:p-8"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-[0.45]"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 90% 60% at 15% 20%, rgba(16, 185, 129, 0.18), transparent 55%),
                  radial-gradient(ellipse 70% 50% at 90% 80%, rgba(30, 58, 138, 0.12), transparent 50%)
                `,
              }}
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="rounded-xl bg-brand-navy/5 p-2.5 text-brand-navy">
                <IconBuilding />
              </div>
              <span className="rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Trụ NOXH
              </span>
            </div>
            <div className="relative mt-4">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Nhà ở xã hội</h3>
              <p className="mt-2 max-w-[20rem] text-sm leading-snug text-slate-600">
                Danh mục dự án, giá tham khảo, wiki pháp lý và công cụ so sánh — lộ trình an cư dài hạn.
              </p>
            </div>
            <div className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-brand-navy">
              Vào kênh NOXH
              <IconChevron />
            </div>
          </Link>
        </li>

        <li>
          <Link
            href="/timnhatro"
            className="pillar-card group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-900/[0.03] via-white/75 to-brand-navy/[0.08] p-6 shadow-md outline-none ring-brand-navy/0 transition duration-200 hover:-translate-y-0.5 hover:border-brand-navy/40 hover:shadow-lg hover:ring-2 hover:ring-brand-navy/25 focus-visible:ring-2 focus-visible:ring-brand-navy md:min-h-[240px] md:p-8"
          >
            <span
              className="pointer-events-none absolute inset-0 opacity-[0.5]"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 85% 55% at 85% 15%, rgba(30, 58, 138, 0.16), transparent 55%),
                  radial-gradient(ellipse 65% 45% at 10% 90%, rgba(15, 23, 42, 0.08), transparent 50%)
                `,
              }}
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-3">
              <div className="rounded-xl bg-brand-navy/10 p-2.5 text-brand-navy">
                <IconHomeDoor />
              </div>
              <span className="rounded-full border border-slate-200/80 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Trụ nhà trọ
              </span>
            </div>
            <div className="relative mt-4">
              <h3 className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">Tìm nhà trọ</h3>
              <p className="mt-2 max-w-[20rem] text-sm leading-snug text-slate-600">
                Tin đăng từ chủ trọ, thời hạn hiển thị rõ ràng; không đặt cọc trên nền tảng — liên hệ trực tiếp.
              </p>
            </div>
            <div className="relative mt-5 flex items-center gap-2 text-sm font-semibold text-brand-navy">
              Vào kênh nhà trọ
              <IconChevron />
            </div>
          </Link>
        </li>
      </ul>
    </section>
  );
}
