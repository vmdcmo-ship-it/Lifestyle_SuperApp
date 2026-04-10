import type { Metadata } from 'next';
import Link from 'next/link';
import { BudgetCompareWidget } from '@/components/home/budget-compare-widget';
import { DualTabsPoi } from '@/components/home/dual-tabs-poi';
import { HeroProjectCarousel, type HeroSlide } from '@/components/home/hero-project-carousel';
import { ServiceGridFour } from '@/components/home/service-grid-four';
import { fetchProjects } from '@/lib/api';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/',
  title: 'Trang chủ',
  description:
    'Nhà ở xã hội và tìm nhà trọ — dự án NOXH, wiki pháp lý, trắc nghiệm điều kiện — timnhaxahoi.com.',
});

function IconArrow() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function toHeroSlides(projects: Awaited<ReturnType<typeof fetchProjects>>): HeroSlide[] {
  return projects.slice(0, 8).map((p) => ({
    slug: p.slug,
    name: p.name,
    location: [p.district, p.province].filter(Boolean).join(', ') || 'Việt Nam',
    estimateTriệu: Math.round((p.pricePerM2 * p.typicalAreaM2) / 1_000_000),
    pricePerM2Label: `Giá/m² từ ${p.pricePerM2.toLocaleString('vi-VN')} VNĐ`,
  }));
}

export default async function HomePage() {
  let allNoxh: Awaited<ReturnType<typeof fetchProjects>> = [];
  try {
    allNoxh = await fetchProjects('NOXH');
  } catch {
    allNoxh = [];
  }

  const heroSlides = toHeroSlides(allNoxh);
  const featured = allNoxh.slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <section aria-label="Dự án tiêu biểu">
        <HeroProjectCarousel slides={heroSlides} />
      </section>

      <section className="mt-8" aria-label="Tìm theo nhu cầu">
        <DualTabsPoi />
      </section>

      <ServiceGridFour />

      <section
        id="bang-tinh"
        className="mt-12 scroll-mt-24 glass-panel rounded-2xl p-6 md:p-8"
        aria-labelledby="budget-compare-heading"
      >
        <BudgetCompareWidget />
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/bang-tinh" className="font-medium text-brand-navy hover:underline">
            Mở trang riêng bảng tính
          </Link>
        </p>
      </section>

      <section className="mt-12 glass-panel rounded-2xl p-6 md:p-8" aria-labelledby="quiz-widget-heading">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Khám sức khỏe hồ sơ</p>
            <h2 id="quiz-widget-heading" className="mt-2 text-xl font-bold text-slate-900 md:text-2xl">
              Trắc nghiệm điều kiện NOXH
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-600">
              Vài bước ngắn — gợi ý phân khúc, điểm tham khảo và dự án phù hợp. Không thay thế tư vấn pháp lý chính thức.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              {['Công nhân', 'Cán bộ', 'Lao động tự do', 'Vợ chồng trẻ'].map((label) => (
                <li key={label} className="rounded-full border border-slate-200 bg-white/80 px-2.5 py-1">
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/quiz"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-gradient px-6 py-3.5 text-base font-semibold text-white shadow-glow transition hover:opacity-95"
          >
            Bắt đầu trắc nghiệm
            <IconArrow />
          </Link>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mt-12" aria-labelledby="featured-projects-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="featured-projects-heading" className="text-xl font-bold text-slate-900">
              Dự án NOXH tiêu biểu
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/bang-tinh"
                className="inline-flex items-center justify-center rounded-xl bg-brand-gold px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-amber-600"
              >
                Thử bảng tính so sánh
              </Link>
              <Link href="/du-an" className="text-sm font-medium text-brand-navy hover:underline">
                Xem tất cả dự án →
              </Link>
            </div>
          </div>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {featured.map((p) => {
              const est = Math.round((p.pricePerM2 * p.typicalAreaM2) / 1_000_000);
              return (
                <li key={p.id} className="glass-panel rounded-xl p-5">
                  <Link href={`/du-an/${p.slug}`} className="text-lg font-semibold text-brand-navy hover:underline">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    {[p.district, p.province].filter(Boolean).join(', ')}
                  </p>
                  <p className="mt-3 text-xs text-slate-600">
                    Giá/m² từ {p.pricePerM2.toLocaleString('vi-VN')} VNĐ · Ước tính ~{est} triệu ({p.typicalAreaM2}m²)
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="mt-12 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-600">
        <p>
          Hub <Link href="/video" className="font-medium text-brand-navy hover:underline">video</Link>
          {' · '}
          <Link href="/phap-ly" className="font-medium text-brand-navy hover:underline">
            wiki pháp lý
          </Link>{' '}
          — mở rộng nội dung theo từng đợt.
        </p>
      </section>
    </div>
  );
}
