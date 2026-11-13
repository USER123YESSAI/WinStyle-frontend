'use client';

import { useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCms, resolveCmsMediaUrl } from '@/components/cms/CmsProvider';

export default function GaleriePage() {
  const { getSectionContent, isSectionActive } = useCms();
  const galerie = getSectionContent('galerie');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  if (!isSectionActive('galerie')) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 text-center">
        <p className="text-gray-400">Cette section est momentanément désactivée.</p>
      </main>
    );
  }

  const allItems = Array.isArray(galerie?.items)
    ? [...galerie.items]
        .filter((item: any) => item.actif !== false)
        .sort((a: any, b: any) => (a.ordre ?? 0) - (b.ordre ?? 0))
    : [];

  const categories: string[] =
    Array.isArray(galerie?.categories) && galerie.categories.length > 0
      ? galerie.categories
      : ['Tous', ...Array.from(new Set(allItems.map((i: any) => i.categorie).filter(Boolean)))];

  const filtered =
    selectedCategory === 'Tous'
      ? allItems
      : allItems.filter((item: any) => item.categorie === selectedCategory);

  const currentItem = lightboxIdx !== null ? filtered[lightboxIdx] : null;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-navy-600 pt-28 pb-16 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-widest mb-3">
            {galerie?.hero_subtitle || 'En images'}
          </p>
          <h1 className="text-5xl font-black text-white mb-3">
            {galerie?.hero_title || 'Notre Galerie'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {galerie?.hero_description}
          </p>
        </div>
      </section>

      {/* Filtres */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 glass">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto py-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setLightboxIdx(null);
                }}
                className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-navy-600 text-white shadow-glow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grille Galerie */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              Aucune photo disponible dans cette catégorie.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item: any, idx: number) => (
                <div
                  key={item.id || idx}
                  onClick={() => setLightboxIdx(idx)}
                  className="group relative rounded-2xl overflow-hidden bg-navy-900 border border-gray-100 shadow-sm hover:shadow-card-hover cursor-pointer transition-all duration-300 hover:-translate-y-1 aspect-[4/3]"
                >
                  <img
                    src={resolveCmsMediaUrl(item.image)}
                    alt={item.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  {item.categorie && (
                    <span className="absolute top-3 right-3 bg-gold-400 text-navy-900 text-xs font-bold px-3 py-1 rounded-full">
                      {item.categorie}
                    </span>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg leading-snug">{item.titre}</h3>
                    {item.legende && (
                      <p className="text-xs text-white/75 mt-1 line-clamp-2">{item.legende}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {currentItem && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIdx(null)}
              className="absolute -top-12 right-0 text-white hover:text-gold-400 text-sm font-bold inline-flex items-center gap-1.5 transition"
            >
              <X className="w-5 h-5" />
              <span>Fermer</span>
            </button>
            <img
              src={resolveCmsMediaUrl(currentItem.image)}
              alt={currentItem.titre}
              className="max-h-[75vh] w-auto object-contain rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-center text-white max-w-xl">
              <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">
                {currentItem.categorie}
              </span>
              <h3 className="text-xl font-bold mt-1">{currentItem.titre}</h3>
              {currentItem.legende && (
                <p className="text-sm text-white/70 mt-1">{currentItem.legende}</p>
              )}
            </div>
            {filtered.length > 1 && (
              <div className="flex items-center gap-4 mt-4">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIdx(lightboxIdx === 0 ? filtered.length - 1 : lightboxIdx - 1)
                  }
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-gold-400 hover:text-navy-900 text-white text-sm font-bold transition inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Précédente</span>
                </button>
                <span className="text-white/60 text-xs">
                  {lightboxIdx + 1} / {filtered.length}
                </span>
                <button
                  type="button"
                  onClick={() => setLightboxIdx((lightboxIdx + 1) % filtered.length)}
                  className="px-4 py-2 rounded-xl bg-white/15 hover:bg-gold-400 hover:text-navy-900 text-white text-sm font-bold transition inline-flex items-center gap-1.5"
                >
                  <span>Suivante</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
