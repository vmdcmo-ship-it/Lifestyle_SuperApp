'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  '': 'Dashboard',
  users: 'Người dùng',
  drivers: 'Tài xế',
  merchants: 'Cửa hàng',
  orders: 'Đơn hàng',
  pricing: 'Bảng giá',
  tables: 'Bảng giá',
  coupons: 'Voucher',
  marketing: 'Trung tâm Marketing',
  campaigns: 'Chiến dịch',
  reports: 'Báo cáo',
  affiliate: 'Affiliate',
  'loyalty-xu': 'Loyalty Xu',
  'run-to-earn': 'Run to Earn',
  content: 'Trung tâm thông tin',
  training: 'Đào tạo',
  categories: 'Danh mục',
  materials: 'Tài liệu',
  news: 'Tin tức',
  regions: 'Khu vực địa lý',
  franchise: 'Nhượng quyền',
  audit: 'Audit Log',
  settings: 'Cài đặt',
  wealth: 'KODO Wealth',
  leads: 'Leads',
  'an-cu-leads': 'An Cư Lạc Nghiệp Leads',
  'seller-leads': 'Seller Leads (Shopping Mall)',
  'lucky-wheel': 'Lucky Wheel',
  spins: 'Lượt quay',
  prizes: 'Giải thưởng',
  new: 'Tạo mới',
  edit: 'Chỉnh sửa',
  verify: 'Xác minh',
  CAR: 'Xe 4 chỗ',
  MOTORCYCLE: 'Xe máy',
  SUV: 'Xe SUV',
  VAN: 'Xe van',
};

export function Breadcrumbs(): JSX.Element {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const items = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = LABELS[seg] ?? (seg.match(/^[0-9a-f-]{36}$/i) ? 'Chi tiết' : seg);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        {LABELS['']}
      </Link>
      {items.map((item, i) => (
        <span key={item.href}>
          <span className="mx-1">/</span>
          {item.isLast ? (
            <span className="font-medium text-foreground">{item.label}</span>
          ) : (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
