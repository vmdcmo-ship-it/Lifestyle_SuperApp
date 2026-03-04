import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** API đăng ký đối tác kinh doanh - form thống nhất cho Food, Bách hóa, Dịch vụ, Shopping Mall */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      storeName,
      contactName,
      contactEmail,
      contactPhone,
      businessGroup,
      subCategory,
      message,
      source,
    } = body as Record<string, unknown>;

    if (
      !storeName?.trim() ||
      !contactName?.trim() ||
      !contactEmail?.trim() ||
      !contactPhone?.trim()
    ) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ Tên cửa hàng, Người liên hệ, Email và Số điện thoại' },
        { status: 400 }
      );
    }

    if (!businessGroup || !subCategory) {
      return NextResponse.json(
        { message: 'Vui lòng chọn nhóm và ngành kinh doanh' },
        { status: 400 }
      );
    }

    const validGroups = ['FOOD_DELIVERY', 'GROCERY', 'LOCAL_SERVICE', 'SHOPPING_MALL'];
    if (!validGroups.includes(String(businessGroup))) {
      return NextResponse.json(
        { message: 'Nhóm kinh doanh không hợp lệ' },
        { status: 400 }
      );
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    const res = await fetch(
      `${API_BASE.replace(/\/$/, '')}/api/v1/merchants/seller-lead`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: String(storeName).trim(),
          contactName: String(contactName).trim(),
          email: String(contactEmail).trim(),
          phone: String(contactPhone).trim(),
          businessGroup: String(businessGroup),
          subCategory: String(subCategory).trim(),
          message: message ? String(message).trim() : undefined,
          source: source || 'partner_web',
        }),
      }
    );

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { message?: string };
      return NextResponse.json(
        { message: err.message || 'Gửi thất bại' },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('[Partner Seller Registration]', e);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
