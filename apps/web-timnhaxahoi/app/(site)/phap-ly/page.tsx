import type { Metadata } from 'next';
import Link from 'next/link';
import { listLegalArticles } from '@/lib/legal-articles';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/phap-ly',
  title: 'Pháp lý và thủ tục NOXH',
  description:
    'Wiki pháp lý và thủ tục nhà ở xã hội: điều kiện, cư trú, hồ sơ — nội dung tham khảo, không thay thế văn bản pháp luật.',
});

export default function LegalHubPage() {
  const items = listLegalArticles();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-slate-900">Pháp lý &amp; thủ tục</h1>
      <p className="mt-3 text-slate-600">
        Nội dung tham khảo, được cập nhật theo từng đợt; chi tiết từng dự án và địa phương có thể khác nhau — vui lòng
        đối chiếu thông báo chính thức.
      </p>
      <ul className="mt-10 space-y-4">
        {items.map((a) => (
          <li key={a.slug} className="glass-panel rounded-xl p-5 transition hover:border-brand-emerald/30">
            <Link href={`/phap-ly/${a.slug}`} className="text-lg font-semibold text-brand-navy hover:underline">
              {a.title}
            </Link>
            <p className="mt-2 text-sm text-slate-600">{a.description}</p>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-center text-xs text-slate-500">
        Thẩm định nội dung pháp lý: Văn phòng Luật sư Mai Quốc Định.
      </p>
    </div>
  );
}
