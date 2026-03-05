/**
 * Tin Bất Động Sản - Trang tin tức bất động sản
 * Thiết kế phong cách báo chí, SEO cho bất động sản
 * Nội dung: dự án, chính sách pháp luật, thị trường BDS
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { BdsBreadcrumb } from '../_components/bds-breadcrumb';
import { BDS_ARTICLES_STATIC } from '@/lib/config/bat-dong-san-articles';

export const metadata: Metadata = {
  title: 'Tin Bất Động Sản - Tin tức, phân tích thị trường BDS',
  description:
    'Tin tức bất động sản phong cách báo chí. Dự án, chính sách pháp luật, phân tích thị trường. SEO bất động sản.',
  keywords: [
    'tin bất động sản',
    'thị trường BDS',
    'chính sách bất động sản',
    'dự án chung cư',
    'nhà ở xã hội',
    'phân tích bất động sản',
  ],
  alternates: { canonical: '/bat-dong-san/tin-bat-dong-san' },
  openGraph: {
    title: 'Tin Bất Động Sản - Tin tức, chính sách, dự án',
    description: 'Tin tức bất động sản phong cách báo chí. Dự án, chính sách pháp luật, phân tích thị trường.',
    url: '/bat-dong-san/tin-bat-dong-san',
    type: 'website',
  },
};

interface ArticleItem {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
  tags?: string[] | null;
}

async function fetchArticles(tag?: string): Promise<ArticleItem[]> {
  try {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
    const proto = headersList.get('x-forwarded-proto') || 'http';
    const baseUrl = `${proto}://${host}`;
    const params = new URLSearchParams({ limit: '50' });
    if (tag) params.set('tag', tag);
    const res = await fetch(`${baseUrl}/api/bat-dong-san/articles?${params.toString()}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: ArticleItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

interface PageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function TinBatDongSanPage({ searchParams }: PageProps): Promise<JSX.Element> {
  const params = await searchParams;
  const tag = params?.tag;

  const apiArticles = await fetchArticles(tag);
  let raw =
    apiArticles.length > 0
      ? apiArticles.map((a) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt ?? '',
          image: a.featuredImage ?? null,
          date: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 10) : '',
          tags: a.tags ?? [],
        }))
      : BDS_ARTICLES_STATIC.map((a) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          image: null,
          date: a.date,
          tags: a.tags ?? [],
        }));

  // Backend hỗ trợ tag thì API đã filter; fallback static vẫn filter phía client
  const articles = tag
    ? raw.filter((a) => a.tags?.some((x) => x.toLowerCase() === tag.toLowerCase()))
    : raw;

  return (
    <div className="min-h-screen">
      <BdsBreadcrumb items={[{ label: 'Tin Bất Động Sản', href: '/bat-dong-san/tin-bat-dong-san' }]} />
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-800 to-orange-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">Tin Bất Động Sản</h1>
          <p className="max-w-2xl text-amber-100">
            Tin tức bất động sản phong cách báo chí. Dự án mới, chính sách pháp luật, phân tích thị trường – SEO cho bất động sản.
          </p>
        </div>
      </section>

      {tag && (
        <p className="mb-4 text-sm text-muted-foreground">
          Đang lọc theo tag: <span className="font-medium text-amber-700">{tag}</span>
          <Link href="/bat-dong-san/tin-bat-dong-san" className="ml-2 text-amber-600 hover:underline">
            (Xóa lọc)
          </Link>
        </p>
      )}

      <section>
        {articles.length === 0 ? (
          <p className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
            {tag ? `Không có bài viết nào với tag "${tag}". ` : 'Chưa có bài viết nào.'}
            {tag && (
              <Link href="/bat-dong-san/tin-bat-dong-san" className="text-amber-600 hover:underline">
                Xem tất cả tin
              </Link>
            )}
          </p>
        ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/bat-dong-san/tin-bat-dong-san/${a.slug}`}
              className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-amber-200"
            >
              <h2 className="font-semibold text-slate-800 group-hover:text-amber-700">{a.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{a.excerpt}</p>
              {a.date && <p className="mt-3 text-xs text-muted-foreground">{a.date}</p>}
            </Link>
          ))}
        </div>
        )}
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        <Link href="/bat-dong-san" className="font-medium text-amber-600 hover:underline">
          ← Về Bất động sản
        </Link>
      </p>
    </div>
  );
}
