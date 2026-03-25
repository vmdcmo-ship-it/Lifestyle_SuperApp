import Link from 'next/link';

/** Widget cuối bài pháp lý (SPEC): CTA sang trắc nghiệm. */
export function LegalQuizCta() {
  return (
    <aside className="mt-12 rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white p-6 md:p-8">
      <h2 className="text-lg font-semibold text-slate-900">Kiểm tra điều kiện sơ bộ</h2>
      <p className="mt-2 text-sm text-slate-600">
        Trắc nghiệm trên web giúp bạn có hình dung ban đầu; kết quả không thay thế quyết định cơ quan có thẩm quyền.
      </p>
      <Link
        href="/quiz"
        className="mt-5 inline-flex rounded-xl bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
      >
        Bắt đầu trắc nghiệm
      </Link>
    </aside>
  );
}
