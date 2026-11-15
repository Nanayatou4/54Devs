import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { HelpCircle, LayoutDashboard, LogOut, ShieldCheck, Trophy, Users } from 'lucide-react'
import { clearAuthSession } from '../api'
import Logo from './Logo'

const navigation = [
  { key: 'overview', label: 'Vue d’ensemble', path: '/admin', icon: LayoutDashboard },
  { key: 'users', label: 'Utilisateurs & accès', path: '/admin?tab=users', icon: Users },
  { key: 'moderation', label: 'Modération Q&A', path: '/admin?tab=moderation', icon: HelpCircle },
  { key: 'challenges', label: 'Défis & compétitions', path: '/admin?tab=challenges', icon: Trophy },
  { key: 'create-challenge', label: 'Nouveau défi', path: '/admin/challenges/creer', icon: ShieldCheck },
]

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeKey = location.pathname === '/admin/challenges/creer'
    ? 'create-challenge'
    : location.pathname.startsWith('/admin/challenges/')
      ? 'challenges'
      : new URLSearchParams(location.search).get('tab') || 'overview'

  return (
    <div className="min-h-screen bg-[#0E1511] text-white lg:flex">
      <aside className="flex flex-col border-b border-white/10 bg-[#0B100D] p-4 sm:p-5 lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-64 lg:overflow-y-auto lg:border-b-0 lg:border-r">
        <Link to="/admin" className="flex flex-col gap-1.5 rounded-xl px-2 py-2 group">
          <Logo variant="full" className="h-9 w-auto" withLink={false} />
          <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#C9F06A]">
            <ShieldCheck size={12} /> Administration
          </span>
        </Link>

        <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible" aria-label="Navigation administration">
          {navigation.map(({ key, label, path, icon: Icon }) => {
            const active = key === activeKey
            return (
              <Link
                key={key}
                to={path}
                aria-current={active ? 'page' : undefined}
                className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold transition lg:w-full ${active
                  ? 'bg-[#C9F06A] text-black shadow-lg shadow-[#C9F06A]/15'
                  : 'border border-transparent text-white/60 hover:border-white/10 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            )
          })}
        </nav>

        <button
          type="button"
          onClick={() => {
            clearAuthSession()
            navigate('/login', { replace: true })
          }}
          className="mt-5 inline-flex items-center gap-3 rounded-xl border border-white/10 px-3 py-3 text-left text-xs font-semibold text-white/55 transition hover:border-rose-400/25 hover:bg-rose-400/5 hover:text-rose-200 lg:mt-auto"
        >
          <LogOut size={17} />
          <span>Se déconnecter</span>
        </button>
      </aside>

      <main className="min-w-0 flex-1 lg:ml-64">
        <Outlet />
      </main>
    </div>
  )
}
