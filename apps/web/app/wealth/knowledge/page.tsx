import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kiến thức thịnh vượng',
  description: 'Blog kiến thức đầu tư, tư duy tài chính và câu chuyện thành công',
  alternates: { canonical: '/wealth/knowledge' },
};

const ARTICLES = [
  { slug: 'bi-mat-cua-may-man', title: 'Bí mật của may mắn', category: 'tu-duy-trieu-phu', excerpt: 'Tư duy tạo ra vận may trong tài chính' },
  { slug: 'tu-do-tai-chinh-tuoi-30', title: 'Tự do tài chính tuổi 30', category: 'cau-chuyen-thanh-cong', excerpt: 'Lộ trình FIRE cho người trẻ' },
  { slug: 'lai-suat-kep-la-gi', title: 'Lãi suất kép là gì?', category: 'tu-duy-trieu-phu', excerpt: 'Sức mạnh kỳ diệu của thời gian' },
  { slug: 'quy-tac-6-chiec-lo', title: 'Quy tắc 6 chiếc lọ', category: 'cong-cu-quan-tri', excerpt: 'Phương pháp phân bổ thu nhập hiệu quả' },
  { slug: 'pareto-80-20-tai-chinh', title: 'Pareto 80/20 trong tài chính', category: 'tu-duy-trieu-phu', excerpt: 'Tập trung vào 20% quyết định 80% kết quả' },
  { slug: 'tam-giac-tai-chinh', title: 'Tam giác tài chính', category: 'tu-duy-trieu-phu', excerpt: 'Nền tảng vững cho kế hoạch tài chính' },
];

export default function WealthKnowledgePage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-heading mb-4 text-3xl font-bold text-[#0D1B2A]">
          Thư viện Kiến thức thịnh vượng
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Khám phá kiến thức đầu tư, tư duy tài chính và câu chuyện thành công từ chuyên gia
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLES.map((art) => (
          <Link
            key={art.slug}
            href={`/wealth/knowledge/${art.slug}`}
            className="group overflow-hidden rounded-xl border border-amber-200/50 bg-white transition-all hover:shadow-lg"
          >
            <div className="h-1.5 bg-gradient-to-r from-[#D4AF37] to-amber-400" />
            <div className="p-6">
              <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#D4AF37]">
                {art.category.replace(/-/g, ' ')}
              </span>
              <h2 className="mb-2 font-semibold text-[#0D1B2A] group-hover:text-[#D4AF37]">
                {art.title}
              </h2>
              <p className="text-sm text-muted-foreground">{art.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/wealth"
          className="text-sm font-medium text-[#D4AF37] hover:underline"
        >
          ← Về KODO Wealth
        </Link>
      </div>
    </div>
  );
}
