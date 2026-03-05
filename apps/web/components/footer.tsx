/**
 * Footer đầy đủ theo mô hình Be Group
 * - Trang chính: đầy đủ các mục (Hỗ trợ, Công ty, KH cá nhân, Đối tác)
 * - Trang con (Sport, Run to Earn): tiêu chuẩn cộng đồng & điều khoản riêng + Công ty
 * - Luôn giữ phần thông tin công ty (logo, social, app download, copyright)
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { KodoLogo } from '@/components/kodo-logo';
import {
  FOOTER_SECTIONS,
  FOOTER_SECTIONS_SPORT,
  FOOTER_SECTIONS_RUN_TO_EARN,
  FOOTER_SECTIONS_BAT_DONG_SAN,
  FOOTER_SECTIONS_SHOPPING_MALL,
} from '@/lib/config/footer-links';
import type { FooterSection } from '@/lib/config/footer-links';

const APP_STORE_URL = process.env.NEXT_PUBLIC_APP_STORE_URL || '#';
const GOOGLE_PLAY_URL = process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL || '#';

function getSectionsForPath(pathname: string): FooterSection[] {
  if (pathname.includes('/shopping-mall')) {
    return FOOTER_SECTIONS_SHOPPING_MALL;
  }
  if (pathname.includes('/the-thao/clb-ban-chuyen-nghiep')) {
    return FOOTER_SECTIONS_SPORT;
  }
  if (pathname.includes('/the-thao/run-to-earn')) {
    return FOOTER_SECTIONS_RUN_TO_EARN;
  }
  if (pathname.includes('/bat-dong-san')) {
    return FOOTER_SECTIONS_BAT_DONG_SAN;
  }
  return FOOTER_SECTIONS;
}

export function Footer(): JSX.Element {
  const pathname = usePathname();
  const sections = getSectionsForPath(pathname);
  return (
    <footer className="brand-footer border-t" style={{ backgroundColor: '#FFC10E' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr,2fr]">
          {/* Cột trái: Logo, Social, App download - text xanh than */}
          <div className="space-y-6">
            <KodoLogo size="md" withWordmark className="[&_span]:!text-[#1e3a5f]" />
            <p className="text-sm">
              Super App dịch vụ cuộc sống – Gọi xe, Giao đồ ăn, Mua sắm và nhiều hơn nữa.
            </p>
            <div>
              <p className="mb-2 text-sm font-medium">Kết nối với chúng tôi</p>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                  aria-label="Facebook"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                  aria-label="Instagram"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:opacity-90"
                style={{ borderColor: 'rgba(30,58,95,0.4)', color: '#1e3a5f', backgroundColor: 'rgba(255,255,255,0.4)' }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8z" />
                </svg>
                App Store
              </a>
              <a
                href={GOOGLE_PLAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors hover:opacity-90"
                style={{ borderColor: 'rgba(30,58,95,0.4)', color: '#1e3a5f', backgroundColor: 'rgba(255,255,255,0.4)' }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" />
                </svg>
                Google Play
              </a>
            </div>
          </div>

          {/* Các cột nội dung - thay đổi theo trang con (Sport/Run: 2 cột, trang chính: 4 cột) */}
          <div
            className={`grid gap-8 sm:grid-cols-2 ${sections.length <= 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4'}`}
          >
            {sections.map((section) => (
              <div key={section.title}>
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className="text-sm transition-opacity hover:opacity-80"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Thông tin công ty */}
        <div className="mt-12 border-t pt-8" style={{ borderColor: 'rgba(30,58,95,0.3)' }}>
          <p className="text-center text-xs">
            &copy; {new Date().getFullYear()} Lifestyle Super App. Bảo lưu mọi quyền.
          </p>
        </div>
      </div>
    </footer>
  );
}
