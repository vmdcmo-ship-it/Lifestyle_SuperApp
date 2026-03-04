import { OpenAI } from 'openai';
import { NextRequest } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

/**
 * POST /api/spotlight/suggest
 * Gợi ý mô tả và từ khóa theo công thức SEO video triệu view.
 * Công thức: Thu hút (hook) → Ấn tượng → Độc đáo → Di sản.
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json();
    const {
      title = '',
      description = '',
      tags = '',
      targetType = '',
      categorySlug = '',
      regionNames = [],
    } = body;

    if (!process.env.OPENAI_API_KEY) {
      return Response.json(
        { error: 'OpenAI API key chưa được cấu hình' },
        { status: 500 }
      );
    }

    const regionStr =
      Array.isArray(regionNames) && regionNames.length
        ? regionNames.join(', ')
        : '';

    const userPrompt = [
      title && `Tiêu đề: ${title}`,
      description && `Mô tả hiện tại: ${description}`,
      tags && `Tags hiện có: ${tags}`,
      targetType && `Thể loại đích: ${targetType}`,
      categorySlug && `Danh mục: ${categorySlug}`,
      regionStr && `Địa điểm: ${regionStr}`,
    ]
      .filter(Boolean)
      .join('\n');

    const systemPrompt = `Bạn là chuyên gia SEO content cho video lifestyle Việt Nam. Nhiệm vụ: gợi ý mô tả và từ khóa theo CÔNG THỨC THÀNH CÔNG của video triệu view.

## CÔNG THỨC 4 YẾU TỐ:
1. **Thu hút (Hook)**: Câu mở đầu gây tò mò, số liệu shock, hoặc câu hỏi mở – giữ chân người xem 3 giây đầu.
2. **Ấn tượng**: Điểm nổi bật nhất (view, món đặc sản, trải nghiệm độc nhất) – yếu tố "wow".
3. **Độc đáo**: Góc nhìn khác biệt, bí quyết riêng, không ai nói đến – làm content khác biệt.
4. **Di sản**: Văn hóa, truyền thống, bản sắc địa phương – gắn với con người và nơi chốn.

## YÊU CẦU OUTPUT:
- Trả lời CHÍNH XÁC theo cấu trúc JSON sau (không thêm text khác):
\`\`\`json
{
  "descriptions": ["mô tả 1 (150-250 ký tự)", "mô tả 2", "mô tả 3"],
  "keywords": ["từ khóa 1", "từ khóa 2", "từ khóa 3", ...]
}
\`\`\`
- Mô tả: tiếng Việt, tự nhiên, có hook rõ ràng, dài 150-250 ký tự.
- Keywords: 5-10 từ khóa/hashtag, phổ biến trên Tiktok/YouTube, có cả long-tail và short-tail.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content:
            userPrompt ||
            'Cho tôi gợi ý mô tả và từ khóa generic cho video lifestyle.',
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? '';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json(
        {
          descriptions: [
            'Khám phá điểm đến độc đáo với trải nghiệm đáng nhớ. #lifestyle #review',
          ],
          keywords: ['review', 'lifestyle', 'vietnam', 'travel', 'food'],
        },
        { status: 200 }
      );
    }

    let parsed: { descriptions?: string[]; keywords?: string[] };
    try {
      parsed = JSON.parse(jsonMatch[0]) as {
        descriptions?: string[];
        keywords?: string[];
      };
    } catch {
      return Response.json(
        {
          descriptions: [
            'Khám phá điểm đến độc đáo với trải nghiệm đáng nhớ. #lifestyle #review',
          ],
          keywords: ['review', 'lifestyle', 'vietnam', 'travel', 'food'],
        },
        { status: 200 }
      );
    }

    const result = {
      descriptions: Array.isArray(parsed.descriptions)
        ? parsed.descriptions.filter((s) => typeof s === 'string' && s.length > 0)
        : [],
      keywords: Array.isArray(parsed.keywords)
        ? parsed.keywords.filter((s) => typeof s === 'string' && s.length > 0)
        : [],
    };

    if (result.descriptions.length === 0) {
      result.descriptions = [
        'Khám phá điểm đến độc đáo với trải nghiệm đáng nhớ. #lifestyle #review',
      ];
    }
    if (result.keywords.length === 0) {
      result.keywords = ['review', 'lifestyle', 'vietnam', 'travel', 'food'];
    }

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('Spotlight Suggest API Error:', error);
    const msg =
      error instanceof Error ? error.message : 'Lỗi không xác định';
    return Response.json(
      { error: 'Gợi ý thất bại', details: msg },
      { status: 500 }
    );
  }
}
