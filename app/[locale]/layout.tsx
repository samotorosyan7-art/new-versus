import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import ClientLayout from '@/components/ClientLayout';
import { SITE_URL, SITE_NAME, ogLocale, languageAlternates } from '@/lib/seo';
import '../globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Meta' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t('home.title'),
      template: `%s · ${t('siteName')}`,
    },
    description: t('home.description'),
    applicationName: SITE_NAME,
    keywords: t('keywords').split(',').map((k) => k.trim()),
    authors: [{ name: 'Vache Simonyan' }],
    creator: 'Vache Simonyan',
    publisher: SITE_NAME,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates('/'),
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon.ico',
      apple: '/logo.png',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: t('home.title'),
      description: t('home.description'),
      url: `${SITE_URL}/${locale}`,
      locale: ogLocale(locale),
      images: [{ url: '/logo.png', width: 1280, height: 720, alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('home.title'),
      description: t('home.description'),
      images: ['/logo.png'],
    },
  };
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'Meta' });

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: 'Versus — Founded by Vache Simonyan',
    description: t('home.description'),
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/Vache-Simonyan-scaled.jpg`,
    telephone: '+374 94 363 484',
    email: 'versus.proc@gmail.com',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Marshal Baghramyan Ave 41, apt. 9',
      addressLocality: 'Yerevan',
      addressCountry: 'AM',
    },
    areaServed: ['Armenia', 'CIS', 'International'],
    knowsLanguage: ['hy', 'ru', 'en'],
    founder: {
      '@type': 'Person',
      name: 'Vache Simonyan',
      jobTitle: 'Attorney at Law',
      url: `${SITE_URL}/${locale}/about`,
    },
  };

  return (
    <html lang={locale} className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
