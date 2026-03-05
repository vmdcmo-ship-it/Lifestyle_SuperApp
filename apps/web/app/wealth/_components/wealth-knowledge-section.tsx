'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Đề mục Thư viện Kiến thức — ảnh minh họa phong cách báo chí
 * Có thể thay bằng ảnh trong public/images/wealth/knowledge/ (path local)
 * Tỷ lệ: 4:3 editorial
 */
const KNOWLEDGE_IMAGES = {
  tuDuyTrieuPhu:
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  congCuQuanTri:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  cauChuyenThanhCong:
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
};

const KNOWLEDGE_CATEGORIES = [
  {
    slug: 'tu-duy-trieu-phu',
    title: 'Tư duy triệu phú',
    description: 'Quy tắc 6 chiếc lọ, lãi suất kép, Pareto 80/20',
    icon: '💡',
    image: KNOWLEDGE_IMAGES.tuDuyTrieuPhu,
  },
  {
    slug: 'cong-cu-quan-tri',
    title: 'Công cụ quản trị',
    description: 'Bảng tính kế hoạch, App quản lý chi tiêu',
    icon: '📊',
    image: KNOWLEDGE_IMAGES.congCuQuanTri,
  },
  {
    slug: 'cau-chuyen-thanh-cong',
    title: 'Câu chuyện thành công',
    description: 'Tự do tài chính tuổi 30, bí mật may mắn',
    icon: '🌟',
    image: KNOWLEDGE_IMAGES.cauChuyenThanhCong,
  },
];

function KnowledgeCategoryCard({
  slug,
  title,
  description,
  icon,
  image,
}: {
  slug: string;
  title: string;
  description: string;
  icon: string;
  image?: string;
}): JSX.Element {
  const [imgError, setImgError] = useState(false);
  const showImage = image && !imgError;

  return (
    <Link
      href={`/wealth/knowledge?category=${slug}`}
      className="group overflow-hidden rounded-2xl border border-amber-200/60 bg-[#FAF9F6] transition-all hover:border-[#D4AF37]/50 hover:shadow-lg"
    >
      {/* Ảnh minh họa phong cách báo chí — tỷ lệ editorial 4:3 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-amber-100/50">
        {showImage ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
            unoptimized={!image.includes('images.unsplash.com')}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl opacity-70" role="img" aria-hidden>
              {icon}
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="mb-2 font-semibold text-[#0D1B2A] group-hover:text-[#D4AF37]">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}

const FEATURED_ARTICLES = [
  { slug: 'bi-mat-cua-may-man', title: 'Bí mật của may mắn', excerpt: 'Tư duy tạo ra vận may trong tài chính' },
  { slug: 'tu-do-tai-chinh-tuoi-30', title: 'Tự do tài chính tuổi 30', excerpt: 'Lộ trình FIRE cho người trẻ' },
  { slug: 'lai-suat-kep-la-gi', title: 'Lãi suất kép là gì?', excerpt: 'Sức mạnh kỳ diệu của thời gian' },
];

export function WealthKnowledgeSection(): JSX.Element {
  return (
    <section className="border-t border-amber-200/50 bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold text-[#0D1B2A]">
            Thư viện Kiến thức thịnh vượng
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Tư duy triệu phú, công cụ quản trị và câu chuyện thành công — thiết kế như tạp chí tài chính
          </p>
        </div>

        {/* Categories — ảnh minh họa phong cách báo chí */}
        <div className="mb-12 grid gap-6 sm:grid-cols-3">
          {KNOWLEDGE_CATEGORIES.map((cat) => (
            <KnowledgeCategoryCard key={cat.slug} {...cat} />
          ))}
        </div>

        {/* Featured articles */}
        <div>
          <h3 className="mb-6 text-xl font-semibold text-[#0D1B2A]">Bài viết nổi bật</h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURED_ARTICLES.map((art) => (
              <Link
                key={art.slug}
                href={`/wealth/knowledge/${art.slug}`}
                className="group overflow-hidden rounded-xl border border-amber-200/50 bg-white transition-all hover:shadow-lg"
              >
                <div className="h-2 bg-gradient-to-r from-[#D4AF37] to-amber-400" />
                <div className="p-5">
                  <h4 className="mb-2 font-semibold text-[#0D1B2A] group-hover:text-[#D4AF37]">
                    {art.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{art.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/wealth/knowledge"
            className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37] px-5 py-2.5 font-medium text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-[#0D1B2A]"
          >
            Xem tất cả kiến thức
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
