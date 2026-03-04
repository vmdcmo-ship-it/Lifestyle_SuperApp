import type { Metadata } from 'next';
import Link from 'next/link';
import { WealthHeroCalculator } from './_components/wealth-hero-calculator';
import { WealthKnowledgeSection } from './_components/wealth-knowledge-section';
import { WealthAssetShieldSection } from './_components/wealth-asset-shield-section';

export const metadata: Metadata = {
  title: 'KODO Wealth - Tư duy tài chính & Bảo hiểm thịnh vượng',
  description:
    'Khám phá kiến thức tài chính, công cụ tính nghỉ hưu và giải pháp bảo hiểm để xây dựng cuộc sống thịnh vượng.',
  alternates: { canonical: '/wealth' },
  openGraph: {
    title: 'KODO Wealth - Tư duy tài chính & Bảo hiểm thịnh vượng',
    description: 'Khám phá kiến thức tài chính, công cụ tính toán và giải pháp bảo hiểm.',
    url: '/wealth',
  },
};

export default function WealthPage(): JSX.Element {
  return (
    <div>
      {/* Hero - Công cụ tính nghỉ hưu */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0D1B2A] via-[#1B2838] to-[#0D1B2A] py-16 text-white md:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNENkFGMzciIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-heading mb-4 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
              Bạn muốn nghỉ hưu với{' '}
              <span className="bg-gradient-to-r from-[#D4AF37] to-amber-400 bg-clip-text text-transparent">
                bao nhiêu tiền?
              </span>
            </h1>
            <p className="mb-8 text-lg text-white/80">
              Tính toán số tiền cần tích lũy và lập kế hoạch tài chính chi tiết cho tương lai của bạn
            </p>
            <WealthHeroCalculator />
          </div>
        </div>
      </section>

      {/* Thư viện Kiến thức thịnh vượng */}
      <WealthKnowledgeSection />

      {/* Khiên chắn tài sản - Bảo hiểm */}
      <WealthAssetShieldSection />

      {/* CTA */}
      <section className="border-t border-amber-200/50 bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-[#0D1B2A]">
            Sẵn sàng lập kế hoạch tài chính?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Đăng ký tư vấn 1-1 với chuyên gia để được hỗ trợ chi tiết
          </p>
          <Link
            href="/wealth/consulting"
            className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-[#0D1B2A] transition-all hover:bg-amber-500 hover:shadow-lg"
          >
            Đăng ký tư vấn
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
