import Archive from '@/components/Archive';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function InsightsPage() {
  return (
    <main className="subpage">
      <Nav />
      <div style={{ paddingTop: '120px' }}>
        <Archive />
      </div>
      <Footer />
    </main>
  );
}
