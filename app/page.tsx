'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PartnerMarquee, { PartenaireItem } from '@/components/ui/PartnerMarquee';
import FaqSection from '@/components/ui/FaqSection';
import { useCms, resolveCmsMediaUrl } from '@/components/cms/CmsProvider';
import api from '@/lib/api';

interface TemoignageItem {
  id?: number;
  nom: string;
  fonction: string;
  entreprise?: string | null;
  texte: string;
  photo?: string | null;
  note?: number;
}

const DEFAULT_TEMOIGNAGES: TemoignageItem[] = [
  {
    nom: 'Marie Remadji',
    fonction: 'Directrice Événements',
    entreprise: '',
    texte: 'Vos filles sont professionnelles, propres et naturelles mais surtout professionnelles. Je vous encourage vivement à continuer dans cette lancée.',
    photo: '/images/services/nounous.jpg',
    note: 5,
  },
  {
    nom: 'Jean-Pierre Mbairasssem',
    fonction: 'Organisateur Conférences',
    entreprise: '',
    texte: 'Bonjour boss! Merci pour le service, tes filles ont assuré. Service impeccable et ponctuel.',
    photo: '/images/team/team-2.jpg',
    note: 5,
  },
  {
    nom: 'Dénémadji Vanessa',
    fonction: 'Responsable Communication',
    entreprise: '',
    texte: "Coucou chérie! Super bien, j'ai aimé. Une équipe dynamique et toujours prête à rendre service.",
    photo: '/images/team/team-3.jpg',
    note: 5,
  },
];

const DEFAULT_PARTENAIRES: PartenaireItem[] = [
  { nom: 'RASMA', logo: '/images/partenaires/partenaire2.png' },
  { nom: 'Partenaire 3', logo: '/images/partenaires/partenaire3.png' },
  { nom: 'Partenaire 4', logo: '/images/partenaires/partenaire4.png' },
  { nom: 'Partenaire 5', logo: '/images/partenaires/partenaire5.png' },
  { nom: 'Partenaire 6', logo: '/images/partenaires/partenaire6.png' },
  { nom: 'Partenaire 7', logo: '/images/partenaires/partenaire7.png' },
  { nom: 'Partenaire 8', logo: '/images/partenaires/partenaire8.png' },
];

