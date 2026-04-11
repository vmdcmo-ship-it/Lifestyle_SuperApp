/** Phần đầu trang chủ — một h1, đoạn dẫn ngắn cho người đọc. */
export function HomeHeroIntro(): JSX.Element {
  return (
    <header className="home-tech-bg relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/50 px-5 py-8 shadow-sm backdrop-blur-md md:px-8 md:py-10">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-brand-emerald/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-16 h-48 w-48 rounded-full bg-brand-navy/10 blur-3xl"
        aria-hidden
      />

      <p className="relative text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-navy/85 md:text-left">
        Dữ liệu · Minh bạch · Công nghệ
      </p>
      <h1 className="relative mt-3 text-center text-[1.65rem] font-bold leading-tight tracking-tight text-slate-900 md:text-left md:text-4xl lg:text-[2.35rem]">
        Nhà ở xã hội &amp; nhà trọ — một nền tảng
      </h1>
      <p className="relative mx-auto mt-4 max-w-2xl text-center text-[15px] leading-relaxed text-slate-600 md:mx-0 md:text-left md:text-base">
        Gom dự án NOXH, wiki pháp lý tham khảo và kênh tìm trọ có kiểm soát thời hạn tin. Trình bày tối giản để bạn
        tra cứu nhanh, dễ hiểu — hướng tới trải nghiệm hiện đại, đáng tin.
      </p>
    </header>
  );
}
