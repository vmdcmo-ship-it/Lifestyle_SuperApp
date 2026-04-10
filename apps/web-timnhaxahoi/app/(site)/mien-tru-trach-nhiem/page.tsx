import type { Metadata } from 'next';
import Link from 'next/link';
import { ContentShell } from '@/components/content/content-shell';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/mien-tru-trach-nhiem',
  title: 'Miễn trừ trách nhiệm và điều khoản',
  description:
    'Thông tin tham khảo, giới hạn trách nhiệm nội dung và công cụ trên timnhaxahoi.com — đọc trước khi sử dụng.',
});

export default function MienTruTrachNhiemPage() {
  return (
    <ContentShell eyebrow="Pháp lý và minh bạch" title="Miễn trừ trách nhiệm và điều khoản sử dụng">
      <p className="text-sm text-slate-600">
        Cập nhật gần nhất áp dụng cho việc sử dụng website công khai tại <strong className="text-slate-800">timnhaxahoi.com</strong>.
        Bằng việc tiếp tục truy cập, bạn xác nhận đã đọc và hiểu các điểm dưới đây.
      </p>

      <section className="space-y-3" id="tong-quan">
        <h2 className="text-xl font-bold text-slate-900">1. Tính chất thông tin</h2>
        <p>
          Toàn bộ nội dung (bài viết, mô tả dự án, video, widget trên site) mang tính{' '}
          <strong className="font-semibold text-slate-900">tham khảo và giáo dục</strong>, không phải văn bản pháp lý cá
          nhân, không phải báo giá chính thức từ chủ đầu tư hay ngân hàng, và{' '}
          <strong className="font-semibold text-slate-900">không</strong> thay thế tư vấn trực tiếp của luật sư, cán bộ
          có thẩm quyền, hay nhân viên tín dụng.
        </p>
        <p>
          Chúng tôi cố gắng cập nhật chính sách và dữ liệu catalog, song quy định pháp luật và điều kiện từng dự án có thể
          thay đổi. Trước khi ký kết hoặc nộp hồ sơ, bạn cần xác minh với cơ quan nhà nước, chủ đầu tư và đối tác tài
          chính phù hợp.
        </p>
      </section>

      <section className="space-y-3" id="cong-cu">
        <h2 className="text-xl font-bold text-slate-900">2. Trắc nghiệm, bảng tính và điểm số</h2>
        <p>
          Công cụ <strong className="font-semibold text-slate-900">trắc nghiệm điều kiện</strong> vận hành theo{' '}
          <strong className="font-semibold text-slate-900">quy tắc nội bộ (rule-based)</strong> để phân loại sơ bộ và hỗ
          trợ vận hành. Kết quả (điểm, nhãn, gợi ý dự án) là{' '}
          <strong className="font-semibold text-slate-900">mô hình tham khảo</strong>, không đảm bảo phê duyệt hồ sơ hay
          mức vay; chúng tôi{' '}
          <strong className="font-semibold text-slate-900">không</strong> cam kết tỉ lệ phê duyệt hay thời hạn xử lý cụ
          thể.
        </p>
        <p>
          <strong className="font-semibold text-slate-900">Bảng tính so sánh ngân sách</strong> dùng dữ liệu catalog (ví
          dụ giá/m² và diện tích điển hình) để ước tính khung giá; các tham số vay minh họa (kỳ hạn, lãi suất) là{' '}
          <strong className="font-semibold text-slate-900">cố định trong hệ thống</strong>, không phải báo giá thực tế.
        </p>
      </section>

      <section className="space-y-3" id="du-lieu">
        <h2 className="text-xl font-bold text-slate-900">3. Liên hệ và dữ liệu cá nhân</h2>
        <p>
          Khi bạn gửi biểu mẫu (điện thoại, email, nội dung trắc nghiệm, yêu cầu tư vấn), thông tin được xử lý để{' '}
          <strong className="font-semibold text-slate-900">phục vụ tư vấn và vận hành</strong> theo chính sách nội bộ và
          tích hợp CRM (ví dụ Lark Base) nếu được bật. Bạn có trách nhiệm cung cấp thông tin trung thực; chúng tôi có
          thể từ chối hoặc giới hạn tiếp nhận nếu phát hiện lạm dụng, spam hoặc vi phạm pháp luật.
        </p>
        <p>
          Chính sách bảo mật chi tiết có thể được bổ sung thành trang riêng khi vận hành yêu cầu; tạm thời, nguyên tắc là{' '}
          <strong className="font-semibold text-slate-900">không bán dữ liệu</strong> cho bên thứ ba cho mục đích quảng
          cáo ngoài phạm vi đồng ý của bạn và pháp luật.
        </p>
      </section>

      <section className="space-y-3" id="nha-tro">
        <h2 className="text-xl font-bold text-slate-900">4. Kênh tìm nhà trọ</h2>
        <p>
          Tin cho thuê do người dùng đăng; nền tảng{' '}
          <strong className="font-semibold text-slate-900">không</strong> đứng ra giao dịch tiền thuê, giữ cọc hay ký hợp
          đồng thay các bên. Việc liên hệ, xem nhà và giao kết là trách nhiệm giữa người thuê và chủ tin; bạn cần tự xác
          minh pháp lý nhà đất và an toàn cá nhân.
        </p>
      </section>

      <section className="space-y-3" id="lien-ket">
        <h2 className="text-xl font-bold text-slate-900">5. Liên kết và dịch vụ bên thứ ba</h2>
        <p>
          Website có thể chứa liên kết hoặc nhúng (video, bản đồ). Chúng tôi không kiểm soát toàn bộ nội dung bên ngoài;
          điều khoản và rủi ro sử dụng thuộc về nhà cung cấp tương ứng.
        </p>
      </section>

      <section className="space-y-3" id="thay-doi">
        <h2 className="text-xl font-bold text-slate-900">6. Thay đổi điều khoản</h2>
        <p>
          Điều khoản có thể được cập nhật; phiên bản hiển thị trên trang này là phiên bản hiện hành. Nếu thay đổi trọng
          yếu ảnh hưởng quyền của bạn, chúng tôi sẽ cố gắng thông báo qua giao diện site hoặc kênh liên hệ phù hợp.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
        <h2 className="text-lg font-bold text-slate-900">Liên hệ vận hành</h2>
        <p className="mt-2 text-sm text-slate-700">
          Mọi góp ý về nội dung hoặc khiếu nại liên quan hiển thị sai lệch trên site, vui lòng dùng kênh liên hệ do đội
          vận hành công bố trên từng trang dịch vụ hoặc email hỗ trợ (khi được cấu hình).
        </p>
        <p className="mt-4 text-sm">
          <Link href="/gioi-thieu" className="font-medium text-brand-navy hover:underline">
            Giới thiệu
          </Link>
          {' · '}
          <Link href="/" className="font-medium text-brand-navy hover:underline">
            Trang chủ
          </Link>
        </p>
      </section>
    </ContentShell>
  );
}
