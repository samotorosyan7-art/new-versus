import Services from '@/components/Services';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function PracticeAreasPage() {
  return (
    <main className="subpage">
      <Nav />
      <div style={{ paddingTop: '120px' }}>
        <Services />
      </div>
      <Footer />
    </main>
  );
}
