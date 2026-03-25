import type { Metadata } from 'next';
import { EligibilityQuiz } from '@/components/quiz/eligibility-quiz';

export const metadata: Metadata = {
  title: 'Trắc nghiệm điều kiện NOXH',
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-900">Trắc nghiệm thẩm định sơ bộ</h1>
      <p className="mb-8 text-sm text-slate-600">
        Thông tin dùng để tư vấn; kết quả không thay thế quyết định cơ quan có thẩm quyền.
      </p>
      <EligibilityQuiz />
    </div>
  );
}
