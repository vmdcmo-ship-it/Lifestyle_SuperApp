/**
 * HeroCarousel - Slide Banner cho các dịch vụ chính KODO
 * Mỗi Slide là poster nghệ thuật, link trực tiếp đến trang chi tiết dịch vụ
 * Lazy loading theo spec performance
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';

export interface HeroSlide {
  id: string;
  title: string;
  description: string;
  href: string;
  image?: string;
  gradient?: string;
  ctaText?: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'ride',
    title: 'Gọi xe',
    description: 'Di chuyển nhanh chóng, an toàn',
    href: '/ride-hailing',
    gradient: 'from-cyan-600 via-blue-700 to-indigo-800',
    ctaText: 'Đặt xe ngay',
  },
  {
    id: 'driver',
    title: 'Lái hộ',
    description: 'Khi say mệt - có chúng tôi lo',
    href: '/ride-hailing?service=driver',
    gradient: 'from-amber-600 via-orange-600 to-red-700',
    ctaText: 'Đặt lái hộ',
  },
  {
    id: 'rental',
    title: 'Thuê xe tự lái',
    description: 'Tự do khám phá mọi hành trình',
    href: '/car-rental',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    ctaText: 'Thuê xe',
  },
  {
    id: 'shopping',
    title: 'Mua hộ / Đi chợ hộ',
    description: 'Mua sắm không cần di chuyển',
    href: '/shopping',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-700',
    ctaText: 'Đặt mua',
  },
  {
    id: 'discover',
    title: 'Khám phá địa điểm',
    description: 'Điểm đến nổi tiếng quanh bạn',
    href: '/spotlight/diem-den',
    gradient: 'from-rose-600 via-pink-600 to-amber-600',
    ctaText: 'Khám phá',
  },
];

const AUTOPLAY_INTERVAL_MS = 5000;

interface HeroCarouselProps {
  slides?: HeroSlide[];
  autoPlay?: boolean;
  /** Chiều cao aspect ratio - mặc định 16/9 */
  aspectRatio?: '16/9' | '21/9' | '4/3';
}

export function HeroCarousel({
  slides = DEFAULT_SLIDES,
  autoPlay = true,
  aspectRatio = '16/9',
}: HeroCarouselProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  useEffect(() => {
    if (!autoPlay || isPaused) return;
    const timer = setTimeout(goNext, AUTOPLAY_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [activeIndex, autoPlay, isPaused, goNext]);

  const aspectClass =
    aspectRatio === '21/9'
      ? 'aspect-[21/9]'
      : aspectRatio === '4/3'
        ? 'aspect-4/3'
        : 'aspect-video';

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative w-full ${aspectClass}`}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === activeIndex ? 'z-10 opacity-100' : 'z-0 opacity-0'
            }`}
          >
            <Link
              href={slide.href}
              className="group relative block h-full w-full overflow-hidden rounded-2xl"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${slide.gradient ?? 'from-slate-700 to-slate-900'}`}
              />
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
              )}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8">
                <h2 className="font-heading text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
                <p className="mt-2 max-w-xl text-lg text-slate-200 md:text-xl">
                  {slide.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors group-hover:text-cyan-200">
                  {slide.ctaText ?? 'Xem chi tiết'}
                  <svg
                    className="h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
        aria-label="Slide trước"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={goNext}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition-colors hover:bg-black/60"
        aria-label="Slide sau"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={slides[index]!.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex
                ? 'w-8 bg-cyan-400'
                : 'w-2 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
