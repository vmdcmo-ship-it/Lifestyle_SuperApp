'use client';

import Link from 'next/link';

interface SpotlightFeedClientProps {
  categories: { id: string; slug: string; name: string }[];
  locations: { id: string; code: string; name: string }[];
  currentFilters: {
    page: number;
    category?: string;
    regionId?: string;
    sort?: string;
    tag?: string;
  };
}

export function SpotlightFeedClient({
  categories,
  locations,
  currentFilters,
}: SpotlightFeedClientProps): JSX.Element {
  const buildUrl = (overrides: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { ...currentFilters, ...overrides };
    if (merged.category) p.set('category', merged.category);
    if (merged.regionId) p.set('regionId', merged.regionId);
    if (merged.sort && merged.sort !== 'latest') p.set('sort', merged.sort);
    if (merged.tag) p.set('tag', merged.tag as string);
    const page = merged.page ?? 1;
    if (page > 1) p.set('page', String(page));
    return `/spotlight${p.toString() ? `?${p}` : ''}`;
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <span className="text-sm text-muted-foreground">Thể loại:</span>
      <Link
        href={buildUrl({ category: undefined, page: 1 })}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          !currentFilters.category
            ? 'bg-purple-600 text-white'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        Tất cả
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={buildUrl({ category: c.slug, page: 1 })}
          className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
            currentFilters.category === c.slug
              ? 'bg-purple-600 text-white'
              : 'bg-muted hover:bg-muted/80'
          }`}
        >
          {c.name}
        </Link>
      ))}

      <span className="ml-4 text-sm text-muted-foreground">Địa điểm:</span>
      <select
        className="rounded-lg border bg-background px-3 py-1.5 text-sm"
        defaultValue={currentFilters.regionId || ''}
        onChange={(e) => {
          const v = e.target.value;
          window.location.href = buildUrl({
            regionId: v || undefined,
            page: 1,
          });
        }}
      >
        <option value="">Tất cả</option>
        {locations.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      {currentFilters.tag ? (
        <span className="ml-4 flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Tag:</span>
          <Link
            href={buildUrl({ tag: undefined, page: 1 })}
            className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-200 dark:hover:bg-amber-800"
          >
            #{currentFilters.tag} ✕
          </Link>
        </span>
      ) : null}

      <span className="ml-4 text-sm text-muted-foreground">Sắp xếp:</span>
      <Link
        href={buildUrl({ sort: 'latest', page: 1 })}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          (currentFilters.sort || 'latest') === 'latest'
            ? 'bg-purple-600 text-white'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        Mới nhất
      </Link>
      <Link
        href={buildUrl({ sort: 'popular', page: 1 })}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          currentFilters.sort === 'popular'
            ? 'bg-purple-600 text-white'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        Phổ biến
      </Link>
      <Link
        href={buildUrl({ sort: 'trending', page: 1 })}
        className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
          currentFilters.sort === 'trending'
            ? 'bg-purple-600 text-white'
            : 'bg-muted hover:bg-muted/80'
        }`}
      >
        Xu hướng
      </Link>
    </div>
  );
}
