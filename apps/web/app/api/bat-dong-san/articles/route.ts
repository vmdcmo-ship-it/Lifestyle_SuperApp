import { NextRequest, NextResponse } from 'next/server';
import { BDS_ARTICLES_STATIC } from '@/lib/config/bat-dong-san-articles';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

/** GET /api/bat-dong-san/articles - Proxy đến backend, fallback dữ liệu tĩnh */
export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 50;
    const tag = request.nextUrl.searchParams.get('tag') || '';
    const query = new URLSearchParams({ limit: String(limit) });
    if (tag) query.set('tag', tag);
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/articles?${query.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }

    // Fallback: backend chưa có API → lọc theo tag phía server
    let data = BDS_ARTICLES_STATIC.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      featuredImage: a.image,
      publishedAt: a.date,
      tags: a.tags ?? [],
    }));
    if (tag) {
      const t = tag.toLowerCase();
      data = data.filter((a) => (a.tags ?? []).some((x) => x.toLowerCase() === t));
    }

    return NextResponse.json({ data });
  } catch (e) {
    console.error('[BDS Articles]', e);
    return NextResponse.json(
      { data: BDS_ARTICLES_STATIC.map((a) => ({ slug: a.slug, title: a.title, excerpt: a.excerpt, publishedAt: a.date })) }
    );
  }
}
