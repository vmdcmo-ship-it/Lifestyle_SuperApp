import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Điều khoản & Điều kiện Thương mại điện tử | Shopping Mall',
  description:
    'Điều khoản và điều kiện sử dụng sàn thương mại điện tử Shopping Mall - KODO. Quyền và trách nhiệm người mua, người bán.',
  alternates: { canonical: '/shopping-mall/dieu-khoan' },
};

export default function ShoppingMallTermsPage(): JSX.Element {
  return (
    <>
      <header className="mb-10">
        <Link
          href="/shopping-mall"
          className="mb-4 inline-block text-sm text-slate-500 hover:text-amber-400"
        >
          ← Về Shopping Mall
        </Link>
        <h1 className="font-serif text-3xl font-light text-amber-100 md:text-4xl">
          Điều khoản & Điều kiện Thương mại điện tử
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Cập nhật lần cuối: Tháng 3, 2026
        </p>
      </header>

      <article className="prose prose-invert max-w-none prose-headings:font-serif prose-headings:text-slate-200 prose-p:text-slate-400 prose-li:text-slate-400">
        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">1. Phạm vi áp dụng</h2>
          <p>
            Điều khoản này áp dụng cho toàn bộ giao dịch mua bán hàng hóa, dịch
            vụ trên sàn thương mại điện tử Shopping Mall (sau đây gọi là
            &quot;Sàn&quot;) thuộc nền tảng KODO. Người mua và người bán khi sử
            dụng Sàn đồng nghĩa với việc chấp nhận các điều khoản và điều kiện
            này.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">
            2. Đối tượng tham gia
          </h2>
          <ul className="list-disc pl-6">
            <li>
              <strong className="text-slate-300">Người mua:</strong> Cá nhân,
              tổ chức có nhu cầu mua hàng hóa/dịch vụ trên Sàn, đã đăng ký tài
              khoản KODO.
            </li>
            <li>
              <strong className="text-slate-300">Người bán/Nhà cung cấp:</strong>{' '}
              Cá nhân, doanh nghiệp đã được phê duyệt đăng ký bán hàng trên Sàn
              theo quy định.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">
            3. Quyền và trách nhiệm người mua
          </h2>
          <ul className="list-disc pl-6">
            <li>Cung cấp thông tin chính xác khi đăng ký và giao dịch</li>
            <li>Thanh toán đầy đủ theo đơn hàng đã đặt</li>
            <li>Kiểm tra hàng trước khi nhận, khiếu nại đúng hạn nếu có sai sót</li>
            <li>Tuân thủ pháp luật về bảo vệ người tiêu dùng</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">
            4. Quyền và trách nhiệm người bán
          </h2>
          <ul className="list-disc pl-6">
            <li>Đảm bảo hàng hóa chính hãng, có nguồn gốc hợp pháp</li>
            <li>Giao hàng đúng mô tả, đúng thời hạn cam kết</li>
            <li>Xử lý khiếu nại, hoàn trả theo chính sách Sàn</li>
            <li>Chịu trách nhiệm thuế và phí theo quy định pháp luật</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">
            5. Chính sách giao hàng
          </h2>
          <p>
            Kodo Mall <strong className="text-slate-300">không áp dụng giao hàng thương mại
            điện tử qua đơn vị thứ ba</strong> (shipper bên ngoài). Chúng tôi tập trung trải
            nghiệm mua hàng nội tỉnh, thành.
          </p>
          <p className="mt-2">
            Quà tặng và sản phẩm cao cấp giao qua TMĐT truyền thống không an toàn và nhiều rủi
            ro. Kodo Mall giao trực tiếp qua đội ngũ của mình để đảm bảo chất lượng đến tay
            khách hàng.
          </p>
          <ul className="mt-2 list-disc pl-6">
            <li>
              <strong className="text-slate-300">Giao chuẩn (nội tỉnh):</strong> Phí cố định,
              giao trong ngày.
            </li>
            <li>
              <strong className="text-slate-300">Giao hỏa tốc:</strong> Tính cước theo khoảng
              cách, dùng dịch vụ giao hàng Kodo.
            </li>
            <li>
              Địa chỉ ngoài khu vực phục vụ: &quot;Dịch vụ, sản phẩm này chưa phục vụ tại khu
              vực quý khách.&quot; Vui lòng liên hệ để được tư vấn.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">
            6. Chính sách đổi trả và hoàn tiền
          </h2>
          <p>
            Sàn áp dụng chính sách đổi trả và hoàn tiền theo từng danh mục sản
            phẩm. Chi tiết được quy định tại từng sản phẩm và trang Chính sách
            đổi trả. Sản phẩm thuộc nhóm &quot;không được đổi trả&quot; (ví dụ:
            mỹ phẩm đã mở niêm phong, hàng đặt riêng) sẽ được ghi rõ trong mô tả.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">
            7. Thanh toán và bảo mật
          </h2>
          <p>
            Thanh toán thông qua Ví Lifestyle, thẻ tín dụng/ghi nợ, ví điện tử
            liên kết. Thông tin thanh toán được mã hóa và bảo mật theo tiêu chuẩn
            PCI-DSS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-medium text-slate-200">
            8. Liên hệ và khiếu nại
          </h2>
          <p>
            Mọi thắc mắc, khiếu nại vui lòng liên hệ qua trang{' '}
            <Link href="/contact" className="text-amber-400 hover:underline">
              Liên hệ
            </Link>{' '}
            hoặc hotline hỗ trợ khách hàng của KODO.
          </p>
        </section>
      </article>

      <div className="mt-12 border-t border-slate-700 pt-6">
        <Link
          href="/shopping-mall"
          className="text-amber-400 hover:underline"
        >
          ← Về Shopping Mall
        </Link>
      </div>
    </>
  );
}
