'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Realisation {
  id: number;
  titre: string;
  date: string;
  categorie: string;
  description: string;
  images: string[];
}

interface RealisationsManagerProps {
  realisations: Realisation[];
  setRealisations: React.Dispatch<React.SetStateAction<Realisation[]>>;
}

export default function RealisationsManager({ realisations, setRealisations }: RealisationsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Realisation | null>(null);
  const [form, setForm] = useState({
    titre: '',
    date: new Date().toISOString().slice(0, 10),
    categorie: '',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setForm({
      titre: '',
      date: new Date().toISOString().slice(0, 10),
      categorie: '',
      description: ''
    });
    setImageFiles(null);
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (r: Realisation) => {
    if (!r) return;
    setEditingItem(r);
    
    let formattedDate = new Date().toISOString().slice(0, 10);
    if (r.date) {
      if (r.date.match && r.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        formattedDate = r.date;
      } else {
        const dateObj = new Date(r.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().slice(0, 10);
        }
      }
    }
    
    setForm({
      titre: r.titre || '',
      date: formattedDate,
      categorie: r.categorie || '',
      description: r.description || ''
    });
    setImageFiles(null);
    setMessage(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    try {
      const formData = new FormData();
      
      // Append all fields directly to FormData
      if (form.titre) formData.append('titre', form.titre);
      if (form.date) formData.append('date', form.date);
      if (form.categorie) formData.append('categorie', form.categorie);
      if (form.description) formData.append('description', form.description);
      
      // Append multiple images if provided
      if (imageFiles && imageFiles.length > 0) {
        for (let i = 0; i < imageFiles.length; i++) {
          formData.append('images', imageFiles[i]);
        }
      }
      
      if (editingItem) {
        await api.put(`/realisations/${editingItem.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage({ type: 'success', text: 'Réalisation modifiée !' });
      } else {
        await api.post('/realisations', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        setMessage({ type: 'success', text: 'Réalisation créée !' });
      }
      
      const res = await api.get('/realisations');
      setRealisations(res.data);
      setForm({
        titre: '',
        date: new Date().toISOString().slice(0, 10),
        categorie: '',
        description: ''
      });
      setImageFiles(null);
      setEditingItem(null);
      setTimeout(() => { setShowForm(false); setMessage(null); }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette réalisation ?')) return;
    await api.delete(`/realisations/${id}`);
    setRealisations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">🏆 Réalisations ({realisations.length})</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          ➕ Nouvelle realisation
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800">
              {editingItem ? '✏️ Modifier la realisation' : '➕ Créer une realisation'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">
              ✕
            </button>
          </div>
          
          {message && (
            <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Titre</label>
              <input
                type="text"
                value={form.titre}
                placeholder="Ex : RASMA 2025"
                onChange={e => setForm(p => ({ ...p, titre: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Catégorie</label>
              <select
                value={form.categorie}
                onChange={e => setForm(p => ({ ...p, categorie: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Sélectionner --</option>
                <option value="Agence">Agence</option>
                <option value="Mode">Mode</option>
                <option value="RASMA">RASMA</option>
                <option value="Formation">Formation</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
              <textarea
                value={form.description}
                rows={3}
                placeholder="Décrivez la realisation..."
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Images (plusieurs fichiers acceptés)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={e => setImageFiles(e.target.files)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 file:mr-3 file:px-3 file:py-1 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white file:cursor-pointer"
              />
              {imageFiles && imageFiles.length > 0 && (
                <p className="text-xs text-green-600 mt-1">{imageFiles.length} fichiers sélectionnés</p>
              )}
              <p className="text-xs text-gray-400 mt-1">Vous pouvez sélectionner plusieurs images à la fois</p>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : editingItem ? (
                  '💾'
                ) : (
                  '➕'
                )}
                {editingItem ? 'Enregistrer' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                {['Titre', 'Date', 'Catégorie', 'Description', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {realisations.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800 max-w-xs">
                    <p className="truncate">{r.titre}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-3">
                    <span className="bg-[#C9A84C]/20 text-[#0E2240] text-xs font-semibold px-2 py-1 rounded-full">
                      {r.categorie}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 max-w-xs">
                    <p className="truncate">{r.description}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(r)}
                        className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {realisations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-gray-400">
                    Aucune realisation —{' '}
                    <button onClick={openCreate} className="text-blue-500 hover:underline">
                      créer la première
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
