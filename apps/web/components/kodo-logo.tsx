/**
 * KodoLogo - Logo thương hiệu KODO
 * Thiết kế: ô vuông vàng, chữ KODO xanh than (navy), bố cục KO / DO
 * Phù hợp spec: debossed, clean, professional
 */

import Link from 'next/link';

const BRAND_YELLOW = '#FFC10E';
const BRAND_YELLOW_DARK = '#FFB800';
const BRAND_NAVY = '#1e3a5f';

interface KodoLogoProps {
  /** Kích thước: sm (header), md (footer), lg (auth pages) */
  size?: 'sm' | 'md' | 'lg';
  /** Hiển thị wordmark "KODO" bên cạnh icon */
  withWordmark?: boolean;
  /** Dùng như link về trang chủ */
  href?: string;
  /** Thêm class cho wrapper */
  className?: string;
}

const SIZE_MAP = {
  sm: { icon: 32 },
  md: { icon: 40 },
  lg: { icon: 48 },
} as const;

export function KodoLogo({
  size = 'sm',
  withWordmark = true,
  href = '/',
  className = '',
}: KodoLogoProps): JSX.Element {
  const { icon: iconSize } = SIZE_MAP[size];
  const wordmarkSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-2xl';

  const logoSvg = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 rounded-lg"
      aria-hidden
    >
      {/* Nền vàng */}
      <rect width="100" height="100" rx="8" fill={BRAND_YELLOW} />
      {/* Khung debossed (viền bên trong) */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="6"
        fill="none"
        stroke={BRAND_NAVY}
        strokeWidth="3"
      />
      {/* KO - hàng trên */}
      <text
        x="50"
        y="40"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={BRAND_NAVY}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="32"
        letterSpacing="-1"
      >
        KO
      </text>
      {/* DO - hàng dưới */}
      <text
        x="50"
        y="68"
        textAnchor="middle"
        dominantBaseline="middle"
        fill={BRAND_NAVY}
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800"
        fontSize="32"
        letterSpacing="-1"
      >
        DO
      </text>
    </svg>
  );

  const content = (
    <>
      {logoSvg}
      {withWordmark && (
        <span
          className={`font-bold ${wordmarkSize}`}
          style={{ color: BRAND_NAVY }}
        >
          KODO
        </span>
      )}
    </>
  );

  const wrapperClass = `inline-flex items-center gap-2 ${className}`;

  if (href) {
    return (
      <Link href={href} className={wrapperClass} aria-label="KODO - Trang chủ">
        {content}
      </Link>
    );
  }

  return <span className={wrapperClass}>{content}</span>;
}
