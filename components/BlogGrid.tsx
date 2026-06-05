import { getAllInsights, type InsightMeta } from '@/lib/mdx';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

interface BlogGridProps {
  locale: string;
}

export default async function BlogGrid({ locale }: BlogGridProps) {
  const posts = getAllInsights(locale);
  const t = await getTranslations('Blog');

  if (posts.length === 0) {
    return (
      <section id="blog-grid">
        <div className="section-header reveal">
          <div>
            <p className="section-label">{t('allPosts')}</p>
            <h2 className="section-title">Strategic<br />Insights</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', marginTop: '48px' }}>{t('noPostsFound')}</p>
      </section>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <section id="blog-grid">
      <div className="section-header reveal">
        <div>
          <p className="section-label">{t('allPosts')}</p>
          <h2 className="section-title">Strategic<br />Insights</h2>
        </div>
        <div className="section-count">{posts.length.toString().padStart(2, '0')}</div>
      </div>

      <div className="blog-grid reveal">
        {/* Full-width featured */}
        <Link href={`/insights/${featured.slug}`} className="blog-featured-full">
          <div className="blog-featured-main">
            <div className="blog-card-flag">
              <span className="blog-card-flag-dot" />
              {t('featured')}
            </div>
            <div className="blog-card-tag">
              <span className="tag-pill">{featured.tag}</span>
            </div>
            <h2 className="blog-featured-title">{featured.title}</h2>
            {featured.excerpt && (
              <p className="blog-featured-excerpt">{featured.excerpt}</p>
            )}
          </div>
          <div className="blog-featured-side">
            <span className="blog-card-date">{featured.date}</span>
            <span className="blog-featured-cta">
              {t('readMore')}
              <span className="blog-featured-cta-arrow">→</span>
            </span>
          </div>
        </Link>

        {/* 3 per row */}
        {rest.length > 0 && (
          <div className="blog-cards-grid">
            {rest.map((post: InsightMeta) => (
              <Link key={post.slug} href={`/insights/${post.slug}`} className="blog-card">
                <div className="blog-card-tag">
                  <span className="tag-pill">{post.tag}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                {post.excerpt && (
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                )}
                <div className="blog-card-meta">
                  <span className="blog-card-date">{post.date}</span>
                  <span className="blog-card-arrow">{t('readMore')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
