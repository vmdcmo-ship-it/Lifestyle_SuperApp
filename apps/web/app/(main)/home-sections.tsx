/**
 * Home Page Sections with Real Data
 * Separated components for better code organization
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePopularRestaurants, usePopularProducts, useRideServices } from '@/lib/hooks';
import { ProductType } from '@lifestyle/types';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';

/**
 * Featured Services Section
 */
export function FeaturedServicesSection(): JSX.Element {
  const { services, isLoading, error } = useRideServices();

  if (error) {
    console.error('Failed to load ride services:', error);
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading mb-4 text-4xl font-bold">Dịch vụ nổi bật</h2>
          <p className="text-lg text-muted-foreground">
            Khám phá những gì chúng tôi mang lại cho bạn
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border bg-card"
              />
            ))
          ) : (
            <>
              <ServiceCard
                icon="🍔"
                title="Giao đồ ăn"
                description="Đặt món ngay từ hàng ngàn nhà hàng yêu thích"
                href="/food-delivery"
              />
              <ServiceCard
                icon="🚗"
                title="Đặt xe"
                description={`${services.length} loại xe phục vụ mọi nhu cầu`}
                href="/ride-hailing"
              />
              <ServiceCard
                icon="🛍️"
                title="Mua sắm"
                description="Khám phá hàng triệu sản phẩm với giá tốt nhất"
                href="/shopping"
              />
              <ServiceCard
                icon="💳"
                title="Ví Lifestyle"
                description="Nạp tiền, thanh toán nhanh với ưu đãi hấp dẫn"
                href="/wallet"
              />
              <ServiceCard
                icon="💰"
                title="Gói Tiết Kiệm"
                description="Combo dịch vụ siêu ưu đãi, tiết kiệm đến 50%"
                href="/savings-packages"
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}

/**
 * Popular Restaurants Section
 */
export function PopularRestaurantsSection(): JSX.Element {
  const { restaurants, isLoading, error } = usePopularRestaurants(8);

  if (error) {
    console.error('Failed to load popular restaurants:', error);
    return null; // Don't show section if error
  }

  if (!isLoading && restaurants.length === 0) {
    return null; // Don't show empty section
  }

  return (
    <section className="border-y bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="font-heading mb-2 text-4xl font-bold">Nhà hàng phổ biến</h2>
            <p className="text-lg text-muted-foreground">
              Những địa điểm được yêu thích nhất
            </p>
          </div>
          <Link
            href="/food-delivery"
            className="text-purple-600 hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl border bg-card"
                />
              ))
            : restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  name={restaurant.name}
                  cuisineTypes={restaurant.cuisineTypes}
                  rating={restaurant.rating.average}
                  deliveryTime={`${restaurant.deliveryTime.min}-${restaurant.deliveryTime.max} phút`}
                  imageUrl={restaurant.logo}
                  href={`/food-delivery/${restaurant.slug}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Popular Products Section
 */
export function PopularProductsSection(): JSX.Element {
  const { products, isLoading, error } = usePopularProducts(8);

  if (error) {
    console.error('Failed to load popular products:', error);
    return null;
  }

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="font-heading mb-2 text-4xl font-bold">Sản phẩm bán chạy</h2>
            <p className="text-lg text-muted-foreground">
              Top sản phẩm được mua nhiều nhất
            </p>
          </div>
          <Link
            href="/shopping"
            className="text-purple-600 hover:underline"
          >
            Xem tất cả →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl border bg-card"
                />
              ))
            : products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={product.price.amount}
                  originalPrice={product.price.originalAmount}
                  rating={product.rating.average}
                  imageUrl={product.images[0]?.url}
                  productType={product.productType}
                  href={`/shopping/${product.slug}`}
                />
              ))}
        </div>
      </div>
    </section>
  );
}

// Component Props Types
interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface RestaurantCardProps {
  name: string;
  cuisineTypes: string[];
  rating: number;
  deliveryTime: string;
  imageUrl: string;
  href: string;
}

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  imageUrl: string;
  productType: ProductType;
  href: string;
}

// Child Components
function ServiceCard({ icon, title, description, href }: ServiceCardProps): JSX.Element {
  return (
    <Link
      href={href}
      className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-lg"
    >
      <div className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
}

function RestaurantCard({
  name,
  cuisineTypes,
  rating,
  deliveryTime,
  imageUrl,
  href,
}: RestaurantCardProps): JSX.Element {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(imageUrl && imageUrl.trim() && !imgError);

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900">
        {showImage ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
            onError={() => setImgError(true)}
            unoptimized={imageUrl.startsWith('http')}
          />
        ) : (
          <ImagePlaceholder type="restaurant" />
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 font-semibold line-clamp-1">{name}</h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {cuisineTypes.join(', ')}
        </p>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center">
            ⭐ {rating.toFixed(1)}
          </span>
          <span className="text-muted-foreground">🚚 {deliveryTime}</span>
        </div>
      </div>
    </Link>
  );
}

function ProductCard({
  name,
  price,
  originalPrice,
  rating,
  imageUrl,
  productType,
  href,
}: ProductCardProps): JSX.Element {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(imageUrl && imageUrl.trim() && !imgError);

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const discountPercent = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <Link
      href={href}
      className="group overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        {showImage ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setImgError(true)}
            unoptimized={imageUrl.startsWith('http')}
          />
        ) : (
          <ImagePlaceholder type="product" />
        )}
        {discountPercent > 0 && (
          <div className="absolute left-2 top-2 rounded-lg bg-red-500 px-2 py-1 text-xs font-bold text-white">
            -{discountPercent}%
          </div>
        )}
        {productType === ProductType.NON_PHYSICAL && (
          <div className="absolute right-2 top-2 rounded-lg bg-blue-500 px-2 py-1 text-xs font-bold text-white">
            Digital
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-2 font-semibold line-clamp-2">{name}</h3>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-lg font-bold text-purple-600">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        <div className="flex items-center text-sm">
          <span className="flex items-center">
            ⭐ {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </Link>
  );
}
