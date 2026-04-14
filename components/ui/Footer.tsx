import Link from 'next/link';

const SERVICES = ['Hôtesses & Stewards', 'Événementiel', 'Nounous', 'Serveurs'];
const PAGES    = [
  { href: '/',            label: 'Accueil' },
  { href: '/about',       label: 'À propos' },
  { href: '/formations',  label: 'Formations' },
  { href: '/candidature', label: 'Candidature' },
  { href: '/contact',     label: 'Contact' },
];

export default function Footer() {
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
            {/* WhatsApp */}
            <a
              href="https://wa.me/221XXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20
                         border border-green-500/30 text-green-400 px-4 py-2.5 rounded-lg text-sm
                         font-medium transition-all duration-200 group"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.428a.75.75 0 00.916.916l5.566-1.476A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 01-4.964-1.36l-.355-.212-3.683.976.976-3.567-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
              </svg>
              WhatsApp
            </a>
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
