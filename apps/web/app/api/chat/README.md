# Chat API - Marketing Consultant Bot

API endpoint cho chatbot Chuyên viên Tư vấn Marketing thông minh, sử dụng Vercel AI SDK và OpenAI GPT-4.

## 📋 Mục Lục

- [Tổng quan](#tổng-quan)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [API Reference](#api-reference)
- [Ví dụ](#ví-dụ)
- [System Prompt](#system-prompt)

## 🎯 Tổng quan

Chat API cung cấp một chatbot AI đóng vai trò là **Chuyên viên Tư vấn Marketing** chuyên nghiệp:

- ✅ Tư vấn chiến lược marketing cho Lifestyle Super App
- ✅ Đề xuất campaigns sáng tạo
- ✅ Phân tích thị trường và đối thủ cạnh tranh
- ✅ Hướng dẫn tối ưu conversion funnel
- ✅ Tư vấn content strategy và social media

## 🔧 Cài đặt

### 1. Cài đặt Dependencies

```bash
# Thêm vào package.json
npm install ai openai
```

### 2. Cấu hình Environment Variables

Thêm OpenAI API key vào file `.env.local`:

```bash
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
```

Lấy API key tại: [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)

## 💻 Sử dụng

### Endpoint

```
POST /api/chat
GET  /api/chat (health check)
```

### Request Body

```typescript
{
  messages: Array<{
    role: 'user' | 'assistant' | 'system',
    content: string
  }>
}
```

### Response

Streaming response với nội dung từ OpenAI GPT-4.

## 📚 API Reference

### POST `/api/chat`

Gửi tin nhắn và nhận phản hồi streaming từ Marketing Consultant Bot.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Tôi muốn tăng số lượng người dùng mới cho tính năng giao đồ ăn. Bạn có thể tư vấn chiến lược marketing không?"
    }
  ]
}
```

**Response:** Streaming text (Server-Sent Events)

**Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid messages array)
- `500` - Internal Server Error (missing API key hoặc OpenAI error)

### GET `/api/chat`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "Marketing Consultant Chat API",
  "version": "1.0.0",
  "model": "gpt-4o-mini"
}
```

## 🎨 Ví dụ

### Frontend Integration với Vercel AI SDK

```typescript
'use client';

import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Hỏi về chiến lược marketing..."
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
}
```

### Fetch API (Without Vercel AI SDK)

```typescript
async function sendChatMessage(userMessage: string) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  // Handle streaming response
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    console.log(chunk); // Process chunk
  }
}
```

### cURL Example

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Làm sao để tăng retention rate cho app?"
      }
    ]
  }'
```

## 🤖 System Prompt

Bot được cấu hình với system prompt chi tiết:

### Vai trò
- Chuyên gia Marketing Digital, Growth Hacking, và Customer Engagement
- Am hiểu thị trường Việt Nam và hành vi người dùng
- Kinh nghiệm với super apps (Grab, Gojek, Momo)

### Phong cách
- Chuyên nghiệp nhưng thân thiện
- Trả lời bằng tiếng Việt, có cấu trúc rõ ràng
- Đưa ra lời khuyên cụ thể với số liệu và ví dụ thực tế

### Nhiệm vụ
1. Tư vấn chiến lược marketing cho các tính năng của Lifestyle Super App
2. Đề xuất campaigns sáng tạo
3. Phân tích thị trường và đối thủ
4. Tối ưu conversion funnel
5. Tư vấn content strategy và social media

### Cấu trúc trả lời
```
Tình huống → Phân tích → Giải pháp → Kế hoạch triển khai
```

## ⚙️ Configuration

### Model Settings

```typescript
{
  model: 'gpt-4o-mini',        // Fast and cost-effective
  temperature: 0.7,            // Balanced creativity
  max_tokens: 2000,            // Sufficient for detailed answers
  top_p: 0.9,
  frequency_penalty: 0.3,      // Reduce repetition
  presence_penalty: 0.3        // Encourage topic diversity
}
```

### Supported Models

- `gpt-4o-mini` (default) - Nhanh, rẻ, phù hợp cho production
- `gpt-4o` - Mạnh hơn, chi tiết hơn
- `gpt-4-turbo` - Cân bằng giữa chất lượng và tốc độ

## 🔒 Security

- ✅ API key được lưu trong environment variables (không commit)
- ✅ Edge Runtime cho hiệu suất tối ưu
- ✅ Error handling đầy đủ
- ✅ Input validation

## 📊 Monitoring

Để theo dõi usage và cost:

1. Truy cập [OpenAI Dashboard](https://platform.openai.com/usage)
2. Xem API usage và costs
3. Cài đặt usage limits nếu cần

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel

# Add environment variable
vercel env add OPENAI_API_KEY
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV OPENAI_API_KEY=your-key
CMD ["npm", "run", "start"]
```

## 📝 License

Private - Lifestyle Super App

## 🤝 Support

Nếu cần hỗ trợ, vui lòng liên hệ team AI/ML.
