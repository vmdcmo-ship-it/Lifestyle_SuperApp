/**
 * MallHero - Slide Banner quảng cáo các bộ sưu tập Luxe
 * Spec: Cinemagraphs hoặc short videos - KHÔNG dùng static images
 * Video: Mixkit free stock (luxury, product). URL config qua env.
 */

'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  /** Video URL - ưu tiên từ env, fallback Mixkit mặc định */
  videoUrl?: string;
  gradient: string;
  ctaLabel: string;
  ctaHref: string;
}

const MIXKIT_BASE = 'https://assets.mixkit.co/videos';
const DEFAULT_VIDEOS: Record<string, string> = {
  watches: `${MIXKIT_BASE}/35540/35540-720.mp4`, // Luxury white sports car - luxury aesthetic
  cosmetics: `${MIXKIT_BASE}/44542/44542-720.mp4`, // Stylish woman - beauty/luxury
  hamper: `${MIXKIT_BASE}/44500/44500-720.mp4`,   // Sunset terrace - sophisticated gift vibe
  flowers: `${MIXKIT_BASE}/4076/4076-720.mp4`,    // City lights - artistic
};

function getHeroSlides(): HeroSlide[] {
  const v1 = process.env.NEXT_PUBLIC_MALL_HERO_VIDEO_1;
  const v2 = process.env.NEXT_PUBLIC_MALL_HERO_VIDEO_2;
  const v3 = process.env.NEXT_PUBLIC_MALL_HERO_VIDEO_3;
  const v4 = process.env.NEXT_PUBLIC_MALL_HERO_VIDEO_4;
  return [
    {
      id: '1',
      title: 'Bộ sưu tập Đồng hồ',
      subtitle: 'Thời gian là sự xa xỉ',
      videoUrl: v1 || DEFAULT_VIDEOS.watches,
      gradient: 'from-amber-900/80 via-slate-900 to-slate-950',
      ctaLabel: 'Khám phá',
      ctaHref: '/shopping-mall/boutiques?category=watches',
    },
    {
      id: '2',
      title: 'Nước hoa & Mỹ phẩm',
      subtitle: 'Hương thơm đẳng cấp',
      videoUrl: v2 || DEFAULT_VIDEOS.cosmetics,
      gradient: 'from-rose-900/60 via-slate-900 to-slate-950',
      ctaLabel: 'Xem bộ sưu tập',
      ctaHref: '/shopping-mall/boutiques?category=cosmetics',
    },
    {
      id: '3',
      title: 'Giỏ quà Hamper',
      subtitle: 'Tinh hoa của sự sang trọng',
      videoUrl: v3 || DEFAULT_VIDEOS.hamper,
      gradient: 'from-emerald-900/50 via-slate-900 to-slate-950',
      ctaLabel: 'Đặt quà ngay',
      ctaHref: '/shopping-mall/gifting-concierge',
    },
    {
      id: '4',
      title: 'Hoa tươi nghệ thuật',
      subtitle: 'Thiết kế độc quyền',
      videoUrl: v4 || DEFAULT_VIDEOS.flowers,
      gradient: 'from-violet-900/60 via-slate-900 to-slate-950',
      ctaLabel: 'Tạo đơn hoa',
      ctaHref: '/shopping-mall/gifting-concierge?type=flowers',
    },
  ];
}

export function MallHero(): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const slides = useMemo(() => getHeroSlides(), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slide = slides[activeIndex];

  return (
    <section
      className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-slate-900"
      aria-label="Banner bộ sưu tập Luxe"
    >
      {/* Video background - autoplay, muted, loop (cinemagraph-style) */}
      {slide.videoUrl && (
        <video
          key={slide.id}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
        >
          <source src={slide.videoUrl} type="video/mp4" />
        </video>
      )}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} mix-blend-multiply`}
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />

      <div className="relative flex h-full flex-col justify-end p-8 md:p-12">
        <h2 className="font-heading text-3xl font-semibold tracking-wide text-white/95 md:text-4xl lg:text-5xl">
          {slide.title}
        </h2>
        <p className="mt-2 font-heading text-sm text-amber-200/90 md:text-base">
          {slide.subtitle}
        </p>
        <Link
          href={slide.ctaHref}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg border border-amber-500/60 bg-amber-500/10 px-6 py-3 font-heading text-sm font-medium text-amber-200 transition-all hover:bg-amber-500/20"
        >
          {slide.ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={slides[i].id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === activeIndex ? 'w-6 bg-amber-400' : 'w-1.5 bg-slate-500'
            }`}
            aria-label={`Chuyển đến slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
