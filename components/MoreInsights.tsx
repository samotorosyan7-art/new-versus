import { getAllInsights } from '@/lib/mdx';
import { getTranslations } from 'next-intl/server';
import MoreInsightsRail from '@/components/MoreInsightsRail';

interface MoreInsightsProps {
  locale: string;
  currentSlug: string;
}

export default async function MoreInsights({ locale, currentSlug }: MoreInsightsProps) {
  const posts = getAllInsights(locale).filter((post) => post.slug !== currentSlug);

  if (posts.length === 0) return null;

  const t = await getTranslations('Blog');

  return (
    <section className="more-insights" aria-label={t('moreInsights')}>
      <div className="more-insights-header">
        <h2 className="section-label">{t('moreInsights')}</h2>
      </div>

      <MoreInsightsRail
        posts={posts}
        readMoreLabel={t('readMore')}
        prevLabel={t('previousInsight')}
        nextLabel={t('nextInsight')}
      />
    </section>
  );
}
