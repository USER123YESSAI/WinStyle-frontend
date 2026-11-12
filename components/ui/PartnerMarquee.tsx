'use client';

import Image from 'next/image';

export interface PartenaireItem {
  id?: number;
  nom: string;
  logo?: string | null;
  site_web?: string | null;
}

interface PartnerMarqueeProps {
  partenaires: PartenaireItem[];
}

function resolveLogoUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/uploads/')) {
    const apiBase = (
      process.env.NEXT_PUBLIC_API_URL || 'https://winstyle-backend.onrender.com/api'
    ).replace(/\/api\/?$/, '');
    return `${apiBase}${url}`;
  }
  return url;
}

export default function PartnerMarquee({ partenaires }: PartnerMarqueeProps) {
  if (!partenaires || partenaires.length === 0) return null;

  // Répéter la liste suffisamment de fois pour assurer un défilement fluide
  const repeatCount = partenaires.length < 4 ? 4 : 2;
  const repeatedList = Array.from({ length: repeatCount }, () => partenaires).flat();

  return (
    <div className="relative overflow-hidden w-full">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-12 sm:gap-16 animate-marquee whitespace-nowrap w-max">
        {repeatedList.map((p, i) => {
          const logoSrc = resolveLogoUrl(p.logo);
          const content = (
            <div className="flex items-center justify-center h-20 flex-shrink-0 group">
              {logoSrc ? (
                <>
                  <Image
                    src={logoSrc}
                    alt={p.nom}
                    width={140}
                    height={60}
                    className="max-h-14 w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                    onError={(e: any) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-14 items-center justify-center border-2 border-dashed border-gray-200 rounded-xl flex-col px-4 card-modern">
                    <span className="text-gold-400 font-black text-lg">
                      {p.nom?.[0] || 'P'}
                    </span>
                    <span className="text-gray-500 text-[10px] font-medium">
                      {p.nom}
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex h-14 items-center justify-center border-2 border-dashed border-gray-200 rounded-xl flex-col px-4 card-modern group-hover:border-gold-400 transition-colors">
                  <span className="text-gold-400 font-black text-lg">
                    {p.nom?.[0] || 'P'}
                  </span>
                  <span className="text-gray-500 text-[10px] font-medium">
                    {p.nom}
                  </span>
                </div>
              )}
            </div>
          );

          if (p.site_web) {
            return (
              <a
                key={`${p.id ?? p.nom}-${i}`}
                href={p.site_web}
                target="_blank"
                rel="noopener noreferrer"
                title={`Visiter le site de ${p.nom}`}
                className="focus:outline-none focus:ring-2 focus:ring-gold-400 rounded-xl"
              >
                {content}
              </a>
            );
          }

          return <div key={`${p.id ?? p.nom}-${i}`}>{content}</div>;
        })}
      </div>
    </div>
  );
}
