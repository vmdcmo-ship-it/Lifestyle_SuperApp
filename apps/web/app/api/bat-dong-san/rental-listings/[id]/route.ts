import { NextRequest, NextResponse } from 'next/server';
import { RENTAL_LISTINGS_STATIC } from '@/lib/config/bat-dong-san-rental-listings';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

/** GET /api/bat-dong-san/rental-listings/[id] - Chi tiết tin cho thuê theo ID */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: 'Thiếu ID' }, { status: 400 });
  }

  try {
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/rental-listings/${encodeURIComponent(id)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }

    // Fallback: tìm trong static
    const item = RENTAL_LISTINGS_STATIC.find((r) => r.id === id);
    if (!item) {
      return NextResponse.json({ message: 'Không tìm thấy tin cho thuê' }, { status: 404 });
    }
    return NextResponse.json({ data: item });
  } catch (e) {
    console.error('[BDS Rental Listing by ID]', e);
    const item = RENTAL_LISTINGS_STATIC.find((r) => r.id === id);
    if (item) return NextResponse.json({ data: item });
    return NextResponse.json({ message: 'Không tìm thấy tin cho thuê' }, { status: 404 });
  }
}
