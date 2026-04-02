'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import Image from 'next/image';

export default function Footer() {
  const t = useTranslations('Footer');
  const tNav = useTranslations('Nav');
  const currentYear = 2026; // Fixed for hydration consistency
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: 'Newsletter', email, type: 'newsletter' }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  return (
    <>
      <footer>
        <div className="footer-brand reveal">
          <div className="footer-logo">
            <Image 
              src="/logo.png"
              alt="Vache Simonyan"
              width={160}
              height={50}
              style={{ height: 'auto', width: 'auto', maxWidth: '160px' }}
            />
          </div>
          <p className="footer-tagline">
            {t('tagline')}
          </p>
        </div>
        <div className="footer-col reveal reveal-delay-1">
          <p className="footer-col-title">Navigate</p>
          <ul className="footer-links">
            <li><Link href="/protocol">{tNav('protocol')}</Link></li>
            <li><Link href="/practice-areas">{tNav('practiceAreas')}</Link></li>
            <li><Link href="/contact">{tNav('contact')}</Link></li>
            <li><Link href="/insights">{tNav('insights')}</Link></li>
          </ul>
        </div>
        <div className="footer-col reveal reveal-delay-2">
          <p className="footer-col-title">{t('newsletterTitle')}</p>
          <p className="footer-col-desc">{t('newsletterSub')}</p>
          {status === 'success' ? (
            <p className="footer-col-desc" style={{ color: 'var(--accent)' }}>Thank you for subscribing.</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input 
                type="email" 
                placeholder={t('newsletterPlaceholder')} 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
              <button type="submit" className="shadow-btn" disabled={status === 'loading'}>
                {status === 'loading' ? '...' : '→'}
              </button>
            </form>
          )}
        </div>
        <div className="footer-col reveal reveal-delay-3">
          <p className="footer-col-title">Contact</p>
          <div className="footer-contact-item">
            <strong>Location</strong>
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
            <strong>Email</strong>
            <a href={`mailto:${t('email')}`} className="footer-contact-link">
              {t('email')}
            </a>
          </div>
          <div className="footer-contact-item">
            <strong>Phone</strong>
            <a href={`tel:${t('phone').replace(/\s+/g, '')}`} className="footer-contact-link">
              {t('phone')}
            </a>
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
