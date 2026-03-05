import Link from 'next/link';
import { BreadcrumbJsonLd } from '@/lib/seo/json-ld';

export interface BdsBreadcrumbItem {
  label: string;
  href?: string;
}

interface BdsBreadcrumbProps {
  items: BdsBreadcrumbItem[];
}

/** Breadcrumb cho các trang Bất động sản - SEO + UI */
export function BdsBreadcrumb({ items }: BdsBreadcrumbProps): JSX.Element {
  const jsonLdItems = [
    { name: 'Trang chủ', url: '/' },
    { name: 'Bất động sản', url: '/bat-dong-san' },
    ...items.map((i) => ({ name: i.label, url: i.href || '#' })),
  ].filter((i) => i.url !== '#');

  return (
    <>
      <BreadcrumbJsonLd items={jsonLdItems} />
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/bat-dong-san" className="hover:text-amber-600">
          Bất động sản
        </Link>
        {items.map((item, i) => (
          <span key={i}>
            <span className="mx-2">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-amber-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
