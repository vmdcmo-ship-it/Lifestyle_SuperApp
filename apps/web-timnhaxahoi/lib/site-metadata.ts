import type { Metadata } from 'next';
import { siteBaseUrl } from './site-url';

export type PageMetaInput = {
  /** Đường dẫn tuyệt đối trên site, ví dụ `/quiz` hoặc `/` */
  path: string;
  title: string;
  description: string;
  openGraphType?: 'website' | 'article';
  /** VD dashboard — không index */
  robots?: Metadata['robots'];
};

/**
 * Title + description + canonical + Open Graph + Twitter Card (summary_large_image).
 * `metadataBase` trong `app/layout.tsx` phải trùng `NEXT_PUBLIC_SITE_URL` khi build.
 */
export function pageMetadata(input: PageMetaInput): Metadata {
  const path = normalizePath(input.path);
  const base = siteBaseUrl();
  const url = `${base}${path === '/' ? '' : path}`;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: path },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: 'timnhaxahoi.com',
      locale: 'vi_VN',
      type: input.openGraphType ?? 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    },
    robots: input.robots,
  };
}

function normalizePath(path: string): string {
  if (path === '' || path === '/') {
    return '/';
  }
  return path.startsWith('/') ? path : `/${path}`;
}

/** Dùng trong `generateMetadata` khi đã có URL / path đầy đủ. */
export function mergeArticleMetadata(
  path: string,
  title: string,
  description: string,
): Pick<Metadata, 'alternates' | 'openGraph' | 'twitter'> {
  const base = siteBaseUrl();
  const p = normalizePath(path);
  const url = `${base}${p === '/' ? '' : p}`;
  return {
    alternates: { canonical: p },
    openGraph: {
      title,
      description,
      url,
      siteName: 'timnhaxahoi.com',
      locale: 'vi_VN',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
