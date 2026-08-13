import { getTranslations } from 'next-intl/server';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { Link } from '@/navigation';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <main className="subpage">
      <Nav />
      <section className="not-found-content">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">{t('title')}</h1>
        <p className="not-found-desc">{t('description')}</p>
        <Link href="/" className="primary-btn">
          {t('cta')}
        </Link>
      </section>
      <Footer />
    </main>
  );
}
