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
    path: '/contact',
    title: t('contact.title'),
    description: t('contact.description'),
  });
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
