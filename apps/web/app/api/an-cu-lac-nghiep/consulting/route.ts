import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phone, email, note } = body as {
      fullName?: string;
      phone?: string;
      email?: string;
      note?: string;
    };

    if (!fullName?.trim() || !phone?.trim() || !email?.trim()) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ Họ tên, Số điện thoại và Email' },
        { status: 400 }
      );
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const res = await fetch(`${API_BASE.replace(/\/$/, '')}/api/v1/an-cu-lac-nghiep/consulting`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        note: note?.trim() || '',
        source: 'an_cu_consulting',
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { message: (err as { message?: string }).message || 'Gửi thất bại' },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[An Cu Lac Nghiep Consulting]', e);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
