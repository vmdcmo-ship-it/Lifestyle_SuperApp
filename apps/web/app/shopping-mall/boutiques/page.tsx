import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductCard } from '../_components/ProductCard';
import type { ProductCardData } from '../_components/ProductCard';

export const metadata: Metadata = {
  title: 'Boutiques - Không gian trưng bày thương hiệu | Shopping Mall',
  description:
    'Khám phá các thương hiệu thời trang hàng hiệu, mỹ phẩm, phụ kiện cao cấp tại Shopping Mall KODO.',
  alternates: { canonical: '/shopping-mall/boutiques' },
};

const BOUTIQUE_CATEGORIES = [
  { key: 'fashion', label: 'Thời trang hàng hiệu', icon: '👗' },
  { key: 'cosmetics', label: 'Mỹ phẩm', icon: '💄' },
  { key: 'watches', label: 'Đồng hồ', icon: '⌚' },
  { key: 'flowers', label: 'Hoa tươi', icon: '💐' },
  { key: 'hamper', label: 'Hamper & Quà tặng', icon: '🎁' },
];

const MOCK_BOUTIQUE_PRODUCTS: ProductCardData[] = [
  {
    id: 'b1',
    name: 'Áo khoác len cao cấp',
    brand: 'Luxe Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    price: 4500000,
    showPrice: false,
    href: '/shopping-mall/boutiques/1',
  },
  {
    id: 'b2',
    name: 'Serum chống lão hóa',
    brand: 'Skin Science',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&q=80',
    price: 1200000,
    showPrice: true,
    href: '/shopping-mall/boutiques/2',
  },
  {
    id: 'b3',
    name: 'Đồng hồ Automatic',
    brand: 'Time Craft',
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80',
    price: 18500000,
    showPrice: false,
    href: '/shopping-mall/boutiques/3',
  },
  {
    id: 'b4',
    name: 'Bó hoa hồng premium',
    brand: 'Art Flower',
    imageUrl: 'https://images.unsplash.com/photo-1490750487820-84d81e2de9dd?w=600&q=80',
    price: 980000,
    showPrice: true,
    href: '/shopping-mall/gifting-concierge?type=flowers',
  },
  {
    id: 'b5',
    name: 'Hamper Tết Signature',
    brand: 'Luxe Hamper',
    imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80',
    price: 5200000,
    showPrice: true,
    href: '/shopping-mall/gifting-concierge',
  },
  {
    id: 'b6',
    name: 'Túi xách da thật',
    brand: 'Leather Art',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    price: 8900000,
    showPrice: false,
    href: '/shopping-mall/boutiques/6',
  },
];

export default function BoutiquesPage(): JSX.Element {
  return (
    <>
      <header className="mb-10">
        <h1 className="font-serif text-3xl font-light md:text-4xl" style={{ color: '#1e3a5f' }}>
          Boutiques
        </h1>
        <p className="mt-2" style={{ color: '#4a6b8a' }}>
          Không gian trưng bày các thương hiệu cao cấp
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-2">
        {BOUTIQUE_CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={`/shopping-mall/boutiques?category=${cat.key}`}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-slate-300 hover:bg-slate-50"
          style={{ color: '#1e3a5f' }}
          >
            {cat.icon} {cat.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {MOCK_BOUTIQUE_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
