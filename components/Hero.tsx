'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section id="hero">
      <div className="hero-img-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.25, 1, 0.5, 1] }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <Image
            src="/Vache-Simonyan-scaled.jpg"
            alt={t('name')}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="hero-portrait"
            priority
          />
        </motion.div>
        <div className="hero-img-overlay"></div>

        {/* Floating credential badge */}
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6, ease: [0.25, 1, 0.5, 1] }}
        >
          <span className="hero-badge-dot"></span>
          <span>Available for Consultation</span>
        </motion.div>
      </div>

      <div className="hero-text-col">
        <p className="hero-overline">{t('overline')}</p>

        <h1 className="hero-name">
          <span className="hero-name-gold">V</span>ache{' '}
          <span className="hero-name-gold">S</span>imonyan
        </h1>

        <p className="hero-versus">{t('versus')}</p>
        <p className="hero-tagline">{t('tagline')}</p>

        {/* Credentials bar */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-num">12+</span>
            <span className="hero-stat-label">Years Practice</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <span className="hero-stat-num">300+</span>
            <span className="hero-stat-label">Cases Won</span>
          </div>
          <div className="hero-stat-divider"></div>
          <div className="hero-stat">
            <span className="hero-stat-num">3</span>
            <span className="hero-stat-label">Languages</span>
          </div>
        </div>

        <div className="hero-cta-wrap">
          <Link href="/contact" className="primary-btn">
            {t('cta')}
          </Link>
          <Link href="/insights" className="hero-cta-secondary">
            {t('insights') || 'Strategic Insights'}
          </Link>
        </div>

        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          {t('scroll')}
        </div>
      </div>
    </section>
  );
}
