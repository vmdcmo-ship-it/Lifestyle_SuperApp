'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ListingForm } from '@/components/timnhatro/listing-form';
import { fetchMyListing, type LandlordListing } from '@/lib/landlord-api';
import { isLandlordLoggedIn } from '@/lib/landlord-auth';

export default function TimnhatroSuaTinPage(): JSX.Element {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [listing, setListing] = useState<LandlordListing | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLandlordLoggedIn()) {
      router.replace(`/timnhatro/dang-nhap?next=${encodeURIComponent(`/timnhatro/sua/${id}`)}`);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const row = await fetchMyListing(id);
        if (!cancelled) {
          setListing(row);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = (err as Error).message;
          if (msg === 'UNAUTHORIZED') {
            router.replace(`/timnhatro/dang-nhap?next=${encodeURIComponent(`/timnhatro/sua/${id}`)}`);
            return;
          }
          setError(msg);
          setListing(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, router]);

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center text-slate-600">
        Đang tải tin…
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <p className="text-red-700">{error || 'Không tìm thấy tin.'}</p>
        <Link href="/timnhatro/tin-cua-toi" className="mt-4 inline-block text-[#1e3a8a] hover:underline">
          ← Quay lại danh sách
        </Link>
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
      <h1 className="text-2xl font-semibold text-slate-900">Sửa tin</h1>
      <p className="mt-2 text-sm text-slate-600">
        Cập nhật nội dung hoặc gia hạn bằng cách chỉnh &quot;Hết hạn hiển thị SĐT&quot;.
      </p>
      <div className="mt-8">
        <ListingForm
          key={listing.id}
          mode="edit"
          initial={listing}
          listingId={listing.id}
          onSuccess={(updated) => {
            router.push(`/timnhatro/${updated.slug}`);
          }}
        />
      </div>
    </div>
  );
}
