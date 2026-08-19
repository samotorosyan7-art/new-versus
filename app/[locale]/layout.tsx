import type { Metadata } from 'next';
import { Source_Serif_4, Source_Sans_3 } from 'next/font/google';
import localFont from 'next/font/local';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import ClientLayout from '@/components/ClientLayout';
import { SITE_URL, SITE_NAME, ogLocale, languageAlternates } from '@/lib/seo';
import '../globals.css';

const sourceSerif = Source_Serif_4({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: 'variable',
  variable: '--font-serif',
  display: 'swap',
});

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  weight: 'variable',
  variable: '--font-sans',
  display: 'swap',
});

const gheaGrapalat = localFont({
  src: [
    { path: '../fonts/GHEAGrapalat-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/GHEAGrapalat-Bold.otf', weight: '700', style: 'normal' },
  ],
  variable: '--font-ghea-grapalat',
  display: 'swap',
});

const newYork = localFont({
  src: [
    { path: '../fonts/NewYork-Regular.otf', weight: '400', style: 'normal' },
  ],
  variable: '--font-new-york',
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
      apple: '/apple-touch-icon.png',
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
    image: `${SITE_URL}/Vache-Simonyan-scaled.png`,
    telephone: '+374 94 363 484',
    email: 'versus.proc@gmail.com',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Marshal Baghramyan Ave 41, 9',
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
    <html lang={locale} className={`${sourceSerif.variable} ${sourceSans.variable} ${gheaGrapalat.variable} ${newYork.variable}`} suppressHydrationWarning>
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
