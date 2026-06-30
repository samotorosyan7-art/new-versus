'use client';
import { useTranslations, useMessages } from 'next-intl';
import { useParams, notFound } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Link } from '@/navigation';

export default function PracticeAreaDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const messages = useMessages() as { PracticeAreas?: Record<string, unknown> };
  const t = useTranslations(`PracticeAreas.${slug}`);
  const common = useTranslations('Services');

  // next-intl throws if we read a missing namespace, so 404 on unknown slugs.
  if (!messages?.PracticeAreas?.[slug]) {
    notFound();
  }

  return (
    <main className="subpage">
      <Nav />
      <div className="practice-detail-container">
        <header className="practice-header reveal">
          <Link href="/practice-areas" className="back-link">← {common('label')}</Link>
          <h1 className="practice-title">{t('title')}</h1>
        </header>

        <section className="practice-rows">
          {(t.raw('rows') as string[]).map((row, i) => (
            <p
              key={i}
              className={`practice-row reveal${i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : ''}`}
            >
              {row}
            </p>
          ))}
        </section>
      </div>
      <Footer />

      <style jsx>{`
        .practice-detail-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 72px 100px;
        }
        .back-link {
          display: block;
          margin-bottom: 24px;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          text-decoration: none;
        }
        .practice-title {
          font-family: var(--font-playfair), serif;
          font-size: 4rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 60px;
          color: var(--text);
        }
        .practice-rows {
          max-width: 820px;
        }
        .practice-row {
          font-size: 1.35rem;
          line-height: 1.7;
          color: var(--text-muted);
          padding: 32px 0;
          border-bottom: 1px solid var(--border);
        }
        .practice-row:first-child { padding-top: 0; }
        .practice-cta {
          display: inline-block;
          margin-top: 56px;
          background: var(--accent);
          color: #FFFFFF;
          text-align: center;
          padding: 18px 40px;
          border-radius: var(--radius-md);
          font-weight: 600;
          text-decoration: none;
          transition: background 0.3s, transform 0.3s;
        }
        .practice-cta:hover { background: var(--accent-hover); transform: translateY(-3px); }

        @media (max-width: 1024px) {
          .practice-detail-container { padding: 48px 40px 60px; }
          .practice-title { font-size: 2.8rem; }
        }
        @media (max-width: 640px) {
          .practice-detail-container { padding: 40px 20px 48px; }
          .practice-title { font-size: 2rem; }
          .practice-row { font-size: 1.1rem; padding: 24px 0; }
        }
      `}</style>
    </main>
  );
}
