/**
 * Image Placeholder - SVG-based placeholders for cards
 * Used when image URL is missing or fails to load
 */
interface ImagePlaceholderProps {
  type: 'restaurant' | 'product';
  className?: string;
  'aria-hidden'?: boolean;
}

export function ImagePlaceholder({
  type,
  className = '',
  'aria-hidden': ariaHidden = true,
}: ImagePlaceholderProps): JSX.Element {
  const baseClass =
    'flex h-full w-full items-center justify-center bg-gradient-to-br text-muted-foreground/40';

  if (type === 'restaurant') {
    return (
      <div className={`${baseClass} from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 ${className}`} aria-hidden={ariaHidden}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-16 w-16"
        >
          <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M5 9v6M19 9v6" />
        </svg>
      </div>
    );
  }

  // product
  return (
    <div className={`${baseClass} from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 ${className}`} aria-hidden={ariaHidden}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-16 w-16"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    </div>
  );
}
