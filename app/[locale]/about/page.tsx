'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Gallery, { type GallerySlide } from '@/components/Gallery';

type EducationItem = { degree: string; school: string; year: string };

export default function AboutPage() {
  const t = useTranslations('About');

  const bio = t.raw('bio') as string[];
  const education = t.raw('education') as EducationItem[];
  const credentials = t.raw('credentials') as string[];
  const languages = t.raw('languages') as string[];
  const galleryCaptions = t.raw('galleryCaptions') as string[];

  // Drop real photos into /public/gallery and extend this list.
  // Falls back to the founder portrait so the slider always has content.
  const slides: GallerySlide[] = galleryCaptions.map((caption) => ({
    src: '/Vache-Simonyan-scaled.jpg',
    caption,
  }));

  return (
    <main className="subpage about-page">
      <Nav />

      {/* Intro */}
      <section className="about-hero">
        <div className="about-hero-text reveal">
          <p className="section-label">{t('label')}</p>
          <h1 className="about-name">{t('title')}</h1>
          <p className="about-role">{t('role')}</p>
          <p className="about-intro">{t('intro')}</p>
        </div>
        <div className="about-hero-img reveal reveal-delay-1">
          <Image
            src="/Vache-Simonyan-scaled.jpg"
            alt={t('title')}
            width={520}
            height={680}
            className="about-portrait"
            priority
          />
        </div>
      </section>

      {/* Biography + sidebar */}
      <section className="about-body">
        <div className="about-bio reveal">
          <h2 className="about-section-title">{t('bioTitle')}</h2>
          {bio.map((para, i) => (
            <p className="about-paragraph" key={i}>
              {para}
            </p>
          ))}
        </div>

        <aside className="about-sidebar">
          <div className="about-card reveal">
            <h3 className="about-card-title">{t('educationTitle')}</h3>
            <ul className="about-edu-list">
              {education.map((e, i) => (
                <li className="about-edu-item" key={i}>
                  <span className="about-edu-year">{e.year}</span>
                  <span className="about-edu-degree">{e.degree}</span>
                  <span className="about-edu-school">{e.school}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="about-card reveal reveal-delay-1">
            <h3 className="about-card-title">{t('credentialsTitle')}</h3>
            <ul className="about-list">
              {credentials.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <div className="about-card reveal reveal-delay-2">
            <h3 className="about-card-title">{t('languagesTitle')}</h3>
            <ul className="about-list">
              {languages.map((l, i) => (
                <li key={i}>{l}</li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* Gallery */}
      <section className="about-gallery-section">
        <div className="section-header reveal">
          <div>
            <p className="section-label">{t('galleryLabel')}</p>
            <h2 className="section-title">{t('galleryTitle')}</h2>
          </div>
        </div>
        <div className="reveal">
          <Gallery slides={slides} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
