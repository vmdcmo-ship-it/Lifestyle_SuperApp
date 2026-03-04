import type { Metadata } from 'next';
import Link from 'next/link';
import { PartnerRegistrationContent } from './_components/PartnerRegistrationContent';

export const metadata: Metadata = {
  title: 'Đăng ký đối tác kinh doanh | KODO',
  description:
    'Đăng ký trở thành đối tác: Giao thức ăn, Bách hóa, Giới thiệu dịch vụ, Shopping Mall. Tải App Merchant quản lý cửa hàng.',
  alternates: { canonical: '/dang-ky-doi-tac' },
};

const MERCHANT_APP_STORE_URL =
  process.env.NEXT_PUBLIC_MERCHANT_APP_STORE_URL ||
  process.env.NEXT_PUBLIC_APP_STORE_URL ||
  '#';
const MERCHANT_GOOGLE_PLAY_URL =
  process.env.NEXT_PUBLIC_MERCHANT_GOOGLE_PLAY_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
  '#';

type SearchParams = { group?: string };

export default function DangKyDoiTacPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): JSX.Element {
  const defaultGroup = searchParams?.group as string | undefined;
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-10 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl" style={{ color: '#1e3a5f' }}>
            Đăng ký đối tác kinh doanh
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-slate-600">
            Gia nhập KODO với tư cách nhà hàng, bách hóa, dịch vụ địa phương hoặc nhà bán hàng
            Shopping Mall.
          </p>
          <p className="mt-2 text-sm" style={{ color: '#4a6b8a' }}>
            Đăng ký tài xế tại{' '}
            <Link href="/signup/driver" className="font-medium underline-offset-4 hover:underline" style={{ color: '#FFB800' }}>
              trang dành cho tài xế
            </Link>
          </p>
        </header>

        <PartnerRegistrationContent
          defaultGroup={defaultGroup}
          source="partner_web"
          apiPath="/api/partner/seller-registration"
          appStoreUrl={MERCHANT_APP_STORE_URL}
          googlePlayUrl={MERCHANT_GOOGLE_PLAY_URL}
        />

        <div className="mt-10 text-center">
          <Link
            href="/partner"
            className="transition-colors font-medium hover:opacity-80"
            style={{ color: '#1e3a5f' }}
          >
            ← Về trang Đối tác
          </Link>
        </div>
      </div>
    </div>
  );
}
