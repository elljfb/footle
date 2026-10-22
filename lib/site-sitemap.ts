import fs from 'node:fs';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import { articles } from './articles';
import { LEAGUE_OPTIONS } from './leagues';

const siteUrl = 'https://footle.club';
const appDirectory = path.join(process.cwd(), 'app');

function findStaticPageRoutes(directory: string, segments: string[] = []): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      if (entry.name.startsWith('[') || entry.name.startsWith('@') || entry.name.startsWith('_') || entry.name === 'api') {
        return [];
      }

      const nextSegments = entry.name.startsWith('(')
        ? segments
        : [...segments, entry.name];

      return findStaticPageRoutes(path.join(directory, entry.name), nextSegments);
    }

    if (entry.isFile() && entry.name === 'page.tsx') {
      return [segments.length === 0 ? '/' : `/${segments.join('/')}`];
    }

    return [];
  });
}

export function getSiteSitemap(): MetadataRoute.Sitemap {
  const staticRoutes = findStaticPageRoutes(appDirectory);
  const articleRoutes = articles.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(`${article.publishedAt}T00:00:00Z`),
  }));
  const leagueRoutes = LEAGUE_OPTIONS.map(({ slug }) => ({
    url: `${siteUrl}/league/${slug}`,
  }));

  return [
    ...staticRoutes.map((route) => ({ url: `${siteUrl}${route}` })),
    ...leagueRoutes,
    ...articleRoutes,
  ];
}
