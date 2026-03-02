'use client';

import { useState } from 'react';

type ContentFormat = 'ARTICLE' | 'QUIZ' | 'FAQ';

interface ArticlePreviewProps {
  title: string;
  excerpt?: string;
  content: string;
  featuredImage?: string | null;
  contentFormat?: ContentFormat;
  onClose: () => void;
}

/**
 * Modal xem trước bài viết trước khi xuất bản.
 * Hiển thị giống giao diện public để quản trị viên kiểm tra.
 */
function renderPreviewContent(content: string, format: ContentFormat): React.ReactNode {
  if (format === 'QUIZ') {
    try {
      const data = JSON.parse(content || '{}') as {
        questions?: Array<{ question: string; options: string[]; correctIndex: number }>;
      };
      const questions = data?.questions ?? [];
      if (questions.length === 0) return <p className="text-muted-foreground">(Chưa có câu hỏi)</p>;
      return (
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div key={i} className="rounded-lg border border-input p-4">
              <p className="mb-2 font-medium">
                Câu {i + 1}: {q.question || '(Chưa nhập)'}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {q.options?.map((opt, j) => (
                  <li key={j} className={j === q.correctIndex ? 'text-green-600 font-medium' : ''}>
                    {opt || '(Trống)'} {j === q.correctIndex ? '✓' : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    } catch {
      return (
        <pre className="text-sm text-muted-foreground overflow-auto">{content || '(Trống)'}</pre>
      );
    }
  }
  if (format === 'FAQ') {
    try {
      const data = JSON.parse(content || '{}') as {
        items?: Array<{ question: string; answer: string }>;
      };
      const items = data?.items ?? [];
      if (items.length === 0) return <p className="text-muted-foreground">(Chưa có câu hỏi FAQ)</p>;
      return (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="rounded-lg border border-input p-4">
              <p className="font-medium mb-2">Q: {item.question || '(Chưa nhập)'}</p>
              <p className="text-muted-foreground">A: {item.answer || '(Chưa nhập)'}</p>
            </div>
          ))}
        </div>
      );
    } catch {
      return (
        <pre className="text-sm text-muted-foreground overflow-auto">{content || '(Trống)'}</pre>
      );
    }
  }
  return (
    <div
      className="article-content space-y-3 text-[15px] leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg"
      dangerouslySetInnerHTML={{
        __html: content || '<p class="text-muted-foreground">(Chưa có nội dung)</p>',
      }}
    />
  );
}

export function ArticlePreview({
  title,
  excerpt,
  content,
  featuredImage,
  contentFormat = 'ARTICLE',
  onClose,
}: ArticlePreviewProps): JSX.Element {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  if (!open) return <></>;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-4 py-3">
          <h2 className="font-semibold">Xem trước bài viết</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-muted"
          >
            Đóng
          </button>
        </div>
        <article className="p-6">
          <h1 className="mb-2 text-2xl font-bold">{title || '(Chưa có tiêu đề)'}</h1>
          {excerpt && <p className="mb-4 text-muted-foreground">{excerpt}</p>}
          {featuredImage && (
            <div className="mb-6 overflow-hidden rounded-lg">
              <img src={featuredImage} alt={title} className="h-auto w-full object-cover" />
            </div>
          )}
          {renderPreviewContent(content, contentFormat)}
        </article>
      </div>
    </div>
  );
}
