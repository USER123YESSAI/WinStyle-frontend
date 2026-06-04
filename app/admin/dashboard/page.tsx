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
  if (a.includes('connexion'))  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-navy-100 text-navy-700">🔐 {action}</span>;
  if (a.includes('supprimé'))   return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-error-100 text-error-700">🗑️ {action}</span>;
  if (a.includes('créé'))       return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-success-100 text-success-700">➕ {action}</span>;
  if (a.includes('modifié') || a.includes('statut')) return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-warning-100 text-warning-700">✏️ {action}</span>;
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Fermer la sidebar on mobile quand on change de tab
  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setSidebarOpen(false);
  };

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* ── Overlay mobile ── */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar (Desktop fixed, Mobile drawer) ── */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-navy-900 text-white flex flex-col flex-shrink-0 transition-transform duration-300 md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-6 py-5 border-b border-navy-700">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-500 rounded-lg flex items-center justify-center font-bold text-navy-900 text-sm shadow-glow">W</div>
              <span className="font-bold text-base">Win's Agency</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.filter(t => !t.superOnly || isSuperAdmin).map(t => (
            <button key={t.key} onClick={() => handleTabChange(t.key)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-gold-400 text-navy-900 shadow-glow' : 'text-gray-400 hover:bg-navy-800 hover:text-white'}`}>
              <span>{t.icon}</span> <span className="hidden sm:inline">{t.label}</span>
              {(t.key === 'admins' || t.key === 'logs') && <span className="ml-auto text-xs bg-gold-400 text-navy-900 px-1.5 py-0.5 rounded font-bold">SA</span>}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-navy-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center text-xs font-bold">{isSuperAdmin ? '★' : 'A'}</div>
            <div className="text-xs">
              <p className="font-medium text-white">{isSuperAdmin ? 'Super Admin' : 'Administrateur'}</p>
              <p className="text-gray-400 hidden sm:block">{isSuperAdmin ? 'superadmin' : 'admin'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-navy-800 hover:text-white transition">
            <span>🚪</span> <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col w-full min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm gap-4">
          <div className="flex items-center gap-3 md:gap-2 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors text-xl"
            >
              ☰
            </button>
            <div className="flex items-center gap-2 text-gray-600 text-sm truncate">
              <span>👤</span>
              <span className="font-medium truncate">{isSuperAdmin ? 'Super Administrateur' : 'Administrateur'}</span>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 border border-error-300 text-error-500 hover:bg-error-50 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all hover:shadow-md whitespace-nowrap">
            🚪 <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 py-6 md:py-8">

          {/* ── STATS ── */}
          {tab === 'stats' && (
            <>
              <h2 className="text-2xl font-bold text-navy-600 mb-6">📊 Tableau de bord</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                {statCards.map(s => (
                  <button key={s.label} onClick={() => s.tab && handleTabChange(s.tab)}
                    className={`${s.bg} text-white rounded-xl p-4 md:p-5 text-left shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col items-start justify-between h-full`}>
                    <div className="w-full">
                      <p className="text-xs md:text-sm font-medium opacity-90 mb-1 line-clamp-1">{s.label}</p>
                      <p className="text-2xl md:text-4xl font-bold">{s.value ?? 0}</p>
                    </div>
                    <span className="text-2xl md:text-3xl opacity-80 mt-2">{s.icon}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── FORMATIONS ── */}
          {tab === 'formations' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-navy-600">🎓 Formations ({formations.length})</h2>
                <button onClick={openCreateFormation} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-navy-900 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-glow">
                  ➕ Nouvelle formation
                </button>
              </div>
              {showFormationForm && (
                <div className="card-modern bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-navy-600">{editingFormation ? '✏️ Modifier la formation' : '➕ Créer une formation'}</h3>
                    <button onClick={() => setShowFormationForm(false)} className="text-gray-400 hover:text-gray-600 text-xl transition-colors">✕</button>
                  </div>
                  {formationFormMsg && (
                    <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${formationFormMsg.type === 'success' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-error-50 text-error-700 border border-error-200'}`}>
                      {formationFormMsg.text}
                    </div>
                  )}
                  <form onSubmit={handleFormationSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Titre *</label>
                      <input value={formationForm.title} placeholder="Ex : Formation Hôtesse d'accueil"
                        onChange={e => { setFormationForm(p => ({ ...p, title: e.target.value })); setFormationFormErrors(p => ({ ...p, title: '' })); }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all ${formationFormErrors.title ? 'border-error-500 bg-error-50' : 'border-gray-300 focus:border-gold-400'}`} />
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
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all ${formationFormErrors.date ? 'border-error-500 bg-error-50' : 'border-gray-300 focus:border-gold-400'}`} />
                      {formationFormErrors.date && <p className="text-xs text-red-500 mt-1">{formationFormErrors.date}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Lieu *</label>
                      <input value={formationForm.lieu} placeholder="Ex : N'Djaména, Tchad"
                        onChange={e => { setFormationForm(p => ({ ...p, lieu: e.target.value })); setFormationFormErrors(p => ({ ...p, lieu: '' })); }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all ${formationFormErrors.lieu ? 'border-error-500 bg-error-50' : 'border-gray-300 focus:border-gold-400'}`} />
                      {formationFormErrors.lieu && <p className="text-xs text-red-500 mt-1">{formationFormErrors.lieu}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Prix (FCFA) *</label>
                      <input type="number" value={formationForm.prix} placeholder="Ex : 50000"
                        onChange={e => { setFormationForm(p => ({ ...p, prix: e.target.value })); setFormationFormErrors(p => ({ ...p, prix: '' })); }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all ${formationFormErrors.prix ? 'border-error-500 bg-error-50' : 'border-gray-300 focus:border-gold-400'}`} />
                      {formationFormErrors.prix && <p className="text-xs text-red-500 mt-1">{formationFormErrors.prix}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Places disponibles *</label>
                      <input type="number" value={formationForm.places_disponibles} placeholder="Ex : 20"
                        onChange={e => { setFormationForm(p => ({ ...p, places_disponibles: e.target.value })); setFormationFormErrors(p => ({ ...p, places_disponibles: '' })); }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all ${formationFormErrors.places_disponibles ? 'border-error-500 bg-error-50' : 'border-gray-300 focus:border-gold-400'}`} />
                      {formationFormErrors.places_disponibles && <p className="text-xs text-red-500 mt-1">{formationFormErrors.places_disponibles}</p>}
                    </div>
                    <div className="sm:col-span-2 flex flex-col sm:flex-row gap-3">
                      <button type="submit" disabled={formationFormLoading}
                        className="flex-1 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 disabled:opacity-60 text-navy-900 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:shadow-glow flex items-center justify-center gap-2">
                        {formationFormLoading ? <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" /> : editingFormation ? '💾' : '➕'}
                        {editingFormation ? 'Enregistrer les modifications' : 'Créer la formation'}
                      </button>
                      <button type="button" onClick={() => setShowFormationForm(false)}
                        className="flex-1 border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-300">
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              )}
              <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                      <tr>{['Titre','Date','Lieu','Prix','Places','Actions'].map(h => <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {formations.map(f => (
                        <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 md:px-5 py-3 font-medium text-navy-600 max-w-xs">
                            <p className="truncate text-xs md:text-sm">{f.title}</p>
                            {f.description && <p className="text-xs text-gray-400 truncate mt-0.5">{f.description}</p>}
                          </td>
                          <td className="px-3 md:px-5 py-3 text-gray-500 whitespace-nowrap text-xs md:text-sm">{f.date ? new Date(f.date).toLocaleDateString('fr-FR') : '—'}</td>
                          <td className="px-3 md:px-5 py-3 text-gray-500 text-xs md:text-sm">{f.lieu || '—'}</td>
                          <td className="px-3 md:px-5 py-3 text-gray-700 whitespace-nowrap text-xs md:text-sm">{f.prix ? `${Number(f.prix).toLocaleString('fr-FR')} FCFA` : '—'}</td>
                          <td className="px-3 md:px-5 py-3"><span className="bg-navy-50 text-navy-700 text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap">{f.places_disponibles}</span></td>
                          <td className="px-3 md:px-5 py-3">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
                              <button onClick={() => openEditFormation(f)} className="text-navy-500 hover:text-navy-700 text-xs font-medium transition-colors">Modifier</button>
                              <button onClick={() => deleteFormation(f.id)} className="text-error-400 hover:text-error-600 text-xs font-medium transition-colors">Supprimer</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {formations.length === 0 && (
                        <tr><td colSpan={6} className="px-3 md:px-5 py-12 text-center text-gray-400 text-xs md:text-sm">
                          Aucune formation — <button onClick={openCreateFormation} className="text-gold-500 hover:underline transition-colors">créer la première</button>
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
              <RealisationTab
                realisations={realisations as any}
                setRealisations={setRealisations as any}
              />
            </div>
          )}


          {/* ── INSCRIPTIONS ── */}
          {tab === 'inscriptions' && (
            <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-navy-600 text-sm md:text-base">📝 Inscriptions ({inscriptions.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Email','Formation','Date'].map(h => <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {inscriptions.map(i => (
                      <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 md:px-5 py-3 font-medium text-navy-600 text-xs md:text-sm">{i.nom}</td>
                        <td className="px-3 md:px-5 py-3 text-gray-500 text-xs md:text-sm break-all">{i.email}</td>
                        <td className="px-3 md:px-5 py-3 text-xs md:text-sm">{i.Formation?.title ?? '—'}</td>
                        <td className="px-3 md:px-5 py-3 text-gray-400 text-xs md:text-sm whitespace-nowrap">{new Date(i.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                    {inscriptions.length === 0 && <tr><td colSpan={4} className="px-3 md:px-5 py-12 text-center text-gray-400 text-xs md:text-sm">Aucune inscription</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CANDIDATURES ── */}
          {tab === 'candidatures' && (
            <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-navy-600 text-sm md:text-base">👤 Candidatures ({candidatures.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Email','Poste','Statut','CV','Actions'].map(h => <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {candidatures.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 md:px-5 py-3 font-medium text-navy-600 text-xs md:text-sm">{c.nom}</td>
                        <td className="px-3 md:px-5 py-3 text-gray-500 text-xs md:text-sm break-all">{c.email}</td>
                        <td className="px-3 md:px-5 py-3 text-xs md:text-sm">{c.poste}</td>
                        <td className="px-3 md:px-5 py-3">
                          <select value={c.statut} onChange={e => updateStatut(c.id, e.target.value)}
                            className={`text-xs font-semibold px-2 md:px-3 py-1 rounded-full border-0 outline-none cursor-pointer transition-colors ${c.statut === 'acceptée' ? 'bg-success-100 text-success-700' : c.statut === 'refusée' ? 'bg-error-100 text-error-700' : 'bg-warning-100 text-warning-700'}`}>
                            <option value="en attente">En attente</option>
                            <option value="acceptée">Acceptée</option>
                            <option value="refusée">Refusée</option>
                          </select>
                        </td>
                        <td className="px-3 md:px-5 py-3 text-xs md:text-sm">
                          {c.cv_url
                            ? <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${c.cv_url}`} target="_blank" rel="noopener noreferrer" className="text-navy-500 hover:text-navy-700 font-medium transition-colors">Voir CV</a>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-3 md:px-5 py-3"><button onClick={() => deleteCandidature(c.id)} className="text-error-400 hover:text-error-600 text-xs font-medium transition-colors">Supprimer</button></td>
                      </tr>
                    ))}
                    {candidatures.length === 0 && <tr><td colSpan={6} className="px-3 md:px-5 py-12 text-center text-gray-400 text-xs md:text-sm">Aucune candidature</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SERVICES ── */}
          {tab === 'services' && (
            <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-navy-600 text-sm md:text-base">💼 Demandes de service ({services.length})</h2></div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Entreprise','Service','Téléphone','Date événement','Message'].map(h => <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 md:px-5 py-3 font-medium text-navy-600 text-xs md:text-sm">{s.nom}</td>
                        <td className="px-3 md:px-5 py-3 text-gray-500 text-xs md:text-sm">{s.entreprise || '—'}</td>
                        <td className="px-3 md:px-5 py-3 text-xs md:text-sm">{s.service}</td>
                        <td className="px-3 md:px-5 py-3 text-gray-500 text-xs md:text-sm">{s.telephone || '—'}</td>
                        <td className="px-3 md:px-5 py-3 text-gray-400 text-xs md:text-sm whitespace-nowrap">{s.date_evenement ? new Date(s.date_evenement).toLocaleDateString('fr-FR') : '—'}</td>
                        <td className="px-3 md:px-5 py-3 max-w-xs"><p className="truncate text-gray-500 text-xs md:text-sm" title={s.message}>{s.message}</p></td>
                      </tr>
                    ))}
                    {services.length === 0 && <tr><td colSpan={6} className="px-3 md:px-5 py-12 text-center text-gray-400 text-xs md:text-sm">Aucune demande</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {tab === 'contacts' && (
            <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-navy-600 text-sm md:text-base">✉️ Messages ({contacts.length})</h2></div>
              <div className="divide-y divide-gray-100">
                {contacts.map(c => (
                  <div key={c.id} className="px-4 md:px-6 py-4 md:py-5 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <span className="font-semibold text-navy-600 text-sm md:text-base">{c.nom}</span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-xs md:text-sm text-navy-500 mb-2 break-all">{c.email}</p>
                    <p className="text-xs md:text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{c.message}</p>
                  </div>
                ))}
                {contacts.length === 0 && <p className="px-4 md:px-6 py-12 text-center text-gray-400 text-xs md:text-sm">Aucun message</p>}
              </div>
            </div>
          )}

          {/* ── ADMINS ── */}
          {tab === 'admins' && isSuperAdmin && (
            <div className="space-y-8">
              <div className="card-modern bg-white rounded-xl border border-gray-200 p-4 md:p-6">
                <h2 className="font-bold text-navy-600 mb-5 text-sm md:text-base">🔑 Créer un compte administrateur</h2>
                {adminFormMsg && <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${adminFormMsg.type === 'success' ? 'bg-success-50 text-success-700 border border-success-200' : 'bg-error-50 text-error-700 border border-error-200'}`}>{adminFormMsg.text}</div>}
                <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[{ field: 'nom', label: 'Nom complet *', type: 'text', placeholder: 'Ex : Fatou Diallo' }, { field: 'email', label: 'Adresse e-mail *', type: 'email', placeholder: 'fatou@wins-agency.td' }, { field: 'password', label: 'Mot de passe * (min. 8)', type: 'password', placeholder: '••••••••' }].map(({ field, label, type, placeholder }) => (
                    <div key={field}>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}</label>
                      <input type={type} value={(adminForm as any)[field]} placeholder={placeholder}
                        onChange={e => { setAdminForm(p => ({ ...p, [field]: e.target.value })); setAdminFormErrors(p => ({ ...p, [field]: '' })); }}
                        className={`w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold-400 transition-all ${(adminFormErrors as any)[field] ? 'border-error-500 bg-error-50' : 'border-gray-300 focus:border-gold-400'}`} />
                      {(adminFormErrors as any)[field] && <p className="text-xs text-red-500 mt-1">{(adminFormErrors as any)[field]}</p>}
                    </div>
                  ))}
                  <div className="sm:col-span-3">
                    <button type="submit" disabled={adminFormLoading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2">
                      {adminFormLoading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : '➕'} Créer le compte
                    </button>
                  </div>
                </form>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-800 text-sm md:text-base">Comptes administrateurs ({admins.length})</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Nom','Email','Créé le','Action'].map(h => <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {admins.map(a => (
                        <tr key={a.id} className="hover:bg-gray-50">
                          <td className="px-3 md:px-5 py-3 font-medium text-xs md:text-sm">{a.nom}</td>
                          <td className="px-3 md:px-5 py-3 text-gray-500 text-xs md:text-sm break-all">{a.email}</td>
                          <td className="px-3 md:px-5 py-3 text-gray-400 text-xs md:text-sm whitespace-nowrap">{new Date(a.createdAt).toLocaleDateString('fr-FR')}</td>
                          <td className="px-3 md:px-5 py-3"><button onClick={() => deleteAdmin(a.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Supprimer</button></td>
                        </tr>
                      ))}
                      {admins.length === 0 && <tr><td colSpan={4} className="px-3 md:px-5 py-10 text-center text-gray-400 text-xs md:text-sm">Aucun admin secondaire</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── LOGS ── */}
          {tab === 'logs' && isSuperAdmin && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-800">📋 Logs d'activité</h2>
                <button onClick={() => api.get('/auth/logs').then(r => setLogs(r.data))} className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">🔄 Actualiser</button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4">
                <input value={logFilter} onChange={e => setLogFilter(e.target.value)} placeholder="🔍 Filtrer..." className="w-full border border-gray-300 rounded-lg px-4 py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {[{ label: 'Total actions', value: logs.length, bg: 'bg-blue-50 text-blue-700' }, { label: 'Connexions', value: logs.filter(l => l.action.includes('Connexion')).length, bg: 'bg-green-50 text-green-700' }, { label: 'Modifications', value: logs.filter(l => l.action.includes('modifié') || l.action.includes('Statut')).length, bg: 'bg-yellow-50 text-yellow-700' }, { label: 'Suppressions', value: logs.filter(l => l.action.includes('supprimé')).length, bg: 'bg-red-50 text-red-700' }].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3 md:p-4`}><p className="text-xs font-semibold opacity-75 mb-1 line-clamp-1">{s.label}</p><p className="text-2xl md:text-3xl font-bold">{s.value}</p></div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 md:px-6 py-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="font-bold text-gray-800 text-sm md:text-base">{filteredLogs.length} entrée{filteredLogs.length !== 1 ? 's' : ''}{logFilter && ` sur ${logs.length}`}</h3>
                  <span className="text-xs text-gray-400">200 dernières actions max</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase"><tr>{['Date & heure','Admin','Action','Élément ciblé','IP'].map(h => <th key={h} className="px-3 md:px-5 py-3 text-left font-semibold">{h}</th>)}</tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredLogs.map(l => (
                        <tr key={l.id} className="hover:bg-gray-50">
                          <td className="px-3 md:px-5 py-3 text-gray-400 whitespace-nowrap text-xs">{new Date(l.createdAt).toLocaleDateString('fr-FR')} <span className="font-mono text-xs">{new Date(l.createdAt).toLocaleTimeString('fr-FR')}</span></td>
                          <td className="px-3 md:px-5 py-3"><p className="font-medium text-gray-800 text-xs md:text-sm">{l.adminNom}</p><p className="text-xs text-gray-400 break-all">{l.adminEmail}</p></td>
                          <td className="px-3 md:px-5 py-3"><ActionBadge action={l.action} /></td>
                          <td className="px-3 md:px-5 py-3 text-gray-500 text-xs max-w-xs"><p className="truncate" title={l.cible ?? ''}>{l.cible || '—'}</p></td>
                          <td className="px-3 md:px-5 py-3 text-gray-400 font-mono text-xs">{l.ip || '—'}</td>
                        </tr>
                      ))}
                      {filteredLogs.length === 0 && <tr><td colSpan={5} className="px-3 md:px-5 py-12 text-center text-gray-400 text-xs md:text-sm">Aucun log trouvé</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          </div>
        </div>
      </main>
    </div>
  );
}
