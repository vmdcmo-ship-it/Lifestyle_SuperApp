'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ListingForm } from '@/components/timnhatro/listing-form';
import { isLandlordLoggedIn } from '@/lib/landlord-auth';

export default function TimnhatroDangTinPage(): JSX.Element {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLandlordLoggedIn()) {
      router.replace('/timnhatro/dang-nhap?next=/timnhatro/dang-tin');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center text-slate-600">
        Đang kiểm tra phiên…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/timnhatro/tin-cua-toi" className="hover:text-[#1e3a8a]">
          ← Tin của tôi
        </Link>
      </nav>
      <h1 className="text-2xl font-semibold text-slate-900">Đăng tin cho thuê</h1>
      <p className="mt-2 text-sm text-slate-600">
        Tin được hiển thị công khai ngay sau khi lưu (§19.1a). Kiểm tra lại địa chỉ và giá trước khi đăng.
      </p>
      <div className="mt-8">
        <ListingForm
          mode="create"
          initial={null}
          onSuccess={(listing) => {
            router.push(`/timnhatro/${listing.slug}`);
          }}
        />
      </div>
    </div>
  );
}
