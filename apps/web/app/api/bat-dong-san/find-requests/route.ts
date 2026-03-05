import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

interface FindRequestBody {
  fullName: string;
  phone: string;
  email?: string;
  type: 'mua' | 'thue' | 'ca-hai';
  location?: string;
  note?: string;
}

/** POST /api/bat-dong-san/find-requests - Tìm bất động sản (proxy đến backend) */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FindRequestBody;
    const { fullName, phone, email, type, location, note } = body;

    if (!fullName?.trim() || !phone?.trim() || !type) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ: Họ tên, Số điện thoại và Nhu cầu' },
        { status: 400 }
      );
    }

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email?.trim() || '',
      type,
      location: location?.trim() || '',
      note: note?.trim() || '',
      source: 'bds_find_request',
    };

    const res = await fetch(`${API_BASE.replace(/\/$/, '')}${API_PREFIX}/bat-dong-san/find-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      return NextResponse.json({ success: true });
    }

    // Dev: Backend chưa triển khai endpoint → vẫn chấp nhận, log dữ liệu
    if (res.status === 404 && process.env.NODE_ENV === 'development') {
      console.log('[BDS Find Request] Backend chưa có endpoint, dữ liệu:', payload);
      return NextResponse.json({ success: true });
    }

    const err = (await res.json().catch(() => ({}))) as { message?: string };
    return NextResponse.json(
      { message: err.message || 'Gửi thất bại. Vui lòng thử lại hoặc liên hệ Hotline.' },
      { status: res.status }
    );
  } catch (e) {
    console.error('[BDS Find Request]', e);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
