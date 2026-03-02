# 🚀 Hướng Dẫn Setup Chat API - Marketing Consultant Bot

Hướng dẫn nhanh để cài đặt và chạy Marketing Consultant Chatbot với Vercel AI SDK và OpenAI.

## ✅ Đã Hoàn Thành

### 1. API Route (`/api/chat`)
✅ File: `app/api/chat/route.ts`
- POST endpoint để chat với AI
- GET endpoint để health check
- Edge Runtime cho performance tối ưu
- Streaming response với Vercel AI SDK
- Error handling đầy đủ

### 2. System Prompt
✅ Cấu hình chi tiết cho Marketing Consultant:
- Vai trò: Chuyên gia Marketing Digital
- Phong cách: Chuyên nghiệp, thân thiện
- Ngôn ngữ: Tiếng Việt
- Expertise: Growth Hacking, Social Media, Campaigns

### 3. Demo Page
✅ File: `app/chat/page.tsx`
- UI đẹp với Tailwind CSS
- Suggested questions để quick start
- Loading states
- Responsive design

### 4. Documentation
✅ File: `app/api/chat/README.md`
- API Reference đầy đủ
- Code examples (React, Fetch, cURL)
- Configuration guide
- Deployment instructions

### 5. Dependencies
✅ Updated `package.json`:
```json
{
  "ai": "^3.4.0",
  "openai": "^4.67.0"
}
```

## 🔧 Cài Đặt

### Bước 1: Cài Dependencies

```bash
# Từ thư mục root của monorepo
npm install

# Hoặc chỉ cho web app
npm install --workspace=apps/web
```

### Bước 2: Setup OpenAI API Key

1. Truy cập: https://platform.openai.com/api-keys
2. Tạo API key mới
3. Copy API key

### Bước 3: Cấu hình Environment Variables

File `.env.local` đã có sẵn cấu trúc. Chỉ cần thay thế API key:

```bash
# apps/web/.env.local

# Thay thế với API key thật
OPENAI_API_KEY=sk-proj-your-real-openai-api-key-here

# Optional: Customize model settings
OPENAI_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

### Bước 4: Chạy Development Server

```bash
# Từ thư mục root
npm run dev:web

# Hoặc từ apps/web
npm run dev
```

Server sẽ chạy tại: http://localhost:3000

## 🧪 Testing

### 1. Health Check

```bash
# Kiểm tra API hoạt động
curl http://localhost:3000/api/chat
```

Response:
```json
{
  "status": "ok",
  "service": "Marketing Consultant Chat API",
  "version": "1.0.0",
  "model": "gpt-4o-mini"
}
```

### 2. Chat Test (cURL)

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Tôi muốn làm campaign để tăng user mới. Bạn tư vấn được không?"
      }
    ]
  }'
```

### 3. Demo UI

Truy cập: http://localhost:3000/chat

Thử các suggested questions hoặc đặt câu hỏi của bạn!

## 📁 Cấu Trúc Files

```
apps/web/
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── route.ts          # API endpoint
│   │       └── README.md         # API documentation
│   └── chat/
│       └── page.tsx              # Demo chat UI
├── .env.local                    # Environment variables
├── .env.local.example            # Template (đã cập nhật)
└── package.json                  # Dependencies (đã cập nhật)
```

## 🎯 Sử Dụng Trong Production

### Frontend Integration

```typescript
'use client';

import { useChat } from 'ai/react';

export default function MyComponent() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return (
    <form onSubmit={handleSubmit}>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <input
        value={input}
        onChange={handleInputChange}
        placeholder="Ask marketing questions..."
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Server-Side Usage

```typescript
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: 'Your system prompt...' },
    { role: 'user', content: 'User question...' }
  ],
});
```

## 🔒 Security Best Practices

1. **API Key Protection**
   - ✅ NEVER commit `.env.local` to git
   - ✅ API key chỉ dùng server-side (không expose client)
   - ✅ Rotate API key định kỳ

2. **Rate Limiting** (TODO)
   ```typescript
   // Thêm rate limiting trong route.ts
   import rateLimit from 'express-rate-limit';
   ```

3. **Authentication** (TODO)
   ```typescript
   // Thêm auth middleware
   import { auth } from '@/lib/auth';
   ```

4. **Input Validation**
   - ✅ Đã validate messages array
   - ✅ Error handling cho invalid requests

## 📊 Monitoring & Cost

### OpenAI Usage Dashboard
- Truy cập: https://platform.openai.com/usage
- Xem costs và usage metrics
- Set usage limits để tránh overcharge

### Cost Estimation (GPT-4o-mini)
- Input: ~$0.15 / 1M tokens
- Output: ~$0.60 / 1M tokens
- Trung bình: ~$0.001 - $0.005 per request

### Logging
```typescript
// Thêm logging trong route.ts
console.log({
  timestamp: new Date().toISOString(),
  userId: session?.user?.id,
  messagesCount: messages.length,
  model: 'gpt-4o-mini'
});
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Deploy
vercel

# Add environment variable
vercel env add OPENAI_API_KEY

# Deploy production
vercel --prod
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV OPENAI_API_KEY=your-key
EXPOSE 3000
CMD ["npm", "run", "start"]
```

### Environment Variables on Vercel

1. Go to: Project Settings → Environment Variables
2. Add:
   - `OPENAI_API_KEY` = your-api-key
3. Deploy lại để apply changes

## 🐛 Troubleshooting

### Error: "OpenAI API key is not configured"
**Solution:** Kiểm tra `.env.local` có `OPENAI_API_KEY` chưa

### Error: "Unsupported URL Type workspace:"
**Solution:** Chạy `npm install` từ root monorepo

### Streaming không hoạt động
**Solution:**
- Kiểm tra Edge Runtime: `export const runtime = 'edge'`
- Verify response type: `StreamingTextResponse`

### CORS errors
**Solution:** Thêm CORS headers vào route.ts nếu cần

## 📚 Resources

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)

## 📝 Next Steps (Optional Enhancements)

### 1. Add Authentication
```typescript
import { getServerSession } from 'next-auth';
// Verify user before processing chat
```

### 2. Add Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit';
// Limit requests per user/IP
```

### 3. Save Chat History
```typescript
import { prisma } from '@/lib/prisma';
// Save messages to database
```

### 4. Add Function Calling
```typescript
// Let AI call functions (e.g., search, analytics)
tools: [
  {
    type: 'function',
    function: {
      name: 'get_campaign_data',
      description: 'Get campaign performance data',
      parameters: { /* ... */ }
    }
  }
]
```

### 5. Multi-language Support
```typescript
// Detect language and adjust system prompt
const language = detectLanguage(messages);
```

## ✅ Checklist

- [x] API Route created (`/api/chat`)
- [x] System Prompt configured (Marketing Consultant)
- [x] Demo UI created (`/chat`)
- [x] Documentation written
- [x] Dependencies added to package.json
- [x] Environment variables configured
- [ ] Install dependencies (`npm install`)
- [ ] Add real OpenAI API key
- [ ] Test API locally
- [ ] Test demo UI
- [ ] (Optional) Add authentication
- [ ] (Optional) Add rate limiting
- [ ] (Optional) Deploy to production

## 🎉 Kết Luận

Chat API đã được setup hoàn chỉnh! Bạn chỉ cần:

1. ✅ Cài dependencies: `npm install`
2. ✅ Thêm OpenAI API key vào `.env.local`
3. ✅ Chạy dev server: `npm run dev`
4. ✅ Test tại: http://localhost:3000/chat

Enjoy coding! 🚀
