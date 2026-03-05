import type { Metadata } from 'next';
import Link from 'next/link';
import { MallHero } from './_components/MallHero';
import { ProductCard } from './_components/ProductCard';
import type { ProductCardData } from './_components/ProductCard';

export const metadata: Metadata = {
  title: 'Shopping Mall - The Essence of Luxury',
  description:
    'Sàn thương mại điện tử cao cấp KODO. Thời trang hàng hiệu, mỹ phẩm, hoa tươi nghệ thuật, giỏ quà Hamper. Dịch vụ sử giá tặng quà.',
  openGraph: {
    title: 'Shopping Mall - The Essence of Luxury | KODO',
    description: 'Sàn TMĐT cao cấp - Thời trang, mỹ phẩm, quà tặng Hamper.',
    url: '/shopping-mall',
  },
};

const FEATURED_PRODUCTS: ProductCardData[] = [
  {
    id: '1',
    name: 'Đồng hồ Chronograph da cao cấp',
    brand: 'Heritage',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    price: 12500000,
    showPrice: false,
    href: '/shopping-mall/boutiques?product=1',
  },
  {
    id: '2',
    name: 'Nước hoa Eau de Parfum 50ml',
    brand: 'Maison',
    imageUrl: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
    price: 2800000,
    showPrice: true,
    href: '/shopping-mall/boutiques?product=2',
  },
  {
    id: '3',
    name: 'Giỏ quà Hamper Tết 2026',
    brand: 'Luxe Hamper',
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80',
    price: 3500000,
    showPrice: true,
    href: '/shopping-mall/gifting-concierge',
  },
  {
    id: '4',
    name: 'Bó hoa hồng nghệ thuật',
    brand: 'Art Flower',
    imageUrl: 'https://images.unsplash.com/photo-1490750487820-84d81e2de9dd?w=600&q=80',
    price: 1200000,
    showPrice: true,
    href: '/shopping-mall/gifting-concierge?type=flowers',
  },
];

export default function ShoppingMallPage(): JSX.Element {
  return (
    <>
      {/* Header - font-heading (Be Vietnam Pro) đồng bộ với các trang khác */}
      <header className="mb-8">
        <h1 className="font-heading text-4xl font-bold tracking-wide md:text-5xl" style={{ color: '#1e3a5f' }}>
          Shopping Mall
        </h1>
        <p className="mt-2 font-heading text-base" style={{ color: '#4a6b8a' }}>
          The Essence of Luxury
        </p>
      </header>

      {/* Hero Section 60% - Cinemagraphs/videos */}
      <section className="mb-12">
        <MallHero />
      </section>

      {/* Boutiques preview */}
      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-heading text-2xl font-semibold" style={{ color: '#1e3a5f' }}>
            Bộ sưu tập nổi bật
          </h2>
          <Link
            href="/shopping-mall/boutiques"
            className="font-heading text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: '#FFB800' }}
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Cross-sell: Lái hộ, Tài chính */}
      <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
        <h3 className="mb-4 font-heading text-lg font-medium" style={{ color: '#1e3a5f' }}>
          Khám phá thêm từ KODO
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/ride-hailing?service=driver"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-slate-300 hover:bg-slate-50"
            style={{ color: '#1e3a5f' }}
          >
            Lái hộ
          </Link>
          <Link
            href="/wealth"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-slate-300 hover:bg-slate-50"
            style={{ color: '#1e3a5f' }}
          >
            KODO Wealth
          </Link>
          <Link
            href="/shopping-mall/dang-ky-ban-hang"
            className="rounded-lg border px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ borderColor: '#FFB800', backgroundColor: '#FFB800' }}
          >
            Đăng ký bán hàng
          </Link>
        </div>
      </section>
    </>
  );
}
