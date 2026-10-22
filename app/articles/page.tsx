import type { Metadata } from 'next';
import Link from 'next/link';
import { formatArticleDate, getArticlesByDate } from '../../lib/articles';
import ArticleArtwork from '../../components/ArticleArtwork';

const featuredArticleForMetadata = getArticlesByDate()[0];

export const metadata: Metadata = {
  title: 'Football Quiz Guides & Articles',
  description: 'Read Footle guides about football games, player clues, tactics, football history and daily puzzles.',
  alternates: { canonical: '/articles' },
  openGraph: {
    title: 'Football Quiz Guides & Articles',
    description: 'Read practical guides to football games, player quizzes and daily puzzles.',
    url: 'https://footle.club/articles',
    siteName: 'Footle',
    images: featuredArticleForMetadata?.image
      ? [{
          url: featuredArticleForMetadata.image,
          width: 1200,
          height: 800,
          alt: featuredArticleForMetadata.imageAlt ?? featuredArticleForMetadata.title,
        }]
      : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Football Quiz Guides & Articles',
    description: 'Read practical guides to football games, player quizzes and daily puzzles.',
    images: featuredArticleForMetadata?.image ? [featuredArticleForMetadata.image] : undefined,
  },
};

export default function ArticlesPage() {
  const sortedArticles = getArticlesByDate();
  const [featuredArticle, ...moreArticles] = sortedArticles;

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">The Footle reading room</p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Football quiz guides & articles</h1>
        <p className="max-w-3xl text-lg leading-8 text-gray-300">
          Practical guides to our games, football knowledge, player clues and the stories behind the sport.
        </p>
      </header>

      {featuredArticle && (
        <section aria-label="Featured article">
          <Link
            href={`/articles/${featuredArticle.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-[#03E690]/30 bg-gray-900/80 transition-colors hover:border-[#03E690] md:grid-cols-2"
          >
            <ArticleArtwork
              article={featuredArticle}
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="aspect-[3/2] md:aspect-auto md:min-h-[390px]"
            />
            <div className="flex flex-col justify-center p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#03E690]">Featured · Latest article</p>
              <p className="mt-4 text-sm text-gray-400">
                {featuredArticle.category} · {formatArticleDate(featuredArticle.publishedAt)}
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight text-white group-hover:text-[#03E690] sm:text-4xl">
                {featuredArticle.title}
              </h2>
              <p className="mt-4 leading-7 text-gray-300">{featuredArticle.excerpt}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-gray-400">By {featuredArticle.author}</span>
                <span className="font-semibold text-[#03E690]">Read featured article →</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <section aria-label="More football articles" className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">More football reads</h2>
          <p className="mt-2 text-gray-400">Guides to game strategy, football knowledge and the details that make every match interesting.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {moreArticles.map((article) => (
            <article key={article.slug} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/70 transition-colors hover:border-[#03E690]/60">
              <Link href={`/articles/${article.slug}`} className="group block h-full">
                <ArticleArtwork
                  article={article}
                  sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 100vw"
                  className="aspect-square"
                />
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#03E690]">{article.category}</p>
                  <h3 className="mt-2 text-xl font-bold leading-snug text-white group-hover:text-[#03E690]">{article.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-gray-400">{article.excerpt}</p>
                  <div className="mt-4 flex flex-wrap justify-between gap-2 text-xs text-gray-500">
                    <span>{article.author}</span>
                    <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
                  </div>
                  <span className="mt-4 inline-block text-sm font-semibold text-[#03E690]">Read article →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <p className="border-t border-gray-800 pt-6 text-sm text-gray-400">
        Explore our <Link href="/games" className="font-semibold text-[#03E690] hover:text-emerald-300">football games and quizzes</Link> after your read.
      </p>
    </div>
  );
}
