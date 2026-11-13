'use client';
import { useState } from 'react';
import {
  Handshake,
  Plus,
  Pencil,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Eye,
  EyeOff,
} from 'lucide-react';
import api from '@/lib/api';

export interface PartenaireItem {
  id: number;
  nom: string;
  logo?: string | null;
  site_web?: string | null;
  actif: boolean;
  ordre: number;
  createdAt?: string;
}

interface PartenairesManagerProps {
  partenaires: PartenaireItem[];
  setPartenaires: React.Dispatch<React.SetStateAction<PartenaireItem[]>>;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://winstyle-backend.onrender.com/api').replace(/\/api\/?$/, '');

export const resolveMediaUrl = (url?: string | null): string | null => {
  if (!url || url === 'null' || url === 'undefined') return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:') || url.startsWith('/images/')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    return `${API_BASE}${url}`;
  }
  return `${API_BASE}/uploads/${url}`;
};

const EMPTY_FORM = {
  nom: '',
  site_web: '',
  ordre: '1',
  actif: true,
};

export default function PartenairesManager({ partenaires, setPartenaires }: PartenairesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<PartenaireItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sortedPartenaires = [...partenaires].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0) || a.id - b.id);

  const filteredPartenaires = sortedPartenaires.filter((p) => {
    if (filter === 'active') return p.actif;
    if (filter === 'inactive') return !p.actif;
    return true;
  });

  const openCreate = () => {
    setEditingItem(null);
    const nextOrder = partenaires.length > 0 ? Math.max(...partenaires.map((p) => p.ordre || 0)) + 1 : 1;
    setForm({ ...EMPTY_FORM, ordre: String(nextOrder) });
    setLogoFile(null);
    setLogoPreview(null);
    setErrors({});
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (p: PartenaireItem) => {
    setEditingItem(p);
    setForm({
      nom: p.nom || '',
      site_web: p.site_web || '',
      ordre: String(p.ordre ?? 1),
      actif: Boolean(p.actif),
    });
    setLogoFile(null);
    setLogoPreview(resolveMediaUrl(p.logo));
    setErrors({});
    setMessage(null);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setLogoFile(file);
    setErrors((prev) => ({ ...prev, logo: '' }));
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoPreview(editingItem ? resolveMediaUrl(editingItem.logo) : null);
    }
  };

  const refreshList = async () => {
    const res = await api.get('/partenaires/admin');
    const data = Array.isArray(res.data) ? res.data : [];
    setPartenaires(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.nom.trim()) {
      newErrors.nom = 'Le nom du partenaire est obligatoire';
    }
    if (form.site_web.trim() && !/^https?:\/\/.+/i.test(form.site_web.trim())) {
      newErrors.site_web = "L'URL doit commencer par http:// ou https://";
    }
    if (!editingItem && !logoFile) {
      newErrors.logo = 'Veuillez sélectionner un logo pour ce partenaire';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('nom', form.nom.trim());
      formData.append('site_web', form.site_web.trim());
      formData.append('ordre', String(Number(form.ordre) || 0));
      formData.append('actif', String(form.actif));
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (editingItem) {
        await api.put(`/partenaires/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ type: 'success', text: 'Partenaire mis à jour avec succès !' });
      } else {
        await api.post('/partenaires', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ type: 'success', text: 'Partenaire ajouté avec succès !' });
      }

      await refreshList();
      setTimeout(() => {
        setShowForm(false);
        setEditingItem(null);
        setMessage(null);
      }, 1000);
    } catch (err: any) {
      const errMsg = err.response?.data?.errors?.[0] || err.response?.data?.message || 'Erreur lors de la sauvegarde';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActif = async (p: PartenaireItem) => {
    try {
      const res = await api.patch(`/partenaires/${p.id}/toggle`);
      const updated = res.data?.partenaire;
      setPartenaires((prev) =>
        prev.map((item) => (item.id === p.id ? { ...item, actif: updated ? updated.actif : !item.actif } : item))
      );
    } catch (err) {
      alert('Impossible de modifier le statut de ce partenaire.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...sortedPartenaires];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    setReordering(true);
    try {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;

      const items = list.map((item, idx) => ({ id: item.id, ordre: idx + 1 }));
      const res = await api.patch('/partenaires/reorder', { items });
      if (Array.isArray(res.data?.partenaires)) {
        setPartenaires(res.data.partenaires);
      } else {
        await refreshList();
      }
    } catch (err) {
      alert("Erreur lors du changement de l'ordre d'affichage.");
    } finally {
      setReordering(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer définitivement ce partenaire ?')) return;
    try {
      await api.delete(`/partenaires/${id}`);
      setPartenaires((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression du partenaire.');
    }
  };

  const inputCls = (err?: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all duration-300 ${
      err ? 'border-error-400 bg-error-50' : 'border-gray-300 hover:border-gray-400'
    }`;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-600 flex items-center gap-2.5">
            <Handshake className="w-6 h-6 text-gold-500" />
            <span>Nos Partenaires ({partenaires.length})</span>
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Gérez les logos, liens, la visibilité et l&apos;ordre d&apos;apparition dans le carrousel de la page d&apos;accueil.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-glow"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau partenaire</span>
        </button>
      </div>

      {/* Filtres rapides */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'all', label: `Tous (${partenaires.length})` },
          { key: 'active', label: `Actifs (${partenaires.filter((p) => p.actif).length})` },
          { key: 'inactive', label: `Masqués (${partenaires.filter((p) => !p.actif).length})` },
        ].map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              filter === f.key ? 'bg-navy-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Formulaire Création / Édition */}
      {showForm && (
        <div className="card-modern bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-navy-600 text-base flex items-center gap-2">
              {editingItem ? (
                <>
                  <Pencil className="w-4 h-4 text-gold-500" />
                  <span>Modifier « {editingItem.nom} »</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-gold-500" />
                  <span>Ajouter un partenaire</span>
                </>
              )}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              aria-label="Fermer"
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-success-50 text-success-700 border border-success-200'
                  : 'bg-error-50 text-error-700 border border-error-200'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-navy-600 mb-1 block">Nom du partenaire *</label>
              <input
                type="text"
                value={form.nom}
                placeholder="Ex : RASMA, Ministère, Entreprise..."
                onChange={(e) => {
                  setForm((p) => ({ ...p, nom: e.target.value }));
                  setErrors((p) => ({ ...p, nom: '' }));
                }}
                className={inputCls(errors.nom)}
              />
              {errors.nom && <p className="text-xs text-error-500 mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-600 mb-1 block">Lien du site web (optionnel)</label>
              <input
                type="url"
                value={form.site_web}
                placeholder="https://www.exemple.com"
                onChange={(e) => {
                  setForm((p) => ({ ...p, site_web: e.target.value }));
                  setErrors((p) => ({ ...p, site_web: '' }));
                }}
                className={inputCls(errors.site_web)}
              />
              {errors.site_web && <p className="text-xs text-error-500 mt-1">{errors.site_web}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-600 mb-1 block">Ordre d&apos;affichage</label>
              <input
                type="number"
                min={0}
                value={form.ordre}
                onChange={(e) => setForm((p) => ({ ...p, ordre: e.target.value }))}
                className={inputCls()}
              />
              <p className="text-xs text-gray-400 mt-1">1 = affiché en premier, 2 = en second, etc.</p>
            </div>

            <div className="flex items-center pt-4">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm((p) => ({ ...p, actif: e.target.checked }))}
                  className="w-4 h-4 accent-navy-600 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-navy-600">
                  Afficher ce partenaire sur le site public
                </span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-navy-600 mb-1 block">
                {editingItem ? 'Remplacer le logo (laisser vide pour conserver le logo actuel)' : 'Logo du partenaire *'}
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {logoPreview && (
                  <div className="w-28 h-20 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center p-2 flex-shrink-0">
                    <img
                      src={logoPreview}
                      alt="Aperçu du logo"
                      className="max-h-16 max-w-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className={`w-full border rounded-lg px-3 py-2 text-sm outline-none transition-all duration-300 file:mr-3 file:px-3 file:py-1 file:rounded-lg file:border-0 file:bg-navy-600 file:text-white file:cursor-pointer hover:file:bg-gold-400 ${
                      errors.logo ? 'border-error-400 bg-error-50' : 'border-gray-300'
                    }`}
                  />
                  <p className="text-xs text-gray-400 mt-1">PNG transparent ou JPG recommandé · Max 5 Mo</p>
                  {errors.logo && <p className="text-xs text-error-500 mt-1">{errors.logo}</p>}
                </div>
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 disabled:opacity-60 text-navy-900 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-glow flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                ) : editingItem ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                <span>{editingItem ? 'Enregistrer les modifications' : 'Ajouter le partenaire'}</span>
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 text-gray-600 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tableau des partenaires */}
      <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Ordre', 'Logo', 'Nom', 'Site web', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPartenaires.map((p, idx) => {
                const logoUrl = resolveMediaUrl(p.logo);
                return (
                  <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${!p.actif ? 'opacity-60 bg-gray-50/40' : ''}`}>
                    <td className="px-3 md:px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 text-center font-mono text-xs font-bold text-gray-500">#{p.ordre}</span>
                        {filter === 'all' && (
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={reordering || idx === 0}
                              onClick={() => handleMove(idx, 'up')}
                              title="Monter"
                              className="p-0.5 rounded bg-gray-100 hover:bg-gold-400 hover:text-navy-900 disabled:opacity-30 transition flex items-center justify-center"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={reordering || idx === filteredPartenaires.length - 1}
                              onClick={() => handleMove(idx, 'down')}
                              title="Descendre"
                              className="p-0.5 rounded bg-gray-100 hover:bg-gold-400 hover:text-navy-900 disabled:opacity-30 transition flex items-center justify-center"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-3 md:px-5 py-3">
                      <div className="w-20 h-12 rounded-lg border border-gray-200 bg-white flex items-center justify-center p-1.5 overflow-hidden">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={p.nom}
                            className="max-h-10 max-w-full object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-gold-500 font-bold text-base">{p.nom?.[0] || 'P'}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-3 md:px-5 py-3 font-semibold text-navy-600">{p.nom}</td>

                    <td className="px-3 md:px-5 py-3 text-gray-500">
                      {p.site_web ? (
                        <a
                          href={p.site_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline inline-flex items-center gap-1 max-w-[180px] truncate"
                        >
                          <span className="truncate">{p.site_web.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>

                    <td className="px-3 md:px-5 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActif(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          p.actif
                            ? 'bg-success-100 text-success-700 hover:bg-success-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {p.actif ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Masqué</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-3 md:px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="text-navy-500 hover:text-navy-700 text-xs font-medium transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(p.id)}
                          className="text-error-400 hover:text-error-600 text-xs font-medium transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPartenaires.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Aucun partenaire trouvé —{' '}
                    <button type="button" onClick={openCreate} className="text-gold-500 hover:underline font-medium">
                      ajouter un partenaire
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
