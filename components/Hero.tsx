'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section id="hero" className="hero-reversed">
      <div className="hero-text-col">
        <p className="hero-overline">{t('overline')}</p>
        <h1 className="hero-name">
          <em>V</em>ache <em>S</em>imonyan
        </h1>
        <p className="hero-versus">{t('versus')}</p>
        <p className="hero-tagline">{t('tagline')}</p>
        <div className="hero-cta-wrap">
          <Link href="/contact" className="primary-btn">
            {t('cta')}
          </Link>
        </div>
      </div>
      <div className="hero-img-col">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{ width: '100%', height: '100%', position: 'relative' }}
        >
          <Image
            src="/Vache-Simonyan-scaled.jpg"
            alt={t('name')}
            fill
            style={{ objectFit: 'contain', objectPosition: 'center 15%' }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="hero-portrait"
            priority
          />
        </motion.div>
      </div>
    </section>
  );
}
