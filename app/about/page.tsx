'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCms, resolveCmsMediaUrl } from '@/components/cms/CmsProvider';

export default function AboutPage() {
  const { getSectionContent, isSectionActive } = useCms();

  if (!isSectionActive('about_page')) {
    return null;
  }

  const about = getSectionContent('about_page');
  const servicesCat = getSectionContent('services_catalogue');

  const hero = about?.hero || {};
  const separator = about?.separator || {};
  const mission = about?.mission || {};
  const valeurs = about?.valeurs || {};
  const timeline = about?.timeline || {};
  const equipe = about?.equipe || {};
  const cta = about?.cta || {};

  const secteurs = Array.isArray(servicesCat?.secteurs)
    ? servicesCat.secteurs.filter((s: any) => s.actif !== false)
    : [];

  const valeursItems = Array.isArray(valeurs.items)
    ? valeurs.items.filter((v: any) => v.actif !== false)
    : [];

  const timelineItems = Array.isArray(timeline.items)
    ? timeline.items.filter((t: any) => t.actif !== false)
    : [];

  const fondatrice = equipe.fondatrice || {};
  const membres = Array.isArray(equipe.membres)
    ? equipe.membres.filter((m: any) => m.actif !== false)
    : [];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO RASMA ── */}
      {hero.actif !== false && (
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={resolveCmsMediaUrl(hero.bg_image || '/images/rasma/rasma1-hero.jpg')}
              alt="RASMA 2025"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-600/80 via-navy-600/70 to-navy-600/90" />
          </div>
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-navy-400/10 rounded-full blur-3xl animate-float delay-500" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6 py-20 text-center animate-fade-in">
            {hero.badge && (
              <div
                className="inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/40
                           text-gold-400 text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-widest"
              >
                {hero.badge}
              </div>
            )}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none mb-3">
              {hero.title_prefix || 'Ra'}
              <span className="text-gold-400">{hero.title_highlight || 'SMA'}</span>
            </h1>
            {hero.subtitle && (
              <p className="text-white/60 text-base sm:text-lg uppercase tracking-[0.2em] mb-6">
                {hero.subtitle}
              </p>
            )}
            {hero.mission_text && (
              <div className="max-w-2xl mx-auto glass-dark rounded-2xl px-8 py-6 mb-8">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-2xl">🌍</span>
                  <h2 className="text-gold-400 font-bold text-lg uppercase tracking-widest">
                    {hero.mission_title || 'Mission Principale'}
                  </h2>
                </div>
                <p className="text-white/80 text-base leading-relaxed">{hero.mission_text}</p>
              </div>
            )}
            {(hero.focus_label || hero.focus_value) && (
              <div className="inline-flex items-center gap-3 bg-gold-400/15 border border-gold-400/30 rounded-full px-6 py-3 mb-8">
                <span className="text-gold-400 text-sm font-semibold">{hero.focus_label}</span>
                <span className="text-white/80 text-sm">{hero.focus_value}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {hero.primary_btn_label && (
                <Link
                  href={hero.primary_btn_href || '/contact'}
                  className="group bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-bold px-8 py-4
                             rounded-xl text-base transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {hero.primary_btn_label}{' '}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              )}
              {hero.secondary_btn_label && (
                <a
                  href={hero.secondary_btn_href || '#winstyle'}
                  className="glass hover:bg-white/20 text-white font-semibold px-8 py-4
                             rounded-xl text-base transition-all duration-300 border border-white/20 flex items-center justify-center"
                >
                  {hero.secondary_btn_label}
                </a>
              )}
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </section>
      )}

      {/* Séparateur WinStyle */}
      {separator.actif !== false && (
        <div id="winstyle" className="bg-navy-600 py-6 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-white font-black text-2xl">{separator.title}</p>
            <p className="text-white/70 mt-1">{separator.subtitle}</p>
          </div>
        </div>
      )}

      {/* Mission */}
      {mission.actif !== false && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
                {mission.subtitle || 'Notre mission'}
              </p>
              <h2 className="text-4xl font-black text-navy-600 mb-5 leading-tight">
                {mission.title}
              </h2>
              {Array.isArray(mission.paragraphs) &&
                mission.paragraphs.map((p: string, idx: number) => (
                  <p key={idx} className="text-gray-500 leading-relaxed mb-4">
                    {p}
                  </p>
                ))}
              {mission.btn_label && (
                <Link
                  href={mission.btn_href || '/contact'}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:shadow-glow mt-2"
                >
                  {mission.btn_label}
                </Link>
              )}
            </div>
            {Array.isArray(mission.stats) && mission.stats.length > 0 && (
              <div className="grid grid-cols-2 gap-4 animate-slide-up delay-100">
                {mission.stats.map(({ v, l, sub }: any, idx: number) => (
                  <div
                    key={`${l}-${idx}`}
                    className="card-modern bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <div className="text-4xl font-black text-gold-400 mb-1">{v}</div>
                    <div className="text-navy-600 font-bold text-sm mb-1">{l}</div>
                    <div className="text-gray-400 text-xs">{sub}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3 Secteurs */}
      {secteurs.length > 0 && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
                Ce que nous faisons
              </p>
              <h2 className="text-4xl font-black text-navy-600">Nos domaines d'activité</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {secteurs.map((s: any, i: number) => {
                const subItems = Array.isArray(s.services)
                  ? s.services.filter((srv: any) => srv.actif !== false)
                  : [];
                return (
                  <div
                    key={s.id || s.titre || i}
                    style={{ animationDelay: `${i * 100}ms` }}
                    className="card-modern bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{s.icon}</span>
                      <div>
                        <span className="text-gold-400 text-xs font-black">{s.num}</span>
                        <h3 className="font-black text-navy-600 text-lg leading-tight">
                          {s.titre}
                        </h3>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {subItems.map((item: any, idx: number) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-gray-500"
                        >
                          <span className="text-gold-400 mt-0.5 flex-shrink-0">•</span>
                          <span>
                            <strong className="text-navy-700 font-medium">{item.label}</strong>
                            {item.desc ? ` — ${item.desc}` : ''}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Valeurs */}
      {valeurs.actif !== false && valeursItems.length > 0 && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
                {valeurs.subtitle || 'Ce qui nous guide'}
              </p>
              <h2 className="text-4xl font-black text-navy-600">
                {valeurs.title || 'Nos valeurs'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {valeursItems.map((v: any, i: number) => (
                <div
                  key={`${v.titre}-${i}`}
                  style={{ animationDelay: `${i * 100}ms` }}
                  className="card-modern bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                >
                  <div className="text-4xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-navy-600 text-lg mb-2">{v.titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline.actif !== false && timelineItems.length > 0 && (
        <section className="py-16 px-6 bg-navy-600">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
                {timeline.subtitle || 'Notre parcours'}
              </p>
              <h2 className="text-4xl font-black text-white">
                {timeline.title || 'WinStyle en dates'}
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-400/30 hidden sm:block" />
              <div className="space-y-6">
                {timelineItems.map((item: any, i: number) => {
                  const isHighlight = item.highlight || item.annee === '2025';
                  return (
                    <div
                      key={`${item.annee}-${i}`}
                      style={{ animationDelay: `${i * 100}ms` }}
                      className="flex gap-6 sm:gap-10 items-start animate-slide-up"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center z-10">
                          <span className="text-gold-400 font-black text-xs">{item.annee}</span>
                        </div>
                      </div>
                      <div
                        className={`rounded-xl p-5 flex-1 ${
                          isHighlight
                            ? 'bg-gold-400/15 border border-gold-400/30'
                            : 'bg-white/5 border border-white/10'
                        }`}
                      >
                        <h3
                          className={`font-bold mb-1 ${
                            isHighlight ? 'text-gold-400' : 'text-white'
                          }`}
                        >
                          {isHighlight && '🏆 '}
                          {item.titre}
                        </h3>
                        <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ÉQUIPE */}
      {equipe.actif !== false && (
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
                {equipe.subtitle || 'Notre équipe'}
              </p>
              <h2 className="text-4xl font-black text-navy-600">
                {equipe.title || 'Les personnes derrière WinStyle'}
              </h2>
              {equipe.description && (
                <p className="text-gray-500 mt-4 max-w-xl mx-auto">{equipe.description}</p>
              )}
            </div>

            {/* Fondatrice */}
            {fondatrice.nom && (
              <div className="card-modern bg-white rounded-3xl overflow-hidden border border-gray-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative h-80 md:h-auto min-h-[350px] bg-navy-600 overflow-hidden">
                    <img
                      src={resolveCmsMediaUrl(fondatrice.photo || '/images/team/fondatrice.jpg')}
                      alt={fondatrice.nom}
                      className="w-full h-full object-cover object-center"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-600 to-navy-700 flex flex-col items-center justify-center -z-10">
                      <div className="w-28 h-28 rounded-full bg-gold-400/20 border-4 border-gold-400/40 flex items-center justify-center mb-3">
                        <span className="text-gold-400 font-black text-5xl">
                          {fondatrice.nom?.[0] || 'W'}
                        </span>
                      </div>
                    </div>
                    {fondatrice.badge_photo && (
                      <div className="absolute bottom-4 left-4">
                        <span className="bg-gold-400 text-navy-900 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                          {fondatrice.badge_photo}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-2">
                      {fondatrice.badge || 'Fondatrice'}
                    </p>
                    <h3 className="text-3xl font-black text-navy-600 mb-2">{fondatrice.nom}</h3>
                    <p className="text-gold-400 font-semibold text-sm mb-4">{fondatrice.role}</p>
                    {fondatrice.bio_1 && (
                      <p className="text-gray-500 leading-relaxed mb-4">{fondatrice.bio_1}</p>
                    )}
                    {fondatrice.bio_2 && (
                      <p className="text-gray-500 leading-relaxed mb-5">{fondatrice.bio_2}</p>
                    )}
                    {Array.isArray(fondatrice.contacts) && (
                      <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                        {fondatrice.contacts.map((c: string, idx: number) => (
                          <span key={idx}>{c}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Membres */}
            {membres.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {membres.map((membre: any, i: number) => (
                  <div
                    key={membre.id || membre.nom || i}
                    style={{ animationDelay: `${(i + 1) * 100}ms` }}
                    className="card-modern bg-white rounded-3xl overflow-hidden border border-gray-100
                               hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col animate-slide-up"
                  >
                    <div className="relative h-64 bg-navy-600 overflow-hidden">
                      <img
                        src={resolveCmsMediaUrl(membre.photo)}
                        alt={membre.nom}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-navy-600 to-navy-700 flex flex-col items-center justify-center -z-10">
                        <div className="w-20 h-20 rounded-full bg-gold-400/20 border-3 border-gold-400/40 flex items-center justify-center mb-2">
                          <span className="text-gold-400 font-black text-3xl">
                            {membre.initiale || membre.nom?.[0] || 'M'}
                          </span>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-gold-400 text-navy-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {(membre.role || '').replace('Responsable ', '')}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="font-black text-navy-600 text-lg mb-1">{membre.nom}</h4>
                      <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">
                        {membre.role}
                      </p>
                      <p className="text-gray-500 text-sm leading-relaxed flex-1">{membre.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      {cta.actif !== false && (
        <section className="py-16 px-6 bg-gradient-to-r from-gold-400 to-gold-500">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">{cta.title}</h2>
            <p className="text-navy-900/70 mb-6 text-lg">{cta.description}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {cta.primary_btn_label && (
                <Link
                  href={cta.primary_btn_href || '/candidature'}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-glow"
                >
                  {cta.primary_btn_label}
                </Link>
              )}
              {cta.secondary_btn_label && (
                <Link
                  href={cta.secondary_btn_href || '/contact'}
                  className="bg-white hover:bg-gray-50 text-navy-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-md"
                >
                  {cta.secondary_btn_label}
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
