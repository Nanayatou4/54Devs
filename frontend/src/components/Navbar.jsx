import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'
import { styles } from './Navbar.styles'
import { NAV_LINKS } from './Navbar.data'

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
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <div className={styles.banner}>
        Coupe d'Afrique des D&eacute;veloppeurs (CADEV) 2026
      </div>

      <nav className={styles.nav}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>&lt;/&gt;</span>{' '}
            <span className="font-extrabold">54Devs</span>
          </Link>

          <div className={styles.desktopNav}>
            {NAV_LINKS.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={isActive(l.to) ? styles.linkActive : styles.linkInactive}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className={styles.desktopActions}>
            {utilisateur ? (
              <>
                <button className={styles.bellButton}>
                  <Bell size={20} />
                </button>
                <Link to="/profile">
                  <div className={styles.avatarContainer}>
                    {photo ? (
                      <img src={photo} alt="" className={styles.avatarImg} />
                    ) : initials}
                  </div>
                </Link>
              </>
            ) : (
              <Link to="/register" className={styles.joinButton}>
                Rejoindre la communauté
              </Link>
            )}
          </div>

          <button className={styles.mobileMenuButton} onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={isActive(l.to) ? styles.mobileLinkActive : styles.mobileLinkInactive}>
                {l.label}
              </Link>
            ))}
            {utilisateur ? (
              <Link to="/profile" onClick={() => setOpen(false)} className={styles.mobileAvatarRow}>
                <div className={styles.mobileAvatarContainer}>
                  {photo ? (
                    <img src={photo} alt="" className={styles.avatarImg} />
                  ) : initials}
                </div>
                <span className={styles.mobileUserName}>{utilisateur.prenom}</span>
              </Link>
            ) : (
              <Link to="/register" onClick={() => setOpen(false)} className={styles.mobileJoinButton}>
                Rejoindre la communauté
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
