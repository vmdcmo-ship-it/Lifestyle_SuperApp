/**
 * JSON-LD Schema components for SEO
 * BreadcrumbList, Article, Organization...
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vmd.asia';

function absoluteUrl(path: string): string {
  return path.startsWith('http') ? path : `${BASE_URL.replace(/\/$/, '')}${path.startsWith('/') ? '' : '/'}${path}`;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }): JSX.Element {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ArticleJsonLdProps {
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  url: string;
}

export function ArticleJsonLd({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = 'Lifestyle Super App',
  url,
}: ArticleJsonLdProps): JSX.Element {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: description || headline,
    image: image ? absoluteUrl(image) : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Lifestyle Super App',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo-kodo.svg'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(url),
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface VideoObjectJsonLdProps {
  name: string;
  description?: string;
  thumbnailUrl?: string | null;
  uploadDate: string; // ISO 8601
  contentUrl?: string | null;
  embedUrl?: string | null;
  duration?: number | null; // seconds
  interactionCount?: number;
  url: string; // page URL
  author?: string;
}

export function VideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  duration,
  interactionCount,
  url,
  author = 'Lifestyle Super App',
}: VideoObjectJsonLdProps): JSX.Element {
  const thumbUrl = thumbnailUrl ? (thumbnailUrl.startsWith('http') ? thumbnailUrl : absoluteUrl(thumbnailUrl)) : undefined;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name,
    description: description || name,
    thumbnail: thumbUrl,
    thumbnailUrl: thumbUrl,
    uploadDate,
    url: absoluteUrl(url),
    publisher: {
      '@type': 'Organization',
      name: 'Lifestyle Super App',
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo-kodo.svg'),
      },
    },
    author: { '@type': 'Organization', name: author },
  };

  if (contentUrl) schema.contentUrl = contentUrl.startsWith('http') ? contentUrl : absoluteUrl(contentUrl);
  if (embedUrl) schema.embedUrl = embedUrl.startsWith('http') ? embedUrl : absoluteUrl(embedUrl);
  if (duration != null && duration > 0) {
    const m = Math.floor(duration / 60);
    const s = Math.floor(duration % 60);
    schema.duration = `PT${m}M${s}S`;
  }
  if (interactionCount != null && interactionCount > 0) {
    schema.interactionStatistic = {
      '@type': 'InteractionCounter',
      interactionType: { '@type': 'WatchAction' },
      userInteractionCount: interactionCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Schema FAQPage cho SEO - câu hỏi thường gặp */
export interface FaqJsonLdProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FaqJsonLd({ faqs }: FaqJsonLdProps): JSX.Element {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/** Schema cho tin cho thuê bất động sản - Product + Offer */
export interface RentalListingJsonLdProps {
  name: string;
  description?: string;
  url: string;
  price?: number;
  priceCurrency?: string;
  area?: number;
  address?: string;
  itemCondition?: string;
}

export function RentalListingJsonLd({
  name,
  description,
  url,
  price,
  priceCurrency = 'VND',
  area,
  address,
  itemCondition = 'https://schema.org/UsedCondition',
}: RentalListingJsonLdProps): JSX.Element {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || name,
    url: absoluteUrl(url),
    category: 'Bất động sản cho thuê',
  };
  if (price != null && price > 0) {
    schema.offers = {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: 'https://schema.org/InStock',
    };
  }
  if (area != null && area > 0) {
    schema.additionalProperty = {
      '@type': 'PropertyValue',
      name: 'Diện tích',
      value: `${area} m²`,
    };
  }
  if (address) {
    schema.address = { '@type': 'PostalAddress', addressLocality: address };
  }
  if (itemCondition) {
    schema.itemCondition = itemCondition;
  }
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
