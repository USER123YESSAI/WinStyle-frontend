 'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SERVICES = ['consultante en ressources humaine','Confection sur Mesure','Cosmétique Naturelle'];
const PAGES    = [
  { href: '/',            label: 'Accueil' },
  { href: '/about',       label: 'À propos' },
  { href: '/formations',  label: 'Formations' },
  { href: '/candidature', label: 'Candidature' },
  { href: '/contact',     label: 'Contact' },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/admin/login') return null;

  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-400 rounded-full blur-3xl" />
      </div>

      {/* Bande dorée décorative */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Colonne marque */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shadow-glow">
                <span className="text-navy-900 font-black text-xl">W</span>
              </div>
              <span className="font-display font-bold text-2xl tracking-wide">
                WIN'S <span className="text-gold-400">AGENCY</span>
              </span>
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-md mb-6">
              Votre partenaire de confiance pour le personnel événementiel qualifié
              et les formations professionnelles d'excellence à N'Djaména, Tchad.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-white/50 text-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <span>Disponible 7j/7</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link href="/services"
                    className="text-white/60 hover:text-white hover:text-gold-400 text-sm transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-gold-400 transition-colors" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-6">
              Navigation
            </h3>
            <ul className="space-y-3">
              {PAGES.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-white/60 hover:text-white hover:text-gold-400 text-sm transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-gold-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center
                        justify-between gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} Win's Agency. Tous droits réservés.</p>
          <div className="flex items-center gap-6">
            <span>N'Djaména, Tchad</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-gold-400/60">Excellence · Style · Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
