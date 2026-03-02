import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

// SEO Metadata
export const metadata: Metadata = {
  title: 'Đặt Xe Nhanh - Di Chuyển An Toàn, Tiện Lợi',
  description:
    'Đặt xe trong vài giây với nhiều loại xe phù hợp. Giá cả minh bạch, tài xế uy tín, an toàn tuyệt đối. Ưu đãi lên đến 100K cho chuyến đi đầu tiên.',
  keywords: [
    'đặt xe',
    'ride hailing',
    'grab',
    'uber',
    'taxi online',
    'di chuyển',
    'gọi xe',
    'xe ôm công nghệ',
  ],
  openGraph: {
    title: 'Đặt Xe Nhanh - Di Chuyển An Toàn, Tiện Lợi | Lifestyle Super App',
    description:
      'Đặt xe trong vài giây. Giá minh bạch, tài xế uy tín, an toàn tuyệt đối.',
    type: 'website',
    url: '/ride-hailing',
    images: [
      {
        url: '/og-ride-hailing.png',
        width: 1200,
        height: 630,
        alt: 'Đặt xe nhanh chóng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Đặt Xe Nhanh - Di Chuyển An Toàn, Tiện Lợi',
    description: 'Đặt xe trong vài giây. Giá minh bạch, tài xế uy tín.',
    images: ['/twitter-ride-hailing.png'],
  },
  alternates: {
    canonical: '/ride-hailing',
  },
};

// Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Đặt Xe - Lifestyle Super App',
  description:
    'Dịch vụ đặt xe công nghệ với nhiều loại xe, giá cả minh bạch và tài xế chuyên nghiệp',
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
    name: 'Các loại xe',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Xe máy',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Xe 4 chỗ',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Xe 7 chỗ',
        },
      },
    ],
  },
};

export default function RideHailingPage(): JSX.Element {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 py-20 dark:from-blue-950 dark:via-cyan-950 dark:to-teal-950">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                Di chuyển dễ dàng
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  {' '}
                  mọi lúc mọi nơi
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Đặt xe trong vài giây. Giá cả minh bạch, tài xế uy tín, an toàn tuyệt đối.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Đặt xe ngay
                </Link>
                <Link
                  href="#vehicle-types"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-foreground/20 bg-background px-8 py-4 text-lg font-semibold transition-colors hover:border-foreground/40 hover:bg-accent"
                >
                  Xem loại xe
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
                Trải nghiệm di chuyển tốt nhất với nhiều lợi ích
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon="⚡"
                title="Tìm xe nhanh chóng"
                description="Xe đến trong vòng 3-5 phút với mạng lưới tài xế rộng khắp"
              />
              <FeatureCard
                icon="💰"
                title="Giá cả minh bạch"
                description="Xem trước giá cước, không phát sinh chi phí ẩn"
              />
              <FeatureCard
                icon="🛡️"
                title="An toàn tuyệt đối"
                description="Bảo hiểm cho mỗi chuyến đi, SOS khẩn cấp 24/7"
              />
              <FeatureCard
                icon="⭐"
                title="Tài xế chuyên nghiệp"
                description="Được đào tạo bài bản, đánh giá cao từ khách hàng"
              />
              <FeatureCard
                icon="🎁"
                title="Ưu đãi hấp dẫn"
                description="Voucher giảm giá và điểm thưởng cho mỗi chuyến đi"
              />
              <FeatureCard
                icon="📱"
                title="Theo dõi real-time"
                description="Xem vị trí xe và thời gian đến trên bản đồ"
              />
            </div>
          </div>
        </section>

        {/* Vehicle Types */}
        <Suspense fallback={<VehicleTypesSkeleton />}>
          <section id="vehicle-types" className="border-y bg-muted/50 py-20">
            <div className="container mx-auto px-4">
              <div className="mb-12">
                <h2 className="mb-4 text-4xl font-bold">Chọn loại xe phù hợp</h2>
                <p className="text-lg text-muted-foreground">
                  Đa dạng phương tiện cho mọi nhu cầu di chuyển
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <VehicleCard
                  icon="🏍️"
                  title="Xe máy"
                  description="Di chuyển nhanh trong thành phố"
                  price="Từ 8,000đ/km"
                  features={['1 người', 'Nhanh nhất', 'Tiết kiệm']}
                />
                <VehicleCard
                  icon="🚗"
                  title="Xe 4 chỗ"
                  description="Thoải mái và tiện nghi"
                  price="Từ 12,000đ/km"
                  features={['3-4 người', 'Điều hòa', 'Rộng rãi']}
                />
                <VehicleCard
                  icon="🚙"
                  title="Xe 7 chỗ"
                  description="Cho gia đình hoặc nhóm bạn"
                  price="Từ 16,000đ/km"
                  features={['5-7 người', 'Hành lý nhiều', 'Thoải mái']}
                />
                <VehicleCard
                  icon="🚕"
                  title="Xe sang"
                  description="Đẳng cấp và chuyên nghiệp"
                  price="Từ 25,000đ/km"
                  features={['Premium', 'VIP', 'Sang trọng']}
                />
              </div>
            </div>
          </section>
        </Suspense>

        {/* How It Works */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Đặt xe chỉ trong 3 bước</h2>
            </div>

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
              <StepCard
                number="1"
                title="Nhập điểm đến"
                description="Chọn điểm đón và điểm đến trên bản đồ"
              />
              <StepCard
                number="2"
                title="Chọn loại xe"
                description="Lựa chọn phương tiện phù hợp với nhu cầu"
              />
              <StepCard
                number="3"
                title="Lên xe và đi"
                description="Theo dõi tài xế real-time và di chuyển an toàn"
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-muted/50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 text-center md:grid-cols-4">
              <StatCard number="3M+" label="Chuyến đi/tháng" />
              <StatCard number="50K+" label="Tài xế đối tác" />
              <StatCard number="4.8★" label="Đánh giá trung bình" />
              <StatCard number="63" label="Thành phố" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 p-12 text-center text-white shadow-2xl">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Sẵn sàng di chuyển?
              </h2>
              <p className="mb-8 text-lg opacity-90">
                Đăng ký ngay để nhận voucher giảm 100K cho chuyến đi đầu tiên!
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-transform hover:scale-105"
              >
                Đăng ký nhận ưu đãi
              </Link>
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

interface VehicleCardProps {
  icon: string;
  title: string;
  description: string;
  price: string;
  features: string[];
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

function VehicleCard({
  icon,
  title,
  description,
  price,
  features,
}: VehicleCardProps): JSX.Element {
  return (
    <div className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:scale-105 hover:shadow-lg">
      <div className="mb-4 text-6xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-3 text-sm text-muted-foreground">{description}</p>
      <p className="mb-4 text-lg font-bold text-blue-600">{price}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm text-muted-foreground">
            <svg
              className="mr-2 h-4 w-4 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepCard({ number, title, description }: StepCardProps): JSX.Element {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-2xl font-bold text-white">
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
      <div className="mb-2 text-4xl font-bold text-blue-600 md:text-5xl">{number}</div>
      <div className="text-lg text-muted-foreground">{label}</div>
    </div>
  );
}

function VehicleTypesSkeleton(): JSX.Element {
  return (
    <section className="border-y bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="mb-4 h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="h-6 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-2xl border bg-card p-6"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
