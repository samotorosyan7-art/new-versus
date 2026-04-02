import Nav from '@/components/Nav';
import { Link } from '@/navigation';
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
      <Link href="/contact" className="float-btn">Begin Consultation</Link>
    </>
  );
}
