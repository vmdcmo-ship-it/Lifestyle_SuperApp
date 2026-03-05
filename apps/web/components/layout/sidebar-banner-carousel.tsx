/**
 * SidebarBannerCarousel - Banner dọc 9:16, tối đa 4 slide
 * Hỗ trợ: JPEG, PNG, SVG (image), MP4 (video từ Spotlight).
 * Carousel tự động chuyển slide, mỗi banner có link trang đích.
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SidebarBanner } from '@/lib/config/sidebar-banners';

interface SidebarBannerCarouselProps {
  banners: SidebarBanner[];
  /** Tối đa 4 banner */
  className?: string;
}

const ROTATE_INTERVAL_MS = 5000;

export function SidebarBannerCarousel({
  banners,
  className = '',
}: SidebarBannerCarouselProps): JSX.Element | null {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = banners.slice(0, 4);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(
      () => setActiveIndex((i) => (i + 1) % items.length),
      ROTATE_INTERVAL_MS
    );
    return () => clearInterval(t);
  }, [items.length]);

  if (items.length === 0) return null;

  const activeBanner = items[activeIndex];

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-xl">
        <Link
          href={activeBanner.href}
          className="block overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
          aria-label={activeBanner.alt}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: '9/16' }}
          >
            {activeBanner.video ? (
              <video
                key={`${activeBanner.href}-${activeIndex}`}
                src={activeBanner.video}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                aria-hidden
              />
            ) : activeBanner.image ? (
              <Image
                src={activeBanner.image}
                alt={activeBanner.alt}
                fill
                className="object-cover"
                sizes="200px"
                unoptimized={
                  activeBanner.image.startsWith('http') || /\.svg$/i.test(activeBanner.image)
                }
              />
            ) : (
              <div
                className="flex flex-col items-center justify-center p-4 text-white"
                style={{
                  background:
                    activeIndex % 2 === 0
                      ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%)'
                      : 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
                }}
              >
                <span className="text-4xl drop-shadow">{activeBanner.icon || '✨'}</span>
                <span className="mt-2 text-center text-xs font-medium drop-shadow">
                  {activeBanner.alt}
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>
      {items.length > 1 && (
        <div className="mt-2 flex justify-center gap-1">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === activeIndex ? 'bg-amber-500' : 'bg-slate-300'
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
