import { getAllInsights, type InsightMeta } from '@/lib/mdx';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

interface CasesGridProps {
  locale: string;
}

export default async function CasesGrid({ locale }: CasesGridProps) {
  const cases = getAllInsights(locale);
  const t = await getTranslations('Cases');

  return (
    <section id="cases">
      <div className="section-header reveal">
        <div>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">{t('title')}</h2>
        </div>
      </div>

      {cases.length === 0 ? (
        <p className="cases-empty">{t('empty')}</p>
      ) : (
        <div className="cases-list reveal">
          {cases.map((c: InsightMeta, i: number) => (
            <Link key={c.slug} href={`/cases/${c.slug}`} className="case-row">
              <span className="case-index">
                {(i + 1).toString().padStart(2, '0')}
              </span>
              <div className="case-main">
                <h3 className="case-title">{c.title}</h3>
                {c.excerpt && <p className="case-excerpt">{c.excerpt}</p>}
              </div>
              <div className="case-meta">
                {c.date && <span className="case-date">{c.date}</span>}
                <span className="case-cta">
                  {t('readMore')}
                  <span className="case-cta-arrow">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
