'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCms } from '@/components/cms/CmsProvider';

export default function Footer() {
  const pathname = usePathname();
  const { getSectionContent, isSectionActive } = useCms();

  if (pathname?.startsWith('/admin')) return null;
  if (!isSectionActive('footer')) return null;

  const footer = getSectionContent('footer');
  const contact = getSectionContent('contact_info');

  const servicesLinks = Array.isArray(footer?.services_links)
    ? footer.services_links.filter((s: any) => s.actif !== false)
    : [];

  const navLinks = Array.isArray(footer?.nav_links)
    ? footer.nav_links.filter((l: any) => l.actif !== false)
    : [];

  const socials = contact?.socials || {};

  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
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
                <span className="text-navy-900 font-black text-xl">
                  {footer?.badge_letter || 'W'}
                </span>
              </div>
              <span className="font-display font-bold text-2xl tracking-wide">
                {footer?.brand_prefix || "WIN'S"}{' '}
                <span className="text-gold-400">{footer?.brand_highlight || 'AGENCY'}</span>
              </span>
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-md mb-6">
              {footer?.description}
            </p>
            <div className="space-y-2 text-sm text-white/60 mb-6">
              {contact?.phone_primary && (
                <p>
                  📞{' '}
                  <a href={`tel:${contact.phone_primary}`} className="hover:text-gold-400 transition">
                    {contact.phone_primary}
                  </a>
                  {contact?.phone_secondary ? ` / ${contact.phone_secondary}` : ''}
                </p>
              )}
              {contact?.email_primary && (
                <p>
                  ✉️{' '}
                  <a href={`mailto:${contact.email_primary}`} className="hover:text-gold-400 transition">
                    {contact.email_primary}
                  </a>
                </p>
              )}
              {contact?.address && <p>📍 {contact.address}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {footer?.availability_text && (
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  <span>{footer.availability_text}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                {socials.facebook && (
                  <a
                    href={socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold-400 hover:text-navy-900 text-xs text-white/70 transition"
                  >
                    Facebook
                  </a>
                )}
                {socials.instagram && (
                  <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold-400 hover:text-navy-900 text-xs text-white/70 transition"
                  >
                    Instagram
                  </a>
                )}
                {socials.linkedin && (
                  <a
                    href={socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold-400 hover:text-navy-900 text-xs text-white/70 transition"
                  >
                    LinkedIn
                  </a>
                )}
                {socials.tiktok && (
                  <a
                    href={socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold-400 hover:text-navy-900 text-xs text-white/70 transition"
                  >
                    TikTok
                  </a>
                )}
                {socials.youtube && (
                  <a
                    href={socials.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-gold-400 hover:text-navy-900 text-xs text-white/70 transition"
                  >
                    YouTube
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-6">
              {footer?.services_title || 'Services'}
            </h3>
            <ul className="space-y-3">
              {servicesLinks.map((s: any, idx: number) => (
                <li key={`${s.label}-${idx}`}>
                  <Link
                    href={s.href || '/services'}
                    className="text-white/60 hover:text-gold-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-gold-400 transition-colors" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-6">
              {footer?.nav_title || 'Navigation'}
            </h3>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }: any, idx: number) => (
                <li key={`${href}-${idx}`}>
                  <Link
                    href={href || '/'}
                    className="text-white/60 hover:text-gold-400 text-sm transition-all duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-gold-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center
                     justify-between gap-4 text-sm text-white/40"
        >
          <p>
            © {new Date().getFullYear()} {footer?.copyright_text || "Win's Agency. Tous droits réservés."}
          </p>
          <div className="flex items-center gap-6">
            <span>{footer?.location_text || "N'Djaména, Tchad"}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-gold-400/60">
              {footer?.slogan_text || 'Excellence · Style · Service'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
