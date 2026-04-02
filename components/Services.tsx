'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Services() {
  const t = useTranslations('Services');
  const rawItems = t.raw('items');
  const items = Array.isArray(rawItems) ? (rawItems as Array<{ num: string, slug: string, title: string, desc: string, outcome: string }>) : [];

  return (
    <section id="services">
      <div className="section-header reveal">
        <div>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">
            Strategic<br />Services
          </h2>
        </div>
        <div className="section-count">{items.length.toString().padStart(2, '0')}</div>
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
            <div className="service-reveal">
              <p className="service-reveal-label">{t('recentOutcomeLabel')}</p>
              <p className="service-reveal-text">&ldquo;{s.outcome}&rdquo;</p>
              <p className="service-link-hint">Read Strategic Deep-Dive →</p>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
