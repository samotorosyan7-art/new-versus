import type { MetadataRoute } from 'next';
import { SITE_URL, locales, languageAlternates } from '@/lib/seo';
import { getAllInsightSlugs } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';

// Locale-agnostic static routes with their relative priority / change frequency.
const STATIC_PATHS: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
}> = [
  { path: '', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/practice-areas', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/cases', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/contact', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/protocol', priority: 0.5, changeFrequency: 'yearly' },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static pages (one entry per locale, each with hreflang alternates)
  for (const { path, priority, changeFrequency } of STATIC_PATHS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path === '/' ? '' : path}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  // Practice-area detail pages (slugs come from the Services translations)
  let serviceSlugs: string[] = [];
  try {
    const t = await getTranslations({ locale: 'en', namespace: 'Services' });
    const items = t.raw('items') as Array<{ slug: string }>;
    serviceSlugs = items.map((i) => i.slug).filter(Boolean);
  } catch {
    serviceSlugs = [];
  }

  for (const slug of serviceSlugs) {
    const path = `/practice-areas/${slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  // Case / insight detail pages
  const insightSlugs = getAllInsightSlugs();
  for (const { slug } of insightSlugs) {
    const path = `/cases/${slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: { languages: languageAlternates(path) },
      });
    }
  }

  return entries;
}
