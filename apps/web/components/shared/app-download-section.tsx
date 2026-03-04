/**
 * AppDownloadSection - Phần tải app với ảnh minh họa
 * Hiện dùng ảnh tĩnh; cấu trúc cho phép thay bằng ảnh động (video/Lottie) sau
 * - Truyền illustration.src để dùng ảnh (vd: /images/app-mockup.png)
 * - Không truyền = hiển thị placeholder (dễ thay bằng component động sau)
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || '#';
const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#';

interface AppDownloadSectionProps {
  /** Ảnh minh họa - tĩnh. Để trống = placeholder, có thể thay bằng video/Lottie sau */
  illustration?: {
    src: string;
    alt: string;
  } | null;
  /** Thêm class cho container */
  className?: string;
}

export function AppDownloadSection({
  illustration = null,
  className = '',
}: AppDownloadSectionProps): JSX.Element {
  return (
    <section
      className={`flex flex-col items-center gap-8 bg-gradient-to-br from-amber-50 to-yellow-50 border-t border-amber-200/60 px-6 py-16 md:flex-row md:justify-between md:gap-12 md:px-12 lg:px-16 ${className}`}
    >
      {/* Trái: Text + QR + Nút tải */}
      <div className="flex flex-1 flex-col items-center text-center md:items-start md:text-left">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-800 md:text-4xl">
          Tải ứng dụng
        </h2>
        <p className="mt-2 text-slate-600">
          để trải nghiệm các dịch vụ của chúng tôi
        </p>
        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          {/* QR Code - placeholder */}
          <div
            className="flex h-32 w-32 items-center justify-center rounded-lg bg-slate-200"
            aria-hidden
          >
            <span className="text-4xl text-slate-400">QR</span>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-amber-600"
              aria-label="Tải từ App Store"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8z" />
              </svg>
              Download on the App Store
            </Link>
            <Link
              href={GOOGLE_PLAY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-amber-600"
              aria-label="Tải từ Google Play"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" />
              </svg>
              GET IT ON Google Play
            </Link>
          </div>
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-slate-600">
          <span>★★★★★</span>
          <span>Đánh giá ứng dụng</span>
          <span className="text-slate-500">•</span>
          <span>20+ Thành phố</span>
        </div>
      </div>

      {/* Phải: Ảnh minh họa - slot có thể thay bằng component động sau */}
      <div
        className="relative flex flex-1 items-center justify-center"
        data-app-illustration-slot
      >
        {/* Slot ảnh minh họa: tĩnh (img) hoặc placeholder - thay bằng video/Lottie sau */}
        <div
          className="relative h-64 w-48 overflow-hidden rounded-3xl border-4 border-amber-200 bg-white shadow-2xl md:h-80 md:w-56"
          data-app-illustration-slot
        >
          {illustration?.src ? (
            <Image
              src={illustration.src}
              alt={illustration.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 192px, 224px"
              unoptimized={illustration.src.startsWith('http')}
            />
          ) : (
          /* Placeholder - thay thế bằng AppMockupDynamic khi có ảnh động */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-100 to-yellow-100 p-4">
            <span className="text-6xl">📱</span>
            <span className="mt-2 text-center text-xs text-slate-600">KODO App</span>
            <span className="text-center text-[10px] text-slate-500">
              Gọi xe • Giao đồ ăn • Mua sắm
            </span>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}
