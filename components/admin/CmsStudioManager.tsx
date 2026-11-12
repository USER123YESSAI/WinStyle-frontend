'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { DEFAULT_CMS_DATA, resolveCmsMediaUrl } from '@/components/cms/CmsProvider';

interface CmsSectionRow {
  id?: number;
  section_key: string;
  title: string;
  actif: boolean;
  statut: 'publie' | 'brouillon';
  ordre: number;
  content: any;
  draft_content?: any | null;
  updatedBy?: string;
  updatedAt?: string;
}

const SECTION_META: {
  key: string;
  label: string;
  icon: string;
  previewPath: string;
  desc: string;
}[] = [
  {
    key: 'home_page',
    label: "Page d'accueil",
    icon: '🏠',
    previewPath: '/',
    desc: 'Hero, bannière événement, secteurs, valeurs et titres des sections.',
  },
  {
    key: 'about_page',
    label: 'À propos & Équipe',
    icon: '🏛️',
    previewPath: '/about',
    desc: 'Présentation, RASMA, mission, chiffres clés, valeurs, histoire (timeline) et équipe.',
  },
  {
    key: 'services_catalogue',
    label: 'Catalogue Services',
    icon: '🛎️',
    previewPath: '/services',
    desc: 'Secteurs, prestations détaillées, tarifs, images et options du formulaire.',
  },
  {
    key: 'blog',
    label: 'Blog & Actualités',
    icon: '📰',
    previewPath: '/blog',
    desc: 'Créer, modifier, publier ou mettre en brouillon des articles et actualités.',
  },
  {
    key: 'galerie',
    label: 'Galerie Photos',
    icon: '🖼️',
    previewPath: '/galerie',
    desc: 'Ajouter, remplacer, organiser et catégoriser les photos de la galerie.',
  },
  {
    key: 'faq',
    label: 'FAQ (Questions / Réponses)',
    icon: '❓',
    previewPath: '/contact',
    desc: 'Gérer et ordonner les questions et réponses fréquentes.',
  },
  {
    key: 'contact_info',
    label: 'Coordonnées & Réseaux',
    icon: '📍',
    previewPath: '/contact',
    desc: 'Téléphones, e-mails, adresse, horaires, réseaux sociaux et postes de candidature.',
  },
  {
    key: 'navigation',
    label: 'Navigation (Menu)',
    icon: '🧭',
    previewPath: '/',
    desc: 'Logo, liens du menu principal, ordre d’affichage et bouton d’action.',
  },
  {
    key: 'footer',
    label: 'Pied de page (Footer)',
    icon: '⚓',
    previewPath: '/',
    desc: 'Présentation marque, colonnes de liens, copyright et slogan.',
  },
  {
    key: 'seo',
    label: 'Référencement SEO',
    icon: '🔍',
    previewPath: '/',
    desc: 'Titres, descriptions, mots-clés et aperçu Google pour chaque page du site.',
  },
  {
    key: 'realisations_page',
    label: 'En-tête Réalisations & Formations',
    icon: '✨',
    previewPath: '/realisations',
    desc: 'Titres, sous-titres, filtres et appels à l’action des pages Réalisations et Formations.',
  },
];

