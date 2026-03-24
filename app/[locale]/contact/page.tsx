import IntakeForm from '@/components/IntakeForm';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <main className="subpage">
      <Nav />
      <div style={{ paddingTop: '120px' }}>
        <IntakeForm />
      </div>
      <Footer />
    </main>
  );
}
