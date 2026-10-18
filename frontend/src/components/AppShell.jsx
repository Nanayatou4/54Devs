import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, PlusCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { clearAuthSession, getStoredUser } from '../api'
import { styles } from '../pages/Dashboard.styles'
import { appNavItems } from './AppShell.data'
import Avatar from './Avatar'

function personName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

export default function AppShell({ children, user }) {
  const navigate = useNavigate()
  const location = useLocation()
  const stored = user || getStoredUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('54devs_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  const activeKey =
    appNavItems.find((item) => location.pathname === item.path || location.pathname.startsWith(`${item.path}/`))
      ?.key || 'dashboard'

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  function handleNav(path) {
    navigate(path)
    setMobileMenuOpen(false)
  }

  function toggleSidebar() {
    setSidebarCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('54devs_sidebar_collapsed', String(next))
      } catch {}
      return next
    })
  }

  return (
    <div className={styles.page}>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0B0D11] border-b border-white/10 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white font-display">
          <span className="text-[#C9F06A] font-mono font-bold">&lt;/&gt;</span>
          <span>
            54<span className="text-[#C9F06A]">Devs</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:text-[#C9F06A] transition"
          aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Bouton flottant pour réafficher la barre latérale sur desktop */}
      {sidebarCollapsed && (
        <button
          type="button"
          onClick={toggleSidebar}
          className="hidden md:flex fixed top-4 left-4 z-40 items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B0D11]/90 hover:bg-[#16221C] border border-white/15 text-white/90 hover:text-white hover:border-[#C9F06A]/50 transition-all shadow-2xl backdrop-blur-md text-xs font-semibold group cursor-pointer"
          title="Afficher la barre latérale"
          aria-label="Afficher la barre latérale"
        >
          <PanelLeftOpen size={18} className="text-[#C9F06A] group-hover:scale-110 transition-transform" />
          <span>Menu</span>
        </button>
      )}

      {/* Sidebar (Desktop always fixed & intact, Mobile toggleable drawer) */}
      <aside
        className={`${styles.sidebar} ${
          mobileMenuOpen
            ? 'flex fixed inset-0 z-50 overflow-y-auto'
            : sidebarCollapsed
            ? 'hidden'
            : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Header & Logo */}
          <div className="flex items-center justify-between mb-6 md:mb-8 px-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white font-display">
              <span className="text-[#C9F06A] font-mono font-bold">&lt;/&gt;</span>
              <span>
                54<span className="text-[#C9F06A]">Devs</span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleSidebar}
                className="hidden md:flex p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
                title="Masquer la barre latérale"
                aria-label="Masquer la barre latérale"
              >
                <PanelLeftClose size={18} />
              </button>
              {mobileMenuOpen && (
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="md:hidden p-1.5 rounded-lg text-white/60 hover:text-white"
                  aria-label="Fermer le menu"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          {/* User Card */}
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`${styles.userCard} ${styles.userCardInactive}`}
          >
            <Avatar
              src={stored?.avatarUrl}
              name={personName(stored)}
              className="w-10 h-10 ring-2 ring-[#C9F06A]/40"
              textClassName="text-xs"
            />
            <div className="text-left min-w-0">
              <p className="text-white text-sm font-semibold truncate">{personName(stored)}</p>
              <p className="text-gray-400 text-[10px] truncate">{stored?.pays || 'Mon profil'}</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1" aria-label="Navigation principale">
            {appNavItems.map((item) => {
              const Icon = item.icon
              const isActive = activeKey === item.key
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Action Card & Logout */}
        <div className="space-y-3 mt-6">
          <div className={styles.publishCard}>
            <span className="text-[#C9F06A] text-xs font-bold uppercase tracking-wider font-mono">
              Co-création
            </span>
            <p className="text-white text-sm font-semibold mt-2 mb-1">Une nouvelle idée ?</p>
            <p className="text-gray-400 text-xs mb-3">
              Publiez votre projet et trouvez vos coéquipiers parmi les 54 nations.
            </p>
            <Link
              to="/projects/create"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-center gap-2 text-center ${styles.projectActionButton}`}
            >
              <PlusCircle size={15} />
              <span>Nouveau projet</span>
            </Link>
          </div>
          <button type="button" onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`${styles.mainContent} ${sidebarCollapsed ? 'md:pt-16' : ''}`}>{children}</main>
    </div>
  )
}
