'use client';

import Link from 'next/link';
import Image from 'next/image';

const SECTEURS = [
  { num: '01', icon: '👔', titre: 'consultante en ressources humaine', items: ['Hôtesses & Stewards pour événements', 'Employés domestiques (gouvernantes, nounous, cuisiniers)', 'Événementiel & Consultance RH', 'Formation & Coaching professionnel'] },
  { num: '02', icon: '✂️', titre: 'Confection sur Mesure', items: ['Tenues de soirée & gala', 'Uniformes professionnels', 'Prêt-à-porter moderne', 'Collections femme & homme — à partir de 10 000 FCFA'] },
  { num: '03', icon: '🌿', titre: 'Cosmétique Naturelle', items: ['Shampoing ultra-doux au miel', 'Crème hydratante antipelliculaire', 'Huile essentielle pour la repousse', 'Huile de chébé anti-alopécie', 'Poudre de chébé du Tchad', 'Manuel capillaire — entre 5 000 et 15 000 FCFA'] },
];

const TIMELINE = [
  { annee: '2019', titre: 'Création de WinStyle', desc: "Winnie Ronel Bou-Ah fonde WinStyle à N'Djaména avec la vision de créer une marque de référence en Afrique centrale." },
  { annee: '2020', titre: 'Lancement des formations', desc: 'Mise en place du programme de formation professionnelle en accueil, protocole et développement personnel.' },
  { annee: '2022', titre: 'Expansion des services', desc: "Ajout des services cosmétiques et de la confection sur mesure pour compléter l'offre agence." },
  { annee: '2024', titre: 'Plateforme digitale', desc: 'Lancement du site web pour faciliter les demandes, candidatures et inscriptions en ligne.' },
  { annee: '2025', titre: 'RASMA 2025', desc: "WinStyle organise le Rassemblement Annuel — un événement majeur qui marque l'ambition nationale de la marque." },
];

const VALEURS = [
  { icon: '🎯', titre: 'Professionnalisme', desc: 'Chaque prestation est préparée avec rigueur selon des critères exigeants.' },
  { icon: '✨', titre: 'Excellence', desc: 'Nous ne faisons pas dans la moyenne. Chaque membre est sélectionné et évalué.' },
  { icon: '🤝', titre: 'Engagement', desc: "Nous nous engageons sur la qualité, la ponctualité et l'autonomisation des femmes." },
  { icon: '💡', titre: 'Adaptabilité', desc: 'Chaque client est unique. Nous personnalisons chaque mission selon vos besoins.' },
];

