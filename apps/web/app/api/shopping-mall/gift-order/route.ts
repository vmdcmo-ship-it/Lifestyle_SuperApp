import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/**
 * API nhận form đặt quà (Hamper, Hoa tươi)
 * Lưu lead / gửi email - hiện lưu vào bảng tạm hoặc gửi contact
 * TODO: Tích hợp với order service khi có
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      giftType,
      action,
      recipientName,
      recipientPhone,
      recipientAddress,
      cityId,
      cardOption,
      cardMessage,
      giftWrapping,
      giftBoxType,
      deliveryMethod,
      distanceKm,
      expressFee,
      senderName,
      senderPhone,
      note,
    } = body as Record<string, unknown>;

    if (!recipientName || !recipientPhone || !recipientAddress) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin người nhận' },
        { status: 400 }
      );
    }

    if (action === 'send' && (!senderName || !senderPhone)) {
      return NextResponse.json(
        { message: 'Gửi quà hộ cần thông tin người gửi' },
        { status: 400 }
      );
    }

    if (cityId === 'other') {
      return NextResponse.json(
        {
          message:
            'Dịch vụ, sản phẩm này chưa phục vụ tại khu vực quý khách. Hiện chúng tôi tập trung trải nghiệm mua hàng nội tỉnh, thành.',
        },
        { status: 400 }
      );
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const msgParts = [
      `Loại: ${giftType}`,
      `Hành động: ${action}`,
      `Tỉnh/thành: ${cityId}`,
      `Địa chỉ: ${recipientAddress}`,
      `Thiệp: ${cardOption}`,
      cardMessage ? `Lời chúc: ${cardMessage}` : null,
      `Gói quà: ${giftWrapping ? 'Có' : 'Không'}`,
      `Hộp quà: ${giftBoxType}`,
      `Giao hàng: ${deliveryMethod === 'express' ? `Hỏa tốc (${distanceKm}km, +${expressFee} VND)` : 'Chuẩn'}`,
      senderName ? `Người gửi: ${senderName} - ${senderPhone}` : null,
      note ? `Ghi chú: ${note}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const payload = {
      storeName: `[GIFT] ${giftType} - ${action === 'send' ? 'Gửi hộ' : 'Order'}`,
      contactName: String(recipientName),
      email: 'gift-order@kodo.vn',
      phone: String(recipientPhone),
      businessGroup: 'SHOPPING_MALL',
      subCategory: String(giftType),
      message: msgParts,
      source: 'shopping_mall_gift_order',
    };

    // Gửi qua seller-lead API (tạm dùng cho gift order lead)
    const res = await fetch(
      `${API_BASE.replace(/\/$/, '')}/api/v1/merchants/seller-lead`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    console.error('[Gift Order]', e);
    return NextResponse.json(
      { message: 'Có lỗi xảy ra. Vui lòng thử lại.' },
      { status: 500 }
    );
  }
}
