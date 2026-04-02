import Nav from '@/components/Nav';
import BlogGrid from '@/components/BlogGrid';
import Footer from '@/components/Footer';

export default async function InsightsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="subpage">
      <Nav />
      <div style={{ paddingTop: '40px' }}>
        <BlogGrid locale={locale} />
      </div>
      <Footer />
    </div>
  );
}
