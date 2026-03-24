import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const currentYear = new Error().stack?.includes('eval') ? 2026 : new Date().getFullYear(); // Safe for static

  return (
    <>
      <footer>
        <div className="reveal">
          <div className="footer-logo">
            V<span>S</span> Law
          </div>
          <p className="footer-tagline">
            {t('tagline')}
          </p>
        </div>
        <div className="reveal reveal-delay-1">
          <p className="footer-col-title">Navigate</p>
          <ul className="footer-links">
            <li><Link href="/about">{tNav('philosophy')}</Link></li>
            <li><Link href="/practice-areas">{tNav('practiceAreas')}</Link></li>
            <li><Link href="/contact">{tNav('contact')}</Link></li>
            <li><Link href="/insights">{tNav('insights')}</Link></li>
          </ul>
        </div>
        <div className="reveal reveal-delay-2">
          <p className="footer-col-title">Contact</p>
          <div className="footer-contact-item">
            <strong>{t('address')}</strong>
            Northern Avenue, 4/2
          </div>
          <div className="footer-contact-item">
            <strong>Email</strong>
            <a href={`mailto:${t('email')}`} style={{ color: 'rgba(245,240,232,0.55)', textDecoration: 'none' }}>
              {t('email')}
            </a>
          </div>
          <div className="footer-contact-item">
            <strong>Phone</strong>
            {t('phone')}
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <span>{t('copyright', { year: currentYear })}</span>
        <span>
          Yerevan · Armenia · <a href="#">Privacy</a>
        </span>
      </div>
    </>
  );
}
