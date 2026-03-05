'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface RentalItem {
  id: string;
  title: string;
  propertyType: string;
  location: string;
  price?: number;
  area?: number;
  description?: string;
}

export function NhaChoThueListings(): JSX.Element {
  const [listings, setListings] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bat-dong-san/rental-listings?limit=6')
      .then((res) => res.json())
      .then((json: { data?: RentalItem[] }) => setListings(json.data ?? []))
      .catch(() => setListings([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/30 py-12 text-center">
        <p className="text-muted-foreground">Chưa có tin cho thuê. Hãy là người đầu tiên đăng tin!</p>
        <Link
          href="/bat-dong-san/nha-cho-thue/dang-tin"
          className="mt-4 inline-block font-medium text-amber-600 hover:underline"
        >
          Đăng tin ngay →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
        >
          <div className="flex h-28 items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
            <span className="text-4xl opacity-60">
              {item.propertyType?.includes('Căn hộ') ? '🏢' : '🏠'}
            </span>
          </div>
          <div className="p-4">
            <h3 className="line-clamp-2 font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.location}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {item.price != null && (
                <span className="rounded bg-amber-100 px-2 py-0.5 text-sm font-medium text-amber-800">
                  {item.price} triệu/tháng
                </span>
              )}
              {item.area != null && (
                <span className="rounded bg-slate-100 px-2 py-0.5 text-sm text-slate-600">
                  {item.area} m²
                </span>
              )}
            </div>
            <Link
              href={`/bat-dong-san/nha-cho-thue/${item.id}`}
              className="mt-3 block text-sm font-medium text-amber-600 hover:underline"
            >
              Xem chi tiết →
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
