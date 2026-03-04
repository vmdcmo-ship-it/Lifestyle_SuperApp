import type { Metadata } from 'next';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchNewsLinks() {
  try {
    const res = await fetch(
      `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/news/public/links?audience=USER&locale=vi`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.items || [];
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Tin tức thể thao - Cộng đồng',
  description: 'Tin tức Tennis, Pickleball, Run to Earn',
  alternates: { canonical: '/the-thao/tin-tuc' },
};

export default async function CongDongTinTucPage() {
  const items = await fetchNewsLinks();
  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/the-thao">Cộng đồng</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tin tức</span>
      </nav>
      <h1 className="font-heading mb-8 text-3xl font-bold">Tin tức thể thao</h1>
      {items.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
          <p>Đang cập nhật tin tức.</p>
          <Link href="/the-thao" className="mt-4 inline-block text-primary">← Về Cộng đồng</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item: { slug: string; title: string; excerpt?: string }) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="block rounded-xl border bg-card p-6 hover:bg-muted/50">
              <h2 className="font-semibold">{item.title}</h2>
              {item.excerpt && <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
      <div className="mt-8"><Link href="/the-thao" className="text-sm font-medium text-primary hover:underline">← Về Cộng đồng</Link></div>
    </div>
  );
}
