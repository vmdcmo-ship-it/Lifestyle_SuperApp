import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, password, referralCode } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Mật khẩu phải có ít nhất 8 ký tự' },
        { status: 400 }
      );
    }

    const res = await fetch(`${API_BASE}${API_PREFIX}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
        phoneNumber: phoneNumber || undefined,
        role: 'CUSTOMER',
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Đăng ký thất bại' },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('[register/member]', err);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    );
  }
}
