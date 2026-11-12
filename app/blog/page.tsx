'use client';

import { useState } from 'react';
import { useCms, resolveCmsMediaUrl } from '@/components/cms/CmsProvider';

export default function BlogPage() {
  const { getSectionContent, isSectionActive } = useCms();
  const blog = getSectionContent('blog');

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [search, setSearch] = useState('');
  const [activeArticle, setActiveArticle] = useState<any | null>(null);

  if (!isSectionActive('blog')) {
    return (
      <main className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 text-center">
        <p className="text-gray-400">Le blog est momentanément désactivé.</p>
      </main>
    );
  }

  const publishedArticles = Array.isArray(blog?.articles)
    ? [...blog.articles]
        .filter((a: any) => a.publie !== false)
        .sort((a: any, b: any) => (a.ordre ?? 0) - (b.ordre ?? 0))
    : [];

  const categories: string[] =
    Array.isArray(blog?.categories) && blog.categories.length > 0
      ? blog.categories
      : [
          'Tous',
          ...Array.from(new Set(publishedArticles.map((a: any) => a.categorie).filter(Boolean))),
        ];

  const filtered = publishedArticles.filter((a: any) => {
    const matchCat = selectedCategory === 'Tous' || a.categorie === selectedCategory;
    const matchSearch =
      !search.trim() ||
      a.titre?.toLowerCase().includes(search.toLowerCase()) ||
      a.extrait?.toLowerCase().includes(search.toLowerCase()) ||
      a.contenu?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
            {blog?.hero_subtitle || 'Le Journal WinStyle'}
          </p>
          <h1 className="text-5xl font-black text-white mb-3">
            {blog?.hero_title || 'Blog & Actualités'}
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            {blog?.hero_description}
          </p>
        </div>
      </section>

      {/* Barre de filtres et recherche */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-20 glass">
        <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex overflow-x-auto gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-navy-600 text-white shadow-glow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Rechercher un article..."
            className="border border-gray-200 rounded-xl px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-gold-400 w-full sm:w-64"
          />
        </div>
      </section>

      {/* Liste des articles */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              Aucun article publié ne correspond à votre recherche.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filtered.map((art: any, idx: number) => (
                <article
                  key={art.id || idx}
                  className="group card-modern bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-52 bg-navy-800 overflow-hidden">
                    <img
                      src={resolveCmsMediaUrl(
                        art.image || '/images/services/hotesses-stewards.jpg'
                      )}
                      alt={art.titre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {art.categorie && (
                      <span className="absolute top-3 left-3 bg-gold-400 text-navy-900 text-xs font-bold px-3 py-1 rounded-full">
                        {art.categorie}
                      </span>
                    )}
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                      {art.date && (
                        <span>
                          {new Date(art.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      {art.temps_lecture && <span>• {art.temps_lecture} de lecture</span>}
                    </div>
                    <h2 className="font-bold text-navy-700 text-lg mb-2 group-hover:text-gold-500 transition-colors">
                      {art.titre}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1 line-clamp-3">
                      {art.extrait}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs font-medium text-gray-400">
                        Par {art.auteur || 'WinStyle'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveArticle(art)}
                        className="text-navy-700 hover:text-gold-500 font-bold text-sm transition-colors"
                      >
                        Lire l&apos;article →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modale lecture complète d'article */}
      {activeArticle && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveArticle(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 bg-navy-900">
              <img
                src={resolveCmsMediaUrl(
                  activeArticle.image || '/images/services/hotesses-stewards.jpg'
                )}
                alt={activeArticle.titre}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white font-bold flex items-center justify-center transition"
              >
                ✕
              </button>
              <div className="absolute bottom-6 left-6 right-6 text-white">
                {activeArticle.categorie && (
                  <span className="inline-block bg-gold-400 text-navy-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    {activeArticle.categorie}
                  </span>
                )}
                <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                  {activeArticle.titre}
                </h2>
                <p className="text-xs text-white/70 mt-2">
                  Par {activeArticle.auteur || 'WinStyle'}
                  {activeArticle.date
                    ? ` · ${new Date(activeArticle.date).toLocaleDateString('fr-FR')}`
                    : ''}
                  {activeArticle.temps_lecture ? ` · ${activeArticle.temps_lecture}` : ''}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              {activeArticle.extrait && (
                <p className="text-navy-700 font-semibold text-base leading-relaxed border-l-4 border-gold-400 pl-4">
                  {activeArticle.extrait}
                </p>
              )}
              <div className="text-gray-700 leading-relaxed space-y-4 whitespace-pre-line text-sm sm:text-base">
                {activeArticle.contenu}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
