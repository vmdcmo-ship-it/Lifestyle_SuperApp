import type { Metadata } from 'next';
import Link from 'next/link';
import { GiftWidget } from './_components/GiftWidget';

export const metadata: Metadata = {
  title: 'Shopping Mall - The Essence of Luxury',
  description:
    'Sàn thương mại điện tử cao cấp KODO - Thời trang hàng hiệu, mỹ phẩm, hoa tươi nghệ thuật, giỏ quà Hamper. Dịch vụ sử giá tặng quà, giao xe hơi premium.',
  keywords: [
    'shopping mall',
    'luxury ecommerce',
    'thời trang hàng hiệu',
    'mỹ phẩm cao cấp',
    'hamper gift',
    'hoa tươi',
    'sử giá tặng quà',
    'KODO',
  ],
  openGraph: {
    title: 'Shopping Mall - The Essence of Luxury | KODO',
    description: 'Sàn thương mại điện tử cao cấp - Thời trang, mỹ phẩm, quà tặng Hamper.',
    type: 'website',
    url: '/shopping-mall',
  },
  alternates: { canonical: '/shopping-mall' },
};

/** Danh mục sản phẩm Shopping Mall (category) */
const SHOPPING_MALL_CATEGORIES = [
  { label: 'Đồng hồ', href: '/shopping-mall/boutiques?category=watches', icon: '⌚' },
  { label: 'Nước hoa & Mỹ phẩm', href: '/shopping-mall/boutiques?category=cosmetics', icon: '💄' },
  { label: 'Thời trang hàng hiệu', href: '/shopping-mall/boutiques?category=fashion', icon: '👗' },
  { label: 'Hoa tươi', href: '/shopping-mall/gifting-concierge?type=flowers', icon: '💐' },
  { label: 'Hamper & Quà tặng', href: '/shopping-mall/gifting-concierge', icon: '🎁' },
  { label: 'Boutiques', href: '/shopping-mall/boutiques', icon: '🛍️' },
];

export default function ShoppingMallLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-[1920px]">
        {/* Cột trái 20% - Sticky nav */}
        <aside className="sticky top-16 hidden w-[20%] min-w-[200px] max-w-[260px] shrink-0 flex-col self-start border-r border-slate-200 bg-white p-6 lg:flex">
          <h3 className="mb-4 font-serif text-xs font-semibold uppercase tracking-wider" style={{ color: '#1e3a5f' }}>
            Danh mục
          </h3>
          <nav className="flex flex-col gap-0.5">
            {SHOPPING_MALL_CATEGORIES.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 font-serif text-sm font-medium transition-colors hover:bg-amber-50"
                style={{ color: '#1e3a5f' }}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 border-t border-slate-200 pt-4">
            <Link
              href="/shopping-mall/gifting-concierge"
              className="mb-2 block text-xs font-medium"
              style={{ color: '#4a6b8a' }}
            >
              Sứ giả tặng quà
            </Link>
            <Link
              href="/shopping-mall/dang-ky-ban-hang"
              className="block text-xs font-medium"
              style={{ color: '#4a6b8a' }}
            >
              Đăng ký bán hàng
            </Link>
          </div>
        </aside>

        {/* Cột giữa 60% */}
        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 lg:w-[60%] lg:max-w-[960px]">
          {children}
        </main>

        {/* Cột phải 20% - Gift Widget luôn hiện theo spec */}
        <aside className="sticky top-16 hidden w-[20%] min-w-[200px] max-w-[260px] shrink-0 flex-col self-start border-l border-slate-200 bg-white p-6 xl:block">
          <GiftWidget />
        </aside>
      </div>
    </div>
  );
}
