import type { Metadata } from 'next';
import { EligibilityQuiz } from '@/components/quiz/eligibility-quiz';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/quiz',
  title: 'Trắc nghiệm điều kiện NOXH',
  description:
    'Chấm điểm sơ bộ theo bộ câu hỏi trên web — gợi ý phân khúc, điểm tham khảo và dự án tham khảo. Không thay thế quyết định cơ quan có thẩm quyền.',
});

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-slate-900">Trắc nghiệm thẩm định sơ bộ</h1>
      <div className="mb-6 space-y-3 rounded-2xl border border-emerald-200/90 bg-emerald-50/60 px-4 py-4 text-sm leading-relaxed text-slate-700 md:px-5 md:py-5">
        <p>
          Bộ câu hỏi giúp bạn <strong className="font-semibold text-slate-800">làm rõ điều kiện sơ bộ</strong> khi tìm
          hiểu nhà ở xã hội. Kết quả chỉ mang tính tham khảo; quyết định cuối cùng thuộc cơ quan có thẩm quyền và chủ đầu
          tư.
        </p>
        <p className="font-medium text-slate-800">
          Hoàn thành các bước bên dưới để nhận gợi ý phù hợp với tình huống bạn khai báo.
        </p>
      </div>
      <p className="mb-8 text-sm text-slate-600">
        Thông tin dùng để tư vấn; kết quả không thay thế quyết định cơ quan có thẩm quyền.
      </p>
      <EligibilityQuiz />
    </div>
  );
}
