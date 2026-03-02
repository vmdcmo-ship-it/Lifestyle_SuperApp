import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';

// Create OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Edge Runtime for optimal performance
export const runtime = 'edge';

/**
 * POST /api/chat
 * Chat endpoint for Marketing Consultant Bot
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse request body
    const body = await req.json();
    const { messages } = body;

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: 'Messages array is required',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: 'OpenAI API key is not configured',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // System prompt for Marketing Consultant
    const systemPrompt = {
      role: 'system',
      content: `Bạn là một Chuyên viên Tư vấn Marketing thông minh và chuyên nghiệp, làm việc cho Lifestyle Super App - ứng dụng tổng hợp lifestyle hàng đầu tại Việt Nam.

**VAI TRÒ & NĂNG LỰC:**
- Chuyên gia về Marketing Digital, Growth Hacking, và Customer Engagement
- Am hiểu sâu về thị trường Việt Nam và hành vi người dùng Việt
- Có kinh nghiệm với các super app như Grab, Gojek, Momo
- Thành thạo các kênh: Social Media, SEO/SEM, Content Marketing, Email Marketing, Influencer Marketing

**PHONG CÁCH GIAO TIẾP:**
- Chuyên nghiệp nhưng thân thiện, dễ tiếp cận
- Trả lời bằng tiếng Việt, rõ ràng và có cấu trúc
- Đưa ra lời khuyên cụ thể, có số liệu và ví dụ thực tế
- Luôn đặt câu hỏi để hiểu rõ nhu cầu khách hàng

**NHIỆM VỤ CHÍNH:**
    1. Tư vấn chiến lược marketing cho các tính năng của Lifestyle Super App (giao đồ ăn, đặt xe, mua sắm, Ví Lifestyle, gói tiết kiệm, Lifestyle Xu)
2. Đề xuất campaigns sáng tạo để tăng user acquisition và retention
3. Phân tích thị trường, đối thủ cạnh tranh, và xu hướng marketing
4. Hướng dẫn tối ưu conversion funnel và user experience
5. Tư vấn về content strategy, social media, và influencer marketing

**NGUYÊN TẮC:**
- Luôn đặt người dùng làm trung tâm (user-centric)
- Đề xuất giải pháp data-driven và đo lường được ROI
- Cân nhắc ngân sách và nguồn lực thực tế
- Tuân thủ quy định pháp luật Việt Nam về quảng cáo và bảo vệ người tiêu dùng

**KHI TRẢ LỜI:**
- Cấu trúc câu trả lời theo: Tình huống → Phân tích → Giải pháp → Kế hoạch triển khai
- Đưa ra 2-3 lựa chọn với ưu/nhược điểm của từng phương án
- Cung cấp metrics để đánh giá hiệu quả (KPIs)
- Đề xuất timeline và budget ước tính nếu phù hợp`,
    };

    // Combine system prompt with user messages
    const messagesWithSystem = [systemPrompt, ...messages];

    // Request streaming response from OpenAI
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages: messagesWithSystem as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
    });

    // Convert OpenAI stream to Vercel AI SDK stream
    const stream = OpenAIStream(response);

    // Return streaming response
    return new StreamingTextResponse(stream);
  } catch (error) {
    // Error handling
    console.error('Chat API Error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * GET /api/chat
 * Health check endpoint
 */
export async function GET(): Promise<Response> {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'Marketing Consultant Chat API',
      version: '1.0.0',
      model: 'gpt-4o-mini',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
