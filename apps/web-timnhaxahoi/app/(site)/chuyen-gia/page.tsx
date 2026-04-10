import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content/content-shell';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/chuyen-gia',
  title: 'Chuyên gia',
  description:
    'Đồng hành pháp lý và tài chính trong hành trình NOXH — timnhaxahoi.com; thẩm định nội dung theo quy chuẩn đã chốt.',
});

export default function ChuyenGiaPage() {
  return (
    <ContentShell eyebrow="Timnhaxahoi" title="Chuyên gia">
      <section className="space-y-3">
        <p>
          Trang <strong className="font-semibold text-slate-900">Chuyên gia</strong> giới thiệu hướng đồng hành của
          timnhaxahoi.com: kết nối người dùng với <strong className="font-semibold text-slate-900">nội dung pháp lý đã
          được thẩm định</strong>, công cụ đánh giá điều kiện sơ bộ, và lộ trình tư vấn khi bạn để lại thông tin liên hệ
          hợp lệ — phù hợp mô hình lead có lọc đối với kênh mua NOXH.
        </p>
        <p>
          Theo định hướng sản phẩm, <strong className="font-semibold text-slate-900">Văn phòng Luật sư Mai Quốc
          Định</strong> đảm nhận vai trò thẩm định và hỗ trợ pháp lý cho các nội dung “góc luật” và tài liệu tham khảo
          trên site. Việc tư vấn cá nhân hóa (hồ sơ cụ thể, tranh chấp, ký kết) vẫn do{' '}
          <strong className="font-semibold text-slate-900">tư vấn viên / luật sư trực tiếp</strong> xử lý sau khi bạn
          liên hệ qua kênh chính thức — không thể hoàn tất chỉ qua website.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Bạn nhận được gì trên website?</h2>
        <ul className="list-inside list-disc space-y-2 text-slate-700">
          <li>
            <Link href="/phap-ly" className="font-medium text-brand-navy hover:underline">
              Wiki pháp lý
            </Link>{' '}
            — bài tóm tắt, mục lục, cập nhật theo khả năng biên tập.
          </li>
          <li>
            <Link href="/quiz" className="font-medium text-brand-navy hover:underline">
              Trắc nghiệm điều kiện
            </Link>{' '}
            — phân loại sơ bộ theo rule nội bộ; kết quả mang tính tham khảo.
          </li>
          <li>
            <Link href="/bang-tinh" className="font-medium text-brand-navy hover:underline">
              Bảng tính so sánh
            </Link>{' '}
            — gợi ý dự án trong catalog theo khung giá ước tính.
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
          là luồng riêng: ưu tiên minh bạch thông tin thuê và kết nối,{' '}
          <strong className="font-semibold text-slate-900">không</strong> áp cùng mô hình quiz / form như NOXH. Chi
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
          tài chính) là <strong className="font-semibold">mô hình nội bộ / minh họa</strong>. Vui lòng đọc thêm tại trang{' '}
          <Link href="/mien-tru-trach-nhiem" className="font-medium text-brand-navy hover:underline">
            miễn trừ trách nhiệm
          </Link>
          .
        </p>
      </section>
    </ContentShell>
  );
}
