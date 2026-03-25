import type { MetadataRoute } from 'next';
import { getLegalSlugs } from '@/lib/legal-articles';
import { siteBaseUrl } from '@/lib/site-url';

type ProjectRow = { slug: string };

async function fetchProjectSlugs(): Promise<string[]> {
  const api =
    process.env.INTERNAL_API_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (!api) {
    return [];
  }
  try {
    const res = await fetch(`${api}/projects`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return [];
    }
    const data = (await res.json()) as unknown;
    if (!Array.isArray(data)) {
      return [];
    }
    return data
      .filter((p): p is ProjectRow => typeof p === 'object' && p != null && typeof p.slug === 'string')
      .map((p) => p.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteBaseUrl();
  const now = new Date();

  const staticPaths = ['/', '/du-an', '/phap-ly', '/video', '/quiz'];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: path === '/' ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }));

  const [slugs, legalSlugs] = await Promise.all([fetchProjectSlugs(), Promise.resolve(getLegalSlugs())]);

  for (const slug of slugs) {
    entries.push({
      url: `${base}/du-an/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const slug of legalSlugs) {
    entries.push({
      url: `${base}/phap-ly/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
