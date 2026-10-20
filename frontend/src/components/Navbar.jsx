import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight, Bell, ShieldCheck } from 'lucide-react'
import { styles } from './Navbar.styles'
import { NAV_LINKS } from './Navbar.data'
import Avatar from './Avatar'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [utilisateur, setUtilisateur] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const u = localStorage.getItem('utilisateur')
    if (u) setUtilisateur(JSON.parse(u))
    function onStorage() {
      const u = localStorage.getItem('utilisateur')
      setUtilisateur(u ? JSON.parse(u) : null)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const initials = utilisateur
    ? ((utilisateur.prenom?.[0] || '') + (utilisateur.nom?.[0] || '')).toUpperCase()
    : ''
  const photo = localStorage.getItem('profile_photo')

  function isActive(path) {
    return location.pathname === path
  }

  return (
    <>
      {/* Top Banner */}
      <div className={styles.announcement}>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9F06A]/10 border border-[#C9F06A]/25 text-[#C9F06A] font-mono text-[10px] font-bold tracking-wider">
          54 NATIONS
        </span>
        <span>L'écosystème technologique unifié des développeurs et mentors d'Afrique</span>
      </div>

      <nav className={styles.nav}>
        <div className={styles.container}>
          {/* Logo Brand */}
          <div className={styles.logoGroup}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>&lt;/&gt;</div>
              <div className="flex flex-col">
                <span className={styles.logoBrand}>
                  54<span className="text-[#C9F06A]">DEVS</span>
                </span>
                <span className={styles.logoTagline}>Let's build Africa</span>
              </div>
            </Link>
            <div className={styles.logoSubline}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9F06A]" />
              <span>54 NATIONS • DAKAR & PANAFRICAIN</span>
            </div>
          </div>

          {/* Central Floating Capsule Navigation (Tech Micro-Beacon Dots) */}
          <div className={styles.desktopNav}>
            {NAV_LINKS.map((l) => {
              const active = isActive(l.to)
              const linkClasses = `${styles.linkItem} ${active ? styles.linkActive : styles.linkInactive}`

              const innerContent = (
                <>
                  <span className="relative flex h-1.5 w-1.5 items-center justify-center shrink-0">
                    {active && (
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#C9F06A] opacity-75 animate-ping" />
                    )}
                    <span
                      className={`relative inline-flex h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                        active
                          ? 'bg-[#C9F06A] shadow-[0_0_8px_#C9F06A]'
                          : 'bg-white/25 group-hover:bg-[#C9F06A] group-hover:shadow-[0_0_6px_#C9F06A]'
                      }`}
                    />
                  </span>
                  <span>{l.label}</span>
                </>
              )

              return l.to.includes('#') ? (
                <a key={l.to} href={l.to} className={linkClasses}>
                  {innerContent}
                </a>
              ) : (
                <Link key={l.to} to={l.to} className={linkClasses}>
                  {innerContent}
                </Link>
              )
            })}
          </div>

          {/* Right Action Buttons */}
          <div className={styles.desktopActions}>
            {utilisateur ? (
              <div className="flex items-center gap-3">
                {utilisateur?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    title="Panneau d'administration"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C9F06A]/15 border border-[#C9F06A]/30 text-[#C9F06A] text-xs font-bold hover:bg-[#C9F06A] hover:text-black transition shadow-sm"
                  >
                    <ShieldCheck size={14} />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  to={utilisateur?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  title="Notifications"
                  className="relative p-2 rounded-full text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  <Bell size={18} />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C9F06A]" />
                </Link>
                <Link to="/profile" title="Mon profil" className="group">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#C9F06A]/50 group-hover:ring-[#C9F06A] transition-all shadow-lg bg-[#16221C]">
                    <Avatar
                      src={photo || utilisateur?.avatarUrl}
                      name={[utilisateur?.prenom, utilisateur?.nom].filter(Boolean).join(' ') || initials || 'Membre'}
                      className="w-full h-full"
                      textClassName="text-xs"
                    />
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className={styles.darkPillButton}>
                  Se connecter
                </Link>
                <Link to="/register" className={styles.orangePillButton}>
                  <span>Rejoindre 54Devs</span>
                  <ArrowUpRight size={15} className="stroke-[2.5]" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Menu principal"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {open && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map((l) => {
              const active = isActive(l.to)
              const linkClasses = active ? styles.mobileLinkActive : styles.mobileLinkInactive

              const innerContent = (
                <>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      active ? 'bg-[#C9F06A] shadow-[0_0_8px_#C9F06A]' : 'bg-white/30'
                    }`}
                  />
                  <span>{l.label}</span>
                </>
              )

              return l.to.includes('#') ? (
                <a
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className={linkClasses}
                >
                  {innerContent}
                </a>
              ) : (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={linkClasses}
                >
                  {innerContent}
                </Link>
              )
            })}

            <div className="pt-3 border-t border-white/10 space-y-2">
              {utilisateur ? (
                <>
                  {utilisateur?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 text-center text-xs font-bold text-[#C9F06A] bg-[#C9F06A]/10 border border-[#C9F06A]/20 rounded-xl"
                    >
                      <ShieldCheck size={14} />
                      <span>Administration</span>
                    </Link>
                  )}
                  <Link
                    to={utilisateur?.role === 'ADMIN' ? '/admin' : '/dashboard'}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-center text-xs font-semibold text-white/80 hover:text-white"
                  >
                    {utilisateur?.role === 'ADMIN' ? 'Administration' : 'Dashboard'}
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setOpen(false)}
                    className={styles.mobileJoinButton}
                  >
                    Mon profil
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-center text-xs font-semibold text-white/80 hover:text-white"
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className={styles.mobileJoinButton}
                  >
                    Rejoindre 54Devs
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
