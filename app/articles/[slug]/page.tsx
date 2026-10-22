import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticlePage from '../../../components/ArticlePage';
import { articles, getArticle } from '../../../lib/articles';

interface ArticleRouteProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: 'Article not found' };
  }

  const url = `https://footle.club/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: 'Footle',
      type: 'article',
      publishedTime: new Date(`${article.publishedAt}T00:00:00Z`).toISOString(),
      authors: [article.author],
      images: article.image
        ? [{ url: article.image, width: 1200, height: 800, alt: article.imageAlt ?? article.title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function ArticleRoute({ params }: ArticleRouteProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    datePublished: new Date(`${article.publishedAt}T00:00:00Z`).toISOString(),
    dateModified: new Date(`${article.publishedAt}T00:00:00Z`).toISOString(),
    author: { '@type': 'Organization', name: article.author },
    publisher: { '@type': 'Organization', name: 'Footle', url: 'https://footle.club' },
    mainEntityOfPage: `https://footle.club/articles/${article.slug}`,
    image: article.image ? `https://footle.club${article.image}` : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, '\\u003c') }}
      />
      <ArticlePage article={article} />
    </>
  );
}
