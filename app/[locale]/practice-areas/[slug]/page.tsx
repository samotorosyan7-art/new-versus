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

        <section className="practice-grid">
          <div className="practice-main">
            <div className="practice-block reveal">
              <h2 className="block-label">The Conflict</h2>
              <p className="block-text">{t('conflict')}</p>
            </div>

            <div className="practice-block reveal reveal-delay-1">
              <h2 className="block-label">The Versus Approach</h2>
              <p className="block-text highlight">{t('versus')}</p>
            </div>

            <div className="practice-block reveal reveal-delay-2">
              <h2 className="block-label">Strategic FAQ</h2>
              <div className="faq-list">
                {/* next-intl raw for arrays of objects */}
                {(t.raw('faq') as Array<{q: string, a: string}>).map((item, i) => (
                  <div key={i} className="faq-item">
                    <h3 className="faq-q">{item.q}</h3>
                    <p className="faq-a">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="practice-sidebar reveal reveal-delay-3">
            <div className="sidebar-box">
              <h2 className="block-label">Sub-Specialties</h2>
              <ul className="specialties-list">
                {(t.raw('specialties') as string[]).map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
            
            <Link href="/contact" className="sidebar-cta">
              Request Strategic Briefing
            </Link>
          </aside>
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
        .practice-grid {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 100px;
        }
        .practice-block {
          margin-bottom: 80px;
        }
        .block-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--accent);
          margin-bottom: 24px;
        }
        .block-text {
          font-size: 1.25rem;
          line-height: 1.6;
          color: var(--text-muted);
        }
        .block-text.highlight {
          font-family: var(--font-playfair), serif;
          font-size: 2rem;
          font-style: italic;
          color: var(--text);
        }
        .faq-list {
          margin-top: 32px;
        }
        .faq-item {
          margin-bottom: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid var(--border);
        }
        .faq-item:last-child { border: none; }
        .faq-q {
          font-family: var(--font-playfair), serif;
          font-size: 1.4rem;
          margin-bottom: 12px;
          color: var(--text);
        }
        .faq-a {
          font-size: 15px;
          line-height: 1.7;
          color: var(--text-muted);
        }
        .sidebar-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 40px;
          margin-bottom: 40px;
        }
        .specialties-list {
          list-style: none;
          padding: 0;
        }
        .specialties-list li {
          font-size: 15px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border);
          color: var(--text-muted);
        }
        .specialties-list li:last-child { border: none; }
        .sidebar-cta {
          display: block;
          background: var(--accent);
          color: #FFFFFF;
          text-align: center;
          padding: 20px;
          border-radius: var(--radius-md);
          font-weight: 600;
          text-decoration: none;
          transition: background 0.3s, transform 0.3s;
        }
        .sidebar-cta:hover { background: var(--accent-hover); transform: translateY(-3px); }

        @media (max-width: 1024px) {
          .practice-grid { grid-template-columns: 1fr; gap: 48px; }
          .practice-detail-container { padding: 48px 40px 60px; }
          .practice-title { font-size: 2.8rem; }
        }
        @media (max-width: 640px) {
          .practice-detail-container { padding: 40px 20px 48px; }
          .practice-title { font-size: 2rem; }
          .block-text { font-size: 1rem; }
          .block-text.highlight { font-size: 1.5rem; }
          .faq-q { font-size: 1.2rem; }
          .sidebar-box { padding: 28px 24px; }
        }
      `}</style>
    </main>
  );
}
