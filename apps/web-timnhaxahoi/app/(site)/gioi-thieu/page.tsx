import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content/content-shell';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/gioi-thieu',
  title: 'Giới thiệu',
  description:
    'timnhaxahoi.com — nền tảng Tech-Trust về nhà ở xã hội và tìm nhà trọ; đồng hành an cư tại Việt Nam.',
});

export default function GioiThieuPage() {
  return (
    <ContentShell eyebrow="Timnhaxahoi.com" title="Giới thiệu">
      <section className="space-y-3">
        <p>
          <strong className="font-semibold text-slate-900">timnhaxahoi.com</strong> là satellite web trong hệ sinh thái
          Lifestyle / Kodo, tập trung làm rõ hành trình mua <strong className="font-semibold text-slate-900">nhà ở xã
          hội (NOXH)</strong> và hỗ trợ kênh <strong className="font-semibold text-slate-900">tìm nhà trọ</strong> trên
          cùng domain — hai trụ nội dung ngang hàng, không lấn át nhau.
        </p>
        <p>
          Chúng tôi theo triết lý <strong className="font-semibold text-slate-900">Tech-Trust</strong>: minh bạch thông
          tin, công cụ trợ giúp (trắc nghiệm điều kiện, bảng tính so sánh ngân sách, danh mục dự án), và nội dung pháp
          lý — để người dùng chủ động trước khi quyết định liên hệ tư vấn.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Phạm vi ưu tiên</h2>
        <p>
          Về SEO và nội dung, site hướng tới <strong className="font-semibold text-slate-900">toàn quốc</strong>. Về dữ
          liệu dự án và khai thác bán hàng, đội ngũ ưu tiên kết nối tại{' '}
          <strong className="font-semibold text-slate-900">khu vực phía Nam</strong> và các tỉnh lân cận theo chiến
          lược go-to-market — danh mục sẽ mở rộng dần.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Ngôn ngữ & đối tượng</h2>
        <p>
          Sản phẩm hướng tới người Việt Nam trong phạm vi NOXH và thuê trọ; nội dung giao diện hiện tại sử dụng{' '}
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
            — xem NOXH và (khi có) nhà thương mại giá rẻ trong catalog.
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
            — phân loại sơ bộ theo rule nội bộ, không thay thế tư vấn pháp lý.
          </li>
          <li>
            <Link href="/timnhatro" className="font-medium text-brand-navy hover:underline">
              Tìm nhà trọ
            </Link>{' '}
            — luồng thuê riêng, khác hoàn toàn luồng mua NOXH.
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
