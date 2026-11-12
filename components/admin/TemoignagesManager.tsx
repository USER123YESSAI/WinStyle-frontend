'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { resolveMediaUrl } from './PartenairesManager';

export interface TemoignageItem {
  id: number;
  nom: string;
  fonction?: string | null;
  entreprise?: string | null;
  texte: string;
  photo?: string | null;
  note: number;
  actif: boolean;
  ordre: number;
  createdAt?: string;
}

interface TemoignagesManagerProps {
  temoignages: TemoignageItem[];
  setTemoignages: React.Dispatch<React.SetStateAction<TemoignageItem[]>>;
}

const EMPTY_FORM = {
  nom: '',
  fonction: '',
  entreprise: '',
  texte: '',
  note: 5,
  ordre: '1',
  actif: true,
};

export default function TemoignagesManager({ temoignages, setTemoignages }: TemoignagesManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TemoignageItem | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sortedTemoignages = [...temoignages].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0) || a.id - b.id);

  const filteredTemoignages = sortedTemoignages.filter((t) => {
    if (filter === 'active') return t.actif;
    if (filter === 'inactive') return !t.actif;
    return true;
  });

  const openCreate = () => {
    setEditingItem(null);
    const nextOrder = temoignages.length > 0 ? Math.max(...temoignages.map((t) => t.ordre || 0)) + 1 : 1;
    setForm({ ...EMPTY_FORM, ordre: String(nextOrder) });
    setPhotoFile(null);
    setPhotoPreview(null);
    setRemoveCurrentPhoto(false);
    setErrors({});
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (t: TemoignageItem) => {
    setEditingItem(t);
    setForm({
      nom: t.nom || '',
      fonction: t.fonction || '',
      entreprise: t.entreprise || '',
      texte: t.texte || '',
      note: t.note || 5,
      ordre: String(t.ordre ?? 1),
      actif: Boolean(t.actif),
    });
    setPhotoFile(null);
    setPhotoPreview(resolveMediaUrl(t.photo));
    setRemoveCurrentPhoto(false);
    setErrors({});
    setMessage(null);
    setShowForm(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    setRemoveCurrentPhoto(false);
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setPhotoPreview(editingItem ? resolveMediaUrl(editingItem.photo) : null);
    }
  };

  const refreshList = async () => {
    const res = await api.get('/temoignages/admin');
    const data = Array.isArray(res.data) ? res.data : [];
    setTemoignages(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.nom.trim() || form.nom.trim().length < 2) {
      newErrors.nom = 'Le nom du client est obligatoire (min. 2 caractères)';
    }
    if (!form.texte.trim() || form.texte.trim().length < 5) {
      newErrors.texte = 'Le contenu du témoignage est obligatoire (min. 5 caractères)';
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
      formData.append('fonction', form.fonction.trim());
      formData.append('entreprise', form.entreprise.trim());
      formData.append('texte', form.texte.trim());
      formData.append('note', String(form.note || 5));
      formData.append('ordre', String(Number(form.ordre) || 0));
      formData.append('actif', String(form.actif));

      if (photoFile) {
        formData.append('photo', photoFile);
      } else if (removeCurrentPhoto) {
        formData.append('photo', '');
      }

      if (editingItem) {
        await api.put(`/temoignages/${editingItem.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ type: 'success', text: 'Témoignage mis à jour avec succès !' });
      } else {
        await api.post('/temoignages', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage({ type: 'success', text: 'Témoignage ajouté avec succès !' });
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

  const handleToggleActif = async (t: TemoignageItem) => {
    try {
      const res = await api.patch(`/temoignages/${t.id}/toggle`);
      const updated = res.data?.temoignage;
      setTemoignages((prev) =>
        prev.map((item) => (item.id === t.id ? { ...item, actif: updated ? updated.actif : !item.actif } : item))
      );
    } catch (err) {
      alert('Impossible de modifier le statut de ce témoignage.');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const list = [...sortedTemoignages];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    setReordering(true);
    try {
      const temp = list[index];
      list[index] = list[targetIdx];
      list[targetIdx] = temp;

      const items = list.map((item, idx) => ({ id: item.id, ordre: idx + 1 }));
      const res = await api.patch('/temoignages/reorder', { items });
      if (Array.isArray(res.data?.temoignages)) {
        setTemoignages(res.data.temoignages);
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
    if (!confirm('Supprimer définitivement ce témoignage ?')) return;
    try {
      await api.delete(`/temoignages/${id}`);
      setTemoignages((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('Erreur lors de la suppression du témoignage.');
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
          <h2 className="text-2xl font-bold text-navy-600">💬 Témoignages clients ({temoignages.length})</h2>
          <p className="text-xs text-gray-500 mt-1">
            Ajoutez, modifiez, réorganisez ou masquez les avis clients affichés sur la page d&apos;accueil.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-glow"
        >
          ➕ Nouveau témoignage
        </button>
      </div>

      {/* Filtres rapides */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'all', label: `Tous (${temoignages.length})` },
          { key: 'active', label: `Actifs (${temoignages.filter((t) => t.actif).length})` },
          { key: 'inactive', label: `Masqués (${temoignages.filter((t) => !t.actif).length})` },
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
            <h3 className="font-bold text-navy-600 text-base">
              {editingItem ? `✏️ Modifier le témoignage de ${editingItem.nom}` : '➕ Ajouter un témoignage client'}
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
            >
              ✕
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
              <label className="text-xs font-semibold text-navy-600 mb-1 block">Nom du client *</label>
              <input
                type="text"
                value={form.nom}
                placeholder="Ex : Marie Remadji"
                onChange={(e) => {
                  setForm((p) => ({ ...p, nom: e.target.value }));
                  setErrors((p) => ({ ...p, nom: '' }));
                }}
                className={inputCls(errors.nom)}
              />
              {errors.nom && <p className="text-xs text-error-500 mt-1">{errors.nom}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-600 mb-1 block">Fonction / Poste</label>
              <input
                type="text"
                value={form.fonction}
                placeholder="Ex : Directrice Événements"
                onChange={(e) => setForm((p) => ({ ...p, fonction: e.target.value }))}
                className={inputCls()}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-navy-600 mb-1 block">Entreprise / Organisation</label>
              <input
                type="text"
                value={form.entreprise}
                placeholder="Ex : Fondation WELA (optionnel)"
                onChange={(e) => setForm((p) => ({ ...p, entreprise: e.target.value }))}
                className={inputCls()}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-navy-600 mb-1 block">Note (étoiles)</label>
                <select
                  value={form.note}
                  onChange={(e) => setForm((p) => ({ ...p, note: Number(e.target.value) }))}
                  className={inputCls()}
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n}/5)
                    </option>
                  ))}
                </select>
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
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-navy-600 mb-1 block">Contenu du témoignage *</label>
              <textarea
                rows={3}
                value={form.texte}
                placeholder="Saisissez le retour d'expérience du client..."
                onChange={(e) => {
                  setForm((p) => ({ ...p, texte: e.target.value }));
                  setErrors((p) => ({ ...p, texte: '' }));
                }}
                className={`${inputCls(errors.texte)} resize-none`}
              />
              {errors.texte && <p className="text-xs text-error-500 mt-1">{errors.texte}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-navy-600 mb-1 block">
                Photo du client (optionnelle)
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-gold-400 bg-navy-600 text-white flex items-center justify-center overflow-hidden flex-shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Aperçu client" className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-lg">
                      {(form.nom || 'C')
                        .split(' ')
                        .filter(Boolean)
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none file:mr-3 file:px-3 file:py-1 file:rounded-lg file:border-0 file:bg-navy-600 file:text-white file:cursor-pointer hover:file:bg-gold-400"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-400">JPG, PNG ou WEBP · Max 5 Mo (si vide, affiche les initiales)</p>
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoFile(null);
                          setPhotoPreview(null);
                          setRemoveCurrentPhoto(true);
                        }}
                        className="text-xs text-error-500 hover:underline"
                      >
                        Retirer la photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="inline-flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.actif}
                  onChange={(e) => setForm((p) => ({ ...p, actif: e.target.checked }))}
                  className="w-4 h-4 accent-navy-600 rounded cursor-pointer"
                />
                <span className="text-sm font-medium text-navy-600">
                  Publier ce témoignage sur la page d&apos;accueil
                </span>
              </label>
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
                  '💾'
                ) : (
                  '➕'
                )}
                {editingItem ? 'Enregistrer les modifications' : 'Ajouter le témoignage'}
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

      {/* Tableau des témoignages */}
      <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Ordre', 'Client', 'Fonction & Entreprise', 'Témoignage', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTemoignages.map((t, idx) => {
                const photoUrl = resolveMediaUrl(t.photo);
                return (
                  <tr key={t.id} className={`hover:bg-gray-50 transition-colors ${!t.actif ? 'opacity-60 bg-gray-50/40' : ''}`}>
                    <td className="px-3 md:px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-6 text-center font-mono text-xs font-bold text-gray-500">#{t.ordre}</span>
                        {filter === 'all' && (
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={reordering || idx === 0}
                              onClick={() => handleMove(idx, 'up')}
                              title="Monter"
                              className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 hover:bg-gold-400 hover:text-navy-900 disabled:opacity-30 transition"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={reordering || idx === filteredTemoignages.length - 1}
                              onClick={() => handleMove(idx, 'down')}
                              title="Descendre"
                              className="px-1.5 py-0.5 text-[10px] rounded bg-gray-100 hover:bg-gold-400 hover:text-navy-900 disabled:opacity-30 transition"
                            >
                              ▼
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-3 md:px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy-600 text-white flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={t.nom}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <span className="font-bold text-xs">
                              {t.nom
                                .split(' ')
                                .filter(Boolean)
                                .map((part) => part[0])
                                .join('')
                                .slice(0, 2)
                                .toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-navy-600">{t.nom}</p>
                          <p className="text-gold-500 text-xs">{'★'.repeat(t.note || 5)}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 md:px-5 py-3 text-gray-600">
                      <p className="font-medium text-xs">{t.fonction || '—'}</p>
                      {t.entreprise && <p className="text-xs text-gray-400">{t.entreprise}</p>}
                    </td>

                    <td className="px-3 md:px-5 py-3 max-w-xs">
                      <p className="text-gray-600 text-xs line-clamp-2 italic" title={t.texte}>
                        “{t.texte}”
                      </p>
                    </td>

                    <td className="px-3 md:px-5 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleToggleActif(t)}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          t.actif
                            ? 'bg-success-100 text-success-700 hover:bg-success-200'
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {t.actif ? '✅ Visible' : '👁️‍🗨️ Masqué'}
                      </button>
                    </td>

                    <td className="px-3 md:px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="text-navy-500 hover:text-navy-700 text-xs font-medium transition-colors"
                        >
                          Modifier
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id)}
                          className="text-error-400 hover:text-error-600 text-xs font-medium transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredTemoignages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Aucun témoignage trouvé —{' '}
                    <button type="button" onClick={openCreate} className="text-gold-500 hover:underline font-medium">
                      ajouter un témoignage
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
