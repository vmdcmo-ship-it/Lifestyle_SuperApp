import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Thông tin pháp lý - Lifestyle Super App',
  description: 'Điều khoản sử dụng, Chính sách bảo mật, Tiêu chuẩn cộng đồng',
  alternates: { canonical: '/phap-ly' },
};

const LEGAL_ITEMS = [
  { href: '/terms', title: 'Điều khoản sử dụng', description: 'Quy định sử dụng dịch vụ' },
  { href: '/privacy', title: 'Chính sách bảo mật', description: 'Thu thập và xử lý dữ liệu cá nhân' },
  { href: '/shopping-mall/dieu-khoan', title: 'Điều khoản TMĐT', description: 'Điều khoản thương mại điện tử Shopping Mall' },
  { href: '/phap-ly/tieu-chuan-cong-dong', title: 'Tiêu chuẩn cộng đồng', description: 'Quy tắc ứng xử trong cộng đồng' },
  { href: '/about', title: 'Về chúng tôi', description: 'Thông tin công ty' },
];

export default function PhapLyPage(): JSX.Element {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading mb-2 text-3xl font-bold">Thông tin pháp lý</h1>
      <p className="mb-12 text-muted-foreground">Các văn bản pháp lý và quy định của Lifestyle Super App</p>
      <div className="grid gap-6 sm:grid-cols-2">
        {LEGAL_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col rounded-xl border bg-card p-6 transition-colors hover:bg-muted/50"
          >
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
