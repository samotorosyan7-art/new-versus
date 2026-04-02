'use client';
import { useTranslations } from 'next-intl';

export default function Protocol() {
  const t = useTranslations('Protocol');

  return (
    <section id="protocol" className="protocol-section">
      <div className="section-header reveal">
        <div>
          <p className="section-label">{t('label')}</p>
          <h2 className="section-title">{t('title')}</h2>
        </div>
      </div>
      
      <div className="protocol-intro reveal">
        <p className="protocol-sub">{t('sub')}</p>
      </div>

      <div className="protocol-grid">
        <div className="protocol-phase reveal">
          <div className="phase-num">01</div>
          <h3 className="phase-title">{t('phase1.title')}</h3>
          <p className="phase-desc">{t('phase1.desc')}</p>
        </div>
        
        <div className="protocol-phase reveal reveal-delay-1">
          <div className="phase-num">02</div>
          <h3 className="phase-title">{t('phase2.title')}</h3>
          <p className="phase-desc">{t('phase2.desc')}</p>
        </div>
        
        <div className="protocol-phase reveal reveal-delay-2">
          <div className="phase-num">03</div>
          <h3 className="phase-title">{t('phase3.title')}</h3>
          <p className="phase-desc">{t('phase3.desc')}</p>
        </div>
      </div>


    </section>
  );
}
