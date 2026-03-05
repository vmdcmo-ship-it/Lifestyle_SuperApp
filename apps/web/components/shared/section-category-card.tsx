'use client';

/**
 * SectionCategoryCard - Card đề mục hỗ trợ ảnh thiết kế hoặc icon
 * Ưu tiên image (ảnh chuyên nghiệp, nhận diện brand) - fallback icon emoji khi chưa có ảnh
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { SectionCategoryItem } from '@/lib/config/section-categories';

interface SectionCategoryCardProps extends SectionCategoryItem {
  /** Custom className cho card */
  className?: string;
}

export function SectionCategoryCard({
  href,
  title,
  description,
  image,
  icon,
  className = '',
}: SectionCategoryCardProps): JSX.Element {
  const [imgError, setImgError] = useState(false);
  const showImage = image && !imgError;

  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:shadow-lg ${className}`}
      aria-label={title}
    >
      <div className="relative mb-4 flex aspect-square w-16 items-center justify-center overflow-hidden rounded-xl bg-muted/50">
        {showImage ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-contain p-2 transition-transform group-hover:scale-105"
            sizes="64px"
            unoptimized={image.startsWith('http')}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-4xl" role="img" aria-hidden>
            {icon || '✨'}
          </span>
        )}
      </div>
      <h2 className="mb-2 font-semibold group-hover:text-primary">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}
