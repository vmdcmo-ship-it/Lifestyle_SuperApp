import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Mua Sắm Online - Giá Tốt, Giao Nhanh',
  description:
    'Khám phá hàng triệu sản phẩm chính hãng với giá tốt nhất. Giao hàng nhanh chóng, đổi trả dễ dàng, thanh toán an toàn. Ưu đãi giảm đến 50% mỗi ngày.',
  keywords: [
    'mua sắm online',
    'shopping',
    'e-commerce',
    'mua hàng online',
    'giá rẻ',
    'giao hàng nhanh',
    'lazada',
    'shopee',
    'tiki',
  ],
  openGraph: {
    title: 'Mua Sắm Online - Giá Tốt, Giao Nhanh | Lifestyle Super App',
    description:
      'Khám phá hàng triệu sản phẩm chính hãng với giá tốt nhất. Giao nhanh, đổi trả dễ dàng.',
    type: 'website',
    url: '/shopping',
    images: [
      {
        url: '/og-shopping.png',
        width: 1200,
        height: 630,
        alt: 'Mua sắm online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mua Sắm Online - Giá Tốt, Giao Nhanh',
    description: 'Hàng triệu sản phẩm chính hãng. Giao nhanh, đổi trả dễ dàng.',
    images: ['/twitter-shopping.png'],
  },
  alternates: {
    canonical: '/shopping',
  },
};

// Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Mua Sắm Online - Lifestyle Super App',
  description:
    'Sàn thương mại điện tử với hàng triệu sản phẩm chính hãng, giá tốt, giao hàng nhanh',
  provider: {
    '@type': 'Organization',
    name: 'Lifestyle Super App',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vmd.asia') + '/shopping/search?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export default function ShoppingPage(): JSX.Element {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-20 dark:from-purple-950 dark:via-pink-950 dark:to-rose-950">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Mua sắm thông minh
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {' '}
                  giá tốt mỗi ngày
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Hàng triệu sản phẩm chính hãng. Giao hàng nhanh chóng. Đổi trả dễ dàng.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Mua sắm ngay
                </Link>
                <Link
                  href="#categories"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-8 py-4 text-lg font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
                >
                  Xem danh mục
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
                Trải nghiệm mua sắm tuyệt vời với nhiều lợi ích
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="✓"
                title="Chính hãng 100%"
                description="Cam kết sản phẩm chính hãng, hoàn tiền nếu phát hiện hàng giả"
              />
              <FeatureCard
                icon="🚚"
                title="Giao hàng nhanh"
                description="Giao trong 2 giờ tại nội thành, miễn phí với đơn từ 100K"
              />
              <FeatureCard
                icon="🎁"
                title="Ưu đãi mỗi ngày"
                description="Flash sale hàng giờ, voucher giảm đến 50%"
              />
              <FeatureCard
                icon="↺"
                title="Đổi trả 30 ngày"
                description="Đổi trả miễn phí trong 30 ngày nếu không hài lòng"
              />
              <FeatureCard
                icon="💳"
                title="Thanh toán an toàn"
                description="Bảo mật SSL, nhiều phương thức thanh toán"
              />
              <FeatureCard
                icon="🎯"
                title="Tích điểm thưởng"
                description="Nhận điểm cho mỗi đơn hàng, đổi quà hấp dẫn"
              />
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <Suspense fallback={<CategoriesSkeleton />}>
          <section id="categories" className="border-y bg-muted/50 py-20">
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <h2 className="mb-4 text-4xl font-bold">Danh mục nổi bật</h2>
                <p className="text-lg text-muted-foreground">
                  Khám phá các sản phẩm theo từng danh mục
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <CategoryCard
                  emoji="📱"
                  title="Điện thoại & Phụ kiện"
                  count="10,000+ sản phẩm"
                  color="from-blue-500 to-cyan-500"
                />
                <CategoryCard
                  emoji="👗"
                  title="Thời trang"
                  count="50,000+ sản phẩm"
                  color="from-pink-500 to-rose-500"
                />
                <CategoryCard
                  emoji="🏠"
                  title="Nhà cửa & Đời sống"
                  count="25,000+ sản phẩm"
                  color="from-orange-500 to-amber-500"
                />
                <CategoryCard
                  emoji="💄"
                  title="Làm đẹp"
                  count="15,000+ sản phẩm"
                  color="from-purple-500 to-fuchsia-500"
                />
                <CategoryCard
                  emoji="💻"
                  title="Laptop & Máy tính"
                  count="5,000+ sản phẩm"
                  color="from-slate-500 to-gray-500"
                />
                <CategoryCard
                  emoji="📚"
                  title="Sách & Văn phòng"
                  count="20,000+ sản phẩm"
                  color="from-emerald-500 to-teal-500"
                />
                <CategoryCard
                  emoji="⚽"
                  title="Thể thao"
                  count="8,000+ sản phẩm"
                  color="from-red-500 to-orange-500"
                />
                <CategoryCard
                  emoji="🎮"
                  title="Giải trí & Sở thích"
                  count="12,000+ sản phẩm"
                  color="from-indigo-500 to-blue-500"
                />
              </div>
            </div>
          </section>
        </Suspense>

        {/* Deals Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12">
              <h2 className="mb-4 text-4xl font-bold">Ưu đãi hot trong ngày</h2>
              <p className="text-lg text-muted-foreground">
                Săn deal ngay kẻo lỡ, số lượng có hạn!
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <DealCard
                  key={i}
                  discount={`-${30 + i * 10}%`}
                  timeLeft="Còn 2 giờ"
                />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Mua sắm dễ dàng chỉ 4 bước</h2>
            </div>

            <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-4">
              <StepCard
                number="1"
                title="Tìm sản phẩm"
                description="Tìm kiếm hoặc duyệt danh mục"
              />
              <StepCard
                number="2"
                title="Thêm giỏ hàng"
                description="Chọn size, màu sắc và số lượng"
              />
              <StepCard
                number="3"
                title="Thanh toán"
                description="Chọn phương thức thanh toán"
              />
              <StepCard
                number="4"
                title="Nhận hàng"
                description="Theo dõi đơn và nhận hàng"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 text-center md:grid-cols-4">
              <StatCard number="5M+" label="Sản phẩm" />
              <StatCard number="100K+" label="Đối tác bán hàng" />
              <StatCard number="50M+" label="Đơn hàng thành công" />
              <StatCard number="4.7★" label="Đánh giá khách hàng" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center text-white shadow-2xl">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Săn sale ngay thôi!
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Đăng ký hôm nay để nhận voucher giảm 200K cho đơn hàng đầu tiên!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 transition-transform hover:scale-105"
                >
                  Đăng ký nhận ưu đãi
                </Link>
                <Link
                  href="/dang-ky-doi-tac?group=GROCERY"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-white/60 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Cửa hàng đăng ký đối tác
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
  color: string;
}

interface DealCardProps {
  discount: string;
  timeLeft: string;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

interface StatCardProps {
  number: string;
  label: string;
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

function CategoryCard({ emoji, title, count, color }: CategoryCardProps): JSX.Element {
  return (
    <button
      type="button"
      className="group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:scale-105 hover:shadow-lg"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity group-hover:opacity-10`}
      />
      <div className="relative">
        <div className="mb-3 text-6xl" role="img" aria-label={title}>
          {emoji}
        </div>
        <h3 className="mb-1 text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{count}</p>
      </div>
    </button>
  );
}

function DealCard({ discount, timeLeft }: DealCardProps): JSX.Element {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:scale-105 hover:shadow-lg">
      <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900" />
      <div className="absolute left-4 top-4 rounded-lg bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
        {discount}
      </div>
      <div className="p-4">
        <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
        <div className="mb-3 h-4 w-1/2 rounded bg-muted" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">⏰ {timeLeft}</span>
          <button
            type="button"
            className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700"
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }: StepCardProps): JSX.Element {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-2xl font-bold text-white">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: StatCardProps): JSX.Element {
  return (
    <div>
      <div className="mb-2 text-4xl font-bold text-purple-600 md:text-5xl">{number}</div>
      <div className="text-lg text-muted-foreground">{label}</div>
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
              className="flex h-48 animate-pulse items-center justify-center rounded-xl border bg-card"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