// ── Composant réutilisable d'upload d'image CMS ───────────────────────────
function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.post('/cms/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        onChange(res.data.url);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Erreur lors du téléversement de l'image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-600 block">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {value && (
          <div className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0">
            <img
              src={resolveCmsMediaUrl(value)}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/... ou URL"
          className="flex-1 w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-gold-400"
        />
        <label className="cursor-pointer bg-navy-600 hover:bg-navy-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition whitespace-nowrap">
          {uploading ? 'Envoi...' : '📤 Téléverser'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs text-red-500 hover:text-red-700 font-medium"
          >
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

// Helper pour réordonner un tableau
function moveItem<T>(arr: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= arr.length) return arr;
  const copy = [...arr];
  const temp = copy[index];
  copy[index] = copy[target];
  copy[target] = temp;
  return copy.map((item: any, idx) =>
    typeof item === 'object' && item !== null ? { ...item, ordre: idx + 1 } : item
  );
}

export default function CmsStudioManager({ initialSectionKey }: { initialSectionKey?: string }) {
  const [sections, setSections] = useState<Record<string, CmsSectionRow>>({});
  const [activeKey, setActiveKey] = useState<string>(initialSectionKey || 'home_page');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [selectedSeoPage, setSelectedSeoPage] = useState<string>('/');

  useEffect(() => {
    if (initialSectionKey) setActiveKey(initialSectionKey);
  }, [initialSectionKey]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const res = await api.get('/cms/admin');
      const rows: CmsSectionRow[] = Array.isArray(res.data?.data) ? res.data.data : [];
      const map: Record<string, CmsSectionRow> = {};

      for (const meta of SECTION_META) {
        const found = rows.find((r) => r.section_key === meta.key);
        const def = DEFAULT_CMS_DATA[meta.key]?.content || {};
        map[meta.key] = found
          ? {
              ...found,
              content: { ...def, ...(found.draft_content || found.content || {}) },
            }
          : {
              section_key: meta.key,
              title: meta.label,
              actif: true,
              statut: 'publie',
              ordre: 1,
              content: JSON.parse(JSON.stringify(def)),
            };
      }
      // Aussi charger formations_page
      const formPageRow = rows.find((r) => r.section_key === 'formations_page');
      map['formations_page'] = formPageRow
        ? {
            ...formPageRow,
            content: {
              ...(DEFAULT_CMS_DATA['formations_page']?.content || {}),
              ...(formPageRow.draft_content || formPageRow.content || {}),
            },
          }
        : {
            section_key: 'formations_page',
            title: 'Page Formations',
            actif: true,
            statut: 'publie',
            ordre: 9,
            content: JSON.parse(
              JSON.stringify(DEFAULT_CMS_DATA['formations_page']?.content || {})
            ),
          };

      setSections(map);
    } catch {
      // Fallback aux valeurs par défaut
      const map: Record<string, CmsSectionRow> = {};
      for (const [k, v] of Object.entries(DEFAULT_CMS_DATA)) {
        map[k] = {
          section_key: k,
          title: k,
          actif: v.actif,
          statut: 'publie',
          ordre: 1,
          content: JSON.parse(JSON.stringify(v.content)),
        };
      }
      setSections(map);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const currentSection = sections[activeKey] || {
    section_key: activeKey,
    title: activeKey,
    actif: true,
    statut: 'publie',
    ordre: 1,
    content: DEFAULT_CMS_DATA[activeKey]?.content || {},
  };

  const c = currentSection.content || {};

  const updateContent = (updater: (prevContent: any) => any) => {
    setSections((prev) => {
      const curr = prev[activeKey] || currentSection;
      const nextContent = updater(JSON.parse(JSON.stringify(curr.content || {})));
      return {
        ...prev,
        [activeKey]: {
          ...curr,
          content: nextContent,
        },
      };
    });
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setFeedback(null);
    try {
      const sec = sections[activeKey];
      const res = await api.put(`/cms/${activeKey}`, {
        title: sec.title,
        actif: sec.actif,
        ordre: sec.ordre,
        content: sec.content,
        publish,
      });

      // Si on est sur realisations_page, sauvegarder aussi formations_page
      if (activeKey === 'realisations_page' && sections['formations_page']) {
        await api.put('/cms/formations_page', {
          title: sections['formations_page'].title,
          actif: sections['formations_page'].actif,
          ordre: sections['formations_page'].ordre,
          content: sections['formations_page'].content,
          publish,
        });
      }

      setSections((prev) => ({
        ...prev,
        [activeKey]: {
          ...prev[activeKey],
          statut: publish ? 'publie' : 'brouillon',
        },
      }));
      setFeedback({
        type: 'success',
        text:
          res.data?.message ||
          (publish ? 'Publié avec succès !' : 'Brouillon enregistré avec succès.'),
      });
    } catch (err: any) {
      setFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Erreur lors de la sauvegarde.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleSection = async () => {
    try {
      const res = await api.patch(`/cms/${activeKey}/toggle`);
      const newActif = res.data?.data?.actif ?? !currentSection.actif;
      setSections((prev) => ({
        ...prev,
        [activeKey]: { ...prev[activeKey], actif: newActif },
      }));
      setFeedback({
        type: 'success',
        text: newActif
          ? 'Section activée sur le site public.'
          : 'Section désactivée sur le site public.',
      });
    } catch {
      setFeedback({ type: 'error', text: 'Impossible de modifier la visibilité.' });
    }
  };

  const handlePreview = async () => {
    await handleSave(false);
    const meta = SECTION_META.find((m) => m.key === activeKey);
    const path = meta?.previewPath || '/';
    window.open(`${path}?cms_preview=1`, '_blank');
  };

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const activeMeta = SECTION_META.find((m) => m.key === activeKey) || SECTION_META[0];

  return (
    <div className="space-y-6">
      {/* En-tête CMS Studio */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 text-white rounded-2xl p-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <span className="inline-block bg-gold-400/20 text-gold-400 border border-gold-400/40 text-xs font-bold px-3 py-1 rounded-full mb-2">
              ✨ CMS Intégré — Gestion 100 % Dynamique
            </span>
            <h2 className="text-2xl font-black">Gestionnaire de Contenu du Site (CMS)</h2>
            <p className="text-white/70 text-sm mt-1">
              Personnalisez toutes les pages, sections, images, menus, FAQ, blog, galerie et SEO en
              temps réel.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleToggleSection}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${
                currentSection.actif
                  ? 'bg-green-500/20 text-green-300 border border-green-400/40 hover:bg-green-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-400/40 hover:bg-red-500/30'
              }`}
            >
              {currentSection.actif ? '🟢 Section Active' : '🔴 Section Désactivée'}
            </button>
            <button
              type="button"
              onClick={handlePreview}
              disabled={saving}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition"
            >
              👁️ Brouillon & Prévisualiser
            </button>
            <button
              type="button"
              onClick={() => handleSave(true)}
              disabled={saving}
              className="bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 px-5 py-2.5 rounded-xl text-xs font-black shadow-glow transition"
            >
              {saving ? 'Enregistrement...' : '🚀 Publier sur le site'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation par onglets des modules CMS */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {SECTION_META.map((m) => {
          const sec = sections[m.key];
          const isSelected = activeKey === m.key;
          return (
            <button
              key={m.key}
              type="button"
              onClick={() => {
                setActiveKey(m.key);
                setFeedback(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                isSelected
                  ? 'bg-navy-600 text-white border-navy-600 shadow-md'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{m.icon}</span>
              <span>{m.label}</span>
              {sec?.statut === 'brouillon' && (
                <span className="w-2 h-2 rounded-full bg-amber-400" title="Brouillon non publié" />
              )}
              {sec && !sec.actif && (
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded">
                  Masqué
                </span>
              )}
            </button>
          );
        })}
      </div>

      {feedback && (
        <div
          className={`px-4 py-3 rounded-xl text-sm font-medium border ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {feedback.text}
        </div>
      )}

      {/* Bandeau info de la section active */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-navy-700 text-lg flex items-center gap-2">
            <span>{activeMeta.icon}</span> {activeMeta.label}
            {currentSection.statut === 'brouillon' && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-semibold">
                🟠 Brouillon en attente de publication
              </span>
            )}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{activeMeta.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-xs font-semibold text-gray-700 transition"
          >
            💾 Enregistrer brouillon
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-navy-600 hover:bg-navy-700 text-white text-xs font-bold transition"
          >
            🚀 Publier les modifications
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          1. PAGE D'ACCUEIL (home_page)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'home_page' && (
        <div className="space-y-6">
          {/* Hero */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">🎯 Section Hero (Bannière principale)</h4>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={c.hero?.actif !== false}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero = { ...(d.hero || {}), actif: e.target.checked };
                      return d;
                    })
                  }
                />
                Afficher cette section
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Badge supérieur</label>
                <input
                  type="text"
                  value={c.hero?.badge || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.badge = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre (partie 1)</label>
                <input
                  type="text"
                  value={c.hero?.title_prefix || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.title_prefix = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre doré (partie 2)</label>
                <input
                  type="text"
                  value={c.hero?.title_highlight || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.title_highlight = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Slogan / Sous-titre</label>
              <input
                type="text"
                value={c.hero?.subtitle || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.hero.subtitle = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description principale</label>
              <textarea
                rows={3}
                value={c.hero?.description || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.hero.description = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <ImageField
              label="Image d'arrière-plan du Hero"
              value={c.hero?.bg_image || ''}
              onChange={(url) =>
                updateContent((d) => {
                  d.hero.bg_image = url;
                  return d;
                })
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Bouton 1 (Texte)</label>
                <input
                  type="text"
                  value={c.hero?.primary_btn_label || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.primary_btn_label = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Bouton 1 (Lien)</label>
                <input
                  type="text"
                  value={c.hero?.primary_btn_href || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.primary_btn_href = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Bouton 2 (Texte)</label>
                <input
                  type="text"
                  value={c.hero?.secondary_btn_label || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.secondary_btn_label = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Bouton 2 (Lien)</label>
                <input
                  type="text"
                  value={c.hero?.secondary_btn_href || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.secondary_btn_href = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Stats du Hero */}
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-navy-700">Chiffres clés sous le Hero</label>
                <button
                  type="button"
                  onClick={() =>
                    updateContent((d) => {
                      d.hero.stats = [
                        ...(d.hero?.stats || []),
                        { id: `st-${Date.now()}`, value: '100%', label: 'Satisfaction', actif: true },
                      ];
                      return d;
                    })
                  }
                  className="text-xs bg-gold-400/20 text-navy-800 font-bold px-3 py-1 rounded-lg"
                >
                  + Ajouter un chiffre
                </button>
              </div>
              <div className="space-y-2">
                {(c.hero?.stats || []).map((st: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={st.value || ''}
                      placeholder="Valeur (ex: 3)"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.hero.stats[idx].value = e.target.value;
                          return d;
                        })
                      }
                      className="w-28 border rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={st.label || ''}
                      placeholder="Libellé"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.hero.stats[idx].label = e.target.value;
                          return d;
                        })
                      }
                      className="flex-1 border rounded-lg px-3 py-1.5 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.hero.stats.splice(idx, 1);
                          return d;
                        })
                      }
                      className="text-red-500 text-xs px-2"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bannière Événement */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">🏆 Bannière Événement / Annonce (ex: RASMA)</h4>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={c.banner?.actif !== false}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.banner = { ...(d.banner || {}), actif: e.target.checked };
                      return d;
                    })
                  }
                />
                Afficher cette bannière
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre</label>
                <input
                  type="text"
                  value={c.banner?.title || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.banner.title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Texte bouton</label>
                <input
                  type="text"
                  value={c.banner?.btn_label || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.banner.btn_label = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Lien bouton</label>
                <input
                  type="text"
                  value={c.banner?.btn_href || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.banner.btn_href = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
              <input
                type="text"
                value={c.banner?.description || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.banner.description = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Section Secteurs sur l'accueil */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">✨ Section « Nos Secteurs » sur l&apos;accueil</h4>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={c.secteurs_section?.actif !== false}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.secteurs_section = { ...(d.secteurs_section || {}), actif: e.target.checked };
                      return d;
                    })
                  }
                />
                Afficher cette section
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Surtitre</label>
                <input
                  type="text"
                  value={c.secteurs_section?.subtitle || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.secteurs_section.subtitle = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre</label>
                <input
                  type="text"
                  value={c.secteurs_section?.title || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.secteurs_section.title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="space-y-4">
              {(c.secteurs_section?.items || []).map((sec: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-700">
                      Carte Secteur #{idx + 1} — {sec.titre}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.secteurs_section.items = moveItem(d.secteurs_section.items, idx, -1);
                            return d;
                          })
                        }
                        className="px-2 py-1 text-xs bg-white border rounded"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.secteurs_section.items = moveItem(d.secteurs_section.items, idx, 1);
                            return d;
                          })
                        }
                        className="px-2 py-1 text-xs bg-white border rounded"
                      >
                        ↓
                      </button>
                      <label className="text-xs flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={sec.actif !== false}
                          onChange={(e) =>
                            updateContent((d) => {
                              d.secteurs_section.items[idx].actif = e.target.checked;
                              return d;
                            })
                          }
                        />
                        Actif
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={sec.num || ''}
                      placeholder="Numéro (01)"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.secteurs_section.items[idx].num = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={sec.titre || ''}
                      placeholder="Titre"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.secteurs_section.items[idx].titre = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={sec.sous || ''}
                      placeholder="Sous-titre"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.secteurs_section.items[idx].sous = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={sec.desc || ''}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.secteurs_section.items[idx].desc = e.target.value;
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-3 py-1.5 text-xs"
                  />
                  <ImageField
                    label="Image du secteur"
                    value={sec.img || ''}
                    onChange={(url) =>
                      updateContent((d) => {
                        d.secteurs_section.items[idx].img = url;
                        return d;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Visibilité et titres des sections Témoignages, Partenaires et FAQ sur l'accueil */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-navy-700 border-b pb-3">
              🎛️ Affichage des sections Témoignages, Partenaires & FAQ sur l&apos;accueil
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border space-y-2">
                <label className="flex items-center justify-between font-bold text-xs text-navy-700">
                  <span>💬 Section Témoignages</span>
                  <input
                    type="checkbox"
                    checked={c.temoignages_section?.actif !== false}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.temoignages_section = {
                          ...(d.temoignages_section || {}),
                          actif: e.target.checked,
                        };
                        return d;
                      })
                    }
                  />
                </label>
                <input
                  type="text"
                  value={c.temoignages_section?.title || ''}
                  placeholder="Titre section"
                  onChange={(e) =>
                    updateContent((d) => {
                      d.temoignages_section.title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs"
                />
                <textarea
                  rows={2}
                  value={c.temoignages_section?.description || ''}
                  placeholder="Sous-titre"
                  onChange={(e) =>
                    updateContent((d) => {
                      d.temoignages_section.description = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border space-y-2">
                <label className="flex items-center justify-between font-bold text-xs text-navy-700">
                  <span>🤝 Section Partenaires</span>
                  <input
                    type="checkbox"
                    checked={c.partenaires_section?.actif !== false}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.partenaires_section = {
                          ...(d.partenaires_section || {}),
                          actif: e.target.checked,
                        };
                        return d;
                      })
                    }
                  />
                </label>
                <input
                  type="text"
                  value={c.partenaires_section?.title || ''}
                  placeholder="Titre (NOS PARTENAIRES)"
                  onChange={(e) =>
                    updateContent((d) => {
                      d.partenaires_section.title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border space-y-2">
                <label className="flex items-center justify-between font-bold text-xs text-navy-700">
                  <span>❓ Aperçu FAQ sur l&apos;accueil</span>
                  <input
                    type="checkbox"
                    checked={c.faq_preview_section?.actif !== false}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.faq_preview_section = {
                          ...(d.faq_preview_section || {}),
                          actif: e.target.checked,
                        };
                        return d;
                      })
                    }
                  />
                </label>
                <p className="text-[11px] text-gray-500">
                  Affiche automatiquement les 4 premières questions de l&apos;onglet FAQ en bas de
                  la page d&apos;accueil.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          2. PAGE À PROPOS & ÉQUIPE (about_page)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'about_page' && (
        <div className="space-y-6">
          {/* Hero RASMA */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">🏆 Bannière Hero (RASMA / Présentation)</h4>
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={c.hero?.actif !== false}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero = { ...(d.hero || {}), actif: e.target.checked };
                      return d;
                    })
                  }
                />
                Afficher
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Badge</label>
                <input
                  type="text"
                  value={c.hero?.badge || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.badge = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre (préfixe)</label>
                <input
                  type="text"
                  value={c.hero?.title_prefix || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.title_prefix = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre doré</label>
                <input
                  type="text"
                  value={c.hero?.title_highlight || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero.title_highlight = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Sous-titre</label>
              <input
                type="text"
                value={c.hero?.subtitle || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.hero.subtitle = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Texte Mission Principale</label>
              <textarea
                rows={3}
                value={c.hero?.mission_text || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.hero.mission_text = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <ImageField
              label="Image de fond du Hero À propos"
              value={c.hero?.bg_image || ''}
              onChange={(url) =>
                updateContent((d) => {
                  d.hero.bg_image = url;
                  return d;
                })
              }
            />
          </div>

          {/* Notre Mission & Chiffres clés */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">🎯 Présentation, Mission & Chiffres clés</h4>
              <label className="flex items-center gap-2 text-xs font-semibold">
                <input
                  type="checkbox"
                  checked={c.mission?.actif !== false}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.mission = { ...(d.mission || {}), actif: e.target.checked };
                      return d;
                    })
                  }
                />
                Afficher
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Surtitre</label>
                <input
                  type="text"
                  value={c.mission?.subtitle || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.mission.subtitle = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre</label>
                <input
                  type="text"
                  value={c.mission?.title || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.mission.title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Paragraphes de présentation (un paragraphe par ligne)
              </label>
              <textarea
                rows={5}
                value={(c.mission?.paragraphs || []).join('\n\n')}
                onChange={(e) =>
                  updateContent((d) => {
                    d.mission.paragraphs = e.target.value
                      .split(/\n\s*\n/)
                      .map((s: string) => s.trim())
                      .filter(Boolean);
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Parcours / Timeline */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">📅 Histoire & Parcours (« WinStyle en dates »)</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    d.timeline.items = [
                      ...(d.timeline?.items || []),
                      {
                        annee: '2026',
                        titre: 'Nouvelle étape',
                        desc: 'Description...',
                        highlight: false,
                        actif: true,
                      },
                    ];
                    return d;
                  })
                }
                className="text-xs bg-gold-400 text-navy-900 font-bold px-3 py-1.5 rounded-lg"
              >
                + Ajouter une date
              </button>
            </div>
            <div className="space-y-3">
              {(c.timeline?.items || []).map((item: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-50 border flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <input
                    type="text"
                    value={item.annee || ''}
                    placeholder="Année"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.timeline.items[idx].annee = e.target.value;
                        return d;
                      })
                    }
                    className="w-24 border rounded-lg px-2.5 py-1.5 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={item.titre || ''}
                    placeholder="Titre de l'étape"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.timeline.items[idx].titre = e.target.value;
                        return d;
                      })
                    }
                    className="w-48 border rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                  />
                  <input
                    type="text"
                    value={item.desc || ''}
                    placeholder="Description"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.timeline.items[idx].desc = e.target.value;
                        return d;
                      })
                    }
                    className="flex-1 w-full border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.timeline.items = moveItem(d.timeline.items, idx, -1);
                          return d;
                        })
                      }
                      className="px-2 py-1 text-xs bg-white border rounded"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.timeline.items = moveItem(d.timeline.items, idx, 1);
                          return d;
                        })
                      }
                      className="px-2 py-1 text-xs bg-white border rounded"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.timeline.items.splice(idx, 1);
                          return d;
                        })
                      }
                      className="text-red-500 text-xs px-2"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Équipe */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">👥 Direction & Équipe</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    d.equipe.membres = [
                      ...(d.equipe?.membres || []),
                      {
                        id: `mem-${Date.now()}`,
                        nom: 'Nouveau Membre',
                        role: 'Fonction',
                        desc: 'Présentation du membre...',
                        photo: '',
                        initiale: 'M',
                        actif: true,
                      },
                    ];
                    return d;
                  })
                }
                className="text-xs bg-gold-400 text-navy-900 font-bold px-3 py-1.5 rounded-lg"
              >
                + Ajouter un membre
              </button>
            </div>

            {/* Fondatrice */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-gold-200 space-y-3">
              <p className="text-xs font-bold text-navy-700 uppercase">Carte Principale — Fondatrice / Direction</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={c.equipe?.fondatrice?.nom || ''}
                  placeholder="Nom complet"
                  onChange={(e) =>
                    updateContent((d) => {
                      d.equipe.fondatrice.nom = e.target.value;
                      return d;
                    })
                  }
                  className="border rounded-lg px-3 py-1.5 text-xs font-bold"
                />
                <input
                  type="text"
                  value={c.equipe?.fondatrice?.role || ''}
                  placeholder="Titre / Rôle"
                  onChange={(e) =>
                    updateContent((d) => {
                      d.equipe.fondatrice.role = e.target.value;
                      return d;
                    })
                  }
                  className="border rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
              <textarea
                rows={2}
                value={c.equipe?.fondatrice?.bio_1 || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.equipe.fondatrice.bio_1 = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-1.5 text-xs"
              />
              <ImageField
                label="Photo de la Fondatrice"
                value={c.equipe?.fondatrice?.photo || ''}
                onChange={(url) =>
                  updateContent((d) => {
                    d.equipe.fondatrice.photo = url;
                    return d;
                  })
                }
              />
            </div>

            {/* Membres */}
            <div className="space-y-3">
              {(c.equipe?.membres || []).map((m: any, idx: number) => (
                <div key={m.id || idx} className="p-4 rounded-xl bg-gray-50 border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-700">
                      Membre #{idx + 1} — {m.nom}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.equipe.membres = moveItem(d.equipe.membres, idx, -1);
                            return d;
                          })
                        }
                        className="px-2 py-1 text-xs bg-white border rounded"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.equipe.membres = moveItem(d.equipe.membres, idx, 1);
                            return d;
                          })
                        }
                        className="px-2 py-1 text-xs bg-white border rounded"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.equipe.membres.splice(idx, 1);
                            return d;
                          })
                        }
                        className="text-xs text-red-500 font-semibold"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={m.nom || ''}
                      placeholder="Nom"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.equipe.membres[idx].nom = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={m.role || ''}
                      placeholder="Rôle"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.equipe.membres[idx].role = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={m.desc || ''}
                    placeholder="Description"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.equipe.membres[idx].desc = e.target.value;
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-3 py-1.5 text-xs"
                  />
                  <ImageField
                    label="Photo du membre"
                    value={m.photo || ''}
                    onChange={(url) =>
                      updateContent((d) => {
                        d.equipe.membres[idx].photo = url;
                        return d;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          3. CATALOGUE DES SERVICES (services_catalogue)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'services_catalogue' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-navy-700 border-b pb-3">En-tête de la page Services</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Surtitre</label>
                <input
                  type="text"
                  value={c.hero_subtitle || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero_subtitle = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre principal</label>
                <input
                  type="text"
                  value={c.hero_title || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero_title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description</label>
              <textarea
                rows={2}
                value={c.hero_description || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.hero_description = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Liste des secteurs et prestations */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">🛎️ Pôles / Secteurs & Prestations détaillées</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    const nextIdx = (d.secteurs?.length || 0) + 1;
                    d.secteurs = [
                      ...(d.secteurs || []),
                      {
                        id: `srv-sec-${Date.now()}`,
                        num: String(nextIdx).padStart(2, '0'),
                        icon: '✨',
                        titre: 'Nouveau Secteur',
                        img: '/images/services/hotesses-stewards.jpg',
                        couleur: 'bg-blue-900',
                        detail: 'Slogan ou tarif indicatif',
                        actif: true,
                        ordre: nextIdx,
                        services: [
                          { label: 'Nouvelle prestation', desc: 'Description de la prestation', actif: true },
                        ],
                      },
                    ];
                    return d;
                  })
                }
                className="bg-gold-400 hover:bg-gold-300 text-navy-900 font-bold text-xs px-4 py-2 rounded-xl"
              >
                + Ajouter un Pôle / Secteur
              </button>
            </div>

            {(c.secteurs || []).map((sec: any, sIdx: number) => (
              <div key={sec.id || sIdx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <span className="font-black text-navy-700 text-sm">
                    {sec.icon} {sec.num} — {sec.titre}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.secteurs = moveItem(d.secteurs, sIdx, -1);
                          return d;
                        })
                      }
                      className="px-2.5 py-1 text-xs bg-white border rounded"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.secteurs = moveItem(d.secteurs, sIdx, 1);
                          return d;
                        })
                      }
                      className="px-2.5 py-1 text-xs bg-white border rounded"
                    >
                      ↓
                    </button>
                    <label className="text-xs font-semibold flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={sec.actif !== false}
                        onChange={(e) =>
                          updateContent((d) => {
                            d.secteurs[sIdx].actif = e.target.checked;
                            return d;
                          })
                        }
                      />
                      Publié
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.secteurs.splice(sIdx, 1);
                          return d;
                        })
                      }
                      className="text-xs text-red-500 font-semibold ml-2"
                    >
                      Supprimer le pôle
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={sec.num || ''}
                    placeholder="N° (01)"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.secteurs[sIdx].num = e.target.value;
                        return d;
                      })
                    }
                    className="border rounded-lg px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={sec.icon || ''}
                    placeholder="Icône (👔)"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.secteurs[sIdx].icon = e.target.value;
                        return d;
                      })
                    }
                    className="border rounded-lg px-3 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={sec.titre || ''}
                    placeholder="Titre du pôle"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.secteurs[sIdx].titre = e.target.value;
                        return d;
                      })
                    }
                    className="sm:col-span-2 border rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                </div>

                <input
                  type="text"
                  value={sec.detail || ''}
                  placeholder="Sous-texte / Tarif indicatif"
                  onChange={(e) =>
                    updateContent((d) => {
                      d.secteurs[sIdx].detail = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-1.5 text-xs"
                />

                <ImageField
                  label="Image illustrant ce pôle"
                  value={sec.img || ''}
                  onChange={(url) =>
                    updateContent((d) => {
                      d.secteurs[sIdx].img = url;
                      return d;
                    })
                  }
                />

                {/* Prestations du pôle */}
                <div className="bg-white rounded-xl p-4 border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-600">
                      Prestations incluses dans ce pôle ({(sec.services || []).length})
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateContent((d) => {
                          d.secteurs[sIdx].services = [
                            ...(d.secteurs[sIdx].services || []),
                            { label: 'Nouveau service', desc: 'Description...', actif: true },
                          ];
                          return d;
                        })
                      }
                      className="text-xs bg-navy-600 text-white px-2.5 py-1 rounded-lg font-semibold"
                    >
                      + Ajouter une prestation
                    </button>
                  </div>
                  {(sec.services || []).map((srv: any, j: number) => (
                    <div key={j} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pt-2 border-t first:border-t-0">
                      <input
                        type="text"
                        value={srv.label || ''}
                        placeholder="Nom du service"
                        onChange={(e) =>
                          updateContent((d) => {
                            d.secteurs[sIdx].services[j].label = e.target.value;
                            return d;
                          })
                        }
                        className="w-full sm:w-56 border rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={srv.desc || ''}
                        placeholder="Description / tarif"
                        onChange={(e) =>
                          updateContent((d) => {
                            d.secteurs[sIdx].services[j].desc = e.target.value;
                            return d;
                          })
                        }
                        className="flex-1 w-full border rounded-lg px-2.5 py-1.5 text-xs"
                      />
                      <label className="text-xs flex items-center gap-1 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={srv.actif !== false}
                          onChange={(e) =>
                            updateContent((d) => {
                              d.secteurs[sIdx].services[j].actif = e.target.checked;
                              return d;
                            })
                          }
                        />
                        Actif
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.secteurs[sIdx].services.splice(j, 1);
                            return d;
                          })
                        }
                        className="text-red-500 text-xs px-1.5"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          4. BLOG & ACTUALITÉS (blog)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'blog' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">📰 Articles du Blog ({(c.articles || []).length})</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    d.articles = [
                      {
                        id: `art-${Date.now()}`,
                        titre: 'Nouvel article WinStyle',
                        extrait: "Résumé court de l'article...",
                        contenu: "Rédigez le contenu complet de l'article ici...",
                        categorie: 'Événementiel',
                        auteur: 'WinStyle',
                        date: new Date().toISOString().slice(0, 10),
                        image: '/images/services/hotesses-stewards.jpg',
                        temps_lecture: '3 min',
                        publie: true,
                        ordre: 1,
                      },
                      ...(d.articles || []),
                    ];
                    return d;
                  })
                }
                className="bg-gold-400 hover:bg-gold-300 text-navy-900 font-bold text-xs px-4 py-2 rounded-xl"
              >
                + Nouvel Article
              </button>
            </div>

            <div className="space-y-4">
              {(c.articles || []).map((art: any, idx: number) => (
                <div key={art.id || idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-bold text-navy-700 text-sm">
                      {art.publie !== false ? '🟢 Publié' : '🟠 Brouillon'} — {art.titre}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.articles = moveItem(d.articles, idx, -1);
                            return d;
                          })
                        }
                        className="px-2 py-1 text-xs bg-white border rounded"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.articles = moveItem(d.articles, idx, 1);
                            return d;
                          })
                        }
                        className="px-2 py-1 text-xs bg-white border rounded"
                      >
                        ↓
                      </button>
                      <label className="text-xs font-semibold flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={art.publie !== false}
                          onChange={(e) =>
                            updateContent((d) => {
                              d.articles[idx].publie = e.target.checked;
                              return d;
                            })
                          }
                        />
                        Publié
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.articles.splice(idx, 1);
                            return d;
                          })
                        }
                        className="text-xs text-red-500 font-semibold ml-2"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                      type="text"
                      value={art.titre || ''}
                      placeholder="Titre de l'article"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.articles[idx].titre = e.target.value;
                          return d;
                        })
                      }
                      className="sm:col-span-2 border rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={art.categorie || ''}
                      placeholder="Catégorie"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.articles[idx].categorie = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                    <input
                      type="date"
                      value={art.date || ''}
                      onChange={(e) =>
                        updateContent((d) => {
                          d.articles[idx].date = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={art.auteur || ''}
                      placeholder="Auteur"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.articles[idx].auteur = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                    <input
                      type="text"
                      value={art.temps_lecture || ''}
                      placeholder="Temps de lecture (ex: 4 min)"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.articles[idx].temps_lecture = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Résumé / Extrait</label>
                    <textarea
                      rows={2}
                      value={art.extrait || ''}
                      onChange={(e) =>
                        updateContent((d) => {
                          d.articles[idx].extrait = e.target.value;
                          return d;
                        })
                      }
                      className="w-full border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1">Contenu complet de l&apos;article</label>
                    <textarea
                      rows={5}
                      value={art.contenu || ''}
                      onChange={(e) =>
                        updateContent((d) => {
                          d.articles[idx].contenu = e.target.value;
                          return d;
                        })
                      }
                      className="w-full border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>

                  <ImageField
                    label="Image de couverture"
                    value={art.image || ''}
                    onChange={(url) =>
                      updateContent((d) => {
                        d.articles[idx].image = url;
                        return d;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          5. GALERIE PHOTOS (galerie)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'galerie' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">🖼️ Photos de la Galerie ({(c.items || []).length})</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    d.items = [
                      {
                        id: `gal-${Date.now()}`,
                        titre: 'Nouvelle photo',
                        legende: 'Description de la photo...',
                        categorie: 'Événementiel',
                        image: '/images/services/hotesses-stewards.jpg',
                        actif: true,
                        ordre: 1,
                      },
                      ...(d.items || []),
                    ];
                    return d;
                  })
                }
                className="bg-gold-400 hover:bg-gold-300 text-navy-900 font-bold text-xs px-4 py-2 rounded-xl"
              >
                + Ajouter une Photo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(c.items || []).map((item: any, idx: number) => (
                <div key={item.id || idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-700 truncate">{item.titre}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.items = moveItem(d.items, idx, -1);
                            return d;
                          })
                        }
                        className="px-2 py-0.5 text-xs bg-white border rounded"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.items = moveItem(d.items, idx, 1);
                            return d;
                          })
                        }
                        className="px-2 py-0.5 text-xs bg-white border rounded"
                      >
                        ↓
                      </button>
                      <label className="text-xs flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={item.actif !== false}
                          onChange={(e) =>
                            updateContent((d) => {
                              d.items[idx].actif = e.target.checked;
                              return d;
                            })
                          }
                        />
                        Actif
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.items.splice(idx, 1);
                            return d;
                          })
                        }
                        className="text-xs text-red-500 font-semibold ml-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={item.titre || ''}
                      placeholder="Titre"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.items[idx].titre = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-2.5 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={item.categorie || ''}
                      placeholder="Catégorie"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.items[idx].categorie = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.legende || ''}
                    placeholder="Légende"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.items[idx].legende = e.target.value;
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <ImageField
                    label="Fichier image"
                    value={item.image || ''}
                    onChange={(url) =>
                      updateContent((d) => {
                        d.items[idx].image = url;
                        return d;
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. FAQ (faq)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'faq' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">❓ Questions & Réponses ({(c.items || []).length})</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    d.items = [
                      ...(d.items || []),
                      {
                        id: `faq-${Date.now()}`,
                        question: 'Nouvelle question fréquente ?',
                        reponse: 'Votre réponse détaillée ici...',
                        categorie: 'Général',
                        actif: true,
                        ordre: (d.items?.length || 0) + 1,
                      },
                    ];
                    return d;
                  })
                }
                className="bg-gold-400 hover:bg-gold-300 text-navy-900 font-bold text-xs px-4 py-2 rounded-xl"
              >
                + Ajouter une Question
              </button>
            </div>

            <div className="space-y-3">
              {(c.items || []).map((q: any, idx: number) => (
                <div key={q.id || idx} className="p-4 rounded-xl bg-gray-50 border space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-navy-700">Question #{idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.items = moveItem(d.items, idx, -1);
                            return d;
                          })
                        }
                        className="px-2 py-0.5 text-xs bg-white border rounded"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.items = moveItem(d.items, idx, 1);
                            return d;
                          })
                        }
                        className="px-2 py-0.5 text-xs bg-white border rounded"
                      >
                        ↓
                      </button>
                      <label className="text-xs flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={q.actif !== false}
                          onChange={(e) =>
                            updateContent((d) => {
                              d.items[idx].actif = e.target.checked;
                              return d;
                            })
                          }
                        />
                        Actif
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateContent((d) => {
                            d.items.splice(idx, 1);
                            return d;
                          })
                        }
                        className="text-red-500 text-xs font-semibold"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={q.question || ''}
                      placeholder="Question"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.items[idx].question = e.target.value;
                          return d;
                        })
                      }
                      className="sm:col-span-2 border rounded-lg px-3 py-1.5 text-xs font-bold"
                    />
                    <input
                      type="text"
                      value={q.categorie || ''}
                      placeholder="Catégorie"
                      onChange={(e) =>
                        updateContent((d) => {
                          d.items[idx].categorie = e.target.value;
                          return d;
                        })
                      }
                      className="border rounded-lg px-3 py-1.5 text-xs"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={q.reponse || ''}
                    placeholder="Réponse..."
                    onChange={(e) =>
                      updateContent((d) => {
                        d.items[idx].reponse = e.target.value;
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          7. COORDONNÉES, RÉSEAUX SOCIAUX & CANDIDATURE (contact_info)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'contact_info' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-navy-700 border-b pb-3">📍 Coordonnées de Contact</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">E-mail principal</label>
                <input
                  type="email"
                  value={c.email_primary || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.email_primary = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">E-mail secondaire</label>
                <input
                  type="email"
                  value={c.email_secondary || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.email_secondary = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Téléphone principal (Tchad)</label>
                <input
                  type="text"
                  value={c.phone_primary || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.phone_primary = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Téléphone secondaire</label>
                <input
                  type="text"
                  value={c.phone_secondary || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.phone_secondary = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Adresse physique</label>
                <input
                  type="text"
                  value={c.address || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.address = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Horaires & Disponibilité</label>
                <input
                  type="text"
                  value={c.hours || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hours = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-navy-700 border-b pb-3">🌐 Réseaux Sociaux</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['facebook', 'instagram', 'linkedin', 'tiktok', 'youtube'].map((net) => (
                <div key={net}>
                  <label className="text-xs font-semibold text-gray-600 capitalize block mb-1">
                    {net}
                  </label>
                  <input
                    type="url"
                    value={c.socials?.[net] || ''}
                    placeholder={`https://${net}.com/...`}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.socials = { ...(d.socials || {}), [net]: e.target.value };
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">👤 Postes ouverts sur la page Candidature</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    d.candidature_postes = [
                      ...(d.candidature_postes || []),
                      { value: 'Nouveau poste', label: 'Nouveau poste', actif: true },
                    ];
                    return d;
                  })
                }
                className="text-xs bg-gold-400 text-navy-900 font-bold px-3 py-1.5 rounded-lg"
              >
                + Ajouter un poste
              </button>
            </div>
            <div className="space-y-2">
              {(c.candidature_postes || []).map((p: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={p.label || ''}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.candidature_postes[idx].label = e.target.value;
                        d.candidature_postes[idx].value = e.target.value;
                        return d;
                      })
                    }
                    className="flex-1 border rounded-lg px-3 py-1.5 text-xs font-semibold"
                  />
                  <label className="text-xs flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={p.actif !== false}
                      onChange={(e) =>
                        updateContent((d) => {
                          d.candidature_postes[idx].actif = e.target.checked;
                          return d;
                        })
                      }
                    />
                    Actif
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateContent((d) => {
                        d.candidature_postes.splice(idx, 1);
                        return d;
                      })
                    }
                    className="text-red-500 text-xs px-2"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          8. NAVIGATION / MENU (navigation)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'navigation' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-navy-700 border-b pb-3">Logo & Bouton d&apos;en-tête</h4>
            <ImageField
              label="Logo de l'en-tête"
              value={c.logo_url || ''}
              onChange={(url) =>
                updateContent((d) => {
                  d.logo_url = url;
                  return d;
                })
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Texte du bouton CTA</label>
                <input
                  type="text"
                  value={c.cta_label || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.cta_label = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Lien du bouton CTA</label>
                <input
                  type="text"
                  value={c.cta_href || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.cta_href = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={c.cta_visible !== false}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.cta_visible = e.target.checked;
                        return d;
                      })
                    }
                  />
                  Afficher le bouton CTA
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-navy-700">🧭 Liens du Menu Principal</h4>
              <button
                type="button"
                onClick={() =>
                  updateContent((d) => {
                    const nextOrdre = (d.links?.length || 0) + 1;
                    d.links = [
                      ...(d.links || []),
                      { id: `nav-${Date.now()}`, label: 'Nouveau lien', href: '/', actif: true, ordre: nextOrdre },
                    ];
                    return d;
                  })
                }
                className="bg-gold-400 text-navy-900 font-bold text-xs px-3 py-1.5 rounded-lg"
              >
                + Ajouter un lien
              </button>
            </div>
            <div className="space-y-2">
              {(c.links || []).map((l: any, idx: number) => (
                <div key={l.id || idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border">
                  <input
                    type="text"
                    value={l.label || ''}
                    placeholder="Libellé"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.links[idx].label = e.target.value;
                        return d;
                      })
                    }
                    className="w-44 border rounded-lg px-3 py-1.5 text-xs font-bold"
                  />
                  <input
                    type="text"
                    value={l.href || ''}
                    placeholder="/chemin"
                    onChange={(e) =>
                      updateContent((d) => {
                        d.links[idx].href = e.target.value;
                        return d;
                      })
                    }
                    className="flex-1 border rounded-lg px-3 py-1.5 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      updateContent((d) => {
                        d.links = moveItem(d.links, idx, -1);
                        return d;
                      })
                    }
                    className="px-2 py-1 text-xs bg-white border rounded"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateContent((d) => {
                        d.links = moveItem(d.links, idx, 1);
                        return d;
                      })
                    }
                    className="px-2 py-1 text-xs bg-white border rounded"
                  >
                    ↓
                  </button>
                  <label className="text-xs flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={l.actif !== false}
                      onChange={(e) =>
                        updateContent((d) => {
                          d.links[idx].actif = e.target.checked;
                          return d;
                        })
                      }
                    />
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateContent((d) => {
                        d.links.splice(idx, 1);
                        return d;
                      })
                    }
                    className="text-red-500 text-xs px-2"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          9. PIED DE PAGE / FOOTER (footer)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'footer' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h4 className="font-bold text-navy-700 border-b pb-3">⚓ Textes & Liens du Pied de Page</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Lettre du badge</label>
              <input
                type="text"
                value={c.badge_letter || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.badge_letter = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Nom marque (partie 1)</label>
              <input
                type="text"
                value={c.brand_prefix || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.brand_prefix = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Nom marque doré (partie 2)</label>
              <input
                type="text"
                value={c.brand_highlight || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.brand_highlight = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Texte de présentation</label>
            <textarea
              rows={3}
              value={c.description || ''}
              onChange={(e) =>
                updateContent((d) => {
                  d.description = e.target.value;
                  return d;
                })
              }
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Disponibilité</label>
              <input
                type="text"
                value={c.availability_text || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.availability_text = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Texte Copyright</label>
              <input
                type="text"
                value={c.copyright_text || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.copyright_text = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Slogan bas de page</label>
              <input
                type="text"
                value={c.slogan_text || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.slogan_text = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          10. RÉFÉRENCEMENT SEO PAR PAGE (seo)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'seo' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
            <h4 className="font-bold text-navy-700">🔍 Métadonnées SEO par Page</h4>
            <select
              value={selectedSeoPage}
              onChange={(e) => setSelectedSeoPage(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-2 text-xs font-bold text-navy-700"
            >
              <option value="/">Accueil (/)</option>
              <option value="/about">À propos (/about)</option>
              <option value="/services">Services (/services)</option>
              <option value="/formations">Formations (/formations)</option>
              <option value="/realisations">Réalisations (/realisations)</option>
              <option value="/galerie">Galerie (/galerie)</option>
              <option value="/blog">Blog (/blog)</option>
              <option value="/candidature">Candidature (/candidature)</option>
              <option value="/contact">Contact (/contact)</option>
            </select>
          </div>

          {(() => {
            const pSeo = c.pages?.[selectedSeoPage] || { title: '', description: '', keywords: '' };
            return (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Titre SEO de la page ({selectedSeoPage})
                  </label>
                  <input
                    type="text"
                    value={pSeo.title || ''}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.pages = d.pages || {};
                        d.pages[selectedSeoPage] = {
                          ...(d.pages[selectedSeoPage] || {}),
                          title: e.target.value,
                        };
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Meta Description (recommandé : 140 à 160 caractères)
                  </label>
                  <textarea
                    rows={3}
                    value={pSeo.description || ''}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.pages = d.pages || {};
                        d.pages[selectedSeoPage] = {
                          ...(d.pages[selectedSeoPage] || {}),
                          description: e.target.value,
                        };
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">
                    Mots-clés (séparés par des virgules)
                  </label>
                  <input
                    type="text"
                    value={pSeo.keywords || ''}
                    onChange={(e) =>
                      updateContent((d) => {
                        d.pages = d.pages || {};
                        d.pages[selectedSeoPage] = {
                          ...(d.pages[selectedSeoPage] || {}),
                          keywords: e.target.value,
                        };
                        return d;
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                {/* Aperçu Google SERP */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-[11px] font-bold uppercase text-gray-400 mb-2">
                    Aperçu dans les résultats Google
                  </p>
                  <p className="text-xs text-green-700 font-mono">
                    https://winstyle-agency.com{selectedSeoPage}
                  </p>
                  <p className="text-base text-blue-700 font-semibold hover:underline truncate mt-0.5">
                    {pSeo.title || "WinStyle — Win's Agency"}
                  </p>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                    {pSeo.description || 'Description de la page...'}
                  </p>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          11. EN-TÊTES RÉALISATIONS & FORMATIONS (realisations_page + formations_page)
      ══════════════════════════════════════════════════════════════════════ */}
      {activeKey === 'realisations_page' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-navy-700 border-b pb-3">🏆 Textes de la page Réalisations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Surtitre Hero</label>
                <input
                  type="text"
                  value={c.hero_subtitle || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero_subtitle = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre Hero</label>
                <input
                  type="text"
                  value={c.hero_title || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.hero_title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Description Hero</label>
              <textarea
                rows={2}
                value={c.hero_description || ''}
                onChange={(e) =>
                  updateContent((d) => {
                    d.hero_description = e.target.value;
                    return d;
                  })
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre Bannière CTA</label>
                <input
                  type="text"
                  value={c.cta_title || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.cta_title = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Texte Bouton CTA</label>
                <input
                  type="text"
                  value={c.cta_btn_label || ''}
                  onChange={(e) =>
                    updateContent((d) => {
                      d.cta_btn_label = e.target.value;
                      return d;
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <h4 className="font-bold text-navy-700 border-b pb-3">🎓 Textes de la page Formations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Titre de la page</label>
                <input
                  type="text"
                  value={sections['formations_page']?.content?.page_title || ''}
                  onChange={(e) =>
                    setSections((prev) => ({
                      ...prev,
                      formations_page: {
                        ...prev['formations_page'],
                        content: {
                          ...(prev['formations_page']?.content || {}),
                          page_title: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Sous-titre</label>
                <input
                  type="text"
                  value={sections['formations_page']?.content?.page_subtitle || ''}
                  onChange={(e) =>
                    setSections((prev) => ({
                      ...prev,
                      formations_page: {
                        ...prev['formations_page'],
                        content: {
                          ...(prev['formations_page']?.content || {}),
                          page_subtitle: e.target.value,
                        },
                      },
                    }))
                  }
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
