import type { Metadata } from 'next';
import Link from 'next/link';
import { SpotlightFeedClient } from '../spotlight-feed-client';
import { SpotlightFeedTabs } from '../spotlight-feed-tabs';
import {
  SILO_CONFIG,
  fetchSiloFeed,
  fetchSiloCategories,
  fetchSiloLocations,
} from '../_lib/spotlight-silo';

const SILO = 'an-uong';

export const metadata: Metadata = {
  title: SILO_CONFIG[SILO].title,
  description: SILO_CONFIG[SILO].description,
  alternates: { canonical: `/spotlight/${SILO}` },
  openGraph: {
    title: SILO_CONFIG[SILO].title,
    description: SILO_CONFIG[SILO].description,
    url: `/spotlight/${SILO}`,
  },
};

interface PageProps {
  searchParams: Promise<{
    page?: string;
    regionId?: string;
    sort?: 'latest' | 'popular' | 'trending';
    tab?: 'for_you' | 'all' | 'following';
    tag?: string;
  }>;
}

export default async function AnUongPage({
  searchParams,
}: PageProps): Promise<JSX.Element> {
  const config = SILO_CONFIG[SILO];
  const sp = await searchParams;
  const tab =
    sp.tab === 'following'
      ? 'following'
      : sp.tab === 'for_you'
        ? 'for_you'
        : 'all';
  const fetchSort = tab === 'for_you' ? 'trending' : (sp.sort || 'latest');

  const [feed, categoriesRes, locationsRes] = await Promise.all([
    tab === 'all' || tab === 'for_you'
      ? fetchSiloFeed({
          page: 1,
          limit: 20,
          category: config.categorySlug,
          regionId: sp.regionId,
          sort: fetchSort,
          tag: sp.tag,
        })
      : Promise.resolve({
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        }),
    fetchSiloCategories(),
    fetchSiloLocations(),
  ]);

  const categories = categoriesRes?.data || [];
  const locations = locationsRes?.data || [];
  const basePath = `/spotlight/${SILO}`;
  const siloLabel = config.title.split(' - ')[0];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: '/' },
      { '@type': 'ListItem', position: 2, name: 'Spotlight', item: '/spotlight' },
      { '@type': 'ListItem', position: 3, name: siloLabel, item: basePath },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <nav
                className="mb-2 text-sm text-muted-foreground"
                aria-label="Breadcrumb"
              >
                <Link href="/spotlight" className="hover:text-foreground">
                  Spotlight
                </Link>
                <span className="mx-2">/</span>
                <span className="text-foreground">{siloLabel}</span>
              </nav>
              <h1 className="font-heading text-2xl font-bold md:text-3xl">
                {siloLabel}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {config.description}
              </p>
            </div>
            <Link
              href="/spotlight/create"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="mr-2">+</span>
              Đăng video
            </Link>
          </div>

          {(tab === 'all' || tab === 'for_you') && (
            <SpotlightFeedClient
              categories={categories}
              locations={locations}
              currentFilters={{
                page: 1,
                category: config.categorySlug,
                regionId: sp.regionId,
                sort: tab === 'for_you' ? 'trending' : (sp.sort || 'latest'),
                tag: sp.tag,
              }}
              basePath={basePath}
              lockCategory
            />
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <SpotlightFeedTabs
          tab={tab}
          initialData={feed.data}
          initialPagination={feed.pagination}
          filters={{
            category: config.categorySlug,
            regionId: sp.regionId,
            sort: tab === 'for_you' ? 'trending' : (sp.sort || 'latest'),
            tag: sp.tag,
          }}
          categories={categories}
          locations={locations}
          basePath={basePath}
        />
      </div>
    </div>
  );
}
