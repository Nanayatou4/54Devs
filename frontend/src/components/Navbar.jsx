import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [utilisateur, setUtilisateur] = useState(null)

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

  return (
    <>
      <div className="bg-accent text-white text-center text-sm py-2 px-4">
        Celebrating the 2026 Coupe d'Afrique des Développeurs (CADEV) !
      </div>
      <nav className="bg-dark-1 border-b border-dark-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-accent">●</span>
            <span>54Devs</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            <a href="#ecosystem" className="text-gray-300 hover:text-white transition">Ecosystem</a>
            <a href="#projects" className="text-gray-300 hover:text-white transition">Projects</a>
            <a href="#plans" className="text-gray-300 hover:text-white transition">Review Plans</a>
            {utilisateur ? (
              <Link to="/dashboard" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-accent/50 transition">
                  {initials}
                </div>
                <span className="text-gray-300 group-hover:text-white text-sm font-medium transition">
                  {utilisateur.prenom}
                </span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg font-medium transition"
              >
                Join the Community
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-300"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-dark-2 border-t border-dark-border px-4 pb-4 space-y-3">
            <a href="#ecosystem" className="block text-gray-300 hover:text-white py-2">Ecosystem</a>
            <a href="#projects" className="block text-gray-300 hover:text-white py-2">Projects</a>
            <a href="#plans" className="block text-gray-300 hover:text-white py-2">Review Plans</a>
            {utilisateur ? (
              <Link to="/dashboard" className="flex items-center gap-2.5 py-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {initials}
                </div>
                <span className="text-white text-sm font-medium">My Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="block bg-accent hover:bg-accent-hover text-white px-5 py-2 rounded-lg font-medium text-center"
              >
                Join the Community
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
