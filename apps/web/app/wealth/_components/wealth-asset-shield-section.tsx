import Link from 'next/link';

export function WealthAssetShieldSection(): JSX.Element {
  return (
    <section className="border-t border-amber-200/50 bg-gradient-to-br from-[#0D1B2A]/95 to-[#1B2838] py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-heading mb-4 text-3xl font-bold">
              Đừng để một biến cố nhỏ quét sạch thành quả đầu tư 10 năm của bạn
            </h2>
            <p className="mb-6 text-lg text-white/85">
              Bảo hiểm là khiên chắn bảo vệ danh mục đầu tư của bạn. Tính toán quyền lợi phù hợp với độ tuổi và nhu cầu gia đình.
            </p>
            <Link
              href="/wealth/tools/insurance-benefit-calc"
              className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-[#0D1B2A] transition-all hover:bg-amber-400"
            >
              Công cụ tính quyền lợi bảo hiểm
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </Link>
          </div>
          <div className="rounded-2xl border border-amber-500/20 bg-white/5 p-8 backdrop-blur-sm">
            <h3 className="mb-4 font-semibold text-[#D4AF37]">Tam giác tài chính</h3>
            <p className="mb-4 text-sm text-white/80">
              Đầu tư hiệu quả cần nền tảng vững: Quỹ khẩn cấp → Bảo hiểm → Tích lũy & Đầu tư.
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Quỹ dự phòng 6-12 tháng chi phí</li>
              <li>• Bảo hiểm y tế, nhân thọ cơ bản</li>
              <li>• Tích lũy dài hạn, đầu tư sinh lời</li>
            </ul>
            <Link
              href="/wealth/products"
              className="mt-6 inline-block text-sm font-medium text-[#D4AF37] underline hover:no-underline"
            >
              Xem danh mục bảo hiểm →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
