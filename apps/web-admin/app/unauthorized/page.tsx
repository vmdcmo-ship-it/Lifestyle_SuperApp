import Link from 'next/link';

export default function UnauthorizedPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">Không có quyền truy cập</h1>
      <p className="text-muted-foreground">
        Tài khoản của bạn không có quyền truy cập trang này.
      </p>
      <Link
        href="/login"
        className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
      >
        Quay lại đăng nhập
      </Link>
    </div>
  );
}
