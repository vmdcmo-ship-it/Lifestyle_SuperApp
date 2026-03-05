import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BreadcrumbJsonLd, ArticleJsonLd } from '@/lib/seo/json-ld';

const ARTICLES: Record<string, { title: string; excerpt: string; content: string }> = {
  'bi-mat-cua-may-man': {
    title: 'Bí mật của may mắn',
    excerpt: 'Tư duy tạo ra vận may trong tài chính',
    content: '<p>May mắn trong tài chính không phải ngẫu nhiên.</p><p>Chi tiêu ít hơn thu nhập, đầu tư phần còn lại.</p>',
  },
  'tu-do-tai-chinh-tuoi-30': {
    title: 'Tự do tài chính tuổi 30',
    excerpt: 'Lộ trình FIRE cho người trẻ',
    content: '<p>FIRE là phong trào hướng tới tự do tài chính sớm.</p><p>Với tỷ lệ tiết kiệm 50%+, bạn có thể nghỉ hưu sớm trong 15-20 năm.</p>',
  },
  'lai-suat-kep-la-gi': {
    title: 'Lãi suất kép là gì?',
    excerpt: 'Sức mạnh kỳ diệu của thời gian',
    content: '<p>Lãi kép là lãi sinh ra từ cả vốn gốc và lãi trước đó.</p><p>Bắt đầu sớm, gửi đều đặn, và kiên nhẫn.</p>',
  },
  'quy-tac-6-chiec-lo': {
    title: 'Quy tắc 6 chiếc lọ',
    excerpt: 'Phương pháp phân bổ thu nhập hiệu quả',
    content: '<p>Phân bổ thu nhập: Nhu cầu thiết yếu, Tiết kiệm, Giáo dục, Hưởng thụ, Cho đi, Tự do tài chính.</p>',
  },
  'pareto-80-20-tai-chinh': {
    title: 'Pareto 80/20 trong tài chính',
    excerpt: 'Tập trung vào 20% quyết định 80% kết quả',
    content: '<p>20% quyết định tạo ra 80% kết quả tài chính.</p>',
  },
  'tam-giac-tai-chinh': {
    title: 'Tam giác tài chính',
    excerpt: 'Nền tảng vững cho kế hoạch tài chính',
    content: '<p>Tam giác: Quỹ khẩn cấp → Bảo hiểm → Tích lũy & Đầu tư.</p><p>Xây từ đáy lên.</p>',
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.vmd.asia').replace(/\/$/, '');
const DEFAULT_OG = `${BASE_URL}/og-image.png`;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const art = ARTICLES[slug];
  if (!art) return { title: 'Bài viết | KODO Wealth' };
  const url = `/wealth/knowledge/${slug}`;
  return {
    title: art.title,
    description: art.excerpt,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'vi_VN',
      url,
      title: art.title,
      description: art.excerpt,
      siteName: 'Lifestyle Super App',
      images: [{ url: DEFAULT_OG, width: 1200, height: 630, alt: art.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: art.title,
      description: art.excerpt,
      images: [DEFAULT_OG],
    },
  };
}

export default async function WealthKnowledgeSlugPage({ params }: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const art = ARTICLES[slug];
  if (!art) notFound();

  const url = `/wealth/knowledge/${slug}`;
  const datePublished = '2024-01-01T00:00:00+07:00';

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <BreadcrumbJsonLd
        items={[
          { name: 'Trang chủ', url: '/' },
          { name: 'KODO Wealth', url: '/wealth' },
          { name: 'Kiến thức', url: '/wealth/knowledge' },
          { name: art.title, url },
        ]}
      />
      <ArticleJsonLd
        headline={art.title}
        description={art.excerpt}
        datePublished={datePublished}
        url={url}
      />
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/wealth" className="hover:text-foreground">KODO Wealth</Link>
        <span className="mx-2">/</span>
        <Link href="/wealth/knowledge" className="hover:text-foreground">Kiến thức</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{art.title}</span>
      </nav>

      <article>
        <h1 className="font-heading mb-4 text-3xl font-bold text-[#0D1B2A]">{art.title}</h1>
        <p className="mb-8 text-muted-foreground">{art.excerpt}</p>
        <div
          className="prose prose-[#0D1B2A] max-w-none"
          dangerouslySetInnerHTML={{ __html: art.content }}
        />
      </article>

      <div className="mt-12 flex gap-4">
        <Link
          href="/wealth/knowledge"
          className="rounded-lg border border-[#D4AF37] px-4 py-2 text-sm font-medium text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
        >
          Bài viết khác
        </Link>
        <Link
          href="/wealth"
          className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-medium text-[#0D1B2A] hover:bg-amber-400"
        >
          Về KODO Wealth
        </Link>
      </div>
    </div>
  );
}
