import type { Metadata } from 'next';

/**
 * Canonical site origin. Override per-environment with NEXT_PUBLIC_SITE_URL
 * (e.g. https://versuslawfirm.am) so canonicals, sitemap and OG tags are correct.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://versuslawfirm.am'
).replace(/\/$/, '');

export const SITE_NAME = 'Versus Law Firm';

export const locales = ['en', 'hy', 'ru'] as const;
export type Locale = (typeof locales)[number];

const OG_LOCALE: Record<string, string> = {
  en: 'en_US',
  hy: 'hy_AM',
  ru: 'ru_RU',
};

export function ogLocale(locale: string): string {
  return OG_LOCALE[locale] ?? 'en_US';
}

/** Build the hreflang map for a given path (path is locale-agnostic, e.g. '' or '/about'). */
export function languageAlternates(path: string): Record<string, string> {
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${clean}`;
  languages['x-default'] = `${SITE_URL}/en${clean}`;
  return languages;
}

interface PageMetaOptions {
  locale: string;
  /** Locale-agnostic path, e.g. '' for home, '/about', '/insights/some-slug'. */
  path: string;
  title: string;
  description: string;
  /** When true, the title is used verbatim (no "%s · Site" template). */
  absoluteTitle?: boolean;
  /** Absolute or root-relative image paths. Defaults to the brand logo. */
  images?: string[];
  type?: 'website' | 'article';
}

/** Produces a consistent, fully-formed Metadata object for a page. */
export function pageMetadata(opts: PageMetaOptions): Metadata {
  const { locale, path, title, description, absoluteTitle, images, type } = opts;
  const clean = path === '/' ? '' : path;
  const url = `${SITE_URL}/${locale}${clean}`;
  const ogImages = (images && images.length ? images : ['/logo.png']).map((src) => ({
    url: src,
    width: 1280,
    height: 720,
    alt: SITE_NAME,
  }));

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: languageAlternates(path),
    },
    openGraph: {
      type: type ?? 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
      locale: ogLocale(locale),
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: (images && images.length ? images : ['/logo.png']),
    },
  };
}
