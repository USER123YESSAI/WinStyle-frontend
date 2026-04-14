import Link from 'next/link';
import Image from 'next/image';

const SECTEURS = [
  {
    num: '01',
    titre: 'Agence de Placement',
    sous: 'Événementiel · Formation · RH',
    desc: 'Hôtesses, stewards, employés domestiques et personnel qualifié pour vos événements et entreprises. Recrutement rigoureux, suivi professionnel.',
    img: '/images/services/hotesses-stewards.jpg',
    color: 'from-[#0E2240]',
    lien: '/services',
  },
  {
    num: '02',
    titre: 'Confection sur Mesure',
    sous: '#WinstyleFashion',
    desc: 'Tenues de soirée, uniformes professionnels, prêt-à-porter moderne. Des créations sur mesure alliant élégance et authenticité africaine.',
    img: '/images/services/confection.jpg',
    color: 'from-[#C9A84C]',
    lien: '/services',
  },
  {
    num: '03',
    titre: 'Cosmétique Naturelle',
    sous: 'Gamme capillaire Bio',
    desc: 'Produits capillaires 100% naturels et bio adaptés aux cheveux africains. Huile de chébé, shampoings, crèmes hydratantes et manuel capillaire.',
    img: '/images/services/cosmetique.jpg',
    color: 'from-green-900',
    lien: '/services',
  },
];

const STATS = [
  { value: '3',      label: 'Secteurs complémentaires' },
  { value: '10M',    label: 'FCFA CA annuel estimé' },
  { value: '8-11',   label: 'Mois seuil rentabilité' },
  { value: 'Tchad',  label: 'N\'Djaména · Afrique centrale' },
];

const VALEURS = [
  { icon: '🎯', title: 'Excellence',       desc: 'Chaque prestation est préparée avec rigueur selon des critères exigeants de savoir-être et de professionnalisme.' },
  { icon: '💡', title: 'Innovation',       desc: 'Trois secteurs complémentaires qui se renforcent mutuellement pour une offre unique sur le marché africain.' },
  { icon: '🤝', title: 'Engagement social',desc: 'L\'autonomisation des femmes est au cœur de notre vision. Nous créons des opportunités économiques durables.' },
  { icon: '⚡', title: 'Réactivité',       desc: 'Disponibles 7j/7, nous répondons à vos besoins rapidement et nous adaptons à chaque contexte.' },
];

