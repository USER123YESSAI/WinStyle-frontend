import Link from 'next/link';

const SECTEURS = [
  { num: '01', icon: '👔', titre: 'Agence de Placement', items: ['Hôtesses & Stewards pour événements', 'Employés domestiques (gouvernantes, nounous, cuisiniers)', 'Événementiel & Consultance RH', 'Formation & Coaching professionnel'] },
  { num: '02', icon: '✂️', titre: 'Confection sur Mesure', items: ['Tenues de soirée & gala', 'Uniformes professionnels', 'Prêt-à-porter moderne', 'Collections femme & homme — à partir de 10 000 FCFA'] },
  { num: '03', icon: '🌿', titre: 'Cosmétique Naturelle', items: ['Shampoing ultra-doux au miel', 'Crème hydratante antipelliculaire', 'Huile essentielle pour la repousse', 'Huile de chébé anti-alopécie', 'Poudre de chébé du Tchad', 'Manuel capillaire — entre 5 000 et 15 000 FCFA'] },
];

const TIMELINE = [
  { annee: '2019', titre: "Création de WinStyle", desc: "Winnie Ronel Bou-Ah fonde WinStyle à N'Djaména avec la vision de créer une marque de référence en Afrique centrale." },
  { annee: '2020', titre: 'Lancement des formations', desc: 'Mise en place du programme de formation professionnelle en accueil, protocole et développement personnel.' },
  { annee: '2022', titre: 'Expansion des services', desc: 'Ajout des services cosmétiques et de la confection sur mesure pour compléter l\'offre agence.' },
  { annee: '2024', titre: 'Plateforme digitale', desc: 'Lancement du site web pour faciliter les demandes, candidatures et inscriptions en ligne.' },
  { annee: '2025', titre: 'RASMA 2025', desc: "WinStyle organise le Rassemblement Annuel de N'Djaména — événement majeur qui marque l'ambition nationale de la marque." },
];

