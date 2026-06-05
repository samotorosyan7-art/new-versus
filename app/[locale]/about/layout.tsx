import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { pageMetadata } from '@/lib/seo';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });
  return pageMetadata({
    locale,
    path: '/about',
    title: t('about.title'),
    description: t('about.description'),
    images: ['/Vache-Simonyan-scaled.jpg'],
  });
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
