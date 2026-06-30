import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata, SITE_NAME } from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  try {
    const t = await getTranslations({ locale, namespace: `PracticeAreas.${slug}` });
    const title = t('title');
    const rows = t.raw('rows') as string[];
    const summary = Array.isArray(rows) && rows.length ? rows[0] : '';
    return pageMetadata({
      locale,
      path: `/practice-areas/${slug}`,
      title,
      description: summary.length > 160 ? `${summary.slice(0, 157).trim()}…` : summary,
    });
  } catch {
    // Unknown slug — let the page handle the 404, but keep metadata sane.
    return {
      title: SITE_NAME,
      robots: { index: false, follow: false },
    };
  }
}

export default function PracticeAreaLayout({ children }: { children: React.ReactNode }) {
  return children;
}
