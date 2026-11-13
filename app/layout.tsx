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

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://winstyle-agency.vercel.app').replace(/\/$/, '');

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    'agence événementielle Tchad',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "WinStyle — Win's Agency | Excellence · Style · Service",
    description:
      "Agence de placement événementiel, confection sur mesure et cosmétique naturelle basée à N'Djaména, Tchad.",
    url: SITE_URL,
    siteName: "WinStyle — Win's Agency",
    images: [
      {
        url: '/images/services/hotesses-stewards.jpg',
        width: 1200,
        height: 630,
        alt: "WinStyle — Win's Agency à N'Djaména, Tchad",
      },
    ],
    locale: 'fr_TD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "WinStyle — Win's Agency | Excellence · Style · Service",
    description:
      "Agence de placement événementiel, confection sur mesure et cosmétique naturelle à N'Djaména, Tchad.",
    images: ['/images/services/hotesses-stewards.jpg'],
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
  }),
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "WinStyle — Win's Agency",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
  email: 'winstylewins@gmail.com',
  telephone: '+23565096024',
  address: {
    '@type': 'PostalAddress',
    addressLocality: "N'Djaména",
    addressCountry: 'TD',
  },
  description:
    "Entreprise tchadienne opérant dans l'agence de placement événementiel, la confection sur mesure (#WinstyleFashion), la cosmétique naturelle au chébé et les formations professionnelles.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CmsProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CmsProvider>
      </body>
    </html>
  );
}
