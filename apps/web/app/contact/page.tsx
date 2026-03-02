import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from './contact-form';

export const metadata: Metadata = {
  title: 'Liên hệ - Lifestyle Super App',
  description:
    'Liên hệ với Lifestyle Super App - Hỗ trợ khách hàng, đối tác và góp ý dịch vụ.',
  openGraph: {
    title: 'Liên hệ - Lifestyle Super App',
    description: 'Liên hệ hỗ trợ và góp ý với Lifestyle Super App.',
    type: 'website',
    url: '/contact',
  },
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactPage(): JSX.Element {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-20 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-muted-foreground">
              Chúng tôi luôn lắng nghe và sẵn sàng hỗ trợ bạn
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-bold">Thông tin liên hệ</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📞</span>
                  <div>
                    <h3 className="font-semibold">Hotline</h3>
                    <p className="text-muted-foreground">1900-xxxx (miễn phí cuộc gọi)</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">✉️</span>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">support@lifestyle-app.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📍</span>
                  <div>
                    <h3 className="font-semibold">Văn phòng</h3>
                    <p className="text-muted-foreground">
                      Tòa nhà Lifestyle, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-8">
              <h2 className="mb-6 text-2xl font-bold">Gửi tin nhắn</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Bạn cũng có thể tìm thêm thông tin tại{' '}
            <Link href="/help" className="font-semibold text-purple-600 hover:underline">
              Trợ giúp
            </Link>{' '}
            hoặc{' '}
            <Link href="/about" className="font-semibold text-purple-600 hover:underline">
              Về chúng tôi
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
