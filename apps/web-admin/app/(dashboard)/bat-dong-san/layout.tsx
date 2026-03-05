'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BDS_NAV = [
  { href: '/bat-dong-san', label: 'Tổng quan' },
  { href: '/bat-dong-san/leads', label: 'Yêu cầu tìm BDS' },
  { href: '/bat-dong-san/articles', label: 'Tin bài viết' },
  { href: '/bat-dong-san/rental-listings', label: 'Tin cho thuê' },
] as const;

export default function BatDongSanLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Quản trị Bất động sản</h1>
        <nav className="flex flex-wrap gap-2">
          {BDS_NAV.map((item) => {
            const isActive =
              item.href === '/bat-dong-san'
                ? pathname === '/bat-dong-san'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      {children}
    </div>
  );
}
