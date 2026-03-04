import type { Metadata } from 'next';
import Link from 'next/link';
import { GiftOrderForm } from '../_components/GiftOrderForm';
import {
  DEFAULT_DELIVERY_FEE_CONFIG,
  type DeliveryFeeConfig,
} from '../../_lib/delivery-config';

export const metadata: Metadata = {
  title: 'Đặt quà - Hamper, Hoa tươi | Shopping Mall',
  description:
    'Đặt quà Hamper hoặc hoa tươi. Chọn thiệp, gói quà thủ công, giao hàng theo bảng giá nền tảng.',
  alternates: { canonical: '/shopping-mall/gifting-concierge/dat-hang' },
};

type SearchParams = { type?: string; action?: string };

async function fetchDeliveryConfig(): Promise<DeliveryFeeConfig> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${apiBase.replace(/\/$/, '')}/api/v1/pricing/public/delivery-mall`, {
      next: { revalidate: 300 },
    });
    if (res.ok) {
      const data = (await res.json()) as DeliveryFeeConfig;
      if (
        typeof data.standardFee === 'number' &&
        typeof data.expressBaseFee === 'number' &&
        typeof data.expressPerKm === 'number'
      ) {
        return data;
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_DELIVERY_FEE_CONFIG;
}

export default async function DatHangPage({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<JSX.Element> {
  const type = searchParams.type === 'flowers' ? 'flowers' : 'hamper';
  const action = searchParams.action === 'send' ? 'send' : 'order';
  const deliveryConfig = await fetchDeliveryConfig();

  return (
    <>
      <header className="mb-8">
        <Link
          href="/shopping-mall/gifting-concierge"
          className="mb-4 inline-block text-sm text-slate-500 hover:text-amber-400"
        >
          ← Sử giá tặng quà
        </Link>
        <h1 className="font-serif text-3xl font-light text-amber-100 md:text-4xl">
          Đặt quà {type === 'hamper' ? 'Hamper' : 'Hoa tươi'}
        </h1>
        <p className="mt-2 text-slate-400">
          {action === 'send'
            ? 'Gửi quà hộ – điền thông tin người nhận và người gửi'
            : 'Điền thông tin giao hàng'}
        </p>
      </header>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white shadow-sm p-8">
        <GiftOrderForm giftType={type} action={action} deliveryConfig={deliveryConfig} />
      </div>
    </>
  );
}
