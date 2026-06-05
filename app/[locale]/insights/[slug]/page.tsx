import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getInsightBySlug, getAllInsightSlugs } from '@/lib/mdx';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import ReactMarkdown from 'react-markdown';
import { pageMetadata, SITE_NAME } from '@/lib/seo';

export async function generateStaticParams() {
  const slugs = getAllInsightSlugs();
  return slugs;
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
    path: `/insights/${slug}`,
    title: post.title,
    description: post.excerpt || `${post.title} — ${SITE_NAME}`,
    type: 'article',
  });
}

export default async function InsightPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getInsightBySlug(slug, locale);
  const t = await getTranslations('Blog');
  const th = await getTranslations('Hero');
  const tc = await getTranslations('Cases');

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
            <Link href="/insights" className="blog-reading-back">
              ← {t('backToInsights')}
            </Link>

            <div className="blog-reading-eyebrow">
              <span className="tag-pill">{post.tag}</span>
              <span className="blog-reading-date">{formattedDate}</span>
            </div>

            <h1 className="blog-reading-title">{post.title}</h1>

            {post.excerpt && (
              <p className="blog-reading-excerpt">{post.excerpt}</p>
            )}

            <span className="blog-reading-rule" aria-hidden="true" />
          </header>

          <div className="case-detail-grid">
            <div className="prose case-detail-body">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>

            <aside className="case-file">
              <div className="case-file-card">
                <p className="case-file-label">{tc('label')}</p>
                <div className="case-file-meta">
                  <span className="tag-pill">{post.tag}</span>
                  <span className="case-file-date">{formattedDate}</span>
                </div>
                <Link href="/contact" className="primary-btn case-file-cta">
                  {th('cta')}
                </Link>
                <Link href="/insights" className="case-file-back">
                  ← {t('backToInsights')}
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
