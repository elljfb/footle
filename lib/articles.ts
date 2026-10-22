import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  author: string;
  excerpt: string;
  featured?: boolean;
  image?: string;
  imageAlt?: string;
  content: string;
}

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

function readRequiredString(data: Record<string, unknown>, key: string, filename: string) {
  const value = data[key];
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Article "${filename}" must define a non-empty "${key}" in its frontmatter.`);
  }
  return value;
}

function readArticle(filename: string): Article {
  const filePath = path.join(articlesDirectory, filename);
  const { content, data } = matter(fs.readFileSync(filePath, 'utf8'));
  const slug = filename.replace(/\.md$/, '');
  const image = data.image;
  const imageAlt = data.imageAlt;
  const featured = data.featured;

  if (image !== undefined && (typeof image !== 'string' || !image.startsWith('/'))) {
    throw new Error(`Article "${filename}" image must be a path from the public directory, such as "/images/articles/example.jpg".`);
  }
  if (imageAlt !== undefined && typeof imageAlt !== 'string') {
    throw new Error(`Article "${filename}" imageAlt must be a string.`);
  }
  if (featured !== undefined && typeof featured !== 'boolean') {
    throw new Error(`Article "${filename}" featured must be true or false.`);
  }

  return {
    slug,
    title: readRequiredString(data, 'title', filename),
    description: readRequiredString(data, 'description', filename),
    category: readRequiredString(data, 'category', filename),
    publishedAt: readRequiredString(data, 'publishedAt', filename),
    author: readRequiredString(data, 'author', filename),
    excerpt: readRequiredString(data, 'excerpt', filename),
    featured,
    image,
    imageAlt,
    content: content.trim(),
  };
}

export const articles: Article[] = fs
  .readdirSync(articlesDirectory)
  .filter((filename) => filename.endsWith('.md') && filename !== 'README.md')
  .sort()
  .map(readArticle);

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByDate() {
  return [...articles].sort((first, second) => (
    second.publishedAt.localeCompare(first.publishedAt)
    || Number(Boolean(second.featured)) - Number(Boolean(first.featured))
  ));
}

export function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
