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
    <footer className="bg-[#0E2240] text-white">
      {/* Bande dorée décorative */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Colonne marque */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#C9A84C] flex items-center justify-center">
                <span className="text-[#0E2240] font-black text-base">W</span>
              </div>
              <span className="font-bold text-xl tracking-wide">
                WIN'S <span className="text-[#C9A84C]">AGENCY</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Votre partenaire de confiance pour le personnel événementiel qualifié
              et les formations professionnelles d'excellence.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s}>
                  <Link href="/services"
                    className="text-white/55 hover:text-white text-sm transition-colors duration-200">
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-4">
              Navigation
            </h3>
            <ul className="space-y-2">
              {PAGES.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-white/55 hover:text-white text-sm transition-colors duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center
                        justify-between gap-3 text-xs text-white/35">
          <p>© {new Date().getFullYear()} Win's Agency. Tous droits réservés.</p>
          <p>N'djamena, Tchad</p>
        </div>
      </div>
    </footer>
  );
}
