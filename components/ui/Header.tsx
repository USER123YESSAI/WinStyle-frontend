'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCms, resolveCmsMediaUrl } from '@/components/cms/CmsProvider';

const HERO_PAGES = ['/', '/about', '/services', '/realisations', '/galerie', '/blog'];

export default function Header() {
  const pathname = usePathname();
  const { getSectionContent, isSectionActive } = useCms();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navConfig = getSectionContent('navigation');
  const activeLinks = Array.isArray(navConfig?.links)
    ? [...navConfig.links]
        .filter((l: any) => l.actif !== false)
        .sort((a: any, b: any) => (a.ordre ?? 0) - (b.ordre ?? 0))
    : [];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const check = () => setScrolled(window.scrollY > 20);
    check();
    window.addEventListener('scroll', check);
    return () => window.removeEventListener('scroll', check);
  }, [pathname]);

  if (!pathname) return null;
  if (pathname.startsWith('/admin')) return null;
  if (!isSectionActive('navigation')) return null;

  const hasHero = HERO_PAGES.includes(pathname);
  const isOpaque = !hasHero || scrolled;
  const logoSrc = resolveCmsMediaUrl(navConfig?.logo_url || '/images/logo.png');

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isOpaque ? 'glass-dark shadow-glass py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src={logoSrc}
              alt={navConfig?.logo_alt || 'WinStyle'}
              className="h-14 w-auto transition-all duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {activeLinks.map(({ href, label }: any, idx: number) => {
              const active = pathname === href;
              return (
                <Link
                  key={`${href}-${idx}`}
                  href={href}
                  className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                    active ? 'text-gold-400' : 'text-white/70 hover:text-white'
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
          {navConfig?.cta_visible !== false && (
            <Link
              href={navConfig?.cta_href || '/admin/login'}
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400
                         text-navy-900 font-semibold text-sm px-6 py-3 rounded-xl
                         transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5"
            >
              {navConfig?.cta_label || 'Connexion'}
            </Link>
          )}

          {/* Burger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${
                open ? 'w-6 rotate-45 translate-y-2' : 'w-6'
              }`}
            />
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${
                open ? 'w-0 opacity-0' : 'w-4'
              }`}
            />
            <span
              className={`block h-0.5 bg-white transition-all duration-300 ${
                open ? 'w-6 -rotate-45 -translate-y-2' : 'w-6'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Menu mobile overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-navy-900/98 backdrop-blur-xl flex flex-col justify-center px-8 overflow-y-auto py-20">
          <nav className="flex flex-col gap-2">
            {activeLinks.map(({ href, label }: any, i: number) => {
              const active = pathname === href;
              return (
                <Link
                  key={`${href}-${i}`}
                  href={href}
                  style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
                  className={`text-2xl font-display font-bold py-3.5 border-b border-white/10 transition-all duration-300 ${
                    open ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'
                  } ${active ? 'text-gold-400' : 'text-white hover:text-gold-400'}`}
                >
                  {label}
                </Link>
              );
            })}
            {navConfig?.cta_visible !== false && (
              <Link
                href={navConfig?.cta_href || '/admin/login'}
                className="mt-6 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 font-bold text-center py-4 rounded-2xl text-lg hover:shadow-glow transition-all duration-300"
              >
                {navConfig?.cta_label || 'Connexion'}
              </Link>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
