'use client';
import { useEffect, useState } from 'react';
import { Input, Button, Alert } from '@/components/ui/FormElements';
import { inscriptionSchema, validateForm } from '@/lib/schemas';
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

// ─── Modal d'inscription ────────────────────────────────────────────
function InscriptionModal({ formation, onClose }: { formation: Formation; onClose: () => void }) {
  const [form, setForm]     = useState({ nom: '', email: '', telephone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading]   = useState(false);
  const [status, setStatus]     = useState<'idle' | 'success' | 'error'>('idle');
  const [serverMsg, setServerMsg] = useState('');

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [field]: e.target.value }));
      setErrors((p) => ({ ...p, [field]: '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Backend attend `formationId` (camelCase) et non `formation_id`
    const payload = { ...form, formationId: formation.id };
    const fieldErrors = validateForm(inscriptionSchema, payload);
    if (Object.keys(fieldErrors).length > 0) { setErrors(fieldErrors); return; }

    setLoading(true);
    try {
      const res = await api.post('/inscriptions', payload);
      setStatus('success');
      setServerMsg(res.data.message || 'Inscription confirmée !');
    } catch (err: any) {
      setStatus('error');
      const backendErrors = err.response?.data?.errors;
      setServerMsg(backendErrors?.[0] || err.response?.data?.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative">
        <button onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold">✕</button>

        <h2 className="text-xl font-bold text-[#1E3A5F] mb-1">S'inscrire à la formation</h2>
        <p className="text-sm text-gray-500 mb-6">{formation.title}</p>

        {status !== 'idle' && (
          <div className="mb-4"><Alert type={status} message={serverMsg} /></div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input label="Nom complet" required
              value={form.nom} onChange={set('nom')} placeholder="Votre nom"
              error={errors.nom ? { message: errors.nom } as any : undefined} />

            <Input label="E-mail" type="email" required
              value={form.email} onChange={set('email')} placeholder="exemple@email.com"
              error={errors.email ? { message: errors.email } as any : undefined} />

            <Input label="Téléphone" type="tel"
              value={form.telephone} onChange={set('telephone')} placeholder="+221 XX XXX XX XX"
              error={errors.telephone ? { message: errors.telephone } as any : undefined} />

            <Button loading={loading} className="w-full">Confirmer l'inscription</Button>
          </form>
        )}

        {status === 'success' && (
          <Button variant="secondary" type="button" onClick={onClose} className="w-full mt-4">Fermer</Button>
        )}
      </div>
    </div>
  );
}

// ─── Page formations ──────────────────────────────────────────────
export default function FormationsPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState<Formation | null>(null);
  const [error, setError]           = useState('');

  useEffect(() => {
    api.get('/formations')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
        setFormations(data);
      })
      .catch(() => setError('Impossible de charger les formations.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 pt-28 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">Nos formations</h1>
        <p className="text-gray-500 mb-10">Inscrivez-vous à nos formations professionnelles.</p>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && <Alert type="error" message={error} />}

        {!loading && formations.length === 0 && !error && (
          <p className="text-center text-gray-400 py-20">Aucune formation disponible pour le moment.</p>
        )}

        {!loading && formations.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Version Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Formation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lieu
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Prix
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Places
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formations.map((f) => (
                    <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-[#1E3A5F]">{f.title}</p>
                          {f.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{f.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {f.date ? new Date(f.date).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {f.lieu || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {f.prix !== null ? `${Number(f.prix).toLocaleString('fr-FR')} FCFA` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {f.places_disponibles || 0} places
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <Button 
                          onClick={() => setSelected(f)} 
                          type="button"
                          className="inline-flex"
                        >
                          S'inscrire
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Version Mobile */}
            <div className="md:hidden divide-y divide-gray-100">
              {formations.map((f) => (
                <div key={f.id} className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-[#1E3A5F] mb-1">{f.title}</h3>
                    {f.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{f.description}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Date :</span>
                      <p className="text-gray-700 font-medium">
                        {f.date ? new Date(f.date).toLocaleDateString('fr-FR') : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Lieu :</span>
                      <p className="text-gray-700 font-medium">{f.lieu || '-'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Prix :</span>
                      <p className="text-gray-900 font-semibold">
                        {f.prix !== null ? `${Number(f.prix).toLocaleString('fr-FR')} FCFA` : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-400">Places :</span>
                      <p className="text-gray-700 font-medium">{f.places_disponibles || 0} disponibles</p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setSelected(f)} 
                    type="button" 
                    className="w-full"
                  >
                    S'inscrire
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selected && (
        <InscriptionModal formation={selected} onClose={() => setSelected(null)} />
      )}
    </main>
  );
}