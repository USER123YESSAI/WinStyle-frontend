import type { Metadata } from 'next';
import './globals.css';

import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: "Win's Agency — Personnel événementiel & Formations",
  description:
    "Win's Agency, votre partenaire pour des hôtesses, stewards, serveurs et nounous qualifiés. Formations professionnelles à Dakar.",
};

// Note: RootLayout est un Server Component par défaut.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>

        {/*
          Retire le footer uniquement sur les pages admin.
          (dashboard, login, etc.)
        */}
        {/** Footer supprimé pour le dashboard/admin (pages /admin/*) **/}
        {/* eslint-disable-next-line react/jsx-no-undef */}
        {null /* Footer volontairement retiré ici */}
      </body>
    </html>
  );
}

