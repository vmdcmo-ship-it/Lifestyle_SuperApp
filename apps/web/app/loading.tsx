export default function Loading(): JSX.Element {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center">
        {/* Spinner */}
        <div className="relative mx-auto mb-4 h-16 w-16">
          <div className="absolute h-full w-full animate-spin rounded-full border-4 border-muted border-t-purple-600"></div>
        </div>

        {/* Loading text */}
        <p className="text-lg font-medium text-muted-foreground">Đang tải...</p>
      </div>
    </div>
  );
}
