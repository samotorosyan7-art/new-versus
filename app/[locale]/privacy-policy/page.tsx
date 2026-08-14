import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getLegalDoc } from '@/lib/legal';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import ReactMarkdown from 'react-markdown';
import { pageMetadata } from '@/lib/seo';
import { routing } from '@/navigation';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return pageMetadata({
    locale,
    path: '/privacy-policy',
    title: t('privacyPolicy.title'),
    description: t('privacyPolicy.description'),
  });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const doc = getLegalDoc('privacy-policy', locale);
  const t = await getTranslations('PrivacyPolicy');

  const formattedDate = doc?.effectiveDate
    ? new Date(doc.effectiveDate).toLocaleDateString(
        locale === 'hy' ? 'hy-AM' : locale === 'ru' ? 'ru-RU' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null;

  return (
    <div className="subpage">
      <Nav />
      <div style={{ paddingTop: '60px' }}>
        <article className="blog-reading">
          <header className="blog-reading-header">
            <div className="blog-reading-eyebrow">
              <span />
              {formattedDate && <span className="blog-reading-date">{t('effective', { date: formattedDate })}</span>}
            </div>

            <h1 className="blog-reading-title">{doc?.title}</h1>

            <span className="blog-reading-rule" aria-hidden="true" />
          </header>

          <div className="prose case-detail-body">
            <ReactMarkdown>{doc?.content ?? ''}</ReactMarkdown>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
