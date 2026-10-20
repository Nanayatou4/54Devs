import { Outlet, Link } from 'react-router-dom'
import { ShieldAlert, ShieldCheck, ArrowLeft } from 'lucide-react'
import { getStoredUser } from '../api'

export default function AdminRoute() {
  const user = getStoredUser()

  if (user?.role === 'ADMIN') {
    return <Outlet />
  }

  function handleEnableAdminLocal() {
    const u = getStoredUser()
    if (u) {
      u.role = 'ADMIN'
      localStorage.setItem('utilisateur', JSON.stringify(u))
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-[#0E1511] text-white flex items-center justify-center p-4 selection:bg-[#C9F06A] selection:text-black">
      <div className="bg-[#16221C] rounded-3xl border border-white/10 p-8 max-w-lg w-full text-center shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={32} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2 font-display">Accès Administrateur Requis</h2>

        <p className="text-white/70 text-sm mb-6 leading-relaxed font-body">
          L'espace <code className="text-[#C9F06A] font-mono bg-white/5 px-2 py-0.5 rounded">/admin</code> est protégé et réservé aux comptes possédant le rôle <strong className="text-white">ADMIN</strong>.
        </p>

        <div className="bg-white/5 rounded-2xl border border-white/10 p-4 mb-6 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-white/50">Compte actuellement connecté :</span>
            <span className="font-mono text-white font-semibold truncate max-w-[200px]">{user?.email || 'Non connecté'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/50">Rôle actuel dans votre session :</span>
            <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
              {user?.role || 'DEVELOPPEUR'}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {user && (
            <button
              type="button"
              onClick={handleEnableAdminLocal}
              className="w-full flex items-center justify-center gap-2 bg-[#C9F06A] text-black px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20 cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>Activer le rôle Admin pour tester (Session locale)</span>
            </button>
          )}

          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 px-6 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition"
          >
            <ArrowLeft size={15} />
            <span>Retour au tableau de bord</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
