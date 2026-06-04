'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/',            label: 'Accueil' },
  { href: '/about',       label: 'À propos' },
  { href: '/services',    label: 'Services' },
  { href: '/formations',  label: 'Formations' },
  { href: '/realisations',     label: 'Réalisations' },
  { href: '/contact',     label: 'Contact' },
];

// Pages qui ont un hero sombre → header peut être transparent en haut
const HERO_PAGES = ['/', '/about', '/services'];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 20);
    check(); // état initial à chaque changement de page
    window.addEventListener('scroll', check);
    return () => window.removeEventListener('scroll', check);
  }, [pathname]);
  if (!pathname) return null;
  if (pathname.startsWith('/admin')) return null;

  // Sombre si page sans hero OU si scrollé
  const hasHero  = HERO_PAGES.includes(pathname);
  const isOpaque = !hasHero || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isOpaque
            ? 'glass-dark shadow-glass py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/images/logo.png"
              alt="WinStyle"
              className="h-14 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                    active
                      ? 'text-gold-400'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {label}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gold-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA desktop */}
          <Link
            href="/admin/login"
            className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400
                       text-navy-900 font-semibold text-sm px-6 py-3 rounded-xl
                       transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
          >
            Connexion
          </Link>

          {/* Burger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
          </button>
        </div>
      </header>

      {/* Menu mobile overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-navy-900/98 backdrop-blur-xl flex flex-col justify-center px-8">
          <nav className="flex flex-col gap-2">
            {LINKS.map(({ href, label }, i) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                  className={`text-2xl font-display font-bold py-4 border-b border-white/10 transition-all duration-300 ${
                    open ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  } ${active ? 'text-gold-400' : 'text-white hover:text-gold-400'}`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="mt-8 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 font-bold text-center py-4 rounded-2xl text-lg hover:shadow-glow transition-all duration-300"
            >
              Connexion
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

