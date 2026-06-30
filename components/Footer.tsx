'use client';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const currentYear = 2026; // Fixed for hydration consistency

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer>
        <span className="footer-watermark" aria-hidden="true">VS</span>

        <div className="footer-top">
          <div className="footer-brand reveal">
            <div className="footer-logo">
              <Image
                src="/logo.svg"
                alt="Vache Simonyan"
                width={160}
                height={50}
                style={{ height: 'auto', width: 'auto', maxWidth: '160px' }}
              />
            </div>
            
          </div>

          <div className="footer-col reveal reveal-delay-1">
            <p className="footer-col-title">{t('navigateTitle')}</p>
            <ul className="footer-links">
              <li><Link href="/">{tNav('home')}</Link></li>
              <li><Link href="/practice-areas">{tNav('practiceAreas')}</Link></li>
              <li><Link href="/cases">{tNav('cases')}</Link></li>
              <li><Link href="/about">{tNav('about')}</Link></li>
              <li><Link href="/contact">{tNav('contact')}</Link></li>
            </ul>
          </div>

          <div className="footer-col footer-col-contact reveal reveal-delay-3">
            <p className="footer-col-title">{t('contactTitle')}</p>
            <div className="footer-contact-item">
              <strong>{t('locationLabel')}</strong>
              <a
                href="https://www.google.com/maps/search/?api=1&query=41+Marshal+Baghramyan+Ave,+Yerevan,+Armenia"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-contact-link"
              >
                {t('address')}
              </a>
            </div>
            <div className="footer-contact-item">
              <strong>{t('emailLabel')}</strong>
              <a href={`mailto:${t('email')}`} className="footer-contact-link">
                {t('email')}
              </a>
            </div>
            <div className="footer-contact-item">
              <strong>{t('phoneLabel')}</strong>
              <a href={`tel:${t('phone').replace(/\s+/g, '')}`} className="footer-contact-link">
                {t('phone')}
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>{t('copyright', { year: currentYear })}</span>
          <div className="footer-bottom-right">
            <span>
              Yerevan · Armenia · <a href="#">Privacy</a>
            </span>
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
    </>
  );
}
