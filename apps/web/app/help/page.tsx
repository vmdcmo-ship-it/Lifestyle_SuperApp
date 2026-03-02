import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Trợ giúp - Lifestyle Super App',
  description:
    'Trung tâm trợ giúp Lifestyle Super App - Hướng dẫn sử dụng, câu hỏi thường gặp và liên hệ hỗ trợ.',
  openGraph: {
    title: 'Trợ giúp - Lifestyle Super App',
    description: 'Hướng dẫn và hỗ trợ sử dụng Lifestyle Super App.',
    type: 'website',
    url: '/help',
  },
  alternates: {
    canonical: '/help',
  },
};

const FAQ_ITEMS = [
  {
    q: 'Làm thế nào để đăng ký tài khoản?',
    a: 'Bạn có thể đăng ký qua trang Đăng ký hoặc ứng dụng di động bằng email hoặc số điện thoại.',
  },
  {
    q: 'Quên mật khẩu thì làm sao?',
    a: 'Vào trang Đăng nhập, nhấn "Quên mật khẩu?" và nhập email để nhận hướng dẫn khôi phục.',
  },
  {
    q: 'Cách nạp tiền vào Ví Lifestyle?',
    a: 'Vào mục Ví Lifestyle, chọn Nạp tiền và làm theo hướng dẫn chuyển khoản hoặc thanh toán bằng thẻ.',
  },
  {
    q: 'Lifestyle Xu dùng để làm gì?',
    a: 'Lifestyle Xu có thể đổi lấy voucher, giảm giá hoặc ưu đãi đặc biệt khi sử dụng các dịch vụ trong app.',
  },
  {
    q: 'Làm sao để liên hệ hỗ trợ?',
    a: 'Bạn có thể gửi yêu cầu qua trang Liên hệ hoặc gọi hotline 1900-xxxx (miễn phí).',
  },
];

export default function HelpPage(): JSX.Element {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Trung tâm trợ giúp
            </h1>
            <p className="text-xl text-muted-foreground">
              Tìm câu trả lời và hỗ trợ khi bạn cần
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold">Câu hỏi thường gặp</h2>
            <dl className="space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl border bg-card p-6"
                >
                  <dt className="mb-2 font-semibold">{item.q}</dt>
                  <dd className="text-muted-foreground">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold">Chưa tìm thấy câu trả lời?</h2>
            <p className="mb-8 text-muted-foreground">
              Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp bạn 24/7
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
            >
              Liên hệ hỗ trợ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
