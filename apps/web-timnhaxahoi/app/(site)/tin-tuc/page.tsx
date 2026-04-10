import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content/content-shell';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/tin-tuc',
  title: 'Tin tức',
  description:
    'Cập nhật chính sách nhà ở, thị trường khu vực và nội dung hữu ích cho người tìm NOXH — timnhaxahoi.com.',
});

const TOPICS = [
  {
    title: 'Pháp lý & thủ tục',
    body: 'Quy định đối tượng, cư trú, thu nhập và trình tự hồ sơ — cập nhật dần trên wiki, song song với bài phân tích ngắn.',
    href: '/phap-ly',
    cta: 'Mở wiki pháp lý',
  },
  {
    title: 'Dự án & thị trường khu vực',
    body: 'Gợi ý theo danh mục dự án và vùng ưu tiên bán hàng; theo dõi trang dự án và trang chủ để xem tin mới.',
    href: '/du-an',
    cta: 'Danh mục dự án',
  },
  {
    title: 'Video ngắn',
    body: 'Định dạng 60–90 giây: hook, thực tế, pháp lý tóm lược, CTA — tập trung mobile.',
    href: '/video',
    cta: 'Hub video',
  },
] as const;

export default function TinTucPage() {
  return (
    <ContentShell eyebrow="Timnhaxahoi" title="Tin tức">
      <section className="space-y-3">
        <p>
          Mục <strong className="font-semibold text-slate-900">Tin tức</strong> tập trung các chủ đề phục vụ SEO và niềm
          tin: chính sách nhà ở xã hội, biến động thị trường theo khu vực, và hướng dẫn ngắn gọn cho người mua lần đầu.
          Bài viết dài sẽ được bổ sung theo từng đợt biên tập; hiện tại bạn có thể bắt đầu từ các kênh sau.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Chủ đề trọng tâm</h2>
        <ul className="space-y-4">
          {TOPICS.map((t) => (
            <li
              key={t.title}
              className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm"
            >
              <h3 className="font-semibold text-slate-900">{t.title}</h3>
              <p className="mt-2 text-slate-700">{t.body}</p>
              <p className="mt-3">
                <Link href={t.href} className="text-sm font-semibold text-brand-navy hover:underline">
                  {t.cta} →
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Gợi ý hành động</h2>
        <p>
          Nếu bạn cần <strong className="font-semibold text-slate-900">đánh giá nhanh điều kiện cá nhân</strong>, dùng{' '}
          <Link href="/quiz" className="font-medium text-brand-navy hover:underline">
            trắc nghiệm
          </Link>
          ; nếu ưu tiên <strong className="font-semibold text-slate-900">con số tài chính</strong>, dùng{' '}
          <Link href="/bang-tinh" className="font-medium text-brand-navy hover:underline">
            bảng tính so sánh
          </Link>
          . Cả hai đều là công cụ hỗ trợ, không thay cho tư vấn pháp lý hay báo giá từ chủ đầu tư.
        </p>
      </section>

      <p className="text-sm text-slate-600">
        Điều khoản và giới hạn trách nhiệm:{' '}
        <Link href="/mien-tru-trach-nhiem" className="font-medium text-brand-navy hover:underline">
          Xem tại đây
        </Link>
        .
      </p>
    </ContentShell>
  );
}
