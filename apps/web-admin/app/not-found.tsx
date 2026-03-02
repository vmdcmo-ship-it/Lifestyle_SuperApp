import Link from 'next/link';

export default function NotFound(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Trang không tồn tại</p>
      <p className="mt-1 text-sm text-muted-foreground">
        URL bạn truy cập có thể đã bị xóa hoặc thay đổi.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Về Dashboard
      </Link>
    </div>
  );
}
