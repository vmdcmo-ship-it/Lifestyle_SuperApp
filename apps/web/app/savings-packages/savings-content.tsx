/**
 * Savings Packages Content - Client Component
 * Interactive content with real-time data
 */

'use client';

import { useFeaturedPackages, usePopularPackages } from '@/lib/hooks';
import { SavingsPackageType, SubscriptionPeriod } from '@lifestyle/types';
import Link from 'next/link';

export function SavingsPackagesContent(): JSX.Element {
  const { packages: featuredPackages, isLoading: featuredLoading } =
    useFeaturedPackages(6);
  const { packages: popularPackages, isLoading: popularLoading } =
    usePopularPackages(8);

  return (
    <>
      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Tại sao chọn Gói Tiết Kiệm?</h2>
            <p className="text-lg text-muted-foreground">
              Nhiều lợi ích vượt trội khi đăng ký gói
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            <BenefitCard
              icon="💰"
              title="Tiết kiệm lớn"
              description="Giảm đến 50% so với giá thường, càng dùng càng lời"
            />
            <BenefitCard
              icon="⚡"
              title="Tiện lợi"
              description="Không lo hết voucher, tự động gia hạn mỗi tháng"
            />
            <BenefitCard
              icon="🎁"
              title="Ưu đãi độc quyền"
              description="Nhận thêm Lifestyle Xu và quà tặng đặc biệt"
            />
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section id="packages" className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Gói nổi bật</h2>
            <p className="text-lg text-muted-foreground">
              Được lựa chọn nhiều nhất
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
            {featuredLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[500px] animate-pulse rounded-2xl border bg-card"
                  />
                ))
              : featuredPackages.map((pkg) => (
                  <PackageCard key={pkg.id} package={pkg} />
                ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Cách thức hoạt động</h2>
            <p className="text-lg text-muted-foreground">
              Đơn giản chỉ với 3 bước
            </p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              title="Chọn gói"
              description="Lựa chọn gói phù hợp với nhu cầu sử dụng của bạn"
            />
            <StepCard
              number="2"
              title="Thanh toán"
              description="Thanh toán một lần để kích hoạt gói ngay lập tức"
            />
            <StepCard
              number="3"
              title="Sử dụng"
              description="Tận hưởng dịch vụ với giá ưu đãi suốt thời gian gói"
            />
          </div>
        </div>
      </section>

      {/* Popular Packages */}
      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-4xl font-bold">Gói phổ biến</h2>
              <p className="text-lg text-muted-foreground">
                Được nhiều người đăng ký
              </p>
            </div>
            <Link
              href="/savings-packages/all"
              className="text-green-600 hover:underline"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-96 animate-pulse rounded-2xl border bg-card"
                  />
                ))
              : popularPackages.map((pkg) => (
                  <CompactPackageCard key={pkg.id} package={pkg} />
                ))}
          </div>
        </div>
      </section>

      {/* Package Types */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Các loại gói</h2>
            <p className="text-lg text-muted-foreground">
              Đa dạng lựa chọn cho mọi nhu cầu
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-4">
            <PackageTypeCard
              icon="🎁"
              title="Combo"
              description="Nhiều dịch vụ trong 1 gói"
            />
            <PackageTypeCard
              icon="🔄"
              title="Đăng ký"
              description="Gia hạn tự động hàng tháng"
            />
            <PackageTypeCard
              icon="💳"
              title="Trả trước"
              description="Nạp trước, dùng sau"
            />
            <PackageTypeCard
              icon="📦"
              title="Bundle"
              description="Gói sản phẩm tổng hợp"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold">Câu hỏi thường gặp</h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            <FAQItem
              question="Tôi có thể hủy gói bất cứ lúc nào không?"
              answer="Có, bạn có thể hủy gói bất cứ lúc nào. Số tiền còn lại sẽ được hoàn lại dưới dạng Lifestyle Xu."
            />
            <FAQItem
              question="Gói có tự động gia hạn không?"
              answer="Các gói Đăng ký sẽ tự động gia hạn. Bạn có thể tắt tính năng này trong cài đặt."
            />
            <FAQItem
              question="Tôi nhận được gì khi mua gói?"
              answer="Bạn sẽ nhận voucher giảm giá, ưu tiên giao hàng, và tích Lifestyle Xu nhiều hơn."
            />
            <FAQItem
              question="Có thể chia sẻ gói cho người khác không?"
              answer="Gói chỉ áp dụng cho tài khoản đã mua và không thể chuyển nhượng."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 p-12 text-center text-white shadow-2xl">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Bắt đầu tiết kiệm ngay hôm nay!
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Đăng ký gói đầu tiên và nhận thêm 500 Lifestyle Xu
            </p>
            <Link
              href="#packages"
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-green-600 transition-transform hover:scale-105"
            >
              Chọn gói ngay
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Component Types
interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

interface PackageTypeCardProps {
  icon: string;
  title: string;
  description: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

// Child Components
function BenefitCard({ icon, title, description }: BenefitCardProps): JSX.Element {
  return (
    <div className="rounded-2xl border bg-card p-6 text-center transition-all hover:shadow-lg">
      <div className="mb-4 text-5xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PackageCard({ package: pkg }: { package: any }): JSX.Element {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const isBestseller = pkg.isBestseller || pkg.isPopular;

  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:scale-105 hover:shadow-xl">
      {isBestseller && (
        <div className="absolute right-4 top-4 z-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
          🔥 Bán chạy
        </div>
      )}

      <div className="aspect-video bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900" />

      <div className="p-6">
        <h3 className="mb-2 text-xl font-bold line-clamp-2">{pkg.name}</h3>
        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
          {pkg.description}
        </p>

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-3xl font-bold text-green-600">
            {formatPrice(pkg.price.amount)}
          </span>
          {pkg.originalValue && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(pkg.originalValue.amount)}
            </span>
          )}
        </div>

        {pkg.discountPercentage > 0 && (
          <div className="mb-4 inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700 dark:bg-green-900 dark:text-green-300">
            <span>💰</span>
            Tiết kiệm {pkg.discountPercentage}%
          </div>
        )}

        <ul className="mb-6 space-y-2 text-sm">
          {pkg.features.slice(0, 3).map((feature: string, i: number) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-green-500">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button className="w-full rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg">
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}

function CompactPackageCard({ package: pkg }: { package: any }): JSX.Element {
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="group overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg">
      <div className="aspect-square bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900" />
      <div className="p-4">
        <h3 className="mb-2 font-semibold line-clamp-2">{pkg.name}</h3>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(pkg.price.amount)}
          </span>
          {pkg.discountPercentage > 0 && (
            <span className="text-xs text-green-600">-{pkg.discountPercentage}%</span>
          )}
        </div>
        <button className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}

function StepCard({ number, title, description }: StepCardProps): JSX.Element {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-2xl font-bold text-white">
        {number}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PackageTypeCard({ icon, title, description }: PackageTypeCardProps): JSX.Element {
  return (
    <div className="rounded-xl border bg-card p-6 text-center transition-all hover:shadow-lg">
      <div className="mb-3 text-4xl" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FAQItem({ question, answer }: FAQItemProps): JSX.Element {
  return (
    <details className="group rounded-lg border bg-card p-4">
      <summary className="flex cursor-pointer items-center justify-between font-semibold">
        {question}
        <span className="transition-transform group-open:rotate-180">▼</span>
      </summary>
      <p className="mt-3 text-sm text-muted-foreground">{answer}</p>
    </details>
  );
}
