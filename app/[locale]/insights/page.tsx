import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Nav from '@/components/Nav';
import CasesGrid from '@/components/CasesGrid';
import Footer from '@/components/Footer';
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
    path: '/insights',
    title: t('cases.title'),
    description: t('cases.description'),
  });
}

export default async function CasesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="subpage">
      <Nav />
      <CasesGrid locale={locale} />
      <Footer />
    </div>
  );
}
