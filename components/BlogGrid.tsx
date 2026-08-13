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
            <h2 className="section-title">{t('allPosts')}</h2>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', marginTop: '48px' }}>{t('noPostsFound')}</p>
      </section>
    );
  }

  return (
    <section id="blog-grid">
      <div className="section-header reveal">
        <div>
          <h2 className="section-label">{t('allPosts')}</h2>
        </div>
      </div>

      <div className="blog-grid reveal">
        <div className="blog-cards-grid">
          {posts.map((post: InsightMeta) => (
            <Link key={post.slug} href={`/cases/${post.slug}`} className="blog-card">
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
      </div>
    </section>
  );
}
