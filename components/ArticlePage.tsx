import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import ArticleShareOptions from './ArticleShareOptions';
import ArticleArtwork from './ArticleArtwork';
import { Article, formatArticleDate } from '../lib/articles';

interface ArticlePageProps {
  article: Article;
}

export default function ArticlePage({ article }: ArticlePageProps) {
  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-5">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#03E690]">
            {article.category} · {estimateReadingTime(article)} min read
          </p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{article.title}</h1>
          <p className="text-lg leading-8 text-gray-300">{article.excerpt}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-gray-800 py-4 text-sm text-gray-400">
          <span>By <span className="font-semibold text-gray-200">{article.author}</span></span>
          <span aria-hidden="true" className="text-gray-700">•</span>
          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
        </div>
      </header>

      {article.image ? (
        <figure className="space-y-2">
          <ArticleArtwork
            article={article}
            priority
            sizes="(min-width: 1024px) 768px, 100vw"
            className="aspect-[3/2] rounded-2xl border border-gray-800"
          />
          <figcaption className="text-sm text-gray-500">{article.description}</figcaption>
        </figure>
      ) : (
        <ArticleArtwork
          article={article}
          sizes="(min-width: 1024px) 768px, 100vw"
          className="aspect-[3/2] rounded-2xl border border-gray-800"
        />
      )}

      <ArticleShareOptions title={article.title} />

      <div className="article-markdown space-y-6 text-base leading-7 text-gray-300">
        <ReactMarkdown
          components={{
            h2: ({ children }) => <h2 className="pt-2 text-2xl font-bold text-white">{children}</h2>,
            h3: ({ children }) => <h3 className="pt-1 text-xl font-bold text-white">{children}</h3>,
            p: ({ children }) => <p>{children}</p>,
            ul: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#03E690] pl-4 italic text-gray-200">{children}</blockquote>
            ),
            img: ({ src, alt }) => src ? (
                <Image
                  src={src}
                  alt={alt ?? ''}
                  width={1200}
                  height={800}
                  sizes="(min-width: 1024px) 768px, 100vw"
                  className="my-8 h-auto w-full rounded-2xl border border-gray-800"
                />
            ) : null,
            a: ({ href, children }) => (
              <a href={href} className="font-semibold text-[#03E690] underline decoration-[#03E690]/40 underline-offset-4 hover:text-emerald-300">
                {children}
              </a>
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      <ArticleShareOptions title={article.title} />

      <div className="flex flex-wrap gap-3 border-t border-gray-800 pt-6">
        <Link href="/articles" className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700">
          ← All articles
        </Link>
        <Link href="/games" className="rounded-lg bg-[#03E690] px-4 py-2 text-sm font-bold text-gray-950 hover:bg-emerald-300">
          Explore Footle games
        </Link>
      </div>
    </article>
  );
}

function estimateReadingTime(article: Article) {
  return Math.max(3, Math.ceil(article.content.split(/\s+/).length / 200));
}
