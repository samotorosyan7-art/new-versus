'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Services() {
  const t = useTranslations('Services');
  const rawItems = t.raw('items');
  const items = Array.isArray(rawItems) ? (rawItems as Array<{ num: string, slug: string, title: string, desc: string }>) : [];

  return (
    <section id="services">
      <div className="section-header reveal">
        <div>
          <h2 className="section-label">{t('label')}</h2>
        </div>
      </div>
      <div className="services-grid">
        {items.map((s, index) => (
          <Link 
            key={s.num} 
            href={`/practice-areas/${s.slug}`}
            className={`service-card reveal reveal-delay-${(index % 3) + 1}`}
          >
            <div className="service-num">{s.num}</div>
            <h3 className="service-title">{s.title}</h3>
            <p className="service-desc">{s.desc}</p>
            <span className="service-link-hint">{t('learnMore')}</span>
          </Link>
        ))}
      </div>

    </section>
  );
}
