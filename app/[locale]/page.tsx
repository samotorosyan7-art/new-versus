import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Nav from '@/components/Nav';
import { Link } from '@/navigation';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Ticker from '@/components/Ticker';
import IntakeForm from '@/components/IntakeForm';
import BlogGrid from '@/components/BlogGrid';
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
    path: '/',
    title: t('home.title'),
    description: t('home.description'),
    absoluteTitle: true,
  });
}

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        {/* <Ticker /> */}
        {/* <IntakeForm /> */}
        <BlogGrid locale={locale} />
      </main>
      <Footer />
    </>
  );
}
