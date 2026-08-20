import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'insights');

export interface InsightMeta {
  slug: string;
  locale: string;
  title: string;
  date: string;
  tag: string;
  excerpt: string;
  isFeatured?: boolean;
  /** Manual sort order (lower = first). Configurable from the admin panel. */
  order?: number;
  /** Optional cover image path. Falls back to a placeholder when unset. */
  image?: string;
}

export interface Insight extends InsightMeta {
  content: string;
}

/** Returns all insight posts for a given locale, sorted by date descending */
export function getAllInsights(locale: string): InsightMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR);

  const posts: InsightMeta[] = [];

  for (const file of files) {
    const match = file.match(/^(.+)\.(en|hy|ru)\.mdx?$/);
    if (!match) continue;

    const [, slug, fileLocale] = match;
    if (fileLocale !== locale) continue;

    const fullPath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(raw);

    posts.push({
      slug,
      locale: fileLocale,
      title: data.title ?? '',
      date: data.date ?? '',
      tag: data.tag ?? 'Insight',
      excerpt: data.excerpt ?? '',
      isFeatured: data.isFeatured ?? false,
      order: typeof data.order === 'number' ? data.order : undefined,
      image: data.image ?? undefined,
    });
  }

  // Sort: by manual order first (lower = earlier; items without an order go last),
  // then featured, then by date descending.
  return posts.sort((a, b) => {
    const ao = a.order ?? Number.POSITIVE_INFINITY;
    const bo = b.order ?? Number.POSITIVE_INFINITY;
    if (ao !== bo) return ao - bo;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/** Returns a single insight post with full MDX content string. Falls back to whichever
 * other locale is available for the same slug, so a case missing one translation still
 * opens instead of 404ing. */
export function getInsightBySlug(slug: string, locale: string): Insight | null {
  const candidateLocales = [locale, 'en', 'hy', 'ru'].filter((l, i, arr) => arr.indexOf(l) === i);

  for (const candidateLocale of candidateLocales) {
    const fullPath = path.join(CONTENT_DIR, `${slug}.${candidateLocale}.mdx`);
    if (!fs.existsSync(fullPath)) continue;

    const raw = fs.readFileSync(fullPath, 'utf-8');
    const { data, content } = matter(raw);

    return {
      slug,
      locale: candidateLocale,
      title: data.title ?? '',
      date: data.date ?? '',
      tag: data.tag ?? 'Insight',
      excerpt: data.excerpt ?? '',
      isFeatured: data.isFeatured ?? false,
      order: typeof data.order === 'number' ? data.order : undefined,
      image: data.image ?? undefined,
      content,
    };
  }

  return null;
}

/** All unique slugs (for static params generation) */
export function getAllInsightSlugs(): { slug: string }[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR);
  const slugSet = new Set<string>();

  for (const file of files) {
    const match = file.match(/^(.+)\.(en|hy|ru)\.mdx?$/);
    if (match) slugSet.add(match[1]);
  }

  return Array.from(slugSet).map((slug) => ({ slug }));
}

const REDIRECTS_PATH = path.join(process.cwd(), 'content', 'insight-redirects.json');

/** Maps an old case slug to the slug it was renamed to from the admin panel. */
export function getInsightRedirects(): Record<string, string> {
  if (!fs.existsSync(REDIRECTS_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(REDIRECTS_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

/** Follows a chain of renames to the slug's current location, or null if it was never renamed. */
export function resolveInsightRedirect(slug: string): string | null {
  const redirects = getInsightRedirects();
  const seen = new Set([slug]);
  let current = slug;
  let target: string | null = null;

  while (redirects[current] && !seen.has(redirects[current])) {
    current = redirects[current];
    seen.add(current);
    target = current;
  }

  return target;
}
