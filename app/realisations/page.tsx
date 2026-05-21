'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

type Categorie = 'Tous' | 'Agence' | 'Mode' | 'RASMA' | 'Formation';

interface Realisation {
  id: number;
  titre: string;
  date: string;
  categorie: Categorie;
  description: string;
  images: string[];
}

const CATEGORIES: Categorie[] = ['Tous', 'Agence', 'Mode', 'RASMA', 'Formation'];

const DEFAULT_API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000';

// Normalize data to ensure all required fields exist
const normalizeRealisation = (item: any): Realisation => {
  let imagesArray: string[] = [];
  if (item.images && Array.isArray(item.images)) {
    imagesArray = item.images;
  } else if (item.image && typeof item.image === 'string' && item.image !== '') {
    imagesArray = [item.image];
  } else if (item.imageUrl && typeof item.imageUrl === 'string') {
    imagesArray = [item.imageUrl];
  } else if (item.photo && typeof item.photo === 'string') {
    imagesArray = [item.photo];
  }
  
  return {
    id: item?.id ?? 0,
    titre: item?.titre ?? item?.title ?? 'Sans titre',
    date: item?.date ?? item?.createdAt ? new Date(item?.date || item?.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : 'Date à confirmer',
    categorie: item?.categorie ?? item?.category ?? 'Agence',
    description: item?.description ?? item?.desc ?? 'Description à venir',
    images: imagesArray,
  };
};

const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath || imagePath === '' || imagePath === 'undefined' || imagePath === 'null') {
    return '/images/placeholder.jpg';
  }
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/images/')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/uploads/')) {
    return DEFAULT_API_URL + imagePath;
  }
  
  if (!imagePath.startsWith('/') && imagePath.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return `${DEFAULT_API_URL}/uploads/${imagePath}`;
  }
  
  return '/images/placeholder.jpg';
};