// ── ÉQUIPE — remplace les noms et photos quand disponibles
const EQUIPE = [
  {
    nom: 'Winnie Ronel Bou-Ah',
    role: 'Directrice Générale',
    desc: 'Fondatrice de WinStyle, Winnie porte la vision de l\'entreprise avec passion et détermination. Spécialisée dans l\'événementiel, la mode et la cosmétique naturelle.',
    photo: '/images/team/fondatrice.jpg',
    initiale: 'W',
    contacts: ['+235 65 09 60 24', 'winstylewins@gmail.com'],
  },
  {
    nom: 'Leatitia Nambatingué',
    role: 'Responsable Comptable',
    desc: 'Garant de la santé financière de WinStyle, elle assure la gestion rigoureuse des comptes et le suivi budgétaire de l\'entreprise.',
    photo: '/images/team/comptable.jpg',
    initiale: 'C',
    contacts: [],
  },
  {
    nom: 'Mbayo Yankimadji',
    role: 'Responsable Administrative',
    desc: 'Elle coordonne les opérations quotidiennes et assure le bon fonctionnement administratif de WinStyle.',
    photo: '/images/team/administrative.jpg',
    initiale: 'A',
    contacts: [],
  },
  {
    nom: 'Gakramta Debora',
    role: 'Responsable RH',
    desc: 'Elle gère le recrutement, la formation et le développement des talents au sein de WinStyle.',
    photo: '/images/team/rh.jpg',
    initiale: 'R',
    contacts: [],
  },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO RASMA ── */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/rasma/rasma1-hero.jpg" alt="RASMA 2025" fill className="object-cover object-center" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-600/80 via-navy-600/70 to-navy-600/90" />
        </div>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-navy-400/10 rounded-full blur-3xl animate-float delay-500" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 py-20 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/40
                          text-gold-400 text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-widest">
            <span>🏆</span> WinStyle présente
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-none mb-3">
            Ra<span className="text-gold-400">SMA</span>
          </h1>
          <p className="text-white/60 text-base sm:text-lg uppercase tracking-[0.2em] mb-6">
            Retour aux Sources de la Mode Africaine
          </p>
          <div className="max-w-2xl mx-auto glass-dark rounded-2xl px-8 py-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-2xl">🌍</span>
              <h2 className="text-gold-400 font-bold text-lg uppercase tracking-widest">Mission Principale</h2>
            </div>
            <p className="text-white/80 text-base leading-relaxed">
              RaSMA est un concept dédié à la <strong className="text-white">valorisation et à la célébration de l'élégance africaine</strong>.
              Son objectif est de reconnecter les générations actuelles avec l'héritage vestimentaire du continent.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 bg-gold-400/15 border border-gold-400/30 rounded-full px-6 py-3 mb-8">
            <span className="text-gold-400 text-sm font-semibold">📅 Focus historique :</span>
            <span className="text-white/80 text-sm">Années 60 → Années 2000</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact"
              className="group bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-bold px-8 py-4
                         rounded-xl text-base transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 flex items-center justify-center gap-2">
              Nous rejoindre <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <a href="#winstyle"
              className="glass hover:bg-white/20 text-white font-semibold px-8 py-4
                         rounded-xl text-base transition-all duration-300 border border-white/20 flex items-center justify-center">
              Découvrir WinStyle ↓
            </a>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Séparateur WinStyle */}
      <div id="winstyle" className="bg-navy-600 py-6 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white font-black text-2xl">WinStyle — L'entreprise derrière RASMA</p>
          <p className="text-white/70 mt-1">Agence de placement · Confection sur mesure · Cosmétique naturelle</p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Notre mission</p>
            <h2 className="text-4xl font-black text-navy-600 mb-5 leading-tight">Valoriser l'excellence<br />au service de l'Afrique</h2>
            <p className="text-gray-500 leading-relaxed mb-4">WinStyle est une entreprise tchadienne innovante basée à N'Djaména, opérant dans trois secteurs complémentaires : agence de placement & événementiel, confection sur mesure, et cosmétique naturelle.</p>
            <p className="text-gray-500 leading-relaxed mb-4">Fondée par <strong className="text-navy-600">Winnie Ronel Bou-Ah</strong>, WinStyle s'engage pour l'autonomisation des femmes et l'excellence du service.</p>
            <p className="text-gray-500 leading-relaxed mb-6">Actuellement Société Individuelle (SI), WinStyle sera transformée en SARL dans l'année, garantissant une structure solide pour une croissance ambitieuse.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-semibold px-7 py-3.5 rounded-xl transition-all duration-300 hover:shadow-glow">Nous contacter</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 animate-slide-up delay-100">
            {[{ v: '3', l: 'Secteurs', sub: 'Complémentaires' }, { v: '10M', l: 'FCFA', sub: 'CA annuel estimé' }, { v: '8-11', l: 'Mois', sub: 'Seuil de rentabilité' }, { v: '99 ans', l: 'Durée', sub: 'De la société' }].map(({ v, l, sub }) => (
              <div key={l} className="card-modern bg-gray-50 border border-gray-100 rounded-2xl p-5 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
                <div className="text-4xl font-black text-gold-400 mb-1">{v}</div>
                <div className="text-navy-600 font-bold text-sm mb-1">{l}</div>
                <div className="text-gray-400 text-xs">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Secteurs */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Ce que nous faisons</p>
            <h2 className="text-4xl font-black text-navy-600">Nos domaines d'activité</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SECTEURS.map((s, i) => (
              <div key={s.titre} className={`card-modern bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-${i * 100}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <span className="text-gold-400 text-xs font-black">{s.num}</span>
                    <h3 className="font-black text-navy-600 text-lg leading-tight">{s.titre}</h3>
                  </div>
                </div>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-gold-400 mt-0.5 flex-shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Ce qui nous guide</p>
            <h2 className="text-4xl font-black text-navy-600">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALEURS.map((v, i) => (
              <div key={v.titre} className={`card-modern bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 animate-slide-up delay-${i * 100}`}>
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-bold text-navy-600 text-lg mb-2">{v.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6 bg-navy-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Notre parcours</p>
            <h2 className="text-4xl font-black text-white">WinStyle en dates</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gold-400/30 hidden sm:block" />
            <div className="space-y-6">
              {TIMELINE.map((item, i) => (
                <div key={item.annee} className={`flex gap-6 sm:gap-10 items-start animate-slide-up delay-${i * 100}`}>
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gold-400/15 border-2 border-gold-400/40 flex items-center justify-center z-10">
                      <span className="text-gold-400 font-black text-xs">{item.annee}</span>
                    </div>
                  </div>
                  <div className={`rounded-xl p-5 flex-1 ${item.annee === '2025' ? 'bg-gold-400/15 border border-gold-400/30' : 'bg-white/5 border border-white/10'}`}>
                    <h3 className={`font-bold mb-1 ${item.annee === '2025' ? 'text-gold-400' : 'text-white'}`}>{item.annee === '2025' && '🏆 '}{item.titre}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ÉQUIPE — Les personnes derrière WinStyle
      ══════════════════════════════════════ */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">Notre équipe</p>
            <h2 className="text-4xl font-black text-navy-600">Les personnes derrière WinStyle</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Une équipe engagée, professionnelle et passionnée au service de l'excellence africaine.
            </p>
          </div>

          {/* Fondatrice — grande carte en premier */}
          <div className="card-modern bg-white rounded-3xl overflow-hidden border border-gray-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Photo */}
              <div className="relative h-80 md:h-auto min-h-[350px] bg-navy-600 overflow-hidden">
                <img
                  src="/images/team/fondatrice.jpg"
                  alt="Winnie Ronel Bou-Ah"
                  className="w-full h-full object-cover object-center"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 bg-gradient-to-br from-navy-600 to-navy-700 flex flex-col items-center justify-center -z-10">
                  <div className="w-28 h-28 rounded-full bg-gold-400/20 border-4 border-gold-400/40 flex items-center justify-center mb-3">
                    <span className="text-gold-400 font-black text-5xl">W</span>
                  </div>
                </div>
                {/* Badge rôle sur photo */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-gold-400 text-navy-900 text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Directrice Générale
                  </span>
                </div>
              </div>
              {/* Texte */}
              <div className="p-8 flex flex-col justify-center">
                <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-2">Fondatrice</p>
                <h3 className="text-3xl font-black text-navy-600 mb-2">Winnie Ronel Bou-Ah</h3>
                <p className="text-gold-400 font-semibold text-sm mb-4">Fondatrice & Directrice Générale</p>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Entrepreneure tchadienne passionnée, Winnie a fondé WinStyle avec la conviction que l'Afrique
                  centrale mérite une marque de prestige qui valorise le talent local. Spécialisée dans
                  l'événementiel, la mode et la cosmétique naturelle.
                </p>
                <p className="text-gray-500 leading-relaxed mb-5">
                  Son engagement pour <strong className="text-navy-600">l'autonomisation des femmes</strong> est
                  le moteur principal de WinStyle.
                </p>
                <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                  <span>📞 +235 65 09 60 24</span>
                  <span>📞 +237 698 617 237</span>
                  <span>✉️ winstylewins@gmail.com</span>
                  <span>📍 N'Djaména, Tchad</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 autres membres — grille */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {EQUIPE.slice(1).map((membre, i) => (
              <div key={membre.role}
                className={`card-modern bg-white rounded-3xl overflow-hidden border border-gray-100
                           hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col animate-slide-up delay-${(i + 1) * 100}`}>

                {/* Photo */}
                <div className="relative h-64 bg-navy-600 overflow-hidden">
                  <img
                    src={membre.photo}
                    alt={membre.nom}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  {/* Fallback toujours présent derrière */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-600 to-navy-700
                                  flex flex-col items-center justify-center -z-10">
                    <div className="w-20 h-20 rounded-full bg-gold-400/20 border-3 border-gold-400/40
                                    flex items-center justify-center mb-2">
                      <span className="text-gold-400 font-black text-3xl">{membre.initiale}</span>
                    </div>
                  </div>
                  {/* Badge rôle */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-gold-400 text-navy-900 text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {membre.role.replace('Responsable ', '')}
                    </span>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-black text-navy-600 text-lg mb-1">{membre.nom}</h4>
                  <p className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-3">{membre.role}</p>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1">{membre.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-gold-400 to-gold-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 mb-4">Rejoignez l'aventure WinStyle</h2>
          <p className="text-navy-900/70 mb-6 text-lg">Vous partagez nos valeurs ? Postulez ou contactez-nous pour un partenariat.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/candidature" className="bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-glow">Postuler maintenant</Link>
            <Link href="/contact" className="bg-white hover:bg-gray-50 text-navy-900 font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-md">Nous contacter</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

