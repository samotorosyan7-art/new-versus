'use client';
import { useTranslations } from 'next-intl';

export default function Ticker() {
  const t = useTranslations('Ticker');
  const items = t.raw('items') as Array<{ label: string, sub: string }> || [];

  if (items.length === 0) return null;

  // Duplicate for seamless loop
  const allItems = [...items, ...items];

  return (
    <div id="ticker" className="reveal">
      <div className="ticker-track">
        {allItems.map((item, i) => (
          <span key={i} className="ticker-item">
            <strong>{item.label}</strong>
            <span className="ticker-dot"></span>
            {item.sub}
          </span>
        ))}
      </div>
    </div>
  );
}