export default function RealisationsPage() {
  const [filtre, setFiltre] = useState<Categorie>('Tous');
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track current image index for each realisation card
  const [currentImages, setCurrentImages] = useState<{ [key: number]: number }>({});

  // Modal state for full image gallery
  const [imageModal, setImageModal] = useState<{ open: boolean; realisationId: number; currentIdx: number }>({
    open: false,
    realisationId: 0,
    currentIdx: 0
  });

  useEffect(() => {
    const fetchRealisations = async () => {
      try {
        const res = await api.get('/realisations');
        const data = res.data;
        
        let items: any[] = [];
        if (Array.isArray(data)) {
          items = data;
        } else if (data?.realisations) {
          items = data.realisations;
        } else if (data?.data) {
          items = Array.isArray(data.data) ? data.data : [data.data];
        } else if (data?.results) {
          items = data.results;
        } else {
          items = [];
        }
        
        const normalized = items.map(normalizeRealisation);
        setRealisations(normalized);
        
        // Initialize current image index for each realisation
        const initialIndices: { [key: number]: number } = {};
        normalized.forEach(r => {
          initialIndices[r.id] = 0;
        });
        setCurrentImages(initialIndices);
      } catch (err) {
        console.error('Erreur lors du chargement des réalisations:', err);
        setError('Impossible de charger les réalisations');
      } finally {
        setLoading(false);
      }
    };
    fetchRealisations();
  }, []);

  const filtresFiltrees = filtre === 'Tous'
    ? realisations
    : realisations.filter((r) => r.categorie === filtre);

  // Navigate to next image (card carousel)
  const nextImage = (id: number, total: number) => {
    setCurrentImages(prev => ({
      ...prev,
      [id]: (prev[id] + 1) % total
    }));
  };

  // Navigate to previous image (card carousel)
  const prevImage = (id: number, total: number) => {
    setCurrentImages(prev => ({
      ...prev,
      [id]: prev[id] === 0 ? total - 1 : prev[id] - 1
    }));
  };

  // Open image modal
  const openImageModal = (realisationId: number, idx: number) => {
    setImageModal({ open: true, realisationId, currentIdx: idx });
  };

  // Close modal
  const closeImageModal = () => {
    setImageModal({ open: false, realisationId: 0, currentIdx: 0 });
  };

  // Modal image nav
  const currentRealisation = realisations.find(r => r.id === imageModal.realisationId);
  const modalTotal = currentRealisation?.images.length || 0;
  const nextModalImage = useCallback(() => {
    if (!currentRealisation) return;
    const nextIdx = (imageModal.currentIdx + 1) % modalTotal;
    setImageModal(prev => ({ ...prev, currentIdx: nextIdx }));
  }, [imageModal.currentIdx, modalTotal, currentRealisation]);
  
  const prevModalImage = useCallback(() => {
    if (!currentRealisation) return;
    const prevIdx = imageModal.currentIdx === 0 ? modalTotal - 1 : imageModal.currentIdx - 1;
    setImageModal(prev => ({ ...prev, currentIdx: prevIdx }));
  }, [imageModal.currentIdx, modalTotal, currentRealisation]);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!imageModal.open) return;
      if (e.key === 'Escape') closeImageModal();
      if (e.key === 'ArrowRight') nextModalImage();
      if (e.key === 'ArrowLeft') prevModalImage();
    };
    if (imageModal.open) {
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [imageModal.open, nextModalImage, prevModalImage]);

  return (
    <>
      <main className="min-h-screen bg-gray-50">

        {/* Hero */}
        <section className="relative bg-[#0E2240] pt-36 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="relative max-w-4xl mx-auto text-center">
            <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-widest mb-4">Ce que nous avons accompli</p>
            <h1 className="text-5xl font-black text-white mb-4">Nos Réalisations</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
             Découvrez nos événements, collections et formations qui font de WinStyle une référence au Tchad et en Afrique centrale.
            </p>
          </div>
        </section>

        {/* Filtres */}
        <section className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex overflow-x-auto py-4 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFiltre(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    filtre === cat
                      ? 'bg-[#0E2240] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Grille de cartes */}
        <section className="py-16 px-6">
            <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500">{error}</p>
              </div>
            ) : realisations.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">Aucune réalisation pour le moment.</p>
                <p className="text-gray-400 text-sm mt-2">Revenez bientôt !</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtresFiltrees.map((realisation) => {
                  const currentIdx = currentImages[realisation.id] || 0;
                  const totalImages = realisation.images?.length || 0;
                  
                  return (
                    <div
                      key={realisation.id}
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Image with navigation buttons - now clickable to open modal */}
                      <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer" onClick={() => totalImages > 0 && openImageModal(realisation.id, currentIdx)}>
                        {totalImages > 0 ? (
                          <>
                            <img
                              src={getImageUrl(realisation.images[currentIdx])}
                              alt={realisation.titre}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 hover:brightness-90"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/images/placeholder.jpg';
                              }}
                            />
                            
                            {/* Always visible nav when multiple images */}
                            {totalImages > 1 && (
                              <>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); prevImage(realisation.id, totalImages); }}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg text-gray-800 rounded-full flex items-center justify-center opacity-100 hover:scale-110 transition-all duration-200 z-10"
                                  aria-label="Image précédente"
                                >
                                  ←
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); nextImage(realisation.id, totalImages); }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg text-gray-800 rounded-full flex items-center justify-center opacity-100 hover:scale-110 transition-all duration-200 z-10"
                                  aria-label="Image suivante"
                                >
                                  →
                                </button>
                                
                                {/* Counter always shown */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full shadow-lg">
                                  {currentIdx + 1} / {totalImages}
                                </div>
                              </>
                            )}
                          </>
                        ) : (
                          <img
                            src="/images/placeholder.jpg"
                            alt={realisation.titre}
                            className="w-full h-full object-cover cursor-default"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2240]/60 to-transparent" />
                        <div className="absolute top-3 right-3 flex items-center gap-2">
                          <span className="bg-[#C9A84C] text-[#0E2240] text-xs font-bold px-3 py-1 rounded-full">
                            {realisation.categorie}
                          </span>
                        </div>
                      </div>

                      {/* Contenu */}
                      <div className="p-5">
                        <p className="text-[#C9A84C] text-xs font-semibold mb-1">{realisation.date}</p>
                        <h3 className="text-[#0E2240] font-bold text-lg mb-2 group-hover:text-[#C9A84C] transition-colors">
                          {realisation.titre}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {realisation.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {!loading && !error && filtresFiltrees.length === 0 && realisations.length > 0 && (
              <div className="text-center py-16">
                <p className="text-gray-400 text-lg">Aucune réalisation dans cette catégorie.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-6 bg-[#0E2240]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-black text-white mb-4">
              Prêt à travailler ensemble ?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Faites confiance à WinStyle pour vos événements et projets.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#e0b954] text-[#0E2240] font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#C9A84C]/30"
            >
              Faire appel à WinStyle
              <span>→</span>
            </Link>
          </div>
        </section>

      </main>

      {/* Image Gallery Modal */}
      {imageModal.open && currentRealisation && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-200"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col md:flex-row gap-6 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sidebar Thumbnails */}
            <div className="w-20 md:w-24 h-full flex flex-col gap-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 p-2 rounded-xl bg-black/30 max-h-[70vh]">
              {currentRealisation.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageModal(prev => ({ ...prev, currentIdx: idx }))}
                  className={`w-full aspect-square rounded-lg overflow-hidden border-3 transition-all duration-200 hover:scale-105 hover:brightness-110 relative group ${
                    idx === imageModal.currentIdx 
                      ? 'border-[#C9A84C] shadow-2xl shadow-[#C9A84C]' 
                      : 'border-transparent hover:border-white/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={getImageUrl(img)} 
                    alt={`${currentRealisation.titre} - ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx + 1}
                  </div>
                </button>
              ))}
            </div>

            {/* Main Modal Image */}
            <div className="flex-1 h-80 md:h-[500px] relative flex items-center justify-center">
              <img
                src={getImageUrl(currentRealisation.images[imageModal.currentIdx])}
                alt={currentRealisation.titre}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                }}
              />
              {/* Modal Counter */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 text-white text-sm px-4 py-2 rounded-xl shadow-2xl">
                {imageModal.currentIdx + 1} / {modalTotal}
              </div>
              {/* Title */}
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-gradient-to-t from-black/90 to-transparent text-white text-xl font-bold px-6 py-4 rounded-xl text-center max-w-md shadow-2xl">
                {currentRealisation.titre}
              </div>
            </div>

            {/* Nav Controls */}
            {modalTotal > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white text-2xl font-bold rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl"
                  aria-label="Image précédente"
                >
                  ←
                </button>
                <button
                  onClick={nextModalImage}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white text-2xl font-bold rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl"
                  aria-label="Image suivante"
                >
                  →
                </button>
              </>
            )}

            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white text-2xl font-bold rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-2xl"
              aria-label="Fermer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
