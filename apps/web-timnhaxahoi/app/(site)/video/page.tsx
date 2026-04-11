import type { Metadata } from 'next';
import Link from 'next/link';
import { VIDEO_ITEMS } from '@/lib/video-placeholders';
import { pageMetadata } from '@/lib/site-metadata';

export const metadata: Metadata = pageMetadata({
  path: '/video',
  title: 'Video',
  description:
    'Video ngắn, dễ hiểu về nhà ở xã hội: thủ tục, tài chính và điểm cần lưu ý — timnhaxahoi.com.',
});

export default function VideoHubPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <h1 className="text-3xl font-bold text-slate-900">Video</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Video ngắn về nhà ở xã hội: tình huống thực tế, điểm cần lưu ý và hướng bước tiếp theo. Một số clip đang được
        hoàn thiện; phần có nhãn &quot;Sắp ra mắt&quot; sẽ mở khi sẵn sàng.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {VIDEO_ITEMS.map((v) => (
          <li key={v.id} className="glass-panel overflow-hidden rounded-2xl">
            <div className="aspect-video bg-gradient-to-br from-slate-200 to-slate-100">
              {v.youtubeId ? (
                <iframe
                  title={v.title}
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                    Sắp ra mắt
                  </span>
                  <span className="text-sm text-slate-500">{v.durationLabel}</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">{v.topic}</p>
              <h2 className="mt-1 font-semibold text-slate-900">{v.title}</h2>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-12 text-center text-sm text-slate-600">
        Xem thêm{' '}
        <Link href="/quiz" className="font-medium text-brand-navy hover:underline">
          trắc nghiệm điều kiện
        </Link>{' '}
        hoặc{' '}
        <Link href="/phap-ly" className="font-medium text-brand-navy hover:underline">
          mục pháp lý
        </Link>
        .
      </p>
    </div>
  );
}
