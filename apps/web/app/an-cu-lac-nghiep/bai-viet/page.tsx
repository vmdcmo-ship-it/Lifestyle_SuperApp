/**
 * An Cư Lạc Nghiệp - Bài viết SEO
 * Thu hút người đọc tìm kiếm nhà ở xã hội trên trình duyệt và app
 * Fetch từ CMS API, fallback sang data tĩnh
 */

import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Bài viết - Nhà ở xã hội',
  description:
    'Bài viết hướng dẫn, tin tức nhà ở xã hội. Mua, thuê mua nhà xã hội TP.HCM, Bình Dương. Điều kiện, thủ tục.',
  alternates: { canonical: '/an-cu-lac-nghiep/bai-viet' },
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

const FALLBACK_ARTICLES = [
  { slug: 'dieu-kien-mua-nha-o-xa-hoi-2024', title: 'Điều kiện mua nhà ở xã hội 2024', excerpt: 'Hướng dẫn chi tiết điều kiện, đối tượng và thủ tục mua nhà ở xã hội năm 2024.', image: null, date: '2024-01-15' },
  { slug: 'thue-mua-nha-o-xa-hoi-uu-nhuoc-diem', title: 'Thuê mua nhà ở xã hội – Ưu và nhược điểm', excerpt: 'So sánh mua trực tiếp và thuê mua, lãi suất, thời gian thanh toán.', image: null, date: '2024-01-10' },
  { slug: 'du-an-nha-o-xa-hoi-tphcm-moi-nhat', title: 'Dự án nhà ở xã hội TP.HCM mới nhất', excerpt: 'Tổng hợp các dự án nhà ở xã hội đang mở bán tại TP.HCM.', image: null, date: '2024-01-05' },
  { slug: 'nha-o-xa-hoi-binh-duong-gia-re', title: 'Nhà ở xã hội Bình Dương giá rẻ', excerpt: 'Các dự án nhà ở xã hội tại Bình Dương với giá ưu đãi cho công nhân.', image: null, date: '2024-01-01' },
];

interface ArticleItem {
  slug: string;
  title: string;
  excerpt?: string | null;
  featuredImage?: string | null;
  publishedAt?: string | null;
}

async function fetchArticles(): Promise<ArticleItem[]> {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}${API_PREFIX}/an-cu-lac-nghiep/articles?limit=50`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: ArticleItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function BaiVietPage(): Promise<JSX.Element> {
  const apiArticles = await fetchArticles();
  const articles = apiArticles.length > 0
    ? apiArticles.map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt ?? '',
        image: a.featuredImage ?? null,
        date: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 10) : '',
      }))
    : FALLBACK_ARTICLES;

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">
            Bài viết
          </h1>
          <p className="max-w-2xl text-emerald-100">
            Tin tức, hướng dẫn và thông tin nhà ở xã hội – mua và thuê mua cho người lao động thu nhập thấp.
          </p>
        </div>
      </section>

      {/* Grid bài viết */}
      <section>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((a) => (
            <Link
              key={a.slug}
              href={`/an-cu-lac-nghiep/bai-viet/${a.slug}`}
              className="group flex gap-4 rounded-xl border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                {a.image ? (
                  <img src={a.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">📄</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="mb-1 font-semibold group-hover:text-emerald-600">{a.title}</h2>
                <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                <span className="text-xs text-muted-foreground">{a.date}</span>
              </div>
              <svg className="h-5 w-5 shrink-0 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <Link href="/an-cu-lac-nghiep" className="text-sm font-medium text-emerald-600 hover:underline">
          ← Về tổng quan An Cư Lạc Nghiệp
        </Link>
      </div>
    </div>
  );
}
