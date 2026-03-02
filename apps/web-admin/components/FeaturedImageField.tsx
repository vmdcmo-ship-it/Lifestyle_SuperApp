'use client';

import { useRef } from 'react';
import { uploadContentImage } from '@/lib/content-upload.service';
import { toast } from '@/lib/toast';

interface FeaturedImageFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function FeaturedImageField({ value, onChange }: FeaturedImageFieldProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadContentImage(file);
      onChange(url);
      toast.success('Đã tải ảnh lên');
    } catch (err) {
      toast.error((err as Error).message || 'Upload thất bại');
    }
    e.target.value = '';
  };

  return (
    <div>
      <label className="mb-1 block text-sm font-medium">Ảnh đại diện</label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleUpload}
          className="hidden"
        />
        <input
          type="url"
          value={value || ''}
          onChange={(e) => onChange(e.target.value || null)}
          placeholder="URL ảnh hoặc bấm Upload"
          className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-input px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Upload
        </button>
      </div>
      {value && (
        <div className="mt-2 w-40 overflow-hidden rounded-lg border">
          <img src={value} alt="Preview" className="h-auto w-full object-cover" />
        </div>
      )}
    </div>
  );
}
