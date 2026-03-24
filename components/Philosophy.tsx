import { useTranslations } from 'next-intl';

export default function Philosophy() {
  const t = useTranslations('Philosophy');

  return (
    <section id="philosophy">
      <div className="phil-left reveal">
        <p className="phil-label">{t('label')}</p>
        <h2 className="phil-name">
          Vache<br />Simonyan
        </h2>
        <p className="phil-body">{t('body1')}</p>
        <div className="career-highlights">
          <p className="phil-label" style={{ marginTop: '40px' }}>Education & Career</p>
          <p className="phil-body" style={{ color: 'var(--copper)', fontWeight: 500 }}>
            {t('education')}
          </p>
          <div className="phil-body" style={{ color: 'rgba(245,240,232,0.5)', fontSize: '13px', marginTop: '12px' }}>
            {/* Additional career info could go here or be in the JSON */}
          </div>
        </div>
      </div>
      <div className="phil-right reveal reveal-delay-2">
        <p className="phil-label">{t('strategyLabel')}</p>
        <div className="versus-word">{t('versusWord')}</div>
        <div className="versus-line"></div>
        <p className="versus-sub">{t('versusSub')}</p>
        <p className="phil-body">{t('body2')}</p>
      </div>
    </section>
  );
}
