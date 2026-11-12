import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import { CmsProvider } from '@/components/cms/CmsProvider';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "WinStyle — Win's Agency | Personnel événementiel, Mode & Cosmétique à N'Djaména",
    template: "%s | WinStyle — Win's Agency",
  },
  description:
    "WinStyle (Win's Agency) à N'Djaména, Tchad : agence de placement (hôtesses, stewards, personnel domestique), confection sur mesure (#WinstyleFashion), cosmétique naturelle au chébé et formations professionnelles.",
  keywords: [
    'WinStyle',
    "Win's Agency",
    "N'Djaména",
    'Tchad',
    'hôtesses événementiel Tchad',
    'RASMA',
    'confection sur mesure',
    'cosmétique chébé',
    'formation professionnelle Tchad',
  ],
  openGraph: {
    title: "WinStyle — Win's Agency | Excellence · Style · Service",
    description:
      "Agence de placement événementiel, confection sur mesure et cosmétique naturelle basée à N'Djaména, Tchad.",
    locale: 'fr_TD',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <CmsProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CmsProvider>
      </body>
    </html>
  );
}
