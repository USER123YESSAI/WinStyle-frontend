'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  GraduationCap,
  Trophy,
  Handshake,
  MessageSquareQuote,
  ClipboardList,
  UserCheck,
  Briefcase,
  Mail,
  KeyRound,
  Activity,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  Menu,
  X,
  Plus,
  RefreshCw,
  Search,
  Lock,
  Trash2,
  Pencil,
  ShieldCheck,
  User,
  ArrowRight,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';
import api from '@/lib/api';
import RealisationTab from './_components/RealisationTab';
import FormationsTab from './_components/FormationsTab';
import PartenairesManager, { PartenaireItem } from '@/components/admin/PartenairesManager';
import TemoignagesManager, { TemoignageItem } from '@/components/admin/TemoignagesManager';
import CmsStudioManager from '@/components/admin/CmsStudioManager';


interface Stats { formations: number; inscriptions: number; candidatures: number; realisations: number; partenaires: number; temoignages: number; services: number; contacts: number; }
interface Formation { id: number; title: string; description: string; date: string; lieu: string; prix: number; places_disponibles: number; }
interface Candidature { id: number; nom: string; email: string; poste: string; statut: string; createdAt: string; cv_url?: string; }
interface Inscription { id: number; nom: string; email: string; createdAt: string; Formation?: { title: string; date: string }; }
interface Realisation { id: number; title: string; description: string; image_url: string; createdAt: string; }
interface AdminUser { id: number; nom: string; email: string; createdAt: string; }
interface Log { id: number; adminNom: string; adminEmail: string; action: string; cible?: string; ip?: string; createdAt: string; }
type Tab = 'stats' | 'cms' | 'formations' | 'inscriptions' | 'candidatures' | 'realisations' | 'partenaires' | 'temoignages' | 'services' | 'contacts' | 'admins' | 'logs';

const EMPTY_ADMIN = { nom: '', email: '', password: '' };

