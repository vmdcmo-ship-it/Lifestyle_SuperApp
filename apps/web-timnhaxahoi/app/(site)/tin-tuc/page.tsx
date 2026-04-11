import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content/content-shell';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/tin-tuc',
  title: 'Tin tức',
  description:
    'Tin và hướng dẫn về nhà ở xã hội, thị trường theo khu vực và chủ đề hữu ích cho người mua lần đầu — timnhaxahoi.com.',
});

const TOPICS = [
  {
    title: 'Pháp lý & thủ tục',
    body: 'Các bài tóm tắt về điều kiện mua, cư trú, thu nhập và trình tự hồ sơ — được cập nhật theo từng đợt trên wiki pháp lý.',
    href: '/phap-ly',
    cta: 'Mở wiki pháp lý',
  },
  {
    title: 'Dự án & thị trường địa phương',
    body: 'Thông tin dự án và mức giá tham khảo theo khu vực; xem danh mục dự án và trang chủ để cập nhật mới nhất.',
    href: '/du-an',
    cta: 'Danh mục dự án',
  },
  {
    title: 'Video ngắn',
    body: 'Các clip ngắn, dễ xem trên điện thoại, giải thích thủ tục và những điểm cần lưu ý khi tìm hiểu NOXH.',
    href: '/video',
    cta: 'Xem kênh video',
  },
] as const;

export default function TinTucPage() {
  return (
    <ContentShell eyebrow="Timnhaxahoi" title="Tin tức">
      <section className="space-y-3">
        <p>
          Mục <strong className="font-semibold text-slate-900">Tin tức</strong> tổng hợp chính sách nhà ở xã hội, thông
          tin thị trường theo từng vùng và các bài hướng dẫn ngắn cho người mua lần đầu. Nội dung sẽ được bổ sung dần;
          bạn có thể bắt đầu từ các mục dưới đây.
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
        <h2 className="text-xl font-bold text-slate-900">Gợi ý cho bạn</h2>
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
