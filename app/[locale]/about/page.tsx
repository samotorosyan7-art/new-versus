'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Gallery, { type GallerySlide } from '@/components/Gallery';

export default function AboutPage() {
  const t = useTranslations('About');
  const th = useTranslations('Hero');

  const bio = t.raw('bio') as string[];
  const galleryCaptions = t.raw('galleryCaptions') as string[];
  const videoCaptions = t.raw('videoCaptions') as string[];

  // Photos live in /public/gallery-images. Mixed orientations (one wide team
  // shot, two portraits) are handled by the Gallery's contain layout.
  const galleryImages = [
    '/gallery-images/NZ5_0715.JPG',
    '/Vache-Simonyan-scaled.png',
    '/gallery-images/NZ5_0871.JPG',
    '/gallery-images/NZ5_0876.JPG',
  ];
  // Press coverage from Azatutyun (RFE/RL Armenian service).
  const galleryVideos = ['VBKbo2vOAh4', '70h_WlHTefM'];

  const slides: GallerySlide[] = [
    ...galleryImages.map((src, i) => ({ src, caption: galleryCaptions[i] })),
    ...galleryVideos.map((videoId, i) => ({
      type: 'video' as const,
      videoId,
      caption: videoCaptions[i],
    })),
  ];

  return (
    <main className="subpage about-page">
      <Nav />

      {/* Biography + portrait */}
      <section className="about-body">
        <div className="about-bio reveal">
          <h1 className="about-section-title">{t('bioTitle')}</h1>
          {bio.map((para, i) => (
            <p className="about-paragraph" key={i}>
              {para}
            </p>
          ))}
        </div>

        <div className="about-hero-img reveal reveal-delay-1">
          <Image
            src="/Vache-Simonyan-scaled.png"
            alt={th('displayName')}
            width={520}
            height={680}
            className="about-portrait"
            priority
          />
        </div>
      </section>

      {/* Gallery */}
      <section className="about-gallery-section">
        <div className="section-header reveal">
          <div>
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
