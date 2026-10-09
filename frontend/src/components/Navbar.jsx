import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bell } from 'lucide-react'

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

  const links = [
    { to: '/ecosystem', label: 'Ecosystem' },
    { to: '/projects', label: 'Projects' },
    { to: '/review-plans', label: 'Review Plans' },
  ]

  function isActive(path) {
    return location.pathname.startsWith(path)
  }

  return (
    <>
      <div className="bg-indigo-600 text-white text-center text-xs font-medium py-2 px-4">
        Celebrating the 2026 Coupe d'Afrique des D&eacute;veloppeurs (CADEV) !
      </div>

      <nav className="bg-dark sticky top-0 z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white flex items-center gap-1">
            <span className="text-gray-400">&lt;/&gt;</span>{' '}
            <span className="font-extrabold">54Devs</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`text-sm font-medium transition ${
                  isActive(l.to)
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {utilisateur ? (
              <>
                <button className="text-gray-400 hover:text-white transition">
                  <Bell size={20} />
                </button>
                <Link to="/profile">
                  <div className="w-9 h-9 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/20 overflow-hidden">
                    {photo ? (
                      <img src={photo} alt="" className="w-full h-full object-cover" />
                    ) : initials}
                  </div>
                </Link>
              </>
            ) : (
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
              >
                Join the Community
              </Link>
            )}
          </div>

          <button className="md:hidden text-gray-400" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-dark border-t border-white/10 px-4 pb-4 space-y-3">
            {links.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={`block py-2 text-sm font-medium ${isActive(l.to) ? 'text-white' : 'text-gray-400'}`}>
                {l.label}
              </Link>
            ))}
            {utilisateur ? (
              <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2.5 py-2">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                  {photo ? (
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                  ) : initials}
                </div>
                <span className="text-white text-sm font-medium">{utilisateur.prenom}</span>
              </Link>
            ) : (
              <Link to="/register" onClick={() => setOpen(false)}
                className="block bg-primary text-white px-5 py-2 rounded-lg font-semibold text-center text-sm">
                Join the Community
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
