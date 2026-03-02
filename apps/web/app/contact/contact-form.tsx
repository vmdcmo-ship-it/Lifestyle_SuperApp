'use client';

import { useState } from 'react';

const SUBJECT_OPTIONS = [
  { value: 'support', label: 'Hỗ trợ kỹ thuật' },
  { value: 'order', label: 'Khiếu nại đơn hàng' },
  { value: 'payment', label: 'Thanh toán / Ví' },
  { value: 'partnership', label: 'Hợp tác / Đối tác' },
  { value: 'other', label: 'Khác' },
];

export function ContactForm(): JSX.Element {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Vui lòng nhập tên');
      return;
    }
    if (!formData.email.trim()) {
      setError('Vui lòng nhập email');
      return;
    }
    if (!formData.message.trim()) {
      setError('Vui lòng nhập nội dung');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Gửi qua API khi có endpoint contact
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
    } catch (err: unknown) {
      setError((err as Error).message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center text-green-800 dark:bg-green-950 dark:text-green-200">
        <p className="text-lg font-medium">
          Cảm ơn bạn đã liên hệ!
        </p>
        <p className="mt-2 text-sm">
          Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium">
          Họ tên <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full rounded-lg border bg-background px-4 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          placeholder="Nguyễn Văn A"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-lg border bg-background px-4 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          placeholder="email@example.com"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium">
          Chủ đề
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full rounded-lg border bg-background px-4 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          disabled={isLoading}
        >
          <option value="">Chọn chủ đề</option>
          {SUBJECT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Nội dung <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full resize-none rounded-lg border bg-background px-4 py-2 focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600/20"
          placeholder="Mô tả vấn đề hoặc câu hỏi của bạn..."
          disabled={isLoading}
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70 active:scale-95"
      >
        {isLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
      </button>
    </form>
  );
}