const TEMOIGNAGES = [
  {
    nom: 'Amadou Diallo',
    role: 'Directeur, Forum Dakar Business',
    texte: 'Un professionnalisme remarquable. Les hôtesses étaient impeccables du début à la fin. Je recommande vivement.',
    initiale: 'A',
  },
  {
    nom: 'Fatou Ndiaye',
    role: 'Organisatrice de mariages',
    texte: 'WinStyle a transformé notre événement. Le personnel était ponctuel, souriant et efficace. Une vraie valeur ajoutée.',
    initiale: 'F',
  },
  {
    nom: 'Pierre Mensah',
    role: 'DRH, Groupe Atlantique',
    texte: 'Nous faisons appel à eux pour tous nos événements corporate. La qualité est constante et la réactivité exemplaire.',
    initiale: 'P',
  },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center bg-[#0E2240] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-[#C9A84C]/60 to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30
                          text-[#C9A84C] text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
            Entreprise tchadienne · N'Djaména, Tchad
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            Win
            <span className="text-[#C9A84C]">Style</span>
          </h1>
          <p className="text-white/50 text-lg sm:text-xl uppercase tracking-widest mb-6">
            Excellence · Style · Service
          </p>
          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-4">
            Une entreprise innovante opérant dans l'agence de placement, la confection sur mesure
            et la cosmétique naturelle — au service de l'excellence africaine.
          </p>
          <p className="text-[#C9A84C] text-sm font-semibold mb-10">
            ✨ Organisateur officiel de RASMA 2025
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services"
              className="group bg-[#C9A84C] hover:bg-[#e0b954] text-[#0E2240] font-bold px-8 py-4
                         rounded-xl text-base transition-all duration-200 hover:shadow-xl
                         hover:shadow-[#C9A84C]/30 hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Nos services
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/contact"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4
                         rounded-xl text-base transition-all duration-200 border border-white/20
                         hover:border-white/40 flex items-center justify-center gap-2">
              Nous contacter
            </Link>
          </div>

          <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-[#C9A84C] mb-1">{value}</div>
                <div className="text-white/50 text-xs uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── RASMA 2025 ── */}
      <section className="py-12 px-6 bg-[#C9A84C]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-[#0E2240] font-black text-2xl mb-1">🏆 RASMA 2025</p>
            <p className="text-[#0E2240]/80 font-medium">
              WinStyle est fier d'avoir organisé le Rassemblement Annuel — un événement majeur de N'Djaména, Tchad.
            </p>
          </div>
          <Link href="/about"
            className="flex-shrink-0 bg-[#0E2240] hover:bg-[#0a1a30] text-white font-bold px-6 py-3
                       rounded-xl transition-all duration-200 whitespace-nowrap">
            En savoir plus →
          </Link>
        </div>
      </section>

      {/* ── NOS 3 SECTEURS ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">
              Notre entreprise
            </p>
            <h2 className="text-4xl font-black text-[#0E2240]">Trois secteurs, une vision</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              WinStyle combine trois activités complémentaires pour une offre unique en Afrique centrale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SECTEURS.map((s) => (
              <Link href={s.lien} key={s.titre}
                className="group rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl
                           hover:-translate-y-2 transition-all duration-400 bg-white flex flex-col">
                {/* Image */}
                <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${s.color} to-gray-800`}>
                  <Image src={s.img} alt={s.titre} fill className="object-cover opacity-70 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-5">
                    <span className="text-[#C9A84C] text-xs font-black uppercase tracking-widest">{s.num}</span>
                    <h3 className="text-white font-black text-xl leading-tight">{s.titre}</h3>
                    <p className="text-white/60 text-xs mt-0.5">{s.sous}</p>
                  </div>
                </div>
                {/* Texte */}
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{s.desc}</p>
                  <div className="mt-5 text-[#C9A84C] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Découvrir <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI WINSTYLE ── */}
      <section className="py-24 px-6 bg-[#0E2240]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">
                Pourquoi nous choisir
              </p>
              <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                L'excellence au cœur<br />
                <span className="text-[#C9A84C]">de tout ce que nous faisons</span>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Fondée par <strong className="text-white">Winnie Ronel Bou-Ah</strong>, WinStyle est bien plus qu'une entreprise.
                C'est une vision d'avenir pour l'Afrique centrale, portée par l'innovation,
                l'excellence du service et l'autonomisation des femmes.
              </p>
              <p className="text-white/60 leading-relaxed mb-8">
                De N'Djaména au reste du continent, WinStyle ambitionne de devenir
                la marque de référence en Afrique centrale.
              </p>
              <Link href="/about"
                className="inline-flex items-center gap-2 text-[#C9A84C] font-semibold hover:gap-3 transition-all">
                Découvrir notre histoire →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {VALEURS.map((v) => (
                <div key={v.title}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/8 transition-colors">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h4 className="text-white font-bold mb-1.5">{v.title}</h4>
                  <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMATIONS CTA ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#0E2240] to-[#1a3a6b] rounded-3xl p-10 sm:p-14
                          text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative">
              <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">
                Formation & Développement personnel
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">
                Développez vos compétences
              </h2>
              <p className="text-white/60 max-w-xl mx-auto mb-8 leading-relaxed">
                Nos programmes en accueil, protocole, posture et présentation professionnelle
                vous préparent aux plus hauts standards du secteur.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/formations"
                  className="bg-[#C9A84C] hover:bg-[#e0b954] text-[#0E2240] font-bold px-8 py-4
                             rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A84C]/30">
                  Voir les formations
                </Link>
                <Link href="/candidature"
                  className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4
                             rounded-xl border border-white/20 transition-all duration-200">
                  Rejoindre l'équipe
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-4xl font-black text-[#0E2240]">Ils nous font confiance</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.nom}
                className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-[#C9A84C] fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{t.texte}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0E2240] flex items-center justify-center text-[#C9A84C] font-bold text-sm flex-shrink-0">{t.initiale}</div>
                  <div>
                    <p className="font-bold text-[#0E2240] text-sm">{t.nom}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-6 bg-[#C9A84C]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0E2240] mb-4">
            Prêt à travailler ensemble ?
          </h2>
          <p className="text-[#0E2240]/70 mb-8 text-lg">
            Contactez-nous dès aujourd'hui — nous répondons sous 24h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"
              className="bg-[#0E2240] hover:bg-[#0a1a30] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl">
              Nous contacter
            </Link>
            <a href="https://wa.me/23565096024" target="_blank" rel="noopener noreferrer"
              className="bg-white hover:bg-gray-50 text-[#0E2240] font-bold px-8 py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" fill="#25D366" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.428a.75.75 0 00.916.916l5.566-1.476A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 01-4.964-1.36l-.355-.212-3.683.976.976-3.567-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* Bouton WhatsApp flottant */}
      <a href="https://wa.me/23565096024" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg shadow-green-500/30 transition-all hover:scale-110 z-50"
        aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.862L.057 23.428a.75.75 0 00.916.916l5.566-1.476A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.718 9.718 0 01-4.964-1.36l-.355-.212-3.683.976.976-3.567-.232-.368A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>
    </div>
  );
}
