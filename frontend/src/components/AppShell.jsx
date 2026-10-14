import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { clearAuthSession, getStoredUser } from '../api'
import { styles } from '../pages/Dashboard.styles'
import { appNavItems } from './AppShell.data'

function personName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

function initials(person) {
  return `${person?.prenom?.[0] || ''}${person?.nom?.[0] || ''}`.toUpperCase() || '?'
}

export default function AppShell({ children, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const stored = user || getStoredUser()

  const activeKey =
    appNavItems.find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
      ?.key || 'dashboard'

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div>
          <Link to="/" className={styles.sidebarLogo}>
            <span className="text-[#C9F06A] font-mono font-bold">&lt;/&gt;</span>
            <span>
              54<span className="text-[#C9F06A]">Devs</span>
            </span>
          </Link>
          <Link to="/profile" className={`${styles.userCard} ${styles.userCardInactive}`}>
            <div className={styles.userAvatar}>{initials(stored)}</div>
            <div className="text-left min-w-0">
              <p className="text-white text-sm font-semibold truncate">{personName(stored)}</p>
              <p className="text-gray-400 text-[10px] truncate">{stored?.pays || 'Mon profil'}</p>
            </div>
          </Link>
          <nav className="space-y-1" aria-label="Navigation principale">
            {appNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeKey === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>
        <div className="space-y-3">
          <div className={styles.publishCard}>
            <span className="text-[#C9F06A] text-xs font-bold uppercase tracking-wider font-mono">Build together</span>
            <p className="text-white text-sm font-semibold mt-2 mb-1">Share your next idea</p>
            <p className="text-gray-400 text-xs mb-3">Publish a project and find collaborators across 54 nations.</p>
            <Link to="/projects/create" className={`block text-center ${styles.projectActionButton}`}>
              New project
            </Link>
          </div>
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>{children}</main>
    </div>
  )
}
