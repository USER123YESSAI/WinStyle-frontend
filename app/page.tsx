import Link from 'next/link';
import Image from 'next/image';
import PartnerMarquee from '@/components/ui/PartnerMarquee';

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

    texte: 'Vos filles sont professionnelles,propres et naturelles mais surtout propres.Je vous encourage vivement à continuer dans cette lancée.',
  },
  {
    texte: 'Bonjour boss!merci  pour le service ,tes filles ont assuré.',
  },
  {
  
    texte: "Coucou chérie! super bien,j'ai aimé.",
   
  },
];

const PARTENAIRES = [
  { nom: 'RASMA', logo: '/images/partenaires/partenaire2.png' },
  { nom: 'Partenaire 3', logo: '/images/partenaires/partenaire3.png' },
  { nom: 'Partenaire 4', logo: '/images/partenaires/partenaire4.png' },
  { nom: 'Partenaire 5', logo: '/images/partenaires/partenaire5.png' },
  { nom: 'Partenaire 6', logo: '/images/partenaires/partenaire6.png' },
  { nom: 'Partenaire 7', logo: '/images/partenaires/partenaire7.png' },
  { nom: 'Partenaire 8', logo: '/images/partenaires/partenaire8.png' },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center bg-[#0E2240] overflow-hidden">
        {/* Image de fond bien visible */}
        <div className="absolute inset-0">
          <Image
            src="/images/services/hotesses-stewards.jpg"
            alt="WinStyle"
            fill
            className="object-cover object-center lg:object-right"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E2240]/90 via-[#0E2240]/70 to-[#0E2240]/50" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

              <div className="relative max-w-6xl mx-auto px-6 lg:px-16 py-32 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#C9A84C]/15 border border-[#C9A84C]/30
                              text-[#C9A84C] text-sm font-medium px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                Entreprise tchadienne · N'Djaména, Tchad
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
                Win<span className="text-[#C9A84C]">Style</span>
              </h1>
              <p className="text-white/90 text-lg sm:text-xl uppercase tracking-widest mb-6">
                Excellence · Style · Service
              </p>
              <p className="text-white/90 text-lg sm:text-xl max-w-xl leading-relaxed mb-4">
                Une entreprise innovante opérant dans l'agence de placement, la confection sur mesure
                et la cosmétique naturelle — au service de l'excellence africaine.
              </p>
              <p className="text-[#C9A84C] text-sm font-semibold mb-10">
                ✨ Organisateur officiel de RASMA 2025
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
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
            </div>

            <div className="hidden lg:block" />
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-10 max-w-3xl">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <div className="text-3xl font-black text-[#C9A84C] mb-1">{value}</div>
                <div className="text-white/80 text-xs uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">
                Pourquoi nous choisir
              </p>
              <h2 className="text-4xl font-black text-[#0E2240] mb-6 leading-tight">
                L'excellence au cœur<br />
                <span className="text-[#C9A84C]">de tout ce que nous faisons</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Fondée par <strong className="text-[#0E2240]">Winnie Ronel Bou-Ah</strong>, WinStyle est bien plus qu'une entreprise.
                C'est une vision d'avenir pour l'Afrique centrale, portée par l'innovation,
                l'excellence du service et l'autonomisation des femmes.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
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
                  className="bg-gray-50 border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h4 className="text-[#0E2240] font-bold mb-1.5">{v.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMATIONS CTA ── */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-3xl p-10 sm:p-14
                          text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A84C]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="relative">
              <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-3">
                Formation & Développement personnel
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0E2240] mb-5">
                Développez vos compétences
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
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
                  className="bg-[#0E2240] hover:bg-[#1a3050] text-white font-semibold px-8 py-4
                             rounded-xl transition-all duration-200">
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
          {TEMOIGNAGES.map((t, i) => (
  <div key={i}
    className="bg-gray-50 rounded-2xl p-7 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, j) => (
        <svg key={j} className="w-4 h-4 text-[#C9A84C] fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
    <p className="text-gray-600 text-sm leading-relaxed italic">"{t.texte}"</p>
  </div>
))}
          </div>
        </div>
      </section>
         {/* ── NOS PARTENAIRES ── */}
      <section className="py-20 px-6 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-10">
            Ils nous ont fait confiance
          </p>
          <PartnerMarquee partenaires={PARTENAIRES} />
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
          </div>
        </div>
      </section>
    </div>
  );
}

