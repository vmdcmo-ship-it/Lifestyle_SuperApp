import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const SPORTS: Record<string, { title: string; description: string; icon: string }> = {
  tennis: {
    title: 'CLB Tennis bán chuyên nghiệp',
    description: 'Câu lạc bộ Tennis dành cho người chơi bán chuyên. Tham gia giải đấu, giao lưu và nâng cao trình độ.',
    icon: '🎾',
  },
  pickleball: {
    title: 'CLB Pickleball bán chuyên nghiệp',
    description: 'Câu lạc bộ Pickleball - môn thể thao đang phát triển mạnh. Tìm đồng đội, tham gia tập luyện.',
    icon: '🏓',
  },
};

interface PageProps {
  params: Promise<{ sport: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { sport } = await params;
  const config = SPORTS[sport.toLowerCase()];
  if (!config) return { title: 'CLB | Cộng đồng' };
  return { title: config.title, description: config.description };
}

export default async function ClbSportPage({ params }: PageProps): Promise<JSX.Element> {
  const { sport } = await params;
  const config = SPORTS[sport.toLowerCase()];

  if (!config) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/the-thao">Cộng đồng</Link>
        <span className="mx-2">/</span>
        <Link href="/the-thao">CLB bán chuyên nghiệp</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{config.title}</span>
      </nav>

      <div className="rounded-2xl border bg-card p-8">
        <span className="mb-4 block text-6xl" role="img" aria-label={config.title}>
          {config.icon}
        </span>
        <h1 className="font-heading mb-4 text-2xl font-bold">{config.title}</h1>
        <p className="mb-6 text-muted-foreground">{config.description}</p>
        <div className="rounded-xl bg-muted/50 p-6">
          <p className="text-sm text-muted-foreground">
            Tải app Lifestyle để đăng ký tham gia CLB và nhận thông báo sự kiện.
          </p>
          <Link
            href="/tai-ung-dung"
            className="mt-4 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Tải app
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/the-thao" className="text-sm font-medium text-primary hover:underline">
          ← Về Cộng đồng
        </Link>
        <Link href="/hop-tac" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Hợp tác
        </Link>
        <Link href="/tai-ung-dung" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Tải ứng dụng
        </Link>
        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Trang chủ
        </Link>
      </div>
    </div>
  );
}
