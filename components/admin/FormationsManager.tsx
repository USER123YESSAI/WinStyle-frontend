'use client';
import { useState } from 'react';
import api from '@/lib/api';

interface Formation {
  id: number;
  title: string;
  description: string;
  date: string;
  lieu: string;
  prix: number;
  places_disponibles: number;
}

interface FormationsManagerProps {
  formations: Formation[];
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
}

const EMPTY_FORM = { title: '', description: '', date: '', lieu: '', prix: '', places_disponibles: '' };

export default function FormationsManager({ formations, setFormations }: FormationsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Formation | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const openCreate = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setMessage(null);
    setShowForm(true);
  };

  const openEdit = (f: Formation) => {
    setEditingItem(f);
    setForm({
      title: f.title,
      description: f.description || '',
      date: f.date ? f.date.slice(0, 10) : '',
      lieu: f.lieu || '',
      prix: String(f.prix || ''),
      places_disponibles: String(f.places_disponibles || '')
    });
    setErrors({});
    setMessage(null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) newErrors.title = 'Le titre est obligatoire';
    if (!form.date) newErrors.date = 'La date est obligatoire';
    if (!form.lieu.trim()) newErrors.lieu = 'Le lieu est obligatoire';
    if (!form.prix) newErrors.prix = 'Le prix est obligatoire';
    if (!form.places_disponibles) newErrors.places_disponibles = 'Les places sont obligatoires';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const payload = {
        ...form,
        prix: parseInt(form.prix),
        places_disponibles: parseInt(form.places_disponibles)
      };
      
      if (editingItem) {
        await api.put(`/formations/${editingItem.id}`, payload);
        setMessage({ type: 'success', text: 'Formation modifiée !' });
      } else {
        await api.post('/formations', payload);
        setMessage({ type: 'success', text: 'Formation créée !' });
      }
      
      const res = await api.get('/formations');
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setFormations(data);
      setForm(EMPTY_FORM);
      setEditingItem(null);
      setTimeout(() => { setShowForm(false); setMessage(null); }, 1500);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette formation ?')) return;
    await api.delete(`/formations/${id}`);
    setFormations(prev => prev.filter(f => f.id !== id));
  };

  const inputCls = (err?: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
      err ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">🎓 Formations ({formations.length})</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          ➕ Nouvelle formation
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-800">
              {editingItem ? '✏️ Modifier la formation' : '➕ Créer une formation'}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
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
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Titre *</label>
              <input
                value={form.title}
                placeholder="Ex : Formation Hôtesse d'accueil"
                onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setErrors(p => ({ ...p, title: '' })); }}
                className={inputCls(errors.title)}
              />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
              <textarea
                value={form.description}
                rows={3}
                placeholder="Décrivez la formation..."
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={e => { setForm(p => ({ ...p, date: e.target.value })); setErrors(p => ({ ...p, date: '' })); }}
                className={inputCls(errors.date)}
              />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Lieu *</label>
              <input
                value={form.lieu}
                placeholder="Ex : Dakar, Sénégal"
                onChange={e => { setForm(p => ({ ...p, lieu: e.target.value })); setErrors(p => ({ ...p, lieu: '' })); }}
                className={inputCls(errors.lieu)}
              />
              {errors.lieu && <p className="text-xs text-red-500 mt-1">{errors.lieu}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Prix (FCFA) *</label>
              <input
                type="number"
                value={form.prix}
                placeholder="Ex : 50000"
                onChange={e => { setForm(p => ({ ...p, prix: e.target.value })); setErrors(p => ({ ...p, prix: '' })); }}
                className={inputCls(errors.prix)}
              />
              {errors.prix && <p className="text-xs text-red-500 mt-1">{errors.prix}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Places disponibles *</label>
              <input
                type="number"
                value={form.places_disponibles}
                placeholder="Ex : 20"
                onChange={e => { setForm(p => ({ ...p, places_disponibles: e.target.value })); setErrors(p => ({ ...p, places_disponibles: '' })); }}
                className={inputCls(errors.places_disponibles)}
              />
              {errors.places_disponibles && <p className="text-xs text-red-500 mt-1">{errors.places_disponibles}</p>}
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
                {editingItem ? 'Enregistrer les modifications' : 'Créer la formation'}
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
                {['Titre', 'Date', 'Lieu', 'Prix', 'Places', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {formations.map(f => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800 max-w-xs">
                    <p className="truncate">{f.title}</p>
                    {f.description && (
                      <p className="text-xs text-gray-400 truncate mt-0.5">{f.description}</p>
                    )}
                  </td>
                  <td className="px-5 py-3 text-gray-500 whitespace-nowrap">
                    {f.date ? new Date(f.date).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{f.lieu || '—'}</td>
                  <td className="px-5 py-3 text-gray-700 whitespace-nowrap">
                    {f.prix ? `${Number(f.prix).toLocaleString('fr-FR')} FCFA` : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                      {f.places_disponibles} places
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(f)}
                        className="text-blue-500 hover:text-blue-700 text-xs font-medium"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {formations.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                    Aucune formation —{' '}
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
