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
        {/* Featured / left column */}
        <Link href={`/insights/${featured.slug}`} className="blog-card featured">
          <div className="blog-card-tag">
            <span className="tag-pill">{featured.tag}</span>
          </div>
          <h2 className="blog-card-title">{featured.title}</h2>
          {featured.excerpt && (
            <p className="blog-card-excerpt">{featured.excerpt}</p>
          )}
          <div className="blog-card-meta">
            <span className="blog-card-date">{featured.date}</span>
            <span className="blog-card-arrow">{t('readMore')}</span>
          </div>
        </Link>

        {/* Right column */}
        <div className="blog-right-col">
          {rest.map((post: InsightMeta) => (
            <Link key={post.slug} href={`/insights/${post.slug}`} className="blog-card">
              <div className="blog-card-tag">
                <span className="tag-pill">{post.tag}</span>
              </div>
              <h3 className="blog-card-title">{post.title}</h3>
              {post.excerpt && (
                <p className="blog-card-excerpt" style={{ fontSize: '12px', WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {post.excerpt}
                </p>
              )}
              <div className="blog-card-meta">
                <span className="blog-card-date">{post.date}</span>
                <span className="blog-card-arrow">{t('readMore')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
