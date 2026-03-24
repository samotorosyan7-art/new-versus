import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, DM_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import ClientLayout from '@/components/ClientLayout';
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

export const metadata: Metadata = {
  title: 'Vache Simonyan — Attorney at Law',
  description:
    'Uncompromising advocacy at the intersection of business law, litigation, and strategic advisory. Where your adversary meets their match.',
  keywords: ['attorney', 'lawyer', 'Armenia', 'Yerevan', 'litigation', 'corporate', 'Vache Simonyan'],
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
