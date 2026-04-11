import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content/content-shell';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/gioi-thieu',
  title: 'Giới thiệu',
  description:
    'Giới thiệu timnhaxahoi.com — thông tin minh bạch về nhà ở xã hội và tìm nhà trọ; đồng hành an cư tại Việt Nam.',
});

export default function GioiThieuPage() {
  return (
    <ContentShell eyebrow="Timnhaxahoi.com" title="Giới thiệu">
      <section className="space-y-3">
        <p>
          <strong className="font-semibold text-slate-900">timnhaxahoi.com</strong> giúp bạn làm rõ hành trình mua{' '}
          <strong className="font-semibold text-slate-900">nhà ở xã hội (NOXH)</strong> và đồng thời hỗ trợ kênh{' '}
          <strong className="font-semibold text-slate-900">tìm nhà trọ</strong> trên cùng website — hai nhu cầu được trình
          bày song song, rõ ràng.
        </p>
        <p>
          Chúng tôi đặt <strong className="font-semibold text-slate-900">minh bạch thông tin</strong> lên trước: cung cấp
          công cụ trợ giúp (trắc nghiệm điều kiện, bảng tính so sánh ngân sách, danh mục dự án) và nội dung pháp lý tham
          khảo — để bạn chủ động tìm hiểu trước khi quyết định liên hệ tư vấn.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Khu vực tư vấn và dữ liệu</h2>
        <p>
          Nội dung trên website phục vụ bạn ở <strong className="font-semibold text-slate-900">mọi tỉnh thành</strong>.
          Danh mục dự án và kênh tư vấn hiện được chúng tôi triển khai mạnh hơn tại{' '}
          <strong className="font-semibold text-slate-900">khu vực phía Nam</strong> và các tỉnh lân cận; danh mục sẽ được
          bổ sung dần.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Ngôn ngữ</h2>
        <p>
          Website phục vụ người dùng tại Việt Nam, tập trung NOXH và thuê trọ; giao diện và nội dung chính bằng{' '}
          <strong className="font-semibold text-slate-900">tiếng Việt</strong>.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Bắt đầu từ đâu?</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-slate-700">
          <li>
            <Link href="/du-an" className="font-medium text-brand-navy hover:underline">
              Danh mục dự án
            </Link>{' '}
            — xem dự án NOXH và nhà thương mại giá rẻ (nếu đã có trong danh mục).
          </li>
          <li>
            <Link href="/bang-tinh" className="font-medium text-brand-navy hover:underline">
              Bảng tính so sánh
            </Link>{' '}
            — ước tính nhanh theo ngân sách (tham khảo).
          </li>
          <li>
            <Link href="/quiz" className="font-medium text-brand-navy hover:underline">
              Trắc nghiệm điều kiện
            </Link>{' '}
            — phân loại sơ bộ theo câu hỏi trên web; không thay thế tư vấn pháp lý.
          </li>
          <li>
            <Link href="/timnhatro" className="font-medium text-brand-navy hover:underline">
              Tìm nhà trọ
            </Link>{' '}
            — phần thuê trọ tách bạch với nội dung mua NOXH.
          </li>
        </ul>
      </section>

      <p className="text-sm text-slate-600">
        Thông tin chi tiết về giới hạn trách nhiệm và cách chúng tôi xử lý dữ liệu:{' '}
        <Link href="/mien-tru-trach-nhiem" className="font-medium text-brand-navy hover:underline">
          Miễn trừ trách nhiệm và điều khoản
        </Link>
        .
      </p>
    </ContentShell>
  );
}
