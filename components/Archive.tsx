import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Archive() {
  const t = useTranslations('Archive');
  const items = t.raw('items') as Array<{ 
    tag: string; 
    title: string; 
    date: string; 
    excerpt?: string; 
    isFeatured: boolean 
  }>;

  return (
    <section id="archive">
      <div className="section-header reveal">
        <div>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">
            Strategic<br />Insights
          </h2>
        </div>
      </div>
      <div className="archive-grid reveal">
        {items.map((a, i) => (
          <Link 
            key={i} 
            href="/insights" 
            className={`archive-card${a.isFeatured ? ' featured' : ''}`}
          >
            {a.isFeatured && <div className="archive-featured-bg"></div>}
            <p className="archive-tag">{a.tag}</p>
            <h3 className="archive-title">{a.title}</h3>
            {a.excerpt && <p className="archive-excerpt">{a.excerpt}</p>}
            <p className="archive-meta" style={!a.isFeatured ? { marginTop: '12px' } : undefined}>
              {a.date}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
