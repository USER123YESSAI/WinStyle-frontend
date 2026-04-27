'use client';

interface PartnerLogoProps {
  nom: string;
  logo: string;
}

export default function PartnerLogo({ nom, logo }: PartnerLogoProps) {
  return (
    <div className="flex items-center justify-center w-48 h-28 hover:-translate-y-1 transition-all duration-300">
      <img
        src={logo}
        alt={nom}
        className="max-h-24 max-w-full object-contain"
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
          const fallback = target.nextElementSibling as HTMLElement;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      {/* Fallback si logo absent */}
      <div className="hidden w-44 h-24 border-2 border-dashed border-gray-200 rounded-xl
                      items-center justify-center flex-col gap-1">
        <span className="text-[#C9A84C] font-black text-2xl">{nom[0]}</span>
        <span className="text-gray-400 text-xs text-center px-2">{nom}</span>
      </div>
    </div>
  );
}

