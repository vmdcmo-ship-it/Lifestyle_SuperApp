'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import Link from 'next/link';

/**
 * Hỏi đáp bảo hiểm với AI Agent
 * AI chỉ trả lời dựa trên dữ liệu sản phẩm từ DN bảo hiểm, không suy diễn.
 */
export default function WealthChatPage(): JSX.Element {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: '/api/wealth/insurance-qa',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const suggestedQuestions = [
    'Sản phẩm bảo hiểm nào phù hợp với độ tuổi 30?',
    'Gói bảo hiểm sức khỏe có phí thấp nhất?',
    'Quyền lợi bảo hiểm nhân thọ của sản phẩm này là gì?',
    'So sánh phí năm giữa các gói bảo hiểm sức khỏe',
  ];

  const handleSuggestedQuestion = (question: string): void => {
    append({ role: 'user', content: question });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/wealth"
          className="text-sm font-medium text-[#D4AF37] hover:underline"
        >
          ← Về KODO Wealth
        </Link>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="font-heading mb-2 text-3xl font-bold text-[#0D1B2A]">
            🤖 Hỏi đáp cùng AI Agent
          </h1>
          <p className="text-muted-foreground">
            AI trả lời câu hỏi về sản phẩm bảo hiểm dựa trên dữ liệu chính xác từ nhà cung cấp.
            Thuật ngữ kỹ thuật, quyền lợi, điều khoản – giải đáp rõ ràng.
          </p>
          <p className="mt-2 text-xs text-amber-700">
            ⚠️ AI chỉ trả lời từ dữ liệu có sẵn. Không tìm thấy thông tin? Liên hệ tư vấn 1-1.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200/60 bg-white shadow-lg">
          <div className="h-[500px] overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-6 text-6xl">🛡️</div>
                <h2 className="mb-2 text-xl font-semibold text-[#0D1B2A]">
                  Hỏi về sản phẩm bảo hiểm
                </h2>
                <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">
                  Chọn câu hỏi mẫu hoặc đặt câu hỏi của bạn. AI sẽ trả lời dựa trên thông tin sản
                  phẩm từ nhà cung cấp bảo hiểm.
                </p>
                <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
                  {suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSuggestedQuestion(q)}
                      className="rounded-lg border border-amber-200/60 bg-amber-50/50 p-4 text-left text-sm transition-colors hover:bg-amber-100/80"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-[#0D1B2A] text-white'
                          : 'border border-amber-200/60 bg-amber-50/30'
                      }`}
                    >
                      <div className="mb-1 text-xs font-semibold">
                        {message.role === 'user' ? 'Bạn' : 'AI Agent'}
                      </div>
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-lg border border-amber-200/60 bg-amber-50/30 px-4 py-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-amber-500" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-amber-500"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-amber-500"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-amber-200/60 p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Hỏi về sản phẩm, quyền lợi, điều khoản bảo hiểm..."
                className="flex-1 rounded-lg border border-amber-200/60 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-lg bg-[#D4AF37] px-6 py-3 font-semibold text-[#0D1B2A] transition-colors hover:bg-amber-500 disabled:opacity-50"
              >
                {isLoading ? 'Đang xử lý...' : 'Gửi'}
              </button>
            </div>
            {isExpanded ? (
              <div className="mt-3 rounded-lg bg-amber-50/50 p-3 text-xs text-muted-foreground">
                <p className="mb-1 font-medium">💡 Lưu ý:</p>
                <p>
                  AI chỉ trả lời từ dữ liệu sản phẩm có trong hệ thống. Để biết thông tin chính xác
                  về hợp đồng cụ thể, vui lòng{' '}
                  <Link href="/wealth/consulting" className="text-[#D4AF37] hover:underline">
                    đăng ký tư vấn 1-1
                  </Link>
                  .
                </p>
                <button type="button" onClick={() => setIsExpanded(false)} className="mt-2 hover:underline">
                  Thu gọn
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="mt-2 text-xs text-muted-foreground hover:underline"
              >
                💡 Xem lưu ý quan trọng
              </button>
            )}
          </form>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
          <Link
            href="/wealth/products"
            className="font-medium text-[#D4AF37] hover:underline"
          >
            Xem danh mục sản phẩm
          </Link>
          <Link href="/wealth/consulting" className="font-medium text-[#D4AF37] hover:underline">
            Đăng ký tư vấn 1-1
          </Link>
        </div>
      </div>
    </div>
  );
}
