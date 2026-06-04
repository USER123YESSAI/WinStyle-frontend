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
    nom: 'Marie Remadji',
    fonction: 'Directrice Événements',
    texte: 'Vos filles sont professionnelles, propres et naturelles mais surtout professionnelles. Je vous encourage vivement à continuer dans cette lancée.',
    photo: '/images/services/nounous.jpg',
  },
  {
    nom: 'Jean-Pierre Mbairasssem',
    fonction: 'Organisateur Conférences',
    texte: 'Bonjour boss! Merci pour le service, tes filles ont assuré. Service impeccable et ponctuel.',
    photo: '/images/team/team-2.jpg',
  },
  {
    nom: 'Dénémadji Vanessa',
    fonction: 'Responsable Communication',
    texte: "Coucou chérie! Super bien, j'ai aimé. Une équipe dynamique et toujours prête à rendre service.",
    photo: '/images/team/team-3.jpg',
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
      <section className="relative min-h-[85vh] flex items-center bg-navy-600 overflow-hidden">
        {/* Image de fond bien visible */}
        <div className="absolute inset-0">
          <Image
            src="/images/services/hotesses-stewards.jpg"
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
              <div className="inline-flex items-center gap-2 bg-gold-400/15 border border-gold-400/30
                              text-gold-400 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                Entreprise tchadienne · N'Djaména, Tchad
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-3">
                Win<span className="text-gold-400">Style</span>
              </h1>
              <p className="text-white/90 text-lg sm:text-xl uppercase tracking-widest mb-4">
                Excellence · Style · Service
              </p>
              <p className="text-white/90 text-lg sm:text-xl max-w-xl leading-relaxed mb-3">
                Une entreprise innovante opérant dans l'agence de placement, la confection sur mesure
                et la cosmétique naturelle — au service de l'excellence africaine.
              </p>
             
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/services"
                  className="group bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 font-bold px-8 py-4
                             rounded-xl text-base transition-all duration-300 hover:shadow-glow
                             hover:-translate-y-0.5 flex items-center justify-center gap-2">
                  Nos services
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/contact"
                  className="glass-dark hover:bg-white/20 text-white font-semibold px-8 py-4
                             rounded-xl text-base transition-all duration-300 border border-white/20
                             hover:border-white/40 flex items-center justify-center gap-2">
                  Nous contacter
                </Link>
              </div>
            </div>

            <div className="hidden lg:block" />
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-white/10 pt-8 max-w-3xl animate-slide-up delay-200">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center lg:text-left">
                <div className="text-3xl font-black text-gold-400 mb-1">{value}</div>
                <div className="text-white/80 text-xs uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── RASMA 2025 ── */}
      <section className="py-6 px-6 bg-gradient-to-r from-gold-400 to-gold-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-navy-900 font-black text-2xl mb-1">🏆 RASMA 2025</p>
            <p className="text-navy-900/80 font-medium">
              WinStyle est fier d'avoir organisé le Rassemblement Annuel — un événement majeur de N'Djaména, Tchad.
            </p>
          </div>
          <Link href="/about"
            className="flex-shrink-0 bg-navy-900 hover:bg-navy-700 text-white font-bold px-6 py-3
                       rounded-xl transition-all duration-300 whitespace-nowrap hover:shadow-lg">
            En savoir plus →
          </Link>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-16 px-6 bg-gradient-to-b from-gold-50 via-white to-slate-50 border-t border-gold-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-semibold text-sm uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-4xl sm:text-5xl font-black text-navy-700">Ils nous font confiance</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-base sm:text-lg">Découvrez l'expérience de nos clients avec un service professionnel, fiable et 100 % humain.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TEMOIGNAGES.map((t, i) => (
              <article
                key={i}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.25)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_90px_-20px_rgba(249,208,83,0.2)]"
                style={{ animationDelay: `${i * 100}ms` }}>
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-gold-100 via-white to-slate-100 opacity-95" />
                <div className="relative flex items-center gap-4 mb-6">
                  <div className="relative h-20 w-20 rounded-full border-4 border-white bg-slate-100 shadow-lg overflow-hidden">
                    {t.photo ? (
                      <Image src={t.photo} alt={t.nom} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-navy-600 text-white text-2xl font-bold">
                        {t.nom.split(' ').map((part) => part[0]).join('')}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-navy-700">{t.nom}</h3>
                    <p className="text-sm uppercase tracking-[0.2em] text-gold-500">{t.fonction}</p>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1 mb-5 text-gold-400">
                  {[...Array(5)].map((_, star) => (
                    <svg key={star} className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 text-base leading-7 italic">“{t.texte}”</p>
              </article>
            ))}
          </div>
        </div>
      </section>
         {/* ── NOS PARTENAIRES ── */}
      <section className="py-8 px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-center text-gold-400 font-semibold text-sm uppercase tracking-widest mb-6">
            NOS PARTENAIRES
          </p>
          <PartnerMarquee partenaires={PARTENAIRES} />
        </div>
      </section>
    </div>
  );
}

