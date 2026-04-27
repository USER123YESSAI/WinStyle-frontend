'use client';

import Image from 'next/image';

interface Partenaire {
  nom: string;
  logo: string;
}

interface PartnerMarqueeProps {
  partenaires: Partenaire[];
}

export default function PartnerMarquee({ partenaires }: PartnerMarqueeProps) {
  // Double la liste pour créer une boucle fluide
  const doubleList = [...partenaires, ...partenaires];

  return (
    <div className="relative overflow-hidden w-full">
      {/* Dégradés de fondu sur les côtés */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap w-max">
        {doubleList.map((p, i) => (
          <div
            key={`${p.nom}-${i}`}
            className="flex items-center justify-center h-20 flex-shrink-0"
          >
            <Image
              src={p.logo}
              alt={p.nom}
              width={140}
              height={60}
              className="max-h-14 w-auto object-contain opacity-90 hover:opacity-100 transition-all duration-300"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="hidden h-14 items-center justify-center border-2 border-dashed border-gray-200 rounded-xl flex-col px-3">
              <span className="text-[#C9A84C] font-black text-lg">{p.nom[0]}</span>
              <span className="text-gray-400 text-[10px]">{p.nom}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

