import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LegalQuizCta } from '@/components/legal/quiz-cta';
import { getLegalArticle, getLegalSlugs } from '@/lib/legal-articles';

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getLegalSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getLegalArticle(params.slug);
  if (!article) {
    return { title: 'Không tìm thấy' };
  }
  return {
    title: article.title,
    description: article.description,
    openGraph: { title: article.title, description: article.description },
  };
}

export default function LegalArticlePage({ params }: Props) {
  const article = getLegalArticle(params.slug);
  if (!article) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <nav className="text-sm text-slate-500">
        <Link href="/phap-ly" className="hover:text-brand-navy">
          Pháp lý
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{article.title}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{article.title}</h1>
      <p className="mt-3 text-slate-600">{article.description}</p>

      <nav
        aria-label="Mục lục"
        className="glass-panel mt-10 rounded-xl p-5 text-sm md:sticky md:top-20"
      >
        <p className="font-semibold text-slate-900">Mục lục</p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-700">
          {article.sections.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hover:text-brand-navy hover:underline">
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 max-w-none">
        {article.sections.map((s) => (
          <section key={s.id} id={s.id} className="mb-12 scroll-mt-24">
            <h2 className="text-xl font-semibold text-slate-900">{s.title}</h2>
            <div className="mt-4 space-y-4 text-slate-700">
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-base leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <LegalQuizCta />
    </article>
  );
}
