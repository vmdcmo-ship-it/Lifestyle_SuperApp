import type { Metadata } from 'next';
import Link from 'next/link';
import { PartnerRegistrationContent } from '@/app/dang-ky-doi-tac/_components/PartnerRegistrationContent';

export const metadata: Metadata = {
  title: 'Đăng ký bán hàng | Shopping Mall - KODO',
  description:
    'Đăng ký trở thành nhà bán hàng trên Shopping Mall KODO. Thời trang, mỹ phẩm, quà tặng. Tải App Merchant.',
  alternates: { canonical: '/shopping-mall/dang-ky-ban-hang' },
};

const MERCHANT_APP_STORE_URL =
  process.env.NEXT_PUBLIC_MERCHANT_APP_STORE_URL ||
  process.env.NEXT_PUBLIC_APP_STORE_URL ||
  '#';
const MERCHANT_GOOGLE_PLAY_URL =
  process.env.NEXT_PUBLIC_MERCHANT_GOOGLE_PLAY_URL ||
  process.env.NEXT_PUBLIC_GOOGLE_PLAY_URL ||
  '#';

export default function SellerRegistrationPage(): JSX.Element {
  return (
    <>
      <header className="mb-10">
        <Link
          href="/shopping-mall"
          className="mb-4 inline-block text-sm text-slate-600 hover:text-amber-600"
        >
          ← Shopping Mall
        </Link>
        <h1 className="font-heading text-3xl font-light text-amber-600 md:text-4xl">
          Đăng ký bán hàng
        </h1>
        <p className="mt-2 text-slate-600">
          Trở thành đối tác nhà bán hàng Shopping Mall — thời trang, mỹ phẩm, quà tặng
        </p>
      </header>

      <PartnerRegistrationContent
        defaultGroup="SHOPPING_MALL"
        source="shopping_mall_web"
        apiPath="/api/partner/seller-registration"
        appStoreUrl={MERCHANT_APP_STORE_URL}
        googlePlayUrl={MERCHANT_GOOGLE_PLAY_URL}
      />
    </>
  );
}
