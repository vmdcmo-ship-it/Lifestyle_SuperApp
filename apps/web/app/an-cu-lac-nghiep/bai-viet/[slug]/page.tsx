/**
 * An Cư Lạc Nghiệp - Chi tiết bài viết SEO
 * Dynamic route: /an-cu-lac-nghiep/bai-viet/[slug]
 * Fetch từ CMS API, fallback sang data tĩnh
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/lib/seo/json-ld';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

async function fetchArticle(slug: string) {
  try {
    const res = await fetch(`${API_BASE.replace(/\/$/, '')}${API_PREFIX}/an-cu-lac-nghiep/articles/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

const STATIC_ARTICLES: Record<
  string,
  { title: string; excerpt: string; content: string; date: string; image?: string }
> = {
  'dieu-kien-mua-nha-o-xa-hoi-2024': {
    title: 'Điều kiện mua nhà ở xã hội 2024',
    excerpt: 'Hướng dẫn chi tiết điều kiện, đối tượng và thủ tục mua nhà ở xã hội năm 2024.',
    content: `
      <p>Nhà ở xã hội là loại hình nhà ở do Nhà nước hoặc tổ chức, cá nhân đầu tư xây dựng dành cho đối tượng được hưởng chính sách hỗ trợ về nhà ở.</p>
      <p><strong>Đối tượng được mua nhà ở xã hội:</strong></p>
      <ul>
        <li>Người có công với cách mạng</li>
        <li>Hộ nghèo, cận nghèo tại khu vực nông thôn</li>
        <li>Người lao động thu nhập thấp tại đô thị</li>
        <li>Công nhân khu công nghiệp, khu chế xuất</li>
        <li>Cán bộ, công chức, viên chức</li>
        <li>Sĩ quan, quân nhân chuyên nghiệp, công nhân quốc phòng</li>
      </ul>
      <p><em>(Nội dung SEO chi tiết sẽ được cập nhật từ CMS)</em></p>
    `,
    date: '2024-01-15',
  },
  'thue-mua-nha-o-xa-hoi-uu-nhuoc-diem': {
    title: 'Thuê mua nhà ở xã hội – Ưu và nhược điểm',
    excerpt: 'So sánh mua trực tiếp và thuê mua, lãi suất, thời gian thanh toán.',
    content: `
      <p>Thuê mua nhà ở xã hội là hình thức người thuê trả tiền theo kỳ hạn, sau khi hoàn tất thanh toán sẽ được cấp sổ đỏ (giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở).</p>
      <p><strong>Ưu điểm:</strong></p>
      <ul>
        <li>Giảm áp lực tài chính ban đầu</li>
        <li>Lãi suất ưu đãi</li>
        <li>Thời gian thanh toán linh hoạt</li>
      </ul>
      <p><strong>Nhược điểm:</strong></p>
      <ul>
        <li>Chưa có quyền sở hữu cho đến khi thanh toán xong</li>
        <li>Ràng buộc hợp đồng dài hạn</li>
      </ul>
      <p><em>(Nội dung chi tiết sẽ cập nhật từ CMS)</em></p>
    `,
    date: '2024-01-10',
  },
  'du-an-nha-o-xa-hoi-tphcm-moi-nhat': {
    title: 'Dự án nhà ở xã hội TP.HCM mới nhất',
    excerpt: 'Tổng hợp các dự án nhà ở xã hội đang mở bán tại TP.HCM.',
    content: `
      <p>Thành phố Hồ Chí Minh đang triển khai nhiều dự án nhà ở xã hội tại các quận huyện ngoại thành và khu công nghiệp.</p>
      <p>Các khu vực trọng điểm: Hóc Môn, Củ Chi, Bình Chánh, Nhà Bè, Quận 9...</p>
      <p><em>(Danh sách dự án chi tiết sẽ cập nhật từ CMS và dữ liệu thực tế)</em></p>
    `,
    date: '2024-01-05',
  },
  'nha-o-xa-hoi-binh-duong-gia-re': {
    title: 'Nhà ở xã hội Bình Dương giá rẻ',
    excerpt: 'Các dự án nhà ở xã hội tại Bình Dương với giá ưu đãi cho công nhân.',
    content: `
      <p>Bình Dương là một trong những tỉnh có nhiều khu công nghiệp, nhu cầu nhà ở xã hội cho công nhân rất cao.</p>
      <p>Các khu vực: Dĩ An, Thuận An, Bến Cát, Tân Uyên...</p>
      <p><em>(Danh sách dự án chi tiết sẽ cập nhật từ CMS)</em></p>
    `,
    date: '2024-01-01',
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://lifestyle-app.com').replace(/\/$/, '');
const DEFAULT_OG = `${BASE_URL}/og-image.png`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const apiArticle = await fetchArticle(slug);
  const article = apiArticle
    ? { title: apiArticle.seoTitle || apiArticle.title, excerpt: apiArticle.seoDescription || apiArticle.excerpt, image: apiArticle.featuredImage }
    : STATIC_ARTICLES[slug];
  if (!article) return { title: 'Bài viết' };
  const url = `/an-cu-lac-nghiep/bai-viet/${slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'vi_VN',
      url,
      title: article.title,
      description: article.excerpt,
      siteName: 'Lifestyle Super App',
      images: [{ url: article.image || DEFAULT_OG, width: 1200, height: 630, alt: article.title }],
      publishedTime: article.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [article.image || DEFAULT_OG],
    },
  };
}

export default async function BaiVietDetailPage({ params }: Props): Promise<JSX.Element> {
  const { slug } = await params;
  const apiArticle = await fetchArticle(slug);
  const article = apiArticle
    ? {
        title: apiArticle.title,
        excerpt: apiArticle.excerpt || apiArticle.seoDescription || '',
        content: apiArticle.content,
        date: apiArticle.publishedAt ? new Date(apiArticle.publishedAt).toISOString().slice(0, 10) : '',
        image: apiArticle.featuredImage,
      }
    : STATIC_ARTICLES[slug];
  if (!article) notFound();

  const url = `/an-cu-lac-nghiep/bai-viet/${slug}`;
  const datePublished = article.date ? `${article.date}T00:00:00+07:00` : new Date().toISOString();

  return (
    <article className="min-h-screen">
      <BreadcrumbJsonLd
        items={[
          { name: 'Trang chủ', url: '/' },
          { name: 'An Cư Lạc Nghiệp', url: '/an-cu-lac-nghiep' },
          { name: 'Bài viết', url: '/an-cu-lac-nghiep/bai-viet' },
          { name: article.title, url },
        ]}
      />
      <ArticleJsonLd
        headline={article.title}
        description={article.excerpt}
        image={article.image}
        datePublished={datePublished}
        dateModified={datePublished}
        url={url}
      />
      {/* Banner bài viết */}
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <Link
            href="/an-cu-lac-nghiep/bai-viet"
            className="mb-4 inline-block text-sm text-emerald-200 hover:text-white"
          >
            ← Bài viết
          </Link>
          <h1 className="font-heading mb-4 text-3xl font-bold md:text-4xl">{article.title}</h1>
          <p className="max-w-2xl text-emerald-100">{article.excerpt}</p>
          <time className="mt-4 block text-sm text-emerald-200">{article.date}</time>
        </div>
      </section>

      {/* Nội dung */}
      <section
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* CTA */}
      <div className="mt-12 rounded-2xl border bg-muted/30 p-6">
        <p className="mb-4 text-sm text-muted-foreground">Cần tư vấn mua nhà ở xã hội?</p>
        <Link
          href="/an-cu-lac-nghiep/tu-van"
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Đăng ký tư vấn
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/an-cu-lac-nghiep" className="text-sm font-medium text-emerald-600 hover:underline">
          ← Về tổng quan An Cư Lạc Nghiệp
        </Link>
      </div>
    </article>
  );
}
