import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function Hero() {
  const t = useTranslations('Hero');

  return (
    <section id="hero">
      <div className="hero-img-col">
        <Image
          src="/Vache-Simonyan-scaled.jpg"
          alt={t('name')}
          fill
          style={{ objectFit: 'cover', objectPosition: 'center 15%' }}
          className="hero-portrait"
          priority
        />
        <div className="hero-img-overlay"></div>
      </div>
      <div className="hero-text-col">
        <p className="hero-overline">{t('overline')}</p>
        <h1 className="hero-name">
          Vache <em>Simon</em>yan
        </h1>
        <p className="hero-versus">{t('versus')}</p>
        <p className="hero-tagline">{t('tagline')}</p>
        <Link href="/contact" className="hero-cta">
          {t('cta')}
        </Link>
        <div className="hero-scroll-indicator">
          <div className="scroll-line"></div>
          {t('scroll')}
        </div>
      </div>
    </section>
  );
}
