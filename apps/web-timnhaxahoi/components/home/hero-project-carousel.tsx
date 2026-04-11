'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

export type HeroSlide = {
  slug: string;
  name: string;
  location: string;
  estimateTriệu: number;
  pricePerM2Label: string;
};

type Props = {
  slides: HeroSlide[];
};

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

const gradientForIndex = (i: number) => {
  const palettes = [
    'linear-gradient(135deg, #1e3a8a 0%, #0f172a 45%, #10b981 100%)',
    'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #047857 100%)',
    'linear-gradient(135deg, #172554 0%, #1e40af 40%, #10b981 95%)',
    'linear-gradient(135deg, #1e293b 0%, #1e3a8a 55%, #34d399 100%)',
  ];
  return palettes[i % palettes.length];
};

export function HeroProjectCarousel({ slides }: Props): JSX.Element {
  const [index, setIndex] = useState(0);
  const n = slides.length;

  const next = useCallback(() => {
    setIndex((i) => (n ? (i + 1) % n : 0));
  }, [n]);

  const prev = useCallback(() => {
    setIndex((i) => (n ? (i - 1 + n) % n : 0));
  }, [n]);

  useEffect(() => {
    if (n < 2) {
      return;
    }
    const id = window.setInterval(next, 6500);
    return () => window.clearInterval(id);
  }, [n, next]);

  if (n === 0) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg"
        style={{ background: gradientForIndex(0) }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex min-h-[260px] flex-col items-center justify-center px-6 py-14 text-center md:min-h-[300px]">
          <p className="text-sm font-medium uppercase tracking-wider text-white/80">Timnhaxahoi</p>
          <h2 className="mt-3 max-w-xl text-2xl font-bold text-white md:text-3xl">Dự án nhà ở xã hội</h2>
          <p className="mt-3 max-w-md text-sm text-white/85">
            Đang cập nhật danh mục. Xem{' '}
            <Link href="/du-an" className="font-semibold text-amber-200 underline underline-offset-2 hover:text-white">
              tất cả dự án
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  const slide = slides[index];

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 shadow-lg"
      role="region"
      aria-roledescription="carousel"
      aria-label="Dự án tiêu biểu"
    >
      <div
        key={slide.slug}
        className="absolute inset-0 transition-opacity duration-500"
        style={{ background: gradientForIndex(index) }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-6 pb-12 md:min-h-[340px] md:p-10 md:pb-14">
        <span className="inline-flex w-fit items-center rounded-full bg-brand-hot px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white shadow">
          Hot · Ưu tiên xem
        </span>
        <h2 className="mt-4 text-2xl font-bold leading-tight text-white md:text-4xl">{slide.name}</h2>
        <p className="mt-2 text-sm text-white/90 md:text-base">{slide.location}</p>
        <p className="mt-4 text-base font-semibold text-brand-gold-light md:text-xl">
          Ước tính từ ~{slide.estimateTriệu} triệu · {slide.pricePerM2Label}
        </p>
        <p className="mt-1 text-xs text-white/75 md:text-sm">Số liệu tham khảo theo giá/m² và diện tích mẫu — xem chi tiết dự án.</p>
        <Link
          href={`/du-an/${slide.slug}`}
          className="mt-6 inline-flex w-fit items-center justify-center rounded-xl bg-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Xem dự án &amp; pháp lý
        </Link>
      </div>

      {n > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/70 md:left-4"
            aria-label="Slide trước"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/15 p-2 text-white backdrop-blur-md transition hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/70 md:right-4"
            aria-label="Slide sau"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2" role="tablist" aria-label="Chọn slide">
            {slides.map((_, i) => (
              <button
                key={slides[i].slug}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-white' : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
