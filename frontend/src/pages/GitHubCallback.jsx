import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { authApi, getHomePath, getOAuthStateKey, setAuthSession } from '../api'

export default function GitHubCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [erreur, setErreur] = useState('')
  const dejaTraite = useRef(false)

  useEffect(() => {
    // StrictMode exécute l'effet deux fois en dev : le code OAuth ne doit être utilisé qu'une fois.
    if (dejaTraite.current) return
    dejaTraite.current = true

    const code = searchParams.get('code')
    if (!code) { setErreur("Code d'autorisation manquant."); return }

    const stateKey = getOAuthStateKey('github')
    const expectedState = sessionStorage.getItem(stateKey)
    if (!expectedState || searchParams.get('state') !== expectedState) {
      setErreur('Connexion refusée : état de sécurité invalide.')
      return
    }
    sessionStorage.removeItem(stateKey)

    authApi
      .github(code)
      .then((data) => {
        setAuthSession(data)
        navigate(getHomePath(data.utilisateur))
      })
      .catch((err) => setErreur(err.message))
  }, [searchParams, navigate])

  if (erreur) {
    return (
      <div className="min-h-screen bg-[#101915] text-white flex items-center justify-center p-4">
        <div className="bg-[#16221C] rounded-3xl border border-white/10 p-8 max-w-md text-center shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xl font-bold flex items-center justify-center mx-auto mb-4">!</div>
          <h2 className="text-xl font-bold text-white mb-2 font-display">Erreur de connexion</h2>
          <p className="text-white/60 text-sm mb-6 font-body">{erreur}</p>
          <button onClick={() => navigate('/login')}
            className="w-full bg-[#C9F06A] text-black px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20">
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#101915] text-white flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-[#C9F06A] mx-auto mb-4" />
        <p className="text-white/60 text-sm font-mono uppercase tracking-wider">Connexion via GitHub en cours...</p>
      </div>
    </div>
  )
}
