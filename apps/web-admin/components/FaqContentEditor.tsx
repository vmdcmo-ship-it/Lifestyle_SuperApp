'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqData {
  items: FaqItem[];
}

const DEFAULT_FAQ: FaqData = { items: [] };

function parseFaqContent(content: string): FaqData {
  if (!content?.trim()) return DEFAULT_FAQ;
  try {
    const parsed = JSON.parse(content) as FaqData;
    if (parsed?.items && Array.isArray(parsed.items)) {
      return parsed;
    }
  } catch {
    /* fallback */
  }
  return DEFAULT_FAQ;
}

function serializeFaq(data: FaqData): string {
  return JSON.stringify(data, null, 2);
}

interface FaqContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function FaqContentEditor({
  value,
  onChange,
  placeholder = 'Thêm câu hỏi thường gặp...',
}: FaqContentEditorProps): JSX.Element {
  const [data, setData] = useState<FaqData>(() => parseFaqContent(value));

  const syncToParent = useCallback(
    (next: FaqData) => {
      setData(next);
      onChange(serializeFaq(next));
    },
    [onChange],
  );

  const addItem = () => {
    syncToParent({
      ...data,
      items: [...data.items, { question: '', answer: '' }],
    });
  };

  const updateItem = (index: number, upd: Partial<FaqItem>) => {
    const next = [...data.items];
    next[index] = { ...next[index], ...upd };
    syncToParent({ ...data, items: next });
  };

  const removeItem = (index: number) => {
    const next = data.items.filter((_, i) => i !== index);
    syncToParent({ ...data, items: next });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{placeholder}</p>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          + Thêm câu hỏi
        </Button>
      </div>

      {data.items.length === 0 ? (
        <div
          className="rounded-lg border border-dashed border-input bg-muted/20 p-8 text-center text-sm text-muted-foreground cursor-pointer hover:bg-muted/30"
          onClick={addItem}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        >
          Chưa có câu hỏi. Bấm để thêm câu hỏi thường gặp (FAQ).
        </div>
      ) : (
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={index} className="rounded-lg border border-input bg-background p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Câu hỏi {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeItem(index)}
                >
                  Xóa
                </Button>
              </div>
              <input
                type="text"
                value={item.question}
                onChange={(e) => updateItem(index, { question: e.target.value })}
                placeholder="Câu hỏi..."
                className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                value={item.answer}
                onChange={(e) => updateItem(index, { answer: e.target.value })}
                placeholder="Câu trả lời..."
                rows={3}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
