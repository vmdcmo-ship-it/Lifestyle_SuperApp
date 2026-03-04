import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Giao Đồ Ăn Nhanh - Hàng Ngàn Nhà Hàng',
  description:
    'Đặt món từ hàng ngàn nhà hàng yêu thích của bạn. Giao nhanh trong 30 phút, ưu đãi hấp dẫn mỗi ngày. Miễn phí vận chuyển cho đơn hàng đầu tiên.',
  keywords: [
    'giao đồ ăn',
    'food delivery',
    'đặt món ăn',
    'giao hàng nhanh',
    'nhà hàng gần đây',
    'đồ ăn online',
  ],
  openGraph: {
    title: 'Giao Đồ Ăn Nhanh - Hàng Ngàn Nhà Hàng | Lifestyle Super App',
    description:
      'Đặt món từ hàng ngàn nhà hàng yêu thích. Giao nhanh 30 phút, ưu đãi mỗi ngày.',
    type: 'website',
    url: '/food-delivery',
    images: [
      {
        url: '/og-food-delivery.png',
        width: 1200,
        height: 630,
        alt: 'Giao đồ ăn nhanh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giao Đồ Ăn Nhanh - Hàng Ngàn Nhà Hàng',
    description: 'Đặt món từ hàng ngàn nhà hàng yêu thích. Giao nhanh 30 phút.',
    images: ['/twitter-food-delivery.png'],
  },
  alternates: {
    canonical: '/food-delivery',
  },
};

// Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Giao Đồ Ăn - Lifestyle Super App',
  description:
    'Dịch vụ giao đồ ăn nhanh chóng từ hàng ngàn nhà hàng với ưu đãi hấp dẫn',
  provider: {
    '@type': 'Organization',
    name: 'Lifestyle Super App',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Vietnam',
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Danh mục nhà hàng',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Giao đồ ăn nhanh',
        },
      },
    ],
  },
};

export default function FoodDeliveryPage(): JSX.Element {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 dark:from-orange-950 dark:via-red-950 dark:to-yellow-950">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Đặt món ngay
                <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {' '}
                  từ hàng ngàn nhà hàng
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Giao nhanh trong 30 phút. Miễn phí vận chuyển cho đơn hàng đầu tiên.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Đặt món ngay
                </Link>
                <Link
                  href="#restaurants"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-8 py-4 text-lg font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
                >
                  Xem nhà hàng
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Tại sao chọn chúng tôi?</h2>
              <p className="text-lg text-muted-foreground">
                Trải nghiệm đặt món tốt nhất với nhiều lợi ích
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="⚡"
                title="Giao siêu nhanh"
                description="Nhận đồ ăn trong vòng 30 phút hoặc hoàn tiền"
              />
              <FeatureCard
                icon="🎁"
                title="Ưu đãi mỗi ngày"
                description="Giảm giá lên đến 50% cho các nhà hàng đối tác"
              />
              <FeatureCard
                icon="🍜"
                title="Đa dạng món ăn"
                description="Hơn 10,000 món từ các nhà hàng nổi tiếng"
              />
              <FeatureCard
                icon="⭐"
                title="Đánh giá thật"
                description="Hệ thống đánh giá minh bạch từ người dùng thực"
              />
              <FeatureCard
                icon="🛡️"
                title="An toàn vệ sinh"
                description="Đảm bảo tiêu chuẩn ATTP nghiêm ngặt"
              />
              <FeatureCard
                icon="💳"
                title="Thanh toán linh hoạt"
                description="COD, Ví Lifestyle, MoMo, thẻ tín dụng và nhiều hơn nữa"
              />
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <Suspense fallback={<CategoriesSkeleton />}>
          <section id="restaurants" className="border-y bg-muted/50 py-20">
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <h2 className="mb-4 text-4xl font-bold">Danh mục phổ biến</h2>
                <p className="text-lg text-muted-foreground">
                  Khám phá các món ăn yêu thích của bạn
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CategoryCard
                  emoji="🍔"
                  title="Burger & Fast Food"
                  count="500+ nhà hàng"
                />
                <CategoryCard emoji="🍜" title="Món Việt" count="1,200+ nhà hàng" />
                <CategoryCard emoji="🍕" title="Pizza & Ý" count="300+ nhà hàng" />
                <CategoryCard emoji="🍱" title="Món Nhật" count="250+ nhà hàng" />
                <CategoryCard emoji="🍗" title="Gà rán" count="150+ nhà hàng" />
                <CategoryCard emoji="☕" title="Cà phê & Trà" count="800+ quán" />
                <CategoryCard emoji="🍰" title="Bánh ngọt" count="200+ tiệm" />
                <CategoryCard emoji="🥗" title="Healthy" count="180+ nhà hàng" />
              </div>
            </div>
          </section>
        </Suspense>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Đặt món dễ dàng chỉ 3 bước</h2>
            </div>

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <StepCard
                number="1"
                title="Chọn nhà hàng"
                description="Duyệt và chọn món từ hàng ngàn nhà hàng gần bạn"
              />
              <StepCard
                number="2"
                title="Đặt hàng"
                description="Thêm món vào giỏ và thanh toán nhanh chóng"
              />
              <StepCard
                number="3"
                title="Nhận đồ ăn"
                description="Theo dõi đơn hàng real-time và nhận trong 30 phút"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 p-12 text-center text-white shadow-2xl">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Đói bụng rồi? Đặt ngay!
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Nhận voucher giảm 50K cho đơn hàng đầu tiên khi đăng ký hôm nay!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-orange-600 transition-transform hover:scale-105"
                >
                  Đăng ký nhận ưu đãi
                </Link>
                <Link
                  href="/dang-ky-doi-tac?group=FOOD_DELIVERY"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white/60 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Nhà hàng đăng ký đối tác
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Component Types
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

interface CategoryCardProps {
  emoji: string;
  title: string;
  count: string;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

// Components
function FeatureCard({ icon, title, description }: FeatureCardProps): JSX.Element {
  return (
    <div className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-lg">
      <div className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function CategoryCard({ emoji, title, count }: CategoryCardProps): JSX.Element {
  return (
    <button
      type="button"
      className="group flex flex-col items-center justify-center rounded-xl border bg-card p-6 transition-all hover:scale-105 hover:shadow-lg"
    >
      <div className="mb-3 text-6xl" role="img" aria-label={title}>
        {emoji}
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{count}</p>
    </button>
  );
}

function StepCard({ number, title, description }: StepCardProps): JSX.Element {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 text-2xl font-bold text-white">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function CategoriesSkeleton(): JSX.Element {
  return (
    <section className="border-y bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="mb-4 h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="h-6 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex h-40 animate-pulse flex-col items-center justify-center rounded-xl border bg-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
