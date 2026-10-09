import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { authApi, setAuthSession } from '../api'

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) { setErreur("Code d'autorisation manquant."); return }

    authApi
      .google(code)
      .then((data) => {
        setAuthSession(data)
        navigate('/projects')
      })
      .catch((err) => setErreur(err.message))
  }, [searchParams, navigate])

  if (erreur) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md text-center shadow-sm">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 text-sm mb-6">{erreur}</p>
          <button onClick={() => navigate('/login')}
            className="bg-dark text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-dark-2 transition">
            Retour a la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Connexion via Google en cours...</p>
      </div>
    </div>
  )
}
