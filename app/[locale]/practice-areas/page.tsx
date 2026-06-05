import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Services from '@/components/Services';
import Nav from '@/components/Nav';
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
    path: '/practice-areas',
    title: t('practiceAreas.title'),
    description: t('practiceAreas.description'),
  });
}

export default function PracticeAreasPage() {
  return (
    <main className="subpage">
      <Nav />
      <Services />
      <Footer />
    </main>
  );
}
