import { getAllInsights, type InsightMeta } from '@/lib/mdx';
import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';

interface CasesGridProps {
  locale: string;
}

export default async function CasesGrid({ locale }: CasesGridProps) {
  const cases = getAllInsights(locale);
  const t = await getTranslations('Cases');

  // Highlight one case — the explicitly featured one, or the first in order.
  const featured = cases.find((c) => c.isFeatured) ?? cases[0];
  const rest = cases.filter((c) => c.slug !== featured?.slug);

  return (
    <section id="cases">
      <div className="section-header reveal">
        <div>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">{t('title')}</h2>
          <p className="cases-intro">{t('intro')}</p>
        </div>
        {cases.length > 0 && (
          <div className="section-count">{cases.length.toString().padStart(2, '0')}</div>
        )}
      </div>

      {cases.length === 0 ? (
        <p className="cases-empty">{t('empty')}</p>
      ) : (
        <>
          {/* Highlighted case */}
          {featured && (
            <Link
              href={`/insights/${featured.slug}`}
              className="case-feature reveal"
            >
              <div className="case-feature-body">
                <div className="case-feature-flag">
                  <span className="case-feature-flag-dot" />
                  {t('featured')}
                </div>
                {featured.tag && <span className="case-tag">{featured.tag}</span>}
                <h3 className="case-feature-title">{featured.title}</h3>
                {featured.excerpt && (
                  <p className="case-feature-excerpt">{featured.excerpt}</p>
                )}
                <div className="case-feature-foot">
                  {featured.date && (
                    <span className="case-date">{featured.date}</span>
                  )}
                  <span className="case-cta">
                    {t('readMore')}
                    <span className="case-cta-arrow">→</span>
                  </span>
                </div>
              </div>
              <div className="case-feature-aside" aria-hidden="true">
                <span className="case-feature-monogram">01</span>
                <span className="case-feature-vlabel">{t('featured')}</span>
              </div>
            </Link>
          )}

          {/* Record list */}
          {rest.length > 0 && (
            <div className="cases-list reveal">
              {rest.map((c: InsightMeta, i: number) => (
                <Link key={c.slug} href={`/insights/${c.slug}`} className="case-row">
                  <span className="case-index">
                    {(i + 2).toString().padStart(2, '0')}
                  </span>
                  <div className="case-main">
                    <span className="case-tag">{c.tag}</span>
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
        </>
      )}
    </section>
  );
}