const VALEURS = [
  { icon: '🎯', titre: 'Professionnalisme', desc: 'Chaque prestation est préparée avec rigueur selon des critères exigeants.' },
  { icon: '✨', titre: 'Excellence', desc: 'Nous ne faisons pas dans la moyenne. Chaque membre est sélectionné et évalué.' },
  { icon: '🤝', titre: 'Engagement', desc: "Nous nous engageons sur la qualité, la ponctualité et l'autonomisation des femmes." },
  { icon: '💡', titre: 'Adaptabilité', desc: 'Chaque client est unique. Nous personnalisons chaque mission selon vos besoins.' },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* Hero */}
      <section className="bg-[#0E2240] pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-4">Notre histoire</p>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
            À propos de<br /><span className="text-[#C9A84C]">WinStyle</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Une entreprise tchadienne innovante opérant dans trois secteurs complémentaires — fondée par Winnie Ronel Bou-Ah avec la vision de faire rayonner l'excellence africaine.
          </p>
        </div>
      </section>

      {/* RASMA 2025 */}
      <section className="bg-[#C9A84C] py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#0E2240] font-black text-3xl mb-2">🏆 RASMA 2025</p>
          <p className="text-[#0E2240]/80 text-lg font-medium max-w-2xl mx-auto">
            WinStyle est fier d'avoir organisé le Rassemblement Annuel de N'Djaména — un événement marquant qui témoigne de notre expertise en événementiel et de notre ancrage national.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">Notre mission</p>
            <h2 className="text-4xl font-black text-[#0E2240] mb-6 leading-tight">Valoriser l'excellence<br />au service de l'Afrique</h2>
            <p className="text-gray-500 leading-relaxed mb-5">WinStyle est une entreprise tchadienne innovante basée à N'Djaména, opérant dans trois secteurs complémentaires : agence de placement & événementiel, confection sur mesure, et cosmétique naturelle.</p>
            <p className="text-gray-500 leading-relaxed mb-5">Fondée par <strong className="text-[#0E2240]">Winnie Ronel Bou-Ah</strong>, WinStyle s'engage pour l'autonomisation des femmes et l'excellence du service. Notre objectif : devenir la marque de référence en Afrique centrale.</p>
            <p className="text-gray-500 leading-relaxed mb-8">Actuellement Société Individuelle (SI), WinStyle sera transformée en SARL dans l'année, garantissant une structure solide pour une croissance ambitieuse.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-[#0E2240] text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-[#C9A84C] hover:text-[#0E2240] transition-all duration-200">Nous contacter</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[{ v: '3', l: 'Secteurs', sub: 'Complémentaires' }, { v: '10M', l: 'FCFA', sub: 'CA annuel estimé' }, { v: '8-11', l: 'Mois', sub: 'Seuil de rentabilité' }, { v: '99 ans', l: 'Durée', sub: 'De la société' }].map(({ v, l, sub }) => (
              <div key={l} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-4xl font-black text-[#C9A84C] mb-1">{v}</div>
                <div className="text-[#0E2240] font-bold text-sm mb-1">{l}</div>
                <div className="text-gray-400 text-xs">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Secteurs */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">Ce que nous faisons</p>
            <h2 className="text-4xl font-black text-[#0E2240]">Nos domaines d'activité</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SECTEURS.map((s) => (
              <div key={s.titre} className="bg-white border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <span className="text-[#C9A84C] text-xs font-black">{s.num}</span>
                    <h3 className="font-black text-[#0E2240] text-lg leading-tight">{s.titre}</h3>
                  </div>
                </div>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-500">
                      <span className="text-[#C9A84C] mt-0.5 flex-shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">Ce qui nous guide</p>
            <h2 className="text-4xl font-black text-[#0E2240]">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALEURS.map((v) => (
              <div key={v.titre} className="bg-gray-50 border border-gray-100 rounded-2xl p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-[#0E2240] text-lg mb-2">{v.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 bg-[#0E2240]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">Notre parcours</p>
            <h2 className="text-4xl font-black text-white">WinStyle en dates</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-[#C9A84C]/30 hidden sm:block" />
            <div className="space-y-8">
              {TIMELINE.map((item) => (
                <div key={item.annee} className="flex gap-6 sm:gap-10 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-[#C9A84C]/15 border-2 border-[#C9A84C]/40 flex items-center justify-center z-10">
                      <span className="text-[#C9A84C] font-black text-xs">{item.annee}</span>
                    </div>
                  </div>
                  <div className={`rounded-xl p-5 flex-1 ${item.annee === '2025' ? 'bg-[#C9A84C]/15 border border-[#C9A84C]/30' : 'bg-white/5 border border-white/10'}`}>
                    <h3 className={`font-bold mb-1 ${item.annee === '2025' ? 'text-[#C9A84C]' : 'text-white'}`}>{item.annee === '2025' && '🏆 '}{item.titre}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Fondatrice */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">La personne derrière la marque</p>
            <h2 className="text-4xl font-black text-[#0E2240]">Notre fondatrice</h2>
          </div>
          <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              <div className="w-24 h-24 rounded-full bg-[#0E2240] flex items-center justify-center text-[#C9A84C] font-black text-3xl flex-shrink-0">W</div>
              <div>
                <h3 className="text-2xl font-black text-[#0E2240] mb-1">Winnie Ronel Bou-Ah</h3>
                <p className="text-[#C9A84C] font-semibold mb-4">Fondatrice & Gérante — WinStyle</p>
                <p className="text-gray-500 leading-relaxed mb-4">Entrepreneure tchadienne passionnée, Winnie a fondé WinStyle avec la conviction que l'Afrique centrale mérite une marque de prestige qui valorise le talent local. Spécialisée dans l'événementiel, la mode et la cosmétique naturelle, elle porte ce projet avec détermination et expertise.</p>
                <p className="text-gray-500 leading-relaxed">Son engagement pour l'autonomisation des femmes est le moteur principal de WinStyle : chaque activité de l'entreprise crée des opportunités économiques pour les femmes tchadiennes et africaines.</p>
                <div className="flex flex-wrap gap-4 mt-5 text-sm text-gray-500">
                  <span>📞 +235 65 09 60 24</span>
                  <span>📞 +237 698 617 237</span>
                  <span>✉️ winstylewins@gmail.com</span>
                  <span>📍 N'Djaména, Tchad</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#C9A84C]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-[#0E2240] mb-4">Rejoignez l'aventure WinStyle</h2>
          <p className="text-[#0E2240]/70 mb-8 text-lg">Vous partagez nos valeurs ? Postulez ou contactez-nous pour un partenariat.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/candidature" className="bg-[#0E2240] hover:bg-[#0a1a30] text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-xl">Postuler maintenant</Link>
            <Link href="/contact" className="bg-white hover:bg-gray-50 text-[#0E2240] font-bold px-8 py-4 rounded-xl transition-all duration-200">Nous contacter</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
