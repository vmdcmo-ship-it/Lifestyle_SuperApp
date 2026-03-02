'use client';

interface SeoPanelProps {
  seoTitle: string;
  seoDescription: string;
  onSeoTitleChange: (v: string) => void;
  onSeoDescriptionChange: (v: string) => void;
  displayTitle?: string;
}

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 160;

/**
 * Panel SEO với đếm ký tự và preview snippet (Google).
 */
export function SeoPanel({
  seoTitle,
  seoDescription,
  onSeoTitleChange,
  onSeoDescriptionChange,
  displayTitle,
}: SeoPanelProps): JSX.Element {
  const title = seoTitle || displayTitle || '';
  const desc = seoDescription || '';
  const titleOk = title.length <= SEO_TITLE_MAX;
  const descOk = desc.length <= SEO_DESC_MAX;

  return (
    <div className="rounded-lg border border-dashed border-input bg-muted/20 p-4">
      <h3 className="mb-3 font-medium">Tối ưu SEO</h3>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">SEO Title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => onSeoTitleChange(e.target.value)}
            placeholder={displayTitle || 'Tiêu đề hiển thị trên Google'}
            maxLength={SEO_TITLE_MAX + 20}
            className={`w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ${!titleOk && title ? 'border-destructive' : ''}`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {title.length}/{SEO_TITLE_MAX} ký tự
            {title.length > SEO_TITLE_MAX && (
              <span className="ml-2 text-destructive">Khuyến nghị ≤{SEO_TITLE_MAX}</span>
            )}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">SEO Description</label>
          <textarea
            value={seoDescription}
            onChange={(e) => onSeoDescriptionChange(e.target.value)}
            rows={2}
            placeholder="Mô tả ngắn cho công cụ tìm kiếm"
            maxLength={SEO_DESC_MAX + 50}
            className={`w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ${!descOk && desc ? 'border-destructive' : ''}`}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            {desc.length}/{SEO_DESC_MAX} ký tự
            {desc.length > SEO_DESC_MAX && (
              <span className="ml-2 text-destructive">Khuyến nghị ≤{SEO_DESC_MAX}</span>
            )}
          </p>
        </div>
        {/* Google snippet preview */}
        <div className="rounded border bg-white p-3 text-left text-[13px] dark:bg-zinc-900">
          <p className="text-muted-foreground text-xs">Preview (Google)</p>
          <p className="mt-1 truncate text-[18px] text-blue-600 dark:text-blue-400">
            {title || 'Tiêu đề bài viết'}
          </p>
          <p className="mt-0.5 line-clamp-2 text-muted-foreground">
            {desc || 'Mô tả sẽ hiển thị trong kết quả tìm kiếm.'}
          </p>
        </div>
      </div>
    </div>
  );
}