export default function HomePage() {
  const { getSectionContent, isSectionActive } = useCms();
  const home = getSectionContent('home_page');

  const [temoignages, setTemoignages] = useState<TemoignageItem[]>(DEFAULT_TEMOIGNAGES);
  const [partenaires, setPartenaires] = useState<PartenaireItem[]>(DEFAULT_PARTENAIRES);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;

    api
      .get('/temoignages')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : null;
        if (isMounted && list) {
          setTemoignages(list);
        }
      })
      .catch(() => {});

    api
      .get('/partenaires')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : null;
        if (isMounted && list) {
          setPartenaires(list);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  if (!isSectionActive('home_page')) {
    return null;
  }

  const hero = home?.hero || {};
  const banner = home?.banner || {};
  const secteursSec = home?.secteurs_section || {};
  const valeursSec = home?.valeurs_section || {};
  const temoignagesSec = home?.temoignages_section || {};
  const partenairesSec = home?.partenaires_section || {};
  const faqPreviewSec = home?.faq_preview_section || {};

  const heroStats = Array.isArray(hero.stats)
    ? hero.stats.filter((s: any) => s.actif !== false)
    : [];
  const secteursItems = Array.isArray(secteursSec.items)
    ? secteursSec.items.filter((s: any) => s.actif !== false)
    : [];
  const valeursItems = Array.isArray(valeursSec.items)
    ? valeursSec.items.filter((v: any) => v.actif !== false)
    : [];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      {hero.actif !== false && (
        <section className="relative min-h-[85vh] flex items-center bg-navy-600 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={resolveCmsMediaUrl(hero.bg_image || '/images/services/hotesses-stewards.jpg')}
              alt="WinStyle"
              fill
              className="object-cover object-top lg:object-top"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-600/90 via-navy-600/75 to-navy-600/50" />
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-navy-400/10 rounded-full blur-3xl animate-float delay-500" />
          </div>

          <div className="relative max-w-7xl mx-auto px-6 lg:px-16 py-20 w-full animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                {hero.badge && (
                  <div
                    className="inline-flex items-center gap-2 bg-gold-400/15 border border-gold-400/30
                               text-gold-400 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
                  >
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                    {hero.badge}
                  </div>
                )}

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-3">
                  {hero.title_prefix || 'Win'}
                  <span className="text-gold-400">{hero.title_highlight || 'Style'}</span>
                </h1>
                {hero.subtitle && (
                  <p className="text-white/90 text-lg sm:text-xl uppercase tracking-widest mb-4">
                    {hero.subtitle}
                  </p>
                )}
                {hero.description && (
                  <p className="text-white/90 text-lg sm:text-xl max-w-xl leading-relaxed mb-6">
                    {hero.description}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  {hero.primary_btn_label && (
                    <Link
                      href={hero.primary_btn_href || '/services'}
                      className="group bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-bold px-8 py-4
                                 rounded-xl text-base transition-all duration-300 hover:shadow-glow
                                 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      {hero.primary_btn_label}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                  {hero.secondary_btn_label && (
                    <Link
                      href={hero.secondary_btn_href || '/contact'}
                      className="glass-dark hover:bg-white/20 text-white font-semibold px-8 py-4
                                 rounded-xl text-base transition-all duration-300 border border-white/20
                                 hover:border-white/40 flex items-center justify-center gap-2"
                    >
                      {hero.secondary_btn_label}
                    </Link>
                  )}
                </div>
              </div>

              <div className="hidden lg:block" />
            </div>

            {heroStats.length > 0 && (
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8 max-w-3xl animate-slide-up delay-200">
                {heroStats.map(({ value, label }: any, idx: number) => (
                  <div key={`${label}-${idx}`} className="text-center lg:text-left">
                    <div className="text-3xl font-black text-gold-400 mb-1">{value}</div>
                    <div className="text-white/80 text-xs uppercase tracking-wider">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>
      )}

      {/* ── BANNIÈRE ÉVÉNEMENT (RASMA 2025) ── */}
      {banner.actif !== false && (
        <section className="py-6 px-6 bg-gradient-to-r from-gold-400 to-gold-500">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-navy-900 font-black text-2xl mb-1">{banner.title}</p>
              <p className="text-navy-900/80 font-medium">{banner.description}</p>
            </div>
            {banner.btn_label && (
              <Link
                href={banner.btn_href || '/about'}
                className="flex-shrink-0 bg-navy-900 hover:bg-navy-700 text-white font-bold px-6 py-3
                           rounded-xl transition-all duration-300 whitespace-nowrap hover:shadow-lg"
              >
                {banner.btn_label}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── NOS SECTEURS D'ACTIVITÉ ── */}
      {secteursSec.actif && secteursItems.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              {secteursSec.subtitle && (
                <p className="text-gold-500 font-semibold text-sm uppercase tracking-widest mb-2">
                  {secteursSec.subtitle}
                </p>
              )}
              <h2 className="text-3xl sm:text-4xl font-black text-navy-700">
                {secteursSec.title || "Trois secteurs d'excellence"}
              </h2>
              {secteursSec.description && (
                <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
                  {secteursSec.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {secteursItems.map((sec: any, idx: number) => (
                <div
                  key={sec.id || idx}
                  className="group card-modern bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-56 bg-navy-700 overflow-hidden">
                    <Image
                      src={resolveCmsMediaUrl(sec.img || '/images/services/hotesses-stewards.jpg')}
                      alt={sec.titre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-navy-900/30 to-transparent" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <span className="text-gold-400 text-xs font-black uppercase tracking-widest">
                        {sec.num} · {sec.sous}
                      </span>
                      <h3 className="text-white font-black text-2xl mt-0.5">{sec.titre}</h3>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">{sec.desc}</p>
                    <Link
                      href={sec.lien || '/services'}
                      className="inline-flex items-center gap-2 text-navy-700 hover:text-gold-500 font-bold text-sm transition-colors"
                    >
                      Découvrir ce pôle <span>→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NOS VALEURS ── */}
      {valeursSec.actif && valeursItems.length > 0 && (
        <section className="py-14 px-6 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10">
              {valeursSec.subtitle && (
                <p className="text-gold-500 font-semibold text-sm uppercase tracking-widest mb-2">
                  {valeursSec.subtitle}
                </p>
              )}
              <h2 className="text-3xl sm:text-4xl font-black text-navy-700">
                {valeursSec.title || 'Pourquoi choisir WinStyle ?'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valeursItems.map((v: any, idx: number) => (
                <div
                  key={v.id || idx}
                  className="card-modern bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-navy-700 text-lg mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TÉMOIGNAGES ── */}
      {temoignagesSec.actif !== false && temoignages.length > 0 && (
        <section className="py-16 px-6 bg-gradient-to-b from-gold-50 via-white to-slate-50 border-t border-gold-200">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">
                {temoignagesSec.subtitle || 'Témoignages'}
              </p>
              <h2 className="text-4xl sm:text-5xl font-black text-navy-700">
                {temoignagesSec.title || 'Ils nous font confiance'}
              </h2>
              {temoignagesSec.description && (
                <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base sm:text-lg">
                  {temoignagesSec.description}
                </p>
              )}
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {temoignages.map((t, i) => {
                const keyId = String(t.id ?? `${t.nom}-${i}`);
                const photoSrc = resolveCmsMediaUrl(t.photo);
                const showPhoto = Boolean(photoSrc) && !failedPhotos[keyId];
                const noteStars = Math.min(5, Math.max(1, Number(t.note) || 5));

                return (
                  <article
                    key={keyId}
                    className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_90px_-20px_rgba(249,208,83,0.2)]"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-gold-100 via-white to-slate-100 opacity-95" />
                    <div className="relative flex items-center gap-4 mb-6">
                      <div className="relative h-20 w-20 flex-shrink-0 rounded-full border-4 border-white bg-slate-100 shadow-lg overflow-hidden">
                        {showPhoto ? (
                          <Image
                            src={photoSrc}
                            alt={t.nom}
                            fill
                            className="object-cover"
                            onError={() =>
                              setFailedPhotos((prev) => ({ ...prev, [keyId]: true }))
                            }
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-navy-600 text-white text-2xl font-bold">
                            {t.nom
                              .split(' ')
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((part) => part[0]?.toUpperCase())
                              .join('')}
                          </div>
                        )}
                      </div>
                      <div className="text-left min-w-0">
                        <h3 className="text-xl font-semibold text-navy-700 truncate">{t.nom}</h3>
                        <p className="text-xs uppercase tracking-[0.18em] text-gold-500 font-semibold">
                          {t.fonction}
                        </p>
                        {t.entreprise && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                            {t.entreprise}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1 mb-5">
                      {[...Array(5)].map((_, star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
                            star < noteStars ? 'text-gold-400' : 'text-gray-200'
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-gray-700 text-base leading-7 italic">“{t.texte}”</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── NOS PARTENAIRES ── */}
      {partenairesSec.actif !== false && partenaires.length > 0 && (
        <section className="py-8 px-6 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto">
            <p className="text-center text-gold-400 font-semibold text-sm uppercase tracking-widest mb-6">
              {partenairesSec.title || 'NOS PARTENAIRES'}
            </p>
            <PartnerMarquee partenaires={partenaires} />
          </div>
        </section>
      )}

      {/* ── APERÇU FAQ SUR L'ACCUEIL ── */}
      {faqPreviewSec.actif !== false && <FaqSection maxItems={4} />}
    </div>
  );
}
