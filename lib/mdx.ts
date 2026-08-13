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

  // Sort: by manual order first (higher = earlier; items without an order go last),
  // then featured, then by date descending.
  return posts.sort((a, b) => {
    const ao = a.order ?? Number.NEGATIVE_INFINITY;
    const bo = b.order ?? Number.NEGATIVE_INFINITY;
    if (ao !== bo) return bo - ao;
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/** Returns a single insight post with full MDX content string */
export function getInsightBySlug(slug: string, locale: string): Insight | null {
  const fileName = `${slug}.${locale}.mdx`;
  const fullPath = path.join(CONTENT_DIR, fileName);

  if (!fs.existsSync(fullPath)) {
    // Try fallback to 'en' locale
    const enPath = path.join(CONTENT_DIR, `${slug}.en.mdx`);
    if (!fs.existsSync(enPath)) return null;

    const raw = fs.readFileSync(enPath, 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug,
      locale: 'en',
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

  const raw = fs.readFileSync(fullPath, 'utf-8');
  const { data, content } = matter(raw);

  return {
    slug,
    locale,
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
