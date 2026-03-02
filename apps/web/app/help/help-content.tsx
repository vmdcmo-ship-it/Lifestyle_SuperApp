'use client';

import Link from 'next/link';

const FAQ_ITEMS = [
  {
    category: 'Tài khoản',
    items: [
      {
        q: 'Làm sao đăng ký tài khoản?',
        a: 'Vào trang Đăng ký, điền email, mật khẩu và thông tin cá nhân. Xác thực qua email rồi hoàn tất.',
      },
      {
        q: 'Quên mật khẩu phải làm gì?',
        a: 'Vào trang Đăng nhập → Quên mật khẩu. Nhập email đăng ký để nhận link đặt lại mật khẩu.',
      },
      {
        q: 'Có thể đổi số điện thoại không?',
        a: 'Được. Vào Cài đặt → Tài khoản để cập nhật số điện thoại. Bạn cần xác thực qua mã OTP.',
      },
    ],
  },
  {
    category: 'Thanh toán & Ví',
    items: [
      {
        q: 'Lifestyle Xu là gì?',
        a: 'Lifestyle Xu là điểm thưởng khi bạn sử dụng dịch vụ. 1 Xu = 1.000đ khi đổi quà hoặc thanh toán.',
      },
      {
        q: 'Nạp tiền vào Ví Lifestyle như thế nào?',
        a: 'Vào Ví Lifestyle → Nạp tiền. Chọn ngân hàng và chuyển khoản theo thông tin hiển thị.',
      },
      {
        q: 'Rút tiền mất bao lâu?',
        a: 'Thường trong 5–15 phút. Ngân hàng có thể xử lý chậm hơn vào cuối tuần hoặc ngày lễ.',
      },
    ],
  },
  {
    category: 'Đặt xe & Giao hàng',
    items: [
      {
        q: 'Hủy đơn có mất phí không?',
        a: 'Hủy trong vòng 2 phút sau khi đặt: miễn phí. Hủy sau khi tài xế đang đến: có thể bị tính phí.',
      },
      {
        q: 'Làm sao theo dõi đơn giao đồ ăn?',
        a: 'Vào Đơn hàng của tôi hoặc xem thông báo real-time trên app khi shipper đang giao.',
      },
    ],
  },
  {
    category: 'Giới thiệu & Khuyến mãi',
    items: [
      {
        q: 'Mã giới thiệu dùng như thế nào?',
        a: 'Chia sẻ mã của bạn cho bạn bè. Khi họ đăng ký và hoàn thành điều kiện, cả hai nhận quà.',
      },
      {
        q: 'Voucher áp dụng thế nào?',
        a: 'Chọn voucher tại bước thanh toán. Một số voucher chỉ áp dụng cho dịch vụ hoặc đơn tối thiểu cụ thể.',
      },
    ],
  },
];

export function HelpContent(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-8 text-2xl font-bold">Câu hỏi thường gặp</h2>

        <div className="space-y-10">
          {FAQ_ITEMS.map((section) => (
            <section key={section.category}>
              <h3 className="mb-4 text-lg font-semibold text-purple-600">
                {section.category}
              </h3>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md"
                  >
                    <h4 className="mb-2 font-medium">{item.q}</h4>
                    <p className="text-sm text-muted-foreground">{item.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border bg-card p-8 text-center">
          <h3 className="mb-4 text-xl font-bold">Vẫn cần hỗ trợ?</h3>
          <p className="mb-6 text-muted-foreground">
            Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ 24/7
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl active:scale-95"
            >
              Liên hệ hỗ trợ
            </Link>
            <a
              href="mailto:support@lifestyle-app.com"
              className="inline-flex items-center justify-center rounded-lg border px-6 py-3 font-medium transition-colors hover:bg-accent"
            >
              support@lifestyle-app.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
