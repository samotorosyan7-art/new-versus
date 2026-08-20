import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInsightBySlug, getAllInsightSlugs, resolveInsightRedirect } from '@/lib/mdx';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import ConsultationButton from '@/components/ConsultationButton';
import MoreInsights from '@/components/MoreInsights';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link, permanentRedirect } from '@/navigation';
import ReactMarkdown from 'react-markdown';
import { pageMetadata, SITE_NAME } from '@/lib/seo';
import { routing } from '@/navigation';

export async function generateStaticParams() {
  const slugs = getAllInsightSlugs();
  return routing.locales.flatMap((locale) =>
    slugs.map(({ slug }) => ({ locale, slug }))
  );
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  let post = getInsightBySlug(slug, locale);
  let canonicalSlug = slug;

  if (!post) {
    const redirectSlug = resolveInsightRedirect(slug);
    if (redirectSlug) {
      canonicalSlug = redirectSlug;
      post = getInsightBySlug(redirectSlug, locale);
    }
  }

  if (!post) {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }

  return pageMetadata({
    locale,
    path: `/cases/${canonicalSlug}`,
    title: post.title,
    description: post.excerpt || `${post.title} — ${SITE_NAME}`,
    type: 'article',
  });
}

export default async function InsightPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getInsightBySlug(slug, locale);
  const t = await getTranslations('Blog');
  const th = await getTranslations('Hero');

  if (!post) {
    // The case may have been renamed from the admin panel — send old links/bookmarks
    // to the new slug instead of a dead page.
    const redirectSlug = resolveInsightRedirect(slug);
    if (redirectSlug) {
      permanentRedirect({ href: `/cases/${redirectSlug}`, locale });
    }
    notFound();
  }

  // Format the date nicely
  const formattedDate = new Date(post.date).toLocaleDateString(
    locale === 'hy' ? 'hy-AM' : locale === 'ru' ? 'ru-RU' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <div className="subpage">
      <Nav />
      <div style={{ paddingTop: '60px' }}>
        <article className="case-detail">
          <header className="case-detail-header">
            <div className="blog-reading-eyebrow">
              <Link href="/cases" className="blog-reading-back">
                ← {t('backToCases')}
              </Link>
              <span className="blog-reading-date">{formattedDate}</span>
            </div>

            <h1 className="blog-reading-title">{post.title}</h1>

            <span className="blog-reading-rule" aria-hidden="true" />
          </header>

          <div className="case-hero">
            <div className="case-hero-media">
              <ImagePlaceholder src={post.image} alt={post.title} priority />
            </div>

            <div className="case-hero-text">
              <div className="prose case-detail-body">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="case-detail-cta">
            <ConsultationButton label={th('cta')} />
          </div>

          <MoreInsights locale={locale} currentSlug={slug} />
        </article>
      </div>
      <Footer />
    </div>
  );
}
