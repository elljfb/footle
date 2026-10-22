import { getSiteSitemap } from '../../lib/site-sitemap';

export function GET() {
  const sitemap = getSiteSitemap()
    .map(({ url }) => url)
    .join('\n');

  return new Response(`${sitemap}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
