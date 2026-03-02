'use client';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  extraContent?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  variant = 'primary',
  loading = false,
  onConfirm,
  onCancel,
  extraContent,
}: ConfirmDialogProps): JSX.Element | null {
  if (!open) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="mx-4 w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
        <h2 id="confirm-dialog-title" className="mb-2 text-lg font-semibold">
          {title}
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        {extraContent}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-muted disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm text-white disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-destructive hover:bg-destructive/90'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
