'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/',            label: 'Accueil' },
  { href: '/about',       label: 'À propos' },
  { href: '/services',    label: 'Services' },
  { href: '/formations',  label: 'Formations' },
  { href: '/candidature', label: 'Candidature' },
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

  if (pathname.startsWith('/admin')) return null;

  // Sombre si page sans hero OU si scrollé
  const hasHero  = HERO_PAGES.includes(pathname);
  const isOpaque = !hasHero || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isOpaque
            ? 'bg-[#0E2240] shadow-lg shadow-black/20 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative w-24 h-24 rounded-3xl bg-transparent flex items-center justify-center overflow-hidden transition-all duration-200 group-hover:scale-105">
              <img
                src="/images/logo.png"
                alt="WinStyle Logo"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextElementSibling) {
                    (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                  }
                }}
              />
              <div className="absolute inset-0 w-full h-full rounded-3xl bg-[#C9A84C] flex items-center justify-center hidden">
                <span className="text-[#0E2240] font-black text-xl">W</span>
              </div>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[#C9A84C] text-[#0E2240]'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* CTA desktop */}
          <Link
            href="/admin/login"
            className="hidden md:flex items-center gap-2 bg-[#C9A84C] hover:bg-[#e0b954]
                       text-[#0E2240] font-semibold text-sm px-5 py-2.5 rounded-lg
                       transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A84C]/30
                       hover:-translate-y-0.5"
          >
            Espace Win
          </Link>

          {/* Burger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Menu"
          >
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-6 rotate-45 translate-y-2' : 'w-6'}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} />
            <span className={`block h-0.5 bg-white transition-all duration-300 ${open ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'}`} />
          </button>
        </div>
      </header>

      {/* Menu mobile overlay */}
      <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-[#0E2240]/98 backdrop-blur-md flex flex-col justify-center px-8">
          <nav className="flex flex-col gap-2">
            {LINKS.map(({ href, label }, i) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                  className={`text-2xl font-bold py-3 border-b border-white/10 transition-all duration-300 ${
                    open ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  } ${active ? 'text-[#C9A84C]' : 'text-white'}`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/admin/login"
              className="mt-6 bg-[#C9A84C] text-[#0E2240] font-bold text-center py-4 rounded-xl text-lg"
            >
              Espace Win
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

