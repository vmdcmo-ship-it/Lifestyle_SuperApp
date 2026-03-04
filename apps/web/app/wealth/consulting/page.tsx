import type { Metadata } from 'next';
import Link from 'next/link';
import { WealthConsultingForm } from '../_components/wealth-consulting-form';

export const metadata: Metadata = {
  title: 'Đăng ký tư vấn 1-1',
  description: 'Đăng ký nhận tư vấn tài chính và bảo hiểm 1-1 với chuyên gia KODO Wealth',
  alternates: { canonical: '/wealth/consulting' },
};

export default function WealthConsultingPage(): JSX.Element {
  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/wealth" className="hover:text-foreground">KODO Wealth</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Đăng ký tư vấn</span>
      </nav>

      <div className="mb-8">
        <h1 className="font-heading mb-4 text-3xl font-bold text-[#0D1B2A]">
          Đăng ký tư vấn 1-1
        </h1>
        <p className="text-muted-foreground">
          Để lại thông tin để nhận tư vấn tài chính, bảo hiểm và tải bản kế hoạch chi tiết
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200/60 bg-white p-8">
        <WealthConsultingForm />
      </div>

      <div className="mt-8">
        <Link href="/wealth" className="text-sm font-medium text-[#D4AF37] hover:underline">
          Về KODO Wealth
        </Link>
      </div>
    </div>
  );
}
