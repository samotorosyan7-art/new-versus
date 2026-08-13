import Image from 'next/image';

interface ImagePlaceholderProps {
  /** Real image source. Omit to render the placeholder panel. */
  src?: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Shared media panel for editorial "left/right" layouts.
 * Renders a real image when `src` is provided; otherwise renders an
 * on-brand placeholder panel that can be swapped for a real photo later.
 */
export default function ImagePlaceholder({
  src,
  alt,
  priority,
  sizes = '(max-width: 900px) 100vw, 460px',
  className,
}: ImagePlaceholderProps) {
  return (
    <div className={`media-frame${className ? ` ${className}` : ''}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="media-frame-img"
          priority={priority}
        />
      ) : (
        <div className="media-frame-placeholder" role="img" aria-label={alt}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="media-frame-mark"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
        </div>
      )}
    </div>
  );
}
