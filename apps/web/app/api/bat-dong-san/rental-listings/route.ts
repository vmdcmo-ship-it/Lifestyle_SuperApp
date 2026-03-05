import { NextRequest, NextResponse } from 'next/server';
import { RENTAL_LISTINGS_STATIC } from '@/lib/config/bat-dong-san-rental-listings';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

/** GET /api/bat-dong-san/rental-listings - Danh sách tin cho thuê (proxy + fallback) */
export async function GET(request: NextRequest) {
  try {
    const limit = Number(request.nextUrl.searchParams.get('limit')) || 20;
    const district = request.nextUrl.searchParams.get('district') || '';
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/rental-listings?limit=${limit}${district ? `&district=${encodeURIComponent(district)}` : ''}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (res.ok) {
      const json = await res.json();
      return NextResponse.json(json);
    }

    // Fallback
    let data = RENTAL_LISTINGS_STATIC;
    if (district) {
      data = data.filter((r) => r.district?.toLowerCase().includes(district.toLowerCase()));
    }
    return NextResponse.json({ data, total: data.length });
  } catch (e) {
    console.error('[BDS Rental Listings GET]', e);
    return NextResponse.json({ data: RENTAL_LISTINGS_STATIC, total: RENTAL_LISTINGS_STATIC.length });
  }
}

interface RentalListingBody {
  fullName: string;
  phone: string;
  email?: string;
  type: 'owner' | 'agent';
  title: string;
  propertyType: string;
  location: string;
  price?: number;
  area?: number;
  description: string;
  contactNote?: string;
}

/** POST /api/bat-dong-san/rental-listings - Đăng tin cho thuê (proxy đến backend) */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RentalListingBody;
    const { fullName, phone, email, type, title, propertyType, location, price, area, description, contactNote } =
      body;

    if (!fullName?.trim() || !phone?.trim() || !title?.trim() || !propertyType?.trim() || !location?.trim() || !description?.trim()) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ: Họ tên, SĐT, Tiêu đề, Loại BDS, Khu vực, Mô tả' },
        { status: 400 }
      );
    }

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      type: type || 'owner',
      title: title.trim(),
      propertyType: propertyType.trim(),
      location: location.trim(),
      price: price ?? null,
      area: area ?? null,
      description: description.trim(),
      contactNote: contactNote?.trim() || '',
      source: 'bds_rental_listing',
    };

    const res = await fetch(`${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/rental-listings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    // Dev: Backend chưa triển khai endpoint → vẫn chấp nhận, log dữ liệu
    if (res.status === 404 && process.env.NODE_ENV === 'development') {
      console.log('[BDS Rental Listing] Backend chưa có endpoint, dữ liệu:', payload);
      return NextResponse.json({ success: true });
    }

    const err = (await res.json().catch(() => ({}))) as { message?: string };
    return NextResponse.json(
      { message: err.message || 'Gửi thất bại. Vui lòng thử lại hoặc liên hệ Hotline.' },
      { status: res.status }
    );
  } catch (e) {
    console.error('[BDS Rental Listing]', e);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
