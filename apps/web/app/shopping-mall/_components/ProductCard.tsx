/**
 * ProductCard - Card sản phẩm Luxury
 * Spec: Tập trung vào hình ảnh, giá ẩn hoặc tinh tế
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';

export interface ProductCardData {
  id: string;
  name: string;
  brand?: string;
  imageUrl: string;
  /** Giá có thể ẩn - hiển thị "Liên hệ" hoặc tinh tế */
  price?: number;
  showPrice?: boolean;
  category?: string;
  href: string;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps): JSX.Element {
  const displayPrice =
    product.showPrice !== false && product.price != null
      ? new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }).format(product.price)
      : null;

  return (
    <Link
      href={product.href}
      className="group block overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-amber-300 hover:shadow-lg"
      aria-label={`Xem chi tiết ${product.name}`}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        {product.brand && (
          <span className="absolute left-3 top-3 rounded bg-black/50 px-2 py-0.5 font-serif text-xs text-amber-200">
            {product.brand}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-serif text-sm font-medium group-hover:opacity-80" style={{ color: '#1e3a5f' }}>
          {product.name}
        </h3>
        {displayPrice ? (
          <p className="mt-2 font-serif text-xs font-medium" style={{ color: '#FFB800' }}>
            {displayPrice}
          </p>
        ) : (
          <p className="mt-2 font-serif text-xs italic text-slate-500">
            Liên hệ để biết giá
          </p>
        )}
      </div>
    </Link>
  );
}
