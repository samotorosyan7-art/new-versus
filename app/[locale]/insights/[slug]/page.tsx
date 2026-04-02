import { notFound } from 'next/navigation';
import { getInsightBySlug, getAllInsightSlugs } from '@/lib/mdx';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/navigation';
import ReactMarkdown from 'react-markdown';

export async function generateStaticParams() {
  const slugs = getAllInsightSlugs();
  return slugs;
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function InsightPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const post = getInsightBySlug(slug, locale);
  const t = await getTranslations('Blog');

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
        <article className="blog-reading">
          <header className="blog-reading-header">
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
          </header>

          <div className="prose">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
      <Footer />
    </div>
  );
}
