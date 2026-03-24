import Philosophy from '@/components/Philosophy';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <main className="subpage">
      <Nav />
      <div style={{ paddingTop: '120px' }}>
        <Philosophy />
      </div>
      <Footer />
    </main>
  );
}
