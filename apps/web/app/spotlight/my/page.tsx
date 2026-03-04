import type { Metadata } from 'next';
import Link from 'next/link';
import { SpotlightMyContent } from './spotlight-my-content';
import { BreadcrumbJsonLd } from '@/lib/seo/json-ld';

export const metadata: Metadata = {
  title: 'Video của tôi - Spotlight',
  description: 'Danh sách video bạn đã đăng trên Spotlight',
};

export default function SpotlightMyPage(): JSX.Element {
  const breadcrumbs = [
    { name: 'Trang chủ', url: '/' },
    { name: 'Spotlight', url: '/spotlight' },
    { name: 'Video của tôi', url: '/spotlight/my' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <nav
            className="mb-2 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/spotlight" className="hover:text-foreground">Spotlight</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">Video của tôi</span>
          </nav>
          <h1 className="font-heading text-2xl font-bold md:text-3xl">
            Video của tôi
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Các video bạn đã đăng trên Spotlight
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <SpotlightMyContent />
      </div>
    </div>
  );
}
