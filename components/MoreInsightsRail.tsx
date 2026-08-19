'use client';

import { useRef } from 'react';
import { Link } from '@/navigation';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import type { InsightMeta } from '@/lib/mdx';

interface MoreInsightsRailProps {
  posts: InsightMeta[];
  readMoreLabel: string;
  prevLabel: string;
  nextLabel: string;
}

export default function MoreInsightsRail({
  posts,
  readMoreLabel,
  prevLabel,
  nextLabel,
}: MoreInsightsRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('.more-insights-card');
    const gap = 24;
    const distance = card ? card.getBoundingClientRect().width + gap : 300;
    track.scrollBy({ left: distance * direction, behavior: 'smooth' });
  };

  return (
    <div className="more-insights-rail">
      {posts.length > 1 && (
        <button
          type="button"
          className="more-insights-arrow more-insights-arrow-prev"
          onClick={() => scrollByCard(-1)}
          aria-label={prevLabel}
        >
          ‹
        </button>
      )}

      <div className="more-insights-track" ref={trackRef}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/cases/${post.slug}`}
            className="more-insights-card"
          >
            <div className="more-insights-card-media">
              <ImagePlaceholder src={post.image} alt={post.title} sizes="300px" />
            </div>
            <div className="more-insights-card-body">
              <h3 className="more-insights-card-title">{post.title}</h3>
              {post.excerpt && (
                <p className="more-insights-card-excerpt">{post.excerpt}</p>
              )}
              <span className="more-insights-card-cta">
                {readMoreLabel}
                <span className="more-insights-card-arrow" aria-hidden="true">
                  →
                </span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {posts.length > 1 && (
        <button
          type="button"
          className="more-insights-arrow more-insights-arrow-next"
          onClick={() => scrollByCard(1)}
          aria-label={nextLabel}
        >
          ›
        </button>
      )}
    </div>
  );
}
