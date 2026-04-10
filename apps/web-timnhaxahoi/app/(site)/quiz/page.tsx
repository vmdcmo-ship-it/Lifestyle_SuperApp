import type { Metadata } from 'next';
import { EligibilityQuiz } from '@/components/quiz/eligibility-quiz';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/quiz',
  title: 'Trắc nghiệm điều kiện NOXH',
  description:
    'Chấm điểm sơ bộ theo rule nội bộ — phân khúc, điểm tham khảo và gợi ý dự án. Không thay thế quyết định cơ quan có thẩm quyền.',
});

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Trắc nghiệm thẩm định sơ bộ</h1>
      <div className="mb-6 space-y-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/60 px-4 py-4 text-sm leading-relaxed text-slate-700 md:px-5 md:py-5">
        <p>
          Chúng tôi đã đồng hành cùng hàng nghìn hộ gia đình trên hành trình tìm hiểu nhà ở xã hội — gợi
          hướng phù hợp điều kiện, hướng tới an cư lạc nghiệp. Timnhaxahoi.com trân trọng được tiếp tục
          đồng hành cùng bạn.
        </p>
        <p className="font-medium text-slate-800">
          Cùng hàng nghìn gia đình đã tham khảo — hoàn thành khai báo để nhận gợi ý dành riêng cho
          tình huống của bạn.
        </p>
      </div>
      <p className="mb-8 text-sm text-slate-600">
        Thông tin dùng để tư vấn; kết quả không thay thế quyết định cơ quan có thẩm quyền.
      </p>
      <EligibilityQuiz />
    </div>
  );
}
