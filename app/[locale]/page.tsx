import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Protocol from '@/components/Protocol';
import Services from '@/components/Services';
import Ticker from '@/components/Ticker';
import IntakeForm from '@/components/IntakeForm';
import BlogGrid from '@/components/BlogGrid';
import Footer from '@/components/Footer';

export default async function Home({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Protocol />
        <Services />
        <Ticker />
        <IntakeForm />
        <BlogGrid locale={locale} />
      </main>
      <Footer />
      <a href="/contact" className="float-btn">Begin Consultation</a>
    </>
  );
}
