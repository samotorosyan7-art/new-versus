'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ConsultationButton from './ConsultationButton';

export default function Hero() {
  const t = useTranslations('Hero');
  const tagline = t.raw('tagline') as string[];

  return (
    <section id="hero" className="hero-reversed">
      <div className="hero-text-col">
        <p className="hero-overline">{t('overline')}</p>
        <h1 className="hero-name">{t('displayName')}</h1>
        <div className="hero-tagline-group">
          {tagline.map((para, i) => (
            <p className="hero-tagline" key={i}>
              {para}
            </p>
          ))}
        </div>
        <div className="hero-cta-wrap">
          <ConsultationButton label={t('cta')} />
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
            src="/Vache-Simonyan-scaled.png"
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
