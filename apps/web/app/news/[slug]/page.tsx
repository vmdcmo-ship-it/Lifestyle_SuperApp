import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
}

async function fetchNews(slug: string, locale = 'vi') {
  const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/news/public/${encodeURIComponent(slug)}?locale=${locale}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { locale = 'vi' } = await searchParams;
  const data = await fetchNews(slug, locale);
  if (!data) return { title: 'Tin tức - Lifestyle Super App' };
  return {
    title: data.seoTitle || `${data.title} - Tin tức | Lifestyle Super App`,
    description: data.seoDescription || data.excerpt || data.content?.replace(/<[^>]*>/g, '').slice(0, 160),
  };
}

export default async function NewsSlugPage({ params, searchParams }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const { locale = 'vi' } = await searchParams;
  const data = await fetchNews(slug, locale);
  if (!data) notFound();

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Link href="/" className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Về trang chủ
      </Link>
      <article>
        <h1 className="mb-4 text-3xl font-bold">{data.title}</h1>
        {data.publishedAt && (
          <p className="mb-4 text-sm text-muted-foreground">
            {new Date(data.publishedAt).toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
            {data.author && ` • ${data.author}`}
          </p>
        )}
        {data.featuredImage && (
          <img src={data.featuredImage} alt={data.title} className="mb-6 w-full rounded-lg object-cover" />
        )}
        <div
          className="prose prose-neutral dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      </article>
      <div className="mt-12 border-t pt-6">
        <Link href="/" className="text-primary hover:underline">← Về trang chủ</Link>
      </div>
    </div>
  );
}
