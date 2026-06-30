'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

export interface GallerySlide {
  src: string;
  caption?: string;
}

interface GalleryProps {
  slides: GallerySlide[];
}

export default function Gallery({ slides }: GalleryProps) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const prev = useCallback(() => goTo(index - 1), [goTo, index]);
  const next = useCallback(() => goTo(index + 1), [goTo, index]);

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (total === 0) return null;

  return (
    <div className="gallery">
      <div
        className="gallery-stage"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (delta > 50) prev();
          if (delta < -50) next();
          touchStartX.current = null;
        }}
      >
        <div
          className="gallery-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className="gallery-slide" key={i}>
              <Image
                src={slide.src}
                alt={slide.caption || `Gallery image ${i + 1}`}
                fill
                sizes="(max-width: 1320px) 100vw, 1200px"
                className="gallery-img"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              className="gallery-arrow gallery-arrow-prev"
              onClick={prev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="gallery-arrow gallery-arrow-next"
              onClick={next}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="gallery-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`gallery-dot${i === index ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
