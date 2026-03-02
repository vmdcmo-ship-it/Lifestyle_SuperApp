'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export interface QuizData {
  questions: QuizQuestion[];
}

const DEFAULT_QUIZ: QuizData = { questions: [] };

function parseQuizContent(content: string): QuizData {
  if (!content?.trim()) return DEFAULT_QUIZ;
  try {
    const parsed = JSON.parse(content) as QuizData;
    if (parsed?.questions && Array.isArray(parsed.questions)) {
      return parsed;
    }
  } catch {
    /* fallback */
  }
  return DEFAULT_QUIZ;
}

function serializeQuiz(data: QuizData): string {
  return JSON.stringify(data, null, 2);
}

interface QuizContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function QuizContentEditor({
  value,
  onChange,
  placeholder = 'Thêm câu hỏi trắc nghiệm...',
}: QuizContentEditorProps): JSX.Element {
  const [data, setData] = useState<QuizData>(() => parseQuizContent(value));

  const syncToParent = useCallback(
    (next: QuizData) => {
      setData(next);
      onChange(serializeQuiz(next));
    },
    [onChange],
  );

  const addQuestion = () => {
    syncToParent({
      ...data,
      questions: [...data.questions, { question: '', options: ['', ''], correctIndex: 0 }],
    });
  };

  const updateQuestion = (index: number, upd: Partial<QuizQuestion>) => {
    const next = [...data.questions];
    next[index] = { ...next[index], ...upd };
    syncToParent({ ...data, questions: next });
  };

  const addOption = (qIndex: number) => {
    const q = data.questions[qIndex];
    const next = [...data.questions];
    next[qIndex] = {
      ...q,
      options: [...q.options, ''],
    };
    syncToParent({ ...data, questions: next });
  };

  const updateOption = (qIndex: number, oIndex: number, val: string) => {
    const q = data.questions[qIndex];
    const nextOpts = [...q.options];
    nextOpts[oIndex] = val;
    updateQuestion(qIndex, { options: nextOpts });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const q = data.questions[qIndex];
    if (q.options.length <= 2) return;
    const nextOpts = q.options.filter((_, i) => i !== oIndex);
    const correctIndex = q.correctIndex >= nextOpts.length ? nextOpts.length - 1 : q.correctIndex;
    updateQuestion(qIndex, { options: nextOpts, correctIndex });
  };

  const removeQuestion = (index: number) => {
    const next = data.questions.filter((_, i) => i !== index);
    syncToParent({ ...data, questions: next });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{placeholder}</p>
        <Button type="button" variant="outline" size="sm" onClick={addQuestion}>
          + Thêm câu hỏi
        </Button>
      </div>

      {data.questions.length === 0 ? (
        <div
          className="rounded-lg border border-dashed border-input bg-muted/20 p-8 text-center text-sm text-muted-foreground"
          onClick={addQuestion}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && addQuestion()}
        >
          Chưa có câu hỏi. Bấm để thêm câu hỏi trắc nghiệm.
        </div>
      ) : (
        <div className="space-y-4">
          {data.questions.map((q, qIndex) => (
            <div key={qIndex} className="rounded-lg border border-input bg-background p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Câu {qIndex + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeQuestion(qIndex)}
                >
                  Xóa
                </Button>
              </div>
              <input
                type="text"
                value={q.question}
                onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
                placeholder="Nhập câu hỏi..."
                className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Các đáp án (chọn đáp án đúng)
                </p>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctIndex === oIndex}
                      onChange={() => updateQuestion(qIndex, { correctIndex: oIndex })}
                      className="h-4 w-4"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                      placeholder={`Đáp án ${oIndex + 1}`}
                      className={cn(
                        'flex-1 rounded border px-3 py-2 text-sm',
                        q.correctIndex === oIndex
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                          : 'border-input bg-background',
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={q.options.length <= 2}
                      onClick={() => removeOption(qIndex, oIndex)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="ghost" size="sm" onClick={() => addOption(qIndex)}>
                  + Thêm đáp án
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
