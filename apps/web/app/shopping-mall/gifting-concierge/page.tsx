import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sử giá tặng quà - Hamper, Hoa tươi | Shopping Mall',
  description:
    'Dịch vụ mua quà & tặng quà hộ. Chọn thiệp, gói quà thủ công, giao hàng bằng xe hơi Premium. Hamper, hoa tươi nghệ thuật.',
  alternates: { canonical: '/shopping-mall/gifting-concierge' },
};

const GIFT_OPTIONS = [
  {
    id: 'hamper',
    name: 'Giỏ quà Hamper',
    description: 'Bộ quà tặng cao cấp với rượu, bánh, trái cây và phụ kiện sang trọng',
    icon: '🎁',
    href: '/shopping-mall/gifting-concierge/dat-hang?type=hamper&action=order',
  },
  {
    id: 'flowers',
    name: 'Hoa tươi nghệ thuật',
    description: 'Thiết kế độc quyền, giao tận tay trong ngày',
    icon: '💐',
    href: '/shopping-mall/gifting-concierge/dat-hang?type=flowers&action=order',
  },
  {
    id: 'custom',
    name: 'Đặt quà theo yêu cầu',
    description: 'Liên hệ đội ngũ concierge để tạo bộ quà riêng',
    icon: '✨',
    href: '/contact?subject=gift-concierge',
  },
];

const GIFT_FEATURES = [
  'Gói quà thủ công cao cấp',
  'Chọn loại hộp quà (cao cấp, thân thiện môi trường, theo yêu cầu)',
  'Viết thiệp tặng kèm (chúc mừng sinh nhật, cảm ơn, v.v.)',
  'Giao chuẩn nội tỉnh hoặc giao hỏa tốc — phí theo bảng giá dịch vụ giao hàng nền tảng',
];

export default function GiftingConciergePage(): JSX.Element {
  return (
    <>
      <header className="mb-10">
        <h1 className="font-heading text-3xl font-light text-amber-100 md:text-4xl">
          Sử giá tặng quà
        </h1>
        <p className="mt-2 text-slate-400">
          Mua quà & Tặng quà hộ. Gói quà, chọn hộp quà, viết thiệp. Giao nội tỉnh/thành,
          không qua đơn vị TMĐT tầng 3 — an toàn cho quà cao cấp.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        {GIFT_OPTIONS.map((opt) => (
          <Link
            key={opt.id}
            href={opt.href}
            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-amber-300"
          >
            <div className="mb-4 text-4xl">{opt.icon}</div>
            <h2 className="mb-2 font-heading text-xl font-medium text-slate-200 group-hover:text-amber-200">
              {opt.name}
            </h2>
            <p className="text-sm text-slate-500">{opt.description}</p>
          </Link>
        ))}
      </div>

      <section className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-8">
        <h2 className="mb-6 font-heading text-2xl font-light text-slate-200">
          Tùy chọn gói quà
        </h2>
        <p className="mb-6 text-sm text-slate-500">
          Chúng tôi phục vụ nội tỉnh, thành. Địa chỉ ngoài khu vực sẽ được thông báo tại form
          đặt hàng.
        </p>
        <ul className="grid gap-4 sm:grid-cols-2">
          {GIFT_FEATURES.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-3 text-slate-300"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex gap-4">
          <Link
            href="/shopping-mall/gifting-concierge/dat-hang?type=hamper&action=order"
            className="rounded-lg bg-amber-600 px-6 py-3 font-medium text-white hover:bg-amber-500"
          >
            Order Now
          </Link>
          <Link
            href="/shopping-mall/gifting-concierge/dat-hang?type=hamper&action=send"
            className="rounded-lg border border-amber-500/50 px-6 py-3 font-medium text-amber-400 hover:bg-amber-500/10"
          >
            Gửi quà hộ
          </Link>
        </div>
      </section>
    </>
  );
}
