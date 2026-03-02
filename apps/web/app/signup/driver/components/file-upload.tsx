import { useState, useRef } from 'react';
import { validateImageFile, convertFileToBase64 } from '../utils/image-upload';

interface FileUploadProps {
  label: string;
  value: string | null;
  onChange: (base64: string) => void;
  required?: boolean;
  helperText?: string;
}

export function FileUpload({
  label,
  value,
  onChange,
  required = false,
  helperText,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError('');
    setIsProcessing(true);

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'File không hợp lệ');
      setIsProcessing(false);
      return;
    }

    try {
      const base64 = await convertFileToBase64(file);
      onChange(base64);
    } catch (err) {
      setError('Không thể xử lý file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {!value ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
              : error
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-300 bg-gray-50 hover:border-purple-400 dark:border-gray-600 dark:bg-gray-800'
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <svg
                className="h-8 w-8 animate-spin text-purple-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Đang xử lý...
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2 text-4xl">📸</div>
              <p className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Chọn file hoặc kéo thả vào đây
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                JPG, PNG, WEBP (Tối đa 5MB)
              </p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative rounded-lg border-2 border-gray-300 p-4 dark:border-gray-600">
          <img
            src={value}
            alt="Preview"
            className="mx-auto max-h-64 rounded-lg object-contain"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow-lg transition-transform hover:scale-110"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          💡 {helperText}
        </p>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
