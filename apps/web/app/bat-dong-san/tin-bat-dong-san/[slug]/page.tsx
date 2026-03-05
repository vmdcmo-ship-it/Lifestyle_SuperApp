/**
 * Tin Bất Động Sản - Chi tiết bài viết
 * Dynamic route: /bat-dong-san/tin-bat-dong-san/[slug]
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { BdsBreadcrumb } from '../../_components/bds-breadcrumb';
import { ArticleJsonLd } from '@/lib/seo/json-ld';
import { BDS_ARTICLES_STATIC } from '@/lib/config/bat-dong-san-articles';

const STATIC_MAP: Record<string, { title: string; excerpt: string; content: string; date: string }> = Object.fromEntries(
  BDS_ARTICLES_STATIC.map((a) => [a.slug, { title: a.title, excerpt: a.excerpt, content: a.content ?? '', date: a.date }])
);

async function fetchArticle(slug: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
    const proto = headersList.get('x-forwarded-proto') || 'http';
    const baseUrl = `${proto}://${host}`;
    const res = await fetch(`${baseUrl}/api/bat-dong-san/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiArticle = await fetchArticle(slug);
  const staticArt = STATIC_MAP[slug];
  const article = apiArticle ?? staticArt;
  if (!article) return { title: 'Không tìm thấy' };
  const title = typeof article.title === 'string' ? article.title : (article as { title?: string }).title ?? 'Bài viết';
  const excerpt = typeof article.excerpt === 'string' ? article.excerpt : undefined;
  return {
    title: `${title} | Tin Bất Động Sản`,
    description: excerpt,
    keywords: ['tin bất động sản', 'bất động sản', title],
    alternates: { canonical: `/bat-dong-san/tin-bat-dong-san/${slug}` },
    openGraph: {
      title: `${title} | Tin Bất Động Sản`,
      description: excerpt,
      url: `/bat-dong-san/tin-bat-dong-san/${slug}`,
      type: 'article',
    },
  };
}

export default async function TinBatDongSanSlugPage({ params }: Props): Promise<JSX.Element> {
  const { slug } = await params;
  const apiArticle = await fetchArticle(slug);
  const staticArt = STATIC_MAP[slug];
  const article = apiArticle ?? staticArt;
  if (!article) notFound();

  const title = typeof article.title === 'string' ? article.title : (article as { title?: string }).title ?? 'Bài viết';
  const excerpt = typeof article.excerpt === 'string' ? article.excerpt : '';
  const content = typeof article.content === 'string' ? article.content : (article as { body?: string }).body ?? '';
  const date = typeof article.date === 'string' ? article.date : (article as { publishedAt?: string })?.publishedAt?.slice(0, 10) ?? '';

  const articlePath = `/bat-dong-san/tin-bat-dong-san/${slug}`;
  const breadcrumbItems = [
    { label: 'Tin Bất Động Sản', href: '/bat-dong-san/tin-bat-dong-san' },
    { label: title, href: `/bat-dong-san/tin-bat-dong-san/${slug}` },
  ];

  return (
    <article className="min-h-screen">
      <BdsBreadcrumb items={breadcrumbItems} />
      <ArticleJsonLd
        headline={title}
        description={excerpt}
        datePublished={date || new Date().toISOString().slice(0, 10)}
        dateModified={date}
        url={articlePath}
      />
      <div className="mb-8">
        <Link href="/bat-dong-san/tin-bat-dong-san" className="text-sm font-medium text-amber-600 hover:underline">
          ← Tin Bất Động Sản
        </Link>
      </div>
      <header className="mb-8">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">{title}</h1>
        {excerpt && <p className="mt-2 text-lg text-muted-foreground">{excerpt}</p>}
        {date && <p className="mt-4 text-sm text-muted-foreground">{date}</p>}
      </header>
      <div
        className="prose prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <p className="mt-12">
        <Link href="/bat-dong-san" className="font-medium text-amber-600 hover:underline">
          ← Về Bất động sản
        </Link>
      </p>
    </article>
  );
}
