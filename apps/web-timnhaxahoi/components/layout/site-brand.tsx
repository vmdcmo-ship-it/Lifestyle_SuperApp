'use client';

import Image from 'next/image';
import Link from 'next/link';

const LOGO_URL = (process.env.NEXT_PUBLIC_SITE_LOGO_URL ?? '').trim();
const SLOGAN = (process.env.NEXT_PUBLIC_SITE_SLOGAN ?? '').trim();
const SITE_NAME = (process.env.NEXT_PUBLIC_SITE_NAME ?? 'timnhaxahoi.com').trim();

function BrandLogo({ siteName }: { siteName: string }) {
  if (!LOGO_URL) return null;
  const isRemote = /^https?:\/\//i.test(LOGO_URL);
  const className =
    'h-9 w-auto max-h-9 max-w-[140px] shrink-0 object-contain md:h-10 md:max-h-10 md:max-w-[180px]';

  if (isRemote) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote logo: tránh bắt buộc remotePatterns cho mọi CDN
      <img
        src={LOGO_URL}
        alt={siteName}
        className={className}
        width={180}
        height={40}
        decoding="async"
      />
    );
  }

  return (
    <Image
      src={LOGO_URL}
      alt={siteName}
      width={180}
      height={40}
      className={className}
      priority
    />
  );
}

export function SiteBrand() {
  const hasLogo = LOGO_URL.length > 0;

  return (
    <Link
      href="/"
      className="flex min-w-0 max-w-[min(100%,22rem)] items-center gap-2.5 md:gap-3"
    >
      <BrandLogo siteName={SITE_NAME} />
      <span className="flex min-w-0 flex-col justify-center leading-tight">
        {!hasLogo ? (
          <span className="bg-brand-gradient bg-clip-text text-lg font-semibold text-transparent">
            {SITE_NAME}
          </span>
        ) : null}
        {SLOGAN ? (
          <span
            className="truncate text-[11px] font-medium text-slate-500 md:text-xs"
            title={SLOGAN}
          >
            {SLOGAN}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
