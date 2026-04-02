'use client';
import IntakeForm from '@/components/IntakeForm';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { useTranslations } from 'next-intl';

export default function ContactPage() {
  const t = useTranslations('Footer');

  return (
    <div className="subpage">
      <Nav />
      <div style={{ paddingTop: '80px' }}>

        {/* Bento stat cards */}
        <div style={{ padding: '0 72px 2px' }}>
          <div className="contact-stats-grid reveal">
            <a
              href="https://www.google.com/maps/search/?api=1&query=41+Marshal+Baghramyan+Ave,+Yerevan,+Armenia"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-stat-link"
            >
              <div className="contact-stat">
                <span className="contact-stat-icon">📍</span>
                <span className="contact-stat-label">Location</span>
                <span className="contact-stat-value">{t('address')}</span>
              </div>
            </a>
            <a href={`mailto:${t('email')}`} className="contact-stat-link">
              <div className="contact-stat">
                <span className="contact-stat-icon">✉️</span>
                <span className="contact-stat-label">Email</span>
                <span className="contact-stat-value">{t('email')}</span>
              </div>
            </a>
            <a href={`tel:${t('phone').replace(/\s+/g, '')}`} className="contact-stat-link">
              <div className="contact-stat">
                <span className="contact-stat-icon">📞</span>
                <span className="contact-stat-label">Phone</span>
                <span className="contact-stat-value">{t('phone')}</span>
              </div>
            </a>
          </div>
        </div>

        <IntakeForm />

        <section className="contact-map-section reveal">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3047.886326848074!2d44.50426547659556!3d40.19159987147743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x406abd190df77279%3A0xc669f987222f7902!2s41%20Marshal%20Baghramyan%20Ave%2C%20Yerevan%2C%20Armenia!5e0!3m2!1sen!2spf!4v1711972000000!5m2!1sen!2spf"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </div>
      <Footer />

    </div>
  );
}
