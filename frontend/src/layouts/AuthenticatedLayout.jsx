import { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, PanelLeftClose, PanelLeftOpen, ShieldCheck } from 'lucide-react'
import { clearAuthSession, getStoredUser } from '../api'
import { navItems } from '../pages/Dashboard.data'
import { styles } from '../pages/Dashboard.styles'

function displayName(user) {
  return user?.pseudo || [user?.prenom, user?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

function initials(user) {
  return `${user?.prenom?.[0] || ''}${user?.nom?.[0] || ''}`.toUpperCase() || '?'
}

const destinations = {
  dashboard: '/dashboard',
  projects: '/projects',
  questions: '/questions',
  challenges: '/challenges',
  developers: '/developers',
  mentorat: '/mentorat',
  admin: '/admin/challenges/new',
}

function activeSection(pathname) {
  if (pathname.startsWith('/profile')) return null
  if (pathname.startsWith('/projects')) return 'projects'
  if (pathname.startsWith('/questions')) return 'questions'
  if (pathname.startsWith('/challenges')) return 'challenges'
  if (pathname.startsWith('/developers')) return 'developers'
  if (pathname.startsWith('/mentorat') || pathname.startsWith('/mentors')) return 'mentorat'
  if (pathname.startsWith('/admin')) return 'admin'
  return 'dashboard'
}

export default function AuthenticatedLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [expanded, setExpanded] = useState(false)
  const user = getStoredUser() || {}
  const active = activeSection(pathname)

  function logout() {
    clearAuthSession()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#f2f1eb] md:flex" style={{ '--sidebar-width': expanded ? '260px' : '84px' }}>
      <aside className={`${styles.sidebar} ${expanded ? 'md:px-4' : 'md:px-3'}`}>
        <div>
          <div className={`mb-6 flex items-center gap-2 px-2 md:px-0 ${expanded ? 'justify-between md:flex-row' : 'justify-center md:flex-col'}`}>
            <Link to="/dashboard" className={`${styles.sidebarLogo} !mb-0 !px-1`} aria-label="54Devs, tableau de bord">
              <span className="text-[#c9f06a]">&lt;/&gt;</span>
              {expanded && <span>54<span className="text-[#c9f06a]">Devs</span></span>}
            </Link>
            <button
              type="button"
              onClick={() => setExpanded(value => !value)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[#c9f06a] transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c9f06a]"
              aria-label={expanded ? 'Replier le menu' : 'Déployer le menu'}
              aria-expanded={expanded}
            >
              {expanded ? <PanelLeftClose size={19} /> : <PanelLeftOpen size={19} />}
            </button>
          </div>

          <Link
            to="/profile"
            title={expanded ? undefined : displayName(user)}
            className={`${styles.userCard} ${styles.userCardInactive} ${expanded ? '' : 'md:justify-center md:px-0'}`}
          >
            <div className={styles.userAvatar}>{initials(user)}</div>
            {expanded && <div className="min-w-0 text-left"><p className="truncate text-sm font-semibold text-white">{displayName(user)}</p><p className="truncate text-[10px] text-gray-400">{user.pays || 'Mon profil'}</p></div>}
          </Link>

          <nav className={`space-y-1 ${expanded ? 'block' : 'hidden md:block'}`} aria-label="Navigation principale">
            {navItems.map(({ key, label, icon: Icon }) => (
              <Link
                key={key}
                to={destinations[key]}
                title={expanded ? undefined : label}
                aria-current={active === key ? 'page' : undefined}
                onClick={() => { if (window.matchMedia('(max-width: 767px)').matches) setExpanded(false) }}
                className={`${styles.navItem} ${expanded ? '' : 'md:justify-center md:px-0'} ${active === key ? styles.navItemActive : styles.navItemInactive}`}
              >
                <Icon size={18} />
                {expanded && <span>{label}</span>}
              </Link>
            ))}
            {user.role === 'ADMIN' && (
              <Link
                to={destinations.admin}
                title={expanded ? undefined : 'Administration'}
                aria-current={active === 'admin' ? 'page' : undefined}
                onClick={() => { if (window.matchMedia('(max-width: 767px)').matches) setExpanded(false) }}
                className={`${styles.navItem} ${expanded ? '' : 'md:justify-center md:px-0'} ${active === 'admin' ? styles.navItemActive : styles.navItemInactive}`}
              >
                <ShieldCheck size={18} />
                {expanded && <span>Administration</span>}
              </Link>
            )}
          </nav>
        </div>

        <div className="space-y-3">
          {expanded && <div className={styles.publishCard}>
            <span className="text-xs font-bold uppercase tracking-wider text-[#c9f06a]">À vous de jouer</span>
            <p className="mb-1 mt-2 text-sm font-semibold text-white">Une idée à partager ?</p>
            <p className="mb-3 text-xs text-gray-400">Publiez votre projet et trouvez des personnes pour le faire avancer.</p>
            <Link to="/projects/create" className={`block text-center ${styles.projectActionButton}`}>Publier un projet</Link>
          </div>}
          <button onClick={logout} title={expanded ? undefined : 'Déconnexion'} className={`${styles.logoutButton} ${expanded ? '' : 'md:justify-center md:px-0'}`}>
            <LogOut size={18} />{expanded && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="min-h-screen min-w-0 flex-1 md:ml-[var(--sidebar-width)] transition-[margin] duration-300 ease-out">
        <Outlet />
      </div>
    </div>
  )
}
