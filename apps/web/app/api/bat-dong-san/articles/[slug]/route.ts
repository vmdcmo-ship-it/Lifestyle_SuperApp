import { NextRequest, NextResponse } from 'next/server';
import { BDS_ARTICLES_STATIC } from '@/lib/config/bat-dong-san-articles';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

/** GET /api/bat-dong-san/articles/[slug] - Proxy đến backend, fallback dữ liệu tĩnh */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/articles/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }

    // Fallback
    const article = BDS_ARTICLES_STATIC.find((a) => a.slug === slug);
    if (article) {
      return NextResponse.json({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        publishedAt: article.date,
      });
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    console.error('[BDS Article]', e);
    const { slug } = await params;
    const article = BDS_ARTICLES_STATIC.find((a) => a.slug === slug);
    if (article) {
      return NextResponse.json({
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        publishedAt: article.date,
      });
    }
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
