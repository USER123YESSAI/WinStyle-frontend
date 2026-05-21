'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import RealisationTab from './_components/RealisationTab';


interface Stats { formations: number; inscriptions: number; candidatures: number; realisations: number; services: number; contacts: number; }
interface Formation { id: number; title: string; description: string; date: string; lieu: string; prix: number; places_disponibles: number; }
interface Candidature { id: number; nom: string; email: string; poste: string; statut: string; createdAt: string; cv_url?: string; }
interface Inscription { id: number; nom: string; email: string; createdAt: string; Formation?: { title: string; date: string }; }
interface Realisation { id: number; title: string; description: string; image_url: string; createdAt: string; }
interface AdminUser { id: number; nom: string; email: string; createdAt: string; }
interface Log { id: number; adminNom: string; adminEmail: string; action: string; cible?: string; ip?: string; createdAt: string; }
type Tab = 'stats' | 'formations' | 'inscriptions' | 'candidatures' | 'realisations' | 'services' | 'contacts' | 'admins' | 'logs';

const EMPTY_ADMIN      = { nom: '', email: '', password: '' };
const EMPTY_FORMATION  = { title: '', description: '', date: '', lieu: '', prix: '', places_disponibles: '' };
const EMPTY_REALISATION = { title: '', description: '', image_url: '' };

