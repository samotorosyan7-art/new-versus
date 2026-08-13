'use client';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = 2026; // Fixed for hydration consistency

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="footer-bottom">
        <span className="footer-copyright">{t('copyright', { year: currentYear })}</span>

        <div className="footer-bottom-contact">
          <a
            href="https://www.google.com/maps/search/?api=1&query=41+Marshal+Baghramyan+Ave,+Yerevan,+Armenia"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('address')}
          </a>
          <a href={`mailto:${t('email')}`}>{t('email')}</a>
          <a href={`tel:${t('phone').replace(/\s+/g, '')}`}>{t('phone')}</a>
        </div>

        <div className="footer-bottom-right">
          <a href="#">{t('privacy')}</a>
          <button
            type="button"
            className="footer-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
