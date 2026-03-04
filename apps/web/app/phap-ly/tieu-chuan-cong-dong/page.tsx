import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tiêu chuẩn cộng đồng',
  description: 'Quy tắc ứng xử và tiêu chuẩn cộng đồng Lifestyle',
  alternates: { canonical: '/phap-ly/tieu-chuan-cong-dong' },
};

export default function TieuChuanCongDongPage(): JSX.Element {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/phap-ly">Pháp lý</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Tiêu chuẩn cộng đồng</span>
      </nav>
      <h1 className="font-heading mb-6 text-2xl font-bold">Tiêu chuẩn cộng đồng</h1>
      <div className="prose prose-sm max-w-none">
        <p>
          Cộng đồng Lifestyle cam kết tạo môi trường an toàn, tôn trọng cho mọi thành viên. Chúng tôi yêu cầu người dùng tuân thủ các quy tắc sau:
        </p>
        <ul className="list-disc pl-6">
          <li>Tôn trọng người khác, không xúc phạm hay quấy rối</li>
          <li>Không chia sẻ nội dung vi phạm pháp luật</li>
          <li>Giao dịch minh bạch, không gian lận</li>
          <li>Bảo mật thông tin cá nhân của bản thân và người khác</li>
        </ul>
      </div>
      <div className="mt-8">
        <Link href="/phap-ly" className="text-sm font-medium text-primary hover:underline">← Về Pháp lý</Link>
      </div>
    </div>
  );
}
