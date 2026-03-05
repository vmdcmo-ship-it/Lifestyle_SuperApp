/**
 * POST /api/wealth/insurance-qa
 * Hỏi đáp bảo hiểm với AI - RAG từ dữ liệu sản phẩm thực tế.
 * QUAN TRỌNG: AI chỉ trả lời dựa trên context, KHÔNG suy diễn thông tin hợp đồng.
 */

import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const API_PREFIX = '/api/v1';

const TYPE_LABELS: Record<string, string> = {
  HEALTH: 'Sức khỏe',
  LIFE: 'Nhân thọ',
  VEHICLE: 'Xe cộ',
  TRAVEL: 'Du lịch',
  HOME: 'Nhà cửa',
  ACCIDENT: 'Tai nạn',
  SOCIAL: 'Xã hội',
};

async function fetchInsuranceProductsContext(): Promise<string> {
  try {
    const url = `${API_BASE.replace(/\/$/, '')}${API_PREFIX}/insurance/products?limit=50`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return '';

    const json = await res.json();
    const products = json?.data ?? json?.items ?? [];
    if (!Array.isArray(products) || products.length === 0) {
      return '(Chưa có dữ liệu sản phẩm bảo hiểm trong hệ thống.)';
    }

    const lines = products.map((p: any) => {
      const typeLabel = TYPE_LABELS[p.type] || p.type;
      const premiumM = Number(p.premiumMonthly ?? 0);
      const premiumY = Number(p.premiumYearly ?? 0);
      const coverage = Number(p.coverageAmount ?? 0);
      const covDetails =
        typeof p.coverageDetails === 'object'
          ? JSON.stringify(p.coverageDetails)
          : p.coverageDetails ?? '';

      return `[SẢN PHẨM]
- Mã: ${p.productCode ?? p.id}
- Tên: ${p.name}
- Loại: ${typeLabel}
- Nhà cung cấp: ${p.provider}
- Mô tả: ${p.description ?? 'Không có'}
- Phí tháng: ${premiumM.toLocaleString('vi-VN')} VND
- Phí năm: ${premiumY.toLocaleString('vi-VN')} VND
- Số tiền bảo hiểm: ${coverage.toLocaleString('vi-VN')} VND
- Thời hạn: ${p.termMonths ?? 'N/A'} tháng
- Độ tuổi: ${p.minAge ?? 'N/A'} - ${p.maxAge ?? 'N/A'} tuổi
- Chi tiết quyền lợi: ${covDetails}
---`;
    });

    return lines.join('\n');
  } catch {
    return '(Không thể tải dữ liệu sản phẩm. Vui lòng thử lại sau.)';
  }
}

const SYSTEM_PROMPT_BASE = `Bạn là Trợ lý Hỏi đáp Bảo hiểm của KODO Wealth. Nhiệm vụ: giải đáp câu hỏi về sản phẩm bảo hiểm dựa CHÍNH XÁC trên dữ liệu được cung cấp.

## QUY TẮC BẮT BUỘC (vi phạm = sai lệch thông tin hợp đồng):

1. CHỈ trả lời dựa trên thông tin trong CONTEXT bên dưới. KHÔNG suy diễn, phỏng đoán, bịa đặt.
2. Nếu câu hỏi về sản phẩm/điều khoản/quyền lợi KHÔNG có trong context:
   - Trả lời: "Tôi không tìm thấy thông tin chính xác về [chủ đề] trong cơ sở dữ liệu sản phẩm hiện tại. Để có thông tin chính xác về hợp đồng bảo hiểm, vui lòng liên hệ bộ phận tư vấn hoặc xem chi tiết sản phẩm tại /wealth/products"
   - KHÔNG trả lời dựa trên kiến thức tổng quát về bảo hiểm khi liên quan đến số liệu cụ thể (phí, quyền lợi, điều khoản).
3. Khi trả lời: luôn trích dẫn nguồn (tên sản phẩm, nhà cung cấp) từ context.
4. Giải thích thuật ngữ kỹ thuật bảo hiểm bằng ngôn ngữ dễ hiểu khi có trong context.
5. Trả lời bằng tiếng Việt, rõ ràng, ngắn gọn.

## CONTEXT - Dữ liệu sản phẩm bảo hiểm từ DN cung cấp:

`;

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OpenAI API key chưa được cấu hình' },
        { status: 500 }
      );
    }

    const context = await fetchInsuranceProductsContext();
    const systemContent = SYSTEM_PROMPT_BASE + context;

    const messagesWithSystem = [
      { role: 'system' as const, content: systemContent },
      ...messages,
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: messagesWithSystem as OpenAI.Chat.ChatCompletionMessageParam[],
      temperature: 0.2,
      max_tokens: 1500,
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Insurance QA API Error:', error);
    return Response.json(
      {
        error: 'Không thể xử lý câu hỏi',
        details: error instanceof Error ? error.message : 'Lỗi không xác định',
      },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<Response> {
  const context = await fetchInsuranceProductsContext();
  const hasData = context && !context.startsWith('(Chưa có') && !context.startsWith('(Không thể');
  return Response.json({
    status: 'ok',
    service: 'Insurance QA API',
    hasProductData: hasData,
    productContextLength: context.length,
  });
}
