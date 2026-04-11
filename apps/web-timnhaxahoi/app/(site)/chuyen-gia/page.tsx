import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content/content-shell';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/chuyen-gia',
  title: 'Chuyên gia',
  description:
    'Đồng hành pháp lý và tài chính trong hành trình NOXH — timnhaxahoi.com; nội dung tham khảo đã qua thẩm định.',
});

export default function ChuyenGiaPage() {
  return (
    <ContentShell eyebrow="Timnhaxahoi" title="Chuyên gia">
      <section className="space-y-3">
        <p>
          Trang <strong className="font-semibold text-slate-900">Chuyên gia</strong> cho biết timnhaxahoi.com đồng hành
          thế nào: bạn được tiếp cận <strong className="font-semibold text-slate-900">nội dung pháp lý đã được thẩm
          định</strong>, công cụ gợi ý điều kiện sơ bộ, và có thể để lại liên hệ khi muốn được tư vấn sâu hơn về mua nhà
          ở xã hội (NOXH).
        </p>
        <p>
          <strong className="font-semibold text-slate-900">Văn phòng Luật sư Mai Quốc Định</strong> thẩm định và hỗ trợ
          pháp lý cho các bài wiki và tài liệu tham khảo trên website. Tư vấn riêng cho hồ sơ cụ thể, tranh chấp hay ký
          kết do <strong className="font-semibold text-slate-900">tư vấn viên / luật sư trực tiếp</strong> thực hiện sau
          khi bạn liên hệ qua kênh chính thức — không thể hoàn tất chỉ trên website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Bạn nhận được gì trên website?</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-700">
          <li>
            <Link href="/phap-ly" className="font-medium text-brand-navy hover:underline">
              Wiki pháp lý
            </Link>{' '}
            — bài tóm tắt, dễ tra cứu; được cập nhật định kỳ.
          </li>
          <li>
            <Link href="/quiz" className="font-medium text-brand-navy hover:underline">
              Trắc nghiệm điều kiện
            </Link>{' '}
            — phân loại sơ bộ theo câu hỏi trên web; kết quả mang tính tham khảo.
          </li>
          <li>
            <Link href="/bang-tinh" className="font-medium text-brand-navy hover:underline">
              Bảng tính so sánh
            </Link>{' '}
            — gợi ý dự án trong danh mục theo khung giá ước tính.
          </li>
          <li>
            <Link href="/video" className="font-medium text-brand-navy hover:underline">
              Video
            </Link>{' '}
            — định hướng ngắn, dễ tiếp cận trên mobile.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Kênh nhà trọ</h2>
        <p>
          <Link href="/timnhatro" className="font-medium text-brand-navy hover:underline">
            Tìm nhà trọ
          </Link>{' '}
          được thiết kế riêng: ưu tiên thông tin thuê rõ ràng và kết nối trực tiếp,{' '}
          <strong className="font-semibold text-slate-900">không</strong> dùng chung bài trắc nghiệm hay biểu mẫu liên hệ
          dành cho NOXH. Chi
          tiết xem trang kênh và{' '}
          <Link href="/mien-tru-trach-nhiem" className="font-medium text-brand-navy hover:underline">
            điều khoản sử dụng
          </Link>
          .
        </p>
      </section>

      <section className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-5 text-sm text-amber-950">
        <p className="font-semibold text-amber-950">Lưu ý</p>
        <p className="mt-2">
          Website không cam kết tỉ lệ phê duyệt hồ sơ hay mức vay cụ thể; mọi con số hiển thị (điểm, phân loại, ước tính
          tài chính) chỉ là <strong className="font-semibold">kết quả tham khảo do công cụ trên website tính toán</strong>.
          Vui lòng đọc thêm tại trang{' '}
          <Link href="/mien-tru-trach-nhiem" className="font-medium text-brand-navy hover:underline">
            miễn trừ trách nhiệm
          </Link>
          .
        </p>
      </section>
    </ContentShell>
  );
}
