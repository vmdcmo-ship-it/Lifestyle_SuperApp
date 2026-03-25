import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Không tìm thấy trang</h1>
      <p className="max-w-md text-slate-600">Đường dẫn không đúng hoặc nội dung đã được chuyển.</p>
      <Link
        href="/"
        className="rounded-xl bg-brand-gradient px-6 py-3 text-sm font-semibold text-white shadow-glow"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
