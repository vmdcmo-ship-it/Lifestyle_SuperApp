/**
 * Nhà cho thuê - Chi tiết tin cho thuê
 * Dynamic route: /bat-dong-san/nha-cho-thue/[id]
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { BdsBreadcrumb } from '../../_components/bds-breadcrumb';
import { RentalListingJsonLd } from '@/lib/seo/json-ld';
import { RENTAL_LISTINGS_STATIC } from '@/lib/config/bat-dong-san-rental-listings';

/** Pre-render các tin static khi build */
export function generateStaticParams(): { id: string }[] {
  return RENTAL_LISTINGS_STATIC.map((r) => ({ id: r.id }));
}

async function fetchRentalListing(id: string) {
  try {
    const headersList = await headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host') || 'localhost:3000';
    const proto = headersList.get('x-forwarded-proto') || 'http';
    const baseUrl = `${proto}://${host}`;
    const res = await fetch(`${baseUrl}/api/bat-dong-san/rental-listings/${encodeURIComponent(id)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Record<string, unknown> };
    return json.data;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await fetchRentalListing(id);
  const staticItem = RENTAL_LISTINGS_STATIC.find((r) => r.id === id);
  const data = item ?? staticItem;
  if (!data) return { title: 'Không tìm thấy tin' };
  const title = String((data as { title?: string }).title ?? 'Tin cho thuê');
  return {
    title: `${title} | Nhà cho thuê`,
    description: (data as { description?: string }).description ?? undefined,
    alternates: { canonical: `/bat-dong-san/nha-cho-thue/${id}` },
  };
}

export default async function NhaChoThueDetailPage({ params }: Props): Promise<JSX.Element> {
  const { id } = await params;
  const item = await fetchRentalListing(id);
  const staticItem = RENTAL_LISTINGS_STATIC.find((r) => r.id === id);
  const data = item ?? staticItem;
  if (!data) notFound();

  const title = String((data as { title?: string }).title ?? 'Tin cho thuê');
  const propertyType = String((data as { propertyType?: string }).propertyType ?? '');
  const location = String((data as { location?: string }).location ?? '');
  const district = (data as { district?: string }).district;
  const price = (data as { price?: number }).price;
  const area = (data as { area?: number }).area;
  const description = (data as { description?: string }).description ?? '';
  const contactPhone = (data as { contactPhone?: string }).contactPhone;
  const createdAt = (data as { createdAt?: string }).createdAt;

  const breadcrumbItems = [
    { label: 'Nhà cho thuê', href: '/bat-dong-san/nha-cho-thue' },
    { label: title, href: `/bat-dong-san/nha-cho-thue/${id}` },
  ];

  const listingPath = `/bat-dong-san/nha-cho-thue/${id}`;

  return (
    <div className="min-h-screen">
      <BdsBreadcrumb items={breadcrumbItems} />
      <RentalListingJsonLd
        name={title}
        description={description || `${propertyType} ${location}`}
        url={listingPath}
        price={price != null ? price * 1_000_000 : undefined}
        area={area}
        address={location}
      />
      <article className="rounded-2xl border bg-card overflow-hidden">
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
          <span className="text-6xl opacity-70">
            {propertyType?.includes('Căn hộ') ? '🏢' : '🏠'}
          </span>
        </div>
        <div className="p-6 md:p-8">
          <header>
            <h1 className="font-heading text-2xl font-bold md:text-3xl">{title}</h1>
            <div className="mt-3 flex flex-wrap gap-2">
              {propertyType && (
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
                  {propertyType}
                </span>
              )}
              {district && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                  {district}
                </span>
              )}
            </div>
            {location && (
              <p className="mt-2 text-muted-foreground">
                📍 {location}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-4">
              {price != null && (
                <span className="rounded-xl bg-amber-100 px-4 py-2 font-semibold text-amber-800">
                  {price} triệu/tháng
                </span>
              )}
              {area != null && (
                <span className="rounded-xl bg-slate-100 px-4 py-2 text-slate-700">
                  {area} m²
                </span>
              )}
            </div>
          </header>

          {description && (
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Mô tả</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">{description}</p>
            </div>
          )}

          {contactPhone && (
            <div className="mt-8 rounded-xl border-2 border-amber-200 bg-amber-50 p-6">
              <h2 className="mb-2 font-semibold">Liên hệ xem nhà</h2>
              <p className="text-lg font-medium text-amber-800">{contactPhone}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Vui lòng gọi trước khi đến xem. Chủ nhà/môi giới sẽ hướng dẫn chi tiết.
              </p>
            </div>
          )}

          {createdAt && (
            <p className="mt-6 text-sm text-muted-foreground">
              Đăng ngày: {createdAt}
            </p>
          )}
        </div>
      </article>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/bat-dong-san/nha-cho-thue"
          className="font-medium text-amber-600 hover:underline"
        >
          ← Xem tin khác
        </Link>
        <Link
          href="/bat-dong-san/tim-bat-dong-san"
          className="font-medium text-amber-600 hover:underline"
        >
          Tìm theo nhu cầu của tôi →
        </Link>
      </div>
    </div>
  );
}