function ActionBadge({ action }: { action: string }) {
  const a = action.toLowerCase();
  if (a.includes('connexion'))
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-navy-100 text-navy-700">
        <Lock className="w-3 h-3 shrink-0" />
        <span>{action}</span>
      </span>
    );
  if (a.includes('supprimé'))
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-error-100 text-error-700">
        <Trash2 className="w-3 h-3 shrink-0" />
        <span>{action}</span>
      </span>
    );
  if (a.includes('créé'))
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success-100 text-success-700">
        <Plus className="w-3 h-3 shrink-0" />
        <span>{action}</span>
      </span>
    );
  if (a.includes('modifié') || a.includes('statut'))
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-warning-100 text-warning-700">
        <Pencil className="w-3 h-3 shrink-0" />
        <span>{action}</span>
      </span>
    );
  return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{action}</span>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab]               = useState<Tab>('stats');
  const [stats, setStats]           = useState<Stats | null>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [partenaires, setPartenaires] = useState<PartenaireItem[]>([]);
  const [temoignages, setTemoignages] = useState<TemoignageItem[]>([]);
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

  const logout = () => { localStorage.removeItem('wins_token'); router.push('/admin/login'); };

  useEffect(() => {
    const token = localStorage.getItem('wins_token');
    if (!token) { router.push('/admin/login'); return; }

    api.get('/auth/me')
      .then((meRes) => {
        if (meRes.data?.user?.role === 'superadmin') setIsSuperAdmin(true);
      })
      .catch(() => {
        localStorage.removeItem('wins_token');
        router.push('/admin/login');
      });

    Promise.allSettled([
      api.get('/formations'), api.get('/inscriptions'), api.get('/candidatures'),
      api.get('/realisations'), api.get('/partenaires/admin'), api.get('/temoignages/admin'),
      api.get('/services'), api.get('/contact'),
    ]).then(([f, i, c, r, p, t, s, co]) => {
      const parse = (res: PromiseSettledResult<any>) => {
        if (res.status !== 'fulfilled') return [];
        const d = res.value?.data;
        return Array.isArray(d) ? d : Array.isArray(d?.data) ? d.data : [];
      };
      const fData = parse(f); const iData = parse(i); const cData = parse(c);
      const rData = parse(r); const pData = parse(p); const tData = parse(t);
      const sData = parse(s); const coData = parse(co);
      setStats({
        formations: fData.length,
        inscriptions: iData.length,
        candidatures: cData.length,
        realisations: rData.length,
        partenaires: pData.length,
        temoignages: tData.length,
        services: sData.length,
        contacts: coData.length,
      });
      setFormations(fData); setInscriptions(iData); setCandidatures(cData);
      setRealisations(rData); setPartenaires(pData); setTemoignages(tData);
      setServices(sData); setContacts(coData);
    }).finally(() => setLoading(false));
  }, [router]);

  // Synchronise les compteurs dynamiques
  useEffect(() => {
    setStats(prev => prev ? {
      ...prev,
      formations: formations.length,
      realisations: realisations.length,
      partenaires: partenaires.length,
      temoignages: temoignages.length,
      candidatures: candidatures.length,
    } : prev);
  }, [formations.length, realisations.length, partenaires.length, temoignages.length, candidatures.length]);

  // Fermer la sidebar on mobile quand on change de tab
  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (tab === 'admins' && isSuperAdmin) api.get('/auth/admins').then(r => setAdmins(r.data)).catch(() => {});
    if (tab === 'logs'   && isSuperAdmin) api.get('/auth/logs').then(r => setLogs(r.data)).catch(() => {});
  }, [tab, isSuperAdmin]);

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

  const TABS: { key: Tab; label: string; icon: LucideIcon; superOnly?: boolean }[] = [
    { key: 'stats',        label: 'Tableau de bord',   icon: LayoutDashboard },
    { key: 'cms',          label: 'Contenu du site',   icon: Sparkles },
    { key: 'formations',   label: 'Formations',        icon: GraduationCap },
    { key: 'realisations', label: 'Réalisations',      icon: Trophy },
    { key: 'partenaires',  label: 'Partenaires',       icon: Handshake },
    { key: 'temoignages',  label: 'Témoignages',       icon: MessageSquareQuote },
    { key: 'inscriptions', label: 'Inscriptions',      icon: ClipboardList },
    { key: 'candidatures', label: 'Candidatures',      icon: UserCheck },
    { key: 'services',     label: 'Demandes',          icon: Briefcase },
    { key: 'contacts',     label: 'Messages',          icon: Mail },
    { key: 'admins',       label: 'Admins',            icon: KeyRound, superOnly: true },
    { key: 'logs',         label: 'Logs activité',     icon: Activity, superOnly: true },
  ];

  const pendingCandidatures = candidatures.filter(c => c.statut === 'en attente').length;
  const acceptedCandidatures = candidatures.filter(c => c.statut === 'acceptée').length;
  const rejectedCandidatures = candidatures.filter(c => c.statut === 'refusée').length;
  const totalCandidatures = candidatures.length || 1;

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
              aria-label="Fermer le menu"
              className="md:hidden text-gray-400 hover:text-white transition-colors p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {TABS.filter(t => !t.superOnly || isSuperAdmin).map(t => {
            const Icon = t.icon;
            return (
              <button key={t.key} onClick={() => handleTabChange(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-gold-400 text-navy-900 shadow-glow' : 'text-gray-400 hover:bg-navy-800 hover:text-white'}`}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{t.label}</span>
                {(t.key === 'admins' || t.key === 'logs') && <span className="ml-auto text-xs bg-gold-400 text-navy-900 px-1.5 py-0.5 rounded font-bold">SA</span>}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-navy-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center text-xs font-bold">
              {isSuperAdmin ? <ShieldCheck className="w-4 h-4 text-gold-400" /> : 'A'}
            </div>
            <div className="text-xs">
              <p className="font-medium text-white">{isSuperAdmin ? 'Super Admin' : 'Administrateur'}</p>
              <p className="text-gray-400 hidden sm:block">{isSuperAdmin ? 'superadmin' : 'admin'}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-navy-800 hover:text-white transition">
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 flex flex-col w-full min-h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm gap-4">
          <div className="flex items-center gap-3 md:gap-2 flex-1 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Ouvrir le menu"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-navy-700" />
            </button>
            <div className="flex items-center gap-2 text-gray-600 text-sm truncate">
              <User className="w-4 h-4 text-navy-600 shrink-0" />
              <span className="font-medium truncate">{isSuperAdmin ? 'Super Administrateur' : 'Administrateur'}</span>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 border border-error-300 text-error-500 hover:bg-error-50 px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm transition-all hover:shadow-md whitespace-nowrap">
            <LogOut className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-8 py-6 md:py-8">

          {/* ── VUE D'ENSEMBLE (SANS CARTES COLORÉES) ── */}
          {tab === 'stats' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* En-tête épuré */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Vue d'ensemble</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Suivi de l'activité et gestion des contenus de Win's Agency.
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => handleTabChange('cms')}
                    className="inline-flex items-center gap-2 bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition"
                  >
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>Éditer le site</span>
                  </button>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-lg transition"
                  >
                    <span>Voir le site</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                  </a>
                </div>
              </div>

              {/* Bandeau d'indicateurs unifié */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                  {[
                    {
                      label: 'Inscriptions',
                      value: stats?.inscriptions ?? 0,
                      sub: `${stats?.formations ?? 0} formation(s) active(s)`,
                      icon: ClipboardList,
                      target: 'inscriptions' as Tab,
                    },
                    {
                      label: 'Candidatures',
                      value: stats?.candidatures ?? 0,
                      sub: pendingCandidatures > 0 ? `${pendingCandidatures} en attente` : 'Tout est traité',
                      icon: UserCheck,
                      target: 'candidatures' as Tab,
                    },
                    {
                      label: 'Demandes de service',
                      value: stats?.services ?? 0,
                      sub: 'Devis & réservations',
                      icon: Briefcase,
                      target: 'services' as Tab,
                    },
                    {
                      label: 'Messages reçus',
                      value: stats?.contacts ?? 0,
                      sub: 'Formulaire de contact',
                      icon: Mail,
                      target: 'contacts' as Tab,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleTabChange(item.target)}
                        className="p-5 sm:p-6 text-left hover:bg-gray-50/70 transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                            {item.label}
                          </span>
                          <Icon className="w-4 h-4 text-gray-400 group-hover:text-navy-700 transition-colors" />
                        </div>
                        <p className="text-3xl font-bold text-navy-900 tracking-tight">{item.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.sub}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grille principale 2 colonnes */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne gauche : Activité récente + Suivi candidatures */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Dernières inscriptions & candidatures */}
                  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-navy-900">Dernières inscriptions aux formations</h3>
                      <button
                        onClick={() => handleTabChange('inscriptions')}
                        className="text-xs font-medium text-navy-600 hover:text-gold-600 inline-flex items-center gap-1 transition"
                      >
                        <span>Tout voir</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {inscriptions.length === 0 ? (
                      <div className="px-6 py-8 text-center text-sm text-gray-400">
                        Aucune inscription enregistrée pour le moment.
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {inscriptions.slice(0, 5).map((ins) => (
                          <div key={ins.id} className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50/60 transition">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-navy-900 truncate">{ins.nom}</p>
                              <p className="text-xs text-gray-500 truncate">{ins.email}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="inline-block text-xs font-medium text-navy-700 bg-navy-50 px-2.5 py-1 rounded-md">
                                {ins.Formation?.title || 'Formation'}
                              </span>
                              <p className="text-[11px] text-gray-400 mt-1">
                                {new Date(ins.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Répartition des candidatures */}
                  <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-navy-900">Suivi des candidatures</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {candidatures.length} candidature(s) reçue(s) au total
                        </p>
                      </div>
                      <button
                        onClick={() => handleTabChange('candidatures')}
                        className="text-xs font-medium text-navy-600 hover:text-gold-600 inline-flex items-center gap-1 transition"
                      >
                        <span>Gérer</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex mb-4">
                      <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{ width: `${(acceptedCandidatures / totalCandidatures) * 100}%` }}
                      />
                      <div
                        className="bg-amber-400 h-full transition-all"
                        style={{ width: `${(pendingCandidatures / totalCandidatures) * 100}%` }}
                      />
                      <div
                        className="bg-rose-400 h-full transition-all"
                        style={{ width: `${(rejectedCandidatures / totalCandidatures) * 100}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-gray-600 text-xs">Acceptées</span>
                        <span className="font-semibold text-navy-900 ml-auto">{acceptedCandidatures}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-gray-600 text-xs">En attente</span>
                        <span className="font-semibold text-navy-900 ml-auto">{pendingCandidatures}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0" />
                        <span className="text-gray-600 text-xs">Refusées</span>
                        <span className="font-semibold text-navy-900 ml-auto">{rejectedCandidatures}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Colonne droite : Contenus du site (liste sobre) */}
                <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden h-fit">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-navy-900">Contenus du site</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Accès rapide aux modules</p>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { label: 'Sections CMS', count: 12, icon: Sparkles, target: 'cms' as Tab },
                      { label: 'Formations', count: stats?.formations ?? 0, icon: GraduationCap, target: 'formations' as Tab },
                      { label: 'Réalisations', count: stats?.realisations ?? 0, icon: Trophy, target: 'realisations' as Tab },
                      { label: 'Partenaires', count: stats?.partenaires ?? 0, icon: Handshake, target: 'partenaires' as Tab },
                      { label: 'Témoignages', count: stats?.temoignages ?? 0, icon: MessageSquareQuote, target: 'temoignages' as Tab },
                    ].map((mod) => {
                      const ModIcon = mod.icon;
                      return (
                        <button
                          key={mod.label}
                          onClick={() => handleTabChange(mod.target)}
                          className="w-full px-6 py-3.5 flex items-center justify-between hover:bg-gray-50/70 transition-colors group text-left"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-200/70 flex items-center justify-center text-navy-700 group-hover:border-gold-400 group-hover:bg-gold-50/50 transition">
                              <ModIcon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-navy-900">
                              {mod.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {mod.count}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-navy-700 transition" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── CMS (Gestion 100 % dynamique du site) ── */}
          {tab === 'cms' && (
            <div className="space-y-6">
              <CmsStudioManager />
            </div>
          )}

          {/* ── FORMATIONS (utilise FormationsManager) ── */}
          {tab === 'formations' && (
            <div className="space-y-6">
              <FormationsTab
                formations={formations as any}
                setFormations={setFormations as any}
              />
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

          {/* ── PARTENAIRES ── */}
          {tab === 'partenaires' && (
            <div className="space-y-6">
              <PartenairesManager
                partenaires={partenaires}
                setPartenaires={setPartenaires}
              />
            </div>
          )}

          {/* ── TÉMOIGNAGES ── */}
          {tab === 'temoignages' && (
            <div className="space-y-6">
              <TemoignagesManager
                temoignages={temoignages}
                setTemoignages={setTemoignages}
              />
            </div>
          )}


          {/* ── INSCRIPTIONS ── */}
          {tab === 'inscriptions' && (
            <div className="card-modern bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-navy-600 text-sm md:text-base flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-gold-500" />
                  <span>Inscriptions ({inscriptions.length})</span>
                </h2>
              </div>
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
              <div className="px-4 md:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-navy-600 text-sm md:text-base flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-gold-500" />
                  <span>Candidatures ({candidatures.length})</span>
                </h2>
              </div>
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
              <div className="px-4 md:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-navy-600 text-sm md:text-base flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gold-500" />
                  <span>Demandes de service ({services.length})</span>
                </h2>
              </div>
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
              <div className="px-4 md:px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-navy-600 text-sm md:text-base flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gold-500" />
                  <span>Messages ({contacts.length})</span>
                </h2>
              </div>
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
                <h2 className="font-bold text-navy-600 mb-5 text-sm md:text-base flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-gold-500" />
                  <span>Créer un compte administrateur</span>
                </h2>
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
                      {adminFormLoading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      <span>Créer le compte</span>
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
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2.5">
                  <Activity className="w-6 h-6 text-gold-500" />
                  <span>Logs d&apos;activité</span>
                </h2>
                <button onClick={() => api.get('/auth/logs').then(r => setLogs(r.data))} className="flex items-center justify-center md:justify-start gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
                  <RefreshCw className="w-4 h-4" />
                  <span>Actualiser</span>
                </button>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3 md:p-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input value={logFilter} onChange={e => setLogFilter(e.target.value)} placeholder="Filtrer par admin, action ou cible..." className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-xs md:text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
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
