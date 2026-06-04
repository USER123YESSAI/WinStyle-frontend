'use client';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  tab: string;
  setTab: (tab: any) => void;
  isSuperAdmin: boolean;
}

type Tab = 'stats' | 'formations' | 'realisations' | 'inscriptions' | 'candidatures' | 'services' | 'contacts' | 'admins' | 'logs';

const TABS: { key: Tab; label: string; icon: string; superOnly?: boolean }[] = [
  { key: 'stats', label: 'Tableau de bord', icon: '📊' },
  { key: 'formations', label: 'Formations', icon: '🎓' },
  { key: 'realisations', label: 'Réalisations', icon: '🏆' },
  { key: 'inscriptions', label: 'Inscriptions', icon: '📝' },
  { key: 'candidatures', label: 'Candidatures', icon: '👤' },
  { key: 'services', label: 'Demandes', icon: '💼' },
  { key: 'contacts', label: 'Messages', icon: '✉️' },
  { key: 'admins', label: 'Admins', icon: '🔑', superOnly: true },
  { key: 'logs', label: 'Logs activité', icon: '📋', superOnly: true },
];

export default function Sidebar({ tab, setTab, isSuperAdmin }: SidebarProps) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('wins_token');
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-navy-900 text-white flex flex-col flex-shrink-0">
      <div className="px-6 py-5 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-gold-400 to-gold-500 rounded-lg flex items-center justify-center font-bold text-navy-900 text-sm shadow-glow">
            W
          </div>
          <span className="font-bold text-base">Win's Agency</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {TABS.filter(t => !t.superOnly || isSuperAdmin).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              tab === t.key
                ? 'bg-gold-400 text-navy-900 shadow-glow'
                : 'text-gray-400 hover:bg-navy-800 hover:text-white'
            }`}
          >
            <span>{t.icon}</span>
            {t.label}
            {(t.key === 'admins' || t.key === 'logs') && (
              <span className="ml-auto text-xs bg-gold-400 text-navy-900 px-1.5 py-0.5 rounded font-bold">
                SA
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-navy-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-navy-600 rounded-full flex items-center justify-center text-xs font-bold">
            {isSuperAdmin ? '★' : 'A'}
          </div>
          <div className="text-xs">
            <p className="font-medium text-white">
              {isSuperAdmin ? 'Super Admin' : 'Administrateur'}
            </p>
            <p className="text-gray-400">{isSuperAdmin ? 'superadmin' : 'admin'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:bg-navy-800 hover:text-white transition-all duration-300"
        >
          <span>🚪</span> Déconnexion
        </button>
      </div>
    </aside>
  );
}
