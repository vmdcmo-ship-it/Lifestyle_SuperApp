'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

/**
 * Marketing Consultant Chat Page
 * Demo page for testing the Marketing AI chatbot
 */
export default function ChatPage(): JSX.Element {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Suggested questions for quick start
  const suggestedQuestions = [
    'Làm sao để tăng user acquisition cho tính năng giao đồ ăn?',
    'Tôi muốn làm campaign viral trên TikTok, bạn có đề xuất gì?',
    'Chiến lược nào để tăng retention rate cho app?',
    'Làm thế nào để cạnh tranh với Grab và Gojek?',
  ];

  const handleSuggestedQuestion = (question: string): void => {
    const syntheticEvent = {
      preventDefault: () => {},
      target: { value: question },
    } as React.ChangeEvent<HTMLInputElement>;

    handleInputChange(syntheticEvent);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold">
          🎯 Marketing Consultant AI
        </h1>
        <p className="text-muted-foreground">
          Chuyên viên tư vấn Marketing thông minh cho Lifestyle Super App
        </p>
      </div>

      {/* Main Chat Container */}
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg border bg-card shadow-lg">
          {/* Messages Area */}
          <div className="h-[600px] overflow-y-auto p-6">
            {messages.length === 0 ? (
              // Welcome Message
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-6 text-6xl">💼</div>
                <h2 className="mb-2 text-2xl font-semibold">
                  Xin chào! Tôi là AI Marketing Consultant
                </h2>
                <p className="mb-6 text-center text-muted-foreground">
                  Tôi có thể giúp bạn với chiến lược marketing, campaigns, phân tích thị trường và nhiều hơn nữa.
                  <br />
                  Hãy bắt đầu bằng cách chọn một câu hỏi dưới đây hoặc đặt câu hỏi của riêng bạn!
                </p>

                {/* Suggested Questions */}
                <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="rounded-lg border bg-background p-4 text-left text-sm transition-colors hover:bg-accent"
                      type="button"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Chat Messages
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {message.role === 'user' ? '👤 Bạn' : '🤖 Marketing AI'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg bg-muted p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-foreground"></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-foreground"
                          style={{ animationDelay: '0.1s' }}
                        ></div>
                        <div
                          className="h-2 w-2 animate-bounce rounded-full bg-foreground"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="border-t bg-background p-4"
          >
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Hỏi về chiến lược marketing, campaigns, phân tích thị trường..."
                className="flex-1 rounded-lg border bg-background px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-primary px-6 py-2 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {isLoading ? 'Đang gửi...' : 'Gửi'}
              </button>
            </div>

            {/* Tips */}
            {!isExpanded && messages.length === 0 && (
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => setIsExpanded(true)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  💡 Xem tips để có câu trả lời tốt nhất
                </button>
              </div>
            )}

            {isExpanded && (
              <div className="mt-3 rounded-lg bg-muted p-3 text-xs text-muted-foreground">
                <div className="mb-2 font-semibold">💡 Tips để có câu trả lời tốt nhất:</div>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Cung cấp context cụ thể về mục tiêu và ngân sách</li>
                  <li>Đề cập target audience của bạn</li>
                  <li>Nêu rõ timeline mong muốn</li>
                  <li>Chia sẻ challenges hiện tại nếu có</li>
                </ul>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="mt-2 hover:text-foreground"
                >
                  Thu gọn ↑
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Info Footer */}
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>
            Powered by OpenAI GPT-4 Mini | Vercel AI SDK
            <br />
            Marketing Consultant AI là công cụ hỗ trợ tư vấn. Hãy luôn xem xét kỹ trước khi triển khai.
          </p>
        </div>
      </div>
    </div>
  );
}
