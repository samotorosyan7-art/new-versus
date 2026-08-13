import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInsightBySlug, getAllInsightSlugs } from '@/lib/mdx';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/navigation';
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
  const post = getInsightBySlug(slug, locale);

  if (!post) {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }

  return pageMetadata({
    locale,
    path: `/cases/${slug}`,
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
            <Link href="/cases" className="blog-reading-back">
              ← {t('backToInsights')}
            </Link>

            <div className="blog-reading-eyebrow">
              <span className="tag-pill">{post.tag}</span>
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
              {post.excerpt && (
                <p className="blog-reading-excerpt">{post.excerpt}</p>
              )}

              <div className="prose case-detail-body">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="case-detail-cta">
            <Link href="/contact" className="primary-btn">
              {th('cta')}
            </Link>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
