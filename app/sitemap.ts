import type { MetadataRoute } from 'next';
import { getSiteSitemap } from '../lib/site-sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  return getSiteSitemap();
}