function ActionBadge({ action }: { action: string }) {
  const a = action.toLowerCase();
  if (a.includes('connexion'))  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">🔐 {action}</span>;
  if (a.includes('supprimé'))   return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">🗑️ {action}</span>;
  if (a.includes('créé'))       return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">➕ {action}</span>;
  if (a.includes('modifié') || a.includes('statut')) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">✏️ {action}</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{action}</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]               = useState<Tab>('stats');
  const [stats, setStats]           = useState<Stats | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [candidatures, setCandidatures] = useState<Candidature[]>([]);
  const [services, setServices]     = useState<any[]>([]);
  const [contacts, setContacts]     = useState<any[]>([]);
  const [admins, setAdmins]         = useState<AdminUser[]>([]);
  const [logs, setLogs]             = useState<Log[]>([]);
  const [logFilter, setLogFilter]   = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading]       = useState(true);

  // ── Admin form ──
  const [adminForm, setAdminForm]   = useState(EMPTY_ADMIN);
  const [adminFormErrors, setAdminFormErrors] = useState<Record<string, string>>({});
  const [adminFormLoading, setAdminFormLoading] = useState(false);
  const [adminFormMsg, setAdminFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Formation form ──
  const [formationForm, setFormationForm] = useState(EMPTY_FORMATION);
  const [formationFormErrors, setFormationFormErrors] = useState<Record<string, string>>({});
  const [formationFormLoading, setFormationFormLoading] = useState(false);
  const [formationFormMsg, setFormationFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);
  const [showFormationForm, setShowFormationForm] = useState(false);

  // ── Réalisation form ──
  const [realisationForm, setRealisationForm] = useState(EMPTY_REALISATION);
  const [realisationFormErrors, setRealisationFormErrors] = useState<Record<string, string>>({});
  const [realisationFormLoading, setRealisationFormLoading] = useState(false);
  const [realisationFormMsg, setRealisationFormMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingRealisation, setEditingRealisation] = useState<Realisation | null>(null);
  const [showRealisationForm, setShowRealisationForm] = useState(false);

  const logout = () => { localStorage.removeItem('wins_token'); router.push('/admin/login'); };

  const retourVersLogin = () => {
    router.push('/admin/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('wins_token');
    if (!token) { router.push('/admin/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'superadmin') setIsSuperAdmin(true);
    } catch {}
    Promise.all([
      api.get('/formations'), api.get('/inscriptions'), api.get('/candidatures'),
      api.get('/realisations'), api.get('/services'), api.get('/contact'),
    ]).then(([f, i, c, r, s, co]) => {
      const parse = (res: any) => Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      const fData = parse(f); const iData = parse(i); const cData = parse(c);
      const rData = parse(r); const sData = parse(s); const coData = parse(co);
      setStats({ formations: fData.length, inscriptions: iData.length, candidatures: cData.length, realisations: rData.length, services: sData.length, contacts: coData.length });
      setFormations(fData); setInscriptions(iData); setCandidatures(cData);
      setRealisations(rData); setServices(sData); setContacts(coData);
    }).catch(() => router.push('/admin/login')).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab === 'admins' && isSuperAdmin) api.get('/auth/admins').then(r => setAdmins(r.data)).catch(() => {});
    if (tab === 'logs'   && isSuperAdmin) api.get('/auth/logs').then(r => setLogs(r.data)).catch(() => {});
  }, [tab, isSuperAdmin]);

  // ── Formation handlers ──
  const openCreateFormation = () => { setEditingFormation(null); setFormationForm(EMPTY_FORMATION); setFormationFormErrors({}); setFormationFormMsg(null); setShowFormationForm(true); };
  const openEditFormation = (f: Formation) => {
    setEditingFormation(f);
    setFormationForm({ title: f.title, description: f.description || '', date: f.date ? f.date.slice(0, 10) : '', lieu: f.lieu || '', prix: String(f.prix || ''), places_disponibles: String(f.places_disponibles || '') });
    setFormationFormErrors({}); setFormationFormMsg(null); setShowFormationForm(true);
  };
  const handleFormationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formationForm.title.trim())       errors.title = 'Le titre est obligatoire';
    if (!formationForm.date)               errors.date  = 'La date est obligatoire';
    if (!formationForm.lieu.trim())        errors.lieu  = 'Le lieu est obligatoire';
    if (!formationForm.prix)               errors.prix  = 'Le prix est obligatoire';
    if (!formationForm.places_disponibles) errors.places_disponibles = 'Les places sont obligatoires';
    if (Object.keys(errors).length > 0) { setFormationFormErrors(errors); return; }
    setFormationFormLoading(true); setFormationFormMsg(null);
    try {
      const payload = { ...formationForm, prix: parseInt(formationForm.prix), places_disponibles: parseInt(formationForm.places_disponibles) };
      if (editingFormation) { await api.put(`/formations/${editingFormation.id}`, payload); setFormationFormMsg({ type: 'success', text: 'Formation modifiée !' }); }
      else { await api.post('/formations', payload); setFormationFormMsg({ type: 'success', text: 'Formation créée !' }); }
      const res = await api.get('/formations');
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      setFormations(data); setStats(prev => prev ? { ...prev, formations: data.length } : prev);
      setFormationForm(EMPTY_FORMATION); setEditingFormation(null);
      setTimeout(() => { setShowFormationForm(false); setFormationFormMsg(null); }, 1500);
    } catch (err: any) {
      setFormationFormMsg({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la sauvegarde' });
    } finally { setFormationFormLoading(false); }
  };
  const deleteFormation = async (id: number) => {
    if (!confirm('Supprimer cette formation ?')) return;
    await api.delete(`/formations/${id}`);
    const updated = formations.filter(f => f.id !== id);
    setFormations(updated); setStats(prev => prev ? { ...prev, formations: updated.length } : prev);
  };

  // ── Réalisation CRUD is handled by <RealisationsManager /> ──


  // ── Candidature handlers ──
  const updateStatut = async (id: number, statut: string) => {
    await api.patch(`/candidatures/${id}/statut`, { statut });
    setCandidatures(prev => prev.map(c => c.id === id ? { ...c, statut } : c));
  };
  const deleteCandidature = async (id: number) => {
    if (!confirm('Supprimer cette candidature ?')) return;
    await api.delete(`/candidatures/${id}`);
    setCandidatures(prev => prev.filter(c => c.id !== id));
  };

  // ── Admin handlers ──
  const deleteAdmin = async (id: number) => {
    if (!confirm('Supprimer ce compte admin ?')) return;
    await api.delete(`/auth/admins/${id}`); setAdmins(prev => prev.filter(a => a.id !== id));
  };
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!adminForm.nom.trim()) errors.nom = 'Le nom est obligatoire';
    if (!adminForm.email.trim()) errors.email = "L'email est obligatoire";
    if (adminForm.password.length < 8) errors.password = 'Minimum 8 caractères';
    if (Object.keys(errors).length > 0) { setAdminFormErrors(errors); return; }
    setAdminFormLoading(true); setAdminFormMsg(null);
    try {
      await api.post('/auth/admins', adminForm);
      setAdminFormMsg({ type: 'success', text: `Compte créé pour ${adminForm.email}` });
      setAdminForm(EMPTY_ADMIN); setAdminFormErrors({});
      const res = await api.get('/auth/admins'); setAdmins(res.data);
    } catch (err: any) {
      setAdminFormMsg({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la création' });
    } finally { setAdminFormLoading(false); }
  };

  const TABS: { key: Tab; label: string; icon: string; superOnly?: boolean }[] = [
    { key: 'stats',        label: 'Tableau de bord', icon: '📊' },
    { key: 'formations',   label: 'Formations',      icon: '🎓' },
    { key: 'realisations', label: 'Réalisations',    icon: '🏆' },
    { key: 'inscriptions', label: 'Inscriptions',    icon: '📝' },
    { key: 'candidatures', label: 'Candidatures',    icon: '👤' },
    { key: 'services',     label: 'Demandes',        icon: '💼' },
    { key: 'contacts',     label: 'Messages',        icon: '✉️' },
    { key: 'admins',       label: 'Admins',          icon: '🔑', superOnly: true },
    { key: 'logs',         label: 'Logs activité',   icon: '📋', superOnly: true },
  ];

  const statCards = [
    { label: 'Formations',   value: stats?.formations,   icon: '🎓', bg: 'bg-blue-600',   tab: 'formations'   as Tab },
    { label: 'Inscriptions', value: stats?.inscriptions, icon: '📝', bg: 'bg-green-600',  tab: 'inscriptions' as Tab },
    { label: 'Candidatures', value: stats?.candidatures, icon: '👤', bg: 'bg-cyan-500',   tab: 'candidatures' as Tab },
    { label: 'Réalisations', value: stats?.realisations, icon: '🏆', bg: 'bg-purple-600', tab: 'realisations' as Tab },
    { label: 'Demandes',     value: stats?.services,     icon: '💼', bg: 'bg-yellow-500', tab: 'services'     as Tab },
    { label: 'Messages',     value: stats?.contacts,     icon: '✉️', bg: 'bg-green-700',  tab: 'contacts'     as Tab },
    { label: 'Acceptées',  value: candidatures.filter(c => c.statut === 'acceptée').length,   icon: '✅', bg: 'bg-gray-700', tab: undefined },
    { label: 'En attente', value: candidatures.filter(c => c.statut === 'en attente').length, icon: '⏳', bg: 'bg-gray-900', tab: undefined },
    { label: 'Refusées',   value: candidatures.filter(c => c.statut === 'refusée').length,    icon: '❌', bg: 'bg-red-600',  tab: undefined },
  ];

  const filteredLogs = logs.filter(l =>
    !logFilter ||
    l.adminNom.toLowerCase().includes(logFilter.toLowerCase()) ||
    l.adminEmail.toLowerCase().includes(logFilter.toLowerCase()) ||
    l.action.toLowerCase().includes(logFilter.toLowerCase()) ||
    (l.cible || '').toLowerCase().includes(logFilter.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C9A84C] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const inputCls = (err?: string) =>
    `w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${err ? 'border-red-400 bg-red-50' : 'border-gray-300'}`;

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#C9A84C] rounded-lg flex items-center justify-center font-bold text-gray-900 text-sm">W</div>
            <span className="font-bold text-base">Win's Agency</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {TABS.filter(t => !t.superOnly || isSuperAdmin).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
              <span>{t.icon}</span> {t.label}
              {(t.key === 'admins' || t.key === 'logs') && <span className="ml-auto text-xs bg-yellow-500 text-gray-900 px-1.5 py-0.5 rounded font-bold">SA</span>}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">{isSuperAdmin ? '★' : 'A'}</div>
            <div className="text-xs">
              <p className="font-medium text-white">{isSuperAdmin ? 'Super Admin' : 'Administrateur'}</p>
              <p className="text-gray-400">{isSuperAdmin ? 'superadmin' : 'admin'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition">
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 text-sm"><span>👤</span><span className="font-medium">{isSuperAdmin ? 'Super Administrateur' : 'Administrateur'}</span></div>
          <button onClick={logout} className="flex items-center gap-2 border border-red-300 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded-lg text-sm transition">🚪 Déconnexion</button>
        </header>

        <div className="px-8 py-8">

          {/* ── STATS ── */}
          {tab === 'stats' && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Tableau de bord</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {statCards.map(s => (
                  <button key={s.label} onClick={() => s.tab && setTab(s.tab)}
                    className={`${s.bg} text-white rounded-xl p-5 text-left shadow hover:opacity-90 transition flex items-start justify-between`}>
                    <div><p className="text-sm font-medium opacity-90 mb-1">{s.label}</p><p className="text-4xl font-bold">{s.value ?? 0}</p></div>
                    <span className="text-3xl opacity-80">{s.icon}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── FORMATIONS ── */}
          {tab === 'formations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">🎓 Formations ({formations.length})</h2>
                <button onClick={openCreateFormation} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                  ➕ Nouvelle formation
                </button>
              </div>
              {showFormationForm && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-800">{editingFormation ? '✏️ Modifier la formation' : '➕ Créer une formation'}</h3>
                    <button onClick={() => setShowFormationForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
                  </div>
                  {formationFormMsg && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${formationFormMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                      {formationFormMsg.text}
                    </div>
                  )}
                  <form onSubmit={handleFormationSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Titre *</label>
                      <input value={formationForm.title} placeholder="Ex : Formation Hôtesse d'accueil"
                        onChange={e => { setFormationForm(p => ({ ...p, title: e.target.value })); setFormationFormErrors(p => ({ ...p, title: '' })); }}
                        className={inputCls(formationFormErrors.title)} />
                      {formationFormErrors.title && <p className="text-xs text-red-500 mt-1">{formationFormErrors.title}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label>
                      <textarea value={formationForm.description} rows={3} placeholder="Décrivez la formation..."
                        onChange={e => setFormationForm(p => ({ ...p, description: e.target.value }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Date *</label>
                      <input type="date" value={formationForm.date}
                        onChange={e => { setFormationForm(p => ({ ...p, date: e.target.value })); setFormationFormErrors(p => ({ ...p, date: '' })); }}
                        className={inputCls(formationFormErrors.date)} />
                      {formationFormErrors.date && <p className="text-xs text-red-500 mt-1">{formationFormErrors.date}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Lieu *</label>
                      <input value={formationForm.lieu} placeholder="Ex : N'Djaména, Tchad"
                        onChange={e => { setFormationForm(p => ({ ...p, lieu: e.target.value })); setFormationFormErrors(p => ({ ...p, lieu: '' })); }}
                        className={inputCls(formationFormErrors.lieu)} />
                      {formationFormErrors.lieu && <p className="text-xs text-red-500 mt-1">{formationFormErrors.lieu}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Prix (FCFA) *</label>
                      <input type="number" value={formationForm.prix} placeholder="Ex : 50000"
                        onChange={e => { setFormationForm(p => ({ ...p, prix: e.target.value })); setFormationFormErrors(p => ({ ...p, prix: '' })); }}
                        className={inputCls(formationFormErrors.prix)} />
                      {formationFormErrors.prix && <p className="text-xs text-red-500 mt-1">{formationFormErrors.prix}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Places disponibles *</label>
                      <input type="number" value={formationForm.places_disponibles} placeholder="Ex : 20"
                        onChange={e => { setFormationForm(p => ({ ...p, places_disponibles: e.target.value })); setFormationFormErrors(p => ({ ...p, places_disponibles: '' })); }}
                        className={inputCls(formationFormErrors.places_disponibles)} />
                      {formationFormErrors.places_disponibles && <p className="text-xs text-red-500 mt-1">{formationFormErrors.places_disponibles}</p>}
                    </div>
                    <div className="sm:col-span-2 flex gap-3">
                      <button type="submit" disabled={formationFormLoading}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2">
                        {formationFormLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : editingFormation ? '💾' : '➕'}
                        {editingFormation ? 'Enregistrer les modifications' : 'Créer la formation'}
                      </button>
                      <button type="button" onClick={() => setShowFormationForm(false)}
                        className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
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
                      <tr>{['Titre','Date','Lieu','Prix','Places','Actions'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formations.map(f => (
                        <tr key={f.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 font-medium text-gray-800 max-w-xs">
                            <p className="truncate">{f.title}</p>
                            {f.description && <p className="text-xs text-gray-400 truncate mt-0.5">{f.description}</p>}
                          </td>
                          <td className="px-5 py-3 text-gray-500 whitespace-nowrap">{f.date ? new Date(f.date).toLocaleDateString('fr-FR') : '—'}</td>
                          <td className="px-5 py-3 text-gray-500">{f.lieu || '—'}</td>
                          <td className="px-5 py-3 text-gray-700 whitespace-nowrap">{f.prix ? `${Number(f.prix).toLocaleString('fr-FR')} FCFA` : '—'}</td>
                          <td className="px-5 py-3"><span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">{f.places_disponibles} places</span></td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <button onClick={() => openEditFormation(f)} className="text-blue-500 hover:text-blue-700 text-xs font-medium">Modifier</button>
                              <button onClick={() => deleteFormation(f.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Supprimer</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {formations.length === 0 && (
                        <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                          Aucune formation — <button onClick={openCreateFormation} className="text-blue-500 hover:underline">créer la première</button>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── RÉALISATIONS (utilise RealisationsManager) ── */}
          {tab === 'realisations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">🏆 Réalisations ({realisations.length})</h2>
                <button
                  onClick={retourVersLogin}
                  className="flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  ↩︎ Retour login
                </button>
              </div>

              <RealisationTab
                realisations={realisations as any}
                setRealisations={setRealisations as any}
              />
            </div>
          )}


          {/* ── INSCRIPTIONS ── */}
          {tab === 'inscriptions' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-800">📝 Inscriptions ({inscriptions.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Email','Formation','Date'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {inscriptions.map(i => (
                      <tr key={i.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium">{i.nom}</td>
                        <td className="px-5 py-3 text-gray-500">{i.email}</td>
                        <td className="px-5 py-3">{i.Formation?.title ?? '—'}</td>
                        <td className="px-5 py-3 text-gray-400">{new Date(i.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                    {inscriptions.length === 0 && <tr><td colSpan={4} className="px-5 py-12 text-center text-gray-400">Aucune inscription</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CANDIDATURES ── */}
          {tab === 'candidatures' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-800">👤 Candidatures ({candidatures.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Email','Poste','Statut','CV','Actions'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {candidatures.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium">{c.nom}</td>
                        <td className="px-5 py-3 text-gray-500">{c.email}</td>
                        <td className="px-5 py-3">{c.poste}</td>
                        <td className="px-5 py-3">
                          <select value={c.statut} onChange={e => updateStatut(c.id, e.target.value)}
                            className={`text-xs font-semibold px-3 py-1 rounded-full border-0 outline-none cursor-pointer ${c.statut === 'acceptée' ? 'bg-green-100 text-green-700' : c.statut === 'refusée' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            <option value="en attente">En attente</option>
                            <option value="acceptée">Acceptée</option>
                            <option value="refusée">Refusée</option>
                          </select>
                        </td>
                        <td className="px-5 py-3">
                          {c.cv_url
                            ? <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${c.cv_url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">Voir CV</a>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-5 py-3"><button onClick={() => deleteCandidature(c.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Supprimer</button></td>
                      </tr>
                    ))}
                    {candidatures.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Aucune candidature</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {tab === 'services' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-800">💼 Demandes de service ({services.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Entreprise','Service','Téléphone','Date événement','Message'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium">{s.nom}</td>
                        <td className="px-5 py-3 text-gray-500">{s.entreprise || '—'}</td>
                        <td className="px-5 py-3">{s.service}</td>
                        <td className="px-5 py-3 text-gray-500">{s.telephone || '—'}</td>
                        <td className="px-5 py-3 text-gray-400">{s.date_evenement ? new Date(s.date_evenement).toLocaleDateString('fr-FR') : '—'}</td>
                        <td className="px-5 py-3 max-w-xs"><p className="truncate text-gray-500" title={s.message}>{s.message}</p></td>
                      </tr>
                    ))}
                    {services.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-400">Aucune demande</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {tab === 'contacts' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-800">✉️ Messages ({contacts.length})</h2></div>
              <div className="divide-y divide-gray-100">
                {contacts.map(c => (
                  <div key={c.id} className="px-6 py-5 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1"><span className="font-semibold text-gray-800">{c.nom}</span><span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</span></div>
                    <p className="text-sm text-blue-600 mb-2">{c.email}</p>
                    <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{c.message}</p>
                  </div>
                ))}
                {contacts.length === 0 && <p className="px-6 py-12 text-center text-gray-400">Aucun message</p>}
              </div>
            </div>
          )}

          {/* ── ADMINS ── */}
          {tab === 'admins' && isSuperAdmin && (
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-5">🔑 Créer un compte administrateur</h2>
                {adminFormMsg && <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${adminFormMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{adminFormMsg.text}</div>}
                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[{ field: 'nom', label: 'Nom complet *', type: 'text', placeholder: 'Ex : Fatou Diallo' }, { field: 'email', label: 'Adresse e-mail *', type: 'email', placeholder: 'fatou@wins-agency.td' }, { field: 'password', label: 'Mot de passe * (min. 8)', type: 'password', placeholder: '••••••••' }].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}</label>
                      <input type={type} value={(adminForm as any)[field]} placeholder={placeholder}
                        onChange={e => { setAdminForm(p => ({ ...p, [field]: e.target.value })); setAdminFormErrors(p => ({ ...p, [field]: '' })); }}
                        className={inputCls((adminFormErrors as any)[field])} />
                      {(adminFormErrors as any)[field] && <p className="text-xs text-red-500 mt-1">{(adminFormErrors as any)[field]}</p>}
                    </div>
                  ))}
                  <div className="sm:col-span-3">
                    <button type="submit" disabled={adminFormLoading} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2">
                      {adminFormLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '➕'} Créer le compte
                    </button>
                  </div>
                </form>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-800">Comptes administrateurs ({admins.length})</h2></div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Email','Créé le','Action'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {admins.map(a => (
                      <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium">{a.nom}</td>
                        <td className="px-5 py-3 text-gray-500">{a.email}</td>
                        <td className="px-5 py-3 text-gray-400">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td className="px-5 py-3"><button onClick={() => deleteAdmin(a.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Supprimer</button></td>
                      </tr>
                    ))}
                    {admins.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">Aucun admin secondaire</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── LOGS ── */}
          {tab === 'logs' && isSuperAdmin && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">📋 Logs d'activité</h2>
                <button onClick={() => api.get('/auth/logs').then(r => setLogs(r.data))} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">🔄 Actualiser</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <input value={logFilter} onChange={e => setLogFilter(e.target.value)} placeholder="🔍 Filtrer par admin, action, élément ciblé..." className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ label: 'Total actions', value: logs.length, bg: 'bg-blue-50 text-blue-700' }, { label: 'Connexions', value: logs.filter(l => l.action.includes('Connexion')).length, bg: 'bg-green-50 text-green-700' }, { label: 'Modifications', value: logs.filter(l => l.action.includes('modifié') || l.action.includes('Statut')).length, bg: 'bg-yellow-50 text-yellow-700' }, { label: 'Suppressions', value: logs.filter(l => l.action.includes('supprimé')).length, bg: 'bg-red-50 text-red-700' }].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-4`}><p className="text-xs font-semibold opacity-75 mb-1">{s.label}</p><p className="text-3xl font-bold">{s.value}</p></div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">{filteredLogs.length} entrée{filteredLogs.length !== 1 ? 's' : ''}{logFilter && ` sur ${logs.length}`}</h3>
                  <span className="text-xs text-gray-400">200 dernières actions max</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Date & heure','Admin','Action','Élément ciblé','IP'].map(h => <th key={h} className="px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLogs.map(l => (
                        <tr key={l.id} className="hover:bg-gray-50">
                          <td className="px-5 py-3 text-gray-400 whitespace-nowrap text-xs">{new Date(l.createdAt).toLocaleDateString('fr-FR')} <span className="font-mono">{new Date(l.createdAt).toLocaleTimeString('fr-FR')}</span></td>
                          <td className="px-5 py-3"><p className="font-medium text-gray-800">{l.adminNom}</p><p className="text-xs text-gray-400">{l.adminEmail}</p></td>
                          <td className="px-5 py-3"><ActionBadge action={l.action} /></td>
                          <td className="px-5 py-3 text-gray-500 text-xs max-w-xs"><p className="truncate" title={l.cible ?? ''}>{l.cible || '—'}</p></td>
                          <td className="px-5 py-3 text-gray-400 font-mono text-xs">{l.ip || '—'}</td>
                        </tr>
                      ))}
                      {filteredLogs.length === 0 && <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">Aucun log trouvé</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
