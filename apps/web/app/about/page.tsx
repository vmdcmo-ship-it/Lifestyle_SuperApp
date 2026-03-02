import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Về chúng tôi - Lifestyle Super App',
  description:
    'Tìm hiểu về Lifestyle Super App - Ứng dụng tổng hợp lifestyle hàng đầu tại Việt Nam với giao đồ ăn, đặt xe, mua sắm và nhiều hơn nữa.',
  openGraph: {
    title: 'Về chúng tôi - Lifestyle Super App',
    description:
      'Tìm hiểu về Lifestyle Super App - Ứng dụng tổng hợp lifestyle hàng đầu tại Việt Nam.',
    type: 'website',
    url: '/about',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage(): JSX.Element {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Về Lifestyle Super App
            </h1>
            <p className="text-xl text-muted-foreground">
              Giải pháp tổng hợp cho cuộc sống hiện đại của bạn
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-4xl font-bold">Sứ mệnh của chúng tôi</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Lifestyle Super App được xây dựng với sứ mệnh mang đến trải nghiệm
              tổng hợp tốt nhất cho người dùng Việt Nam. Chúng tôi tin rằng cuộc sống
              hiện đại cần một giải pháp đơn giản, tiện lợi và đáng tin cậy.
            </p>
            <p className="text-lg text-muted-foreground">
              Với đội ngũ công nghệ hàng đầu và mạng lưới đối tác rộng khắp,
              chúng tôi cam kết mang đến dịch vụ chất lượng cao với giá cả hợp lý
              và nhiều ưu đãi hấp dẫn.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Dịch vụ của chúng tôi</h2>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            <ServiceCard
              icon="🍔"
              title="Giao đồ ăn"
              description="Đặt món từ hàng ngàn nhà hàng"
              href="/food-delivery"
            />
            <ServiceCard
              icon="🚗"
              title="Đặt xe"
              description="Di chuyển nhanh chóng, an toàn"
              href="/ride-hailing"
            />
            <ServiceCard
              icon="🛍️"
              title="Mua sắm"
              description="Hàng triệu sản phẩm với giá tốt"
              href="/shopping"
            />
            <ServiceCard
              icon="💰"
              title="Gói Tiết Kiệm"
              description="Combo dịch vụ siêu ưu đãi"
              href="/savings-packages"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Con số ấn tượng</h2>

          <div className="mx-auto grid max-w-4xl gap-8 text-center md:grid-cols-3">
            <StatCard number="5M+" label="Người dùng" />
            <StatCard number="10K+" label="Đối tác" />
            <StatCard number="50M+" label="Đơn hàng" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold">Giá trị cốt lõi</h2>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <ValueCard
              icon="❤️"
              title="Khách hàng là trung tâm"
              description="Mọi quyết định đều hướng đến lợi ích của khách hàng"
            />
            <ValueCard
              icon="⚡"
              title="Nhanh chóng & Tiện lợi"
              description="Tối ưu hóa trải nghiệm, tiết kiệm thời gian"
            />
            <ValueCard
              icon="🤝"
              title="Đáng tin cậy"
              description="Chất lượng dịch vụ và an toàn luôn được đảm bảo"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 p-12 text-center text-white shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Sẵn sàng trải nghiệm?
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Tải ứng dụng ngay để nhận ưu đãi đặc biệt!
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-purple-600 transition-transform hover:scale-105"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Components
interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  href: string;
}

function ServiceCard({ icon, title, description, href }: ServiceCardProps): JSX.Element {
  return (
    <Link
      href={href}
      className="rounded-2xl border bg-card p-6 text-center transition-all hover:shadow-lg"
    >
      <div className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps): JSX.Element {
  return (
    <div>
      <div className="mb-2 text-5xl font-bold text-purple-600">{number}</div>
      <div className="text-lg text-muted-foreground">{label}</div>
    </div>
  );
}

interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: ValueCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border bg-card p-6 text-center">
      <div className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
