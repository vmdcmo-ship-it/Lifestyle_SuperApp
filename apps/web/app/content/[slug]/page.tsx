import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

async function fetchContent(slug: string, locale = 'vi') {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/content/${encodeURIComponent(slug)}?locale=${locale}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale = 'vi' } = await searchParams;
  const data = await fetchContent(slug, locale);
  if (!data) return { title: 'Nội dung - Lifestyle Super App' };
  return {
    title: `${data.title} - Lifestyle Super App`,
    description: `Xem nội dung ${data.title} trên Lifestyle Super App.`,
    openGraph: {
      title: `${data.title} - Lifestyle Super App`,
      type: 'website',
      url: `/content/${slug}`,
    },
    alternates: { canonical: `/content/${slug}` },
  };
}

export default async function ContentSlugPage({
  params,
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const { locale = 'vi' } = await searchParams;

  const data = await fetchContent(slug, locale);

  if (!data) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
      >
        ← Về trang chủ
      </Link>

      <h1 className="mb-2 text-3xl font-bold">{data.title}</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Phiên bản {data.version} • Cập nhật{' '}
        {new Date(data.effectiveFrom).toLocaleDateString('vi-VN')}
      </p>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />

      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-primary hover:underline">
          ← Về trang chủ
        </Link>
      </div>
    </div>
  );
}
