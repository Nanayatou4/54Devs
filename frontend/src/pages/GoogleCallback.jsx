import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const API_URL = 'http://localhost:8087/api/auth'

export default function GoogleCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [erreur, setErreur] = useState('')

  useEffect(() => {
    const code = searchParams.get('code')
    if (!code) {
      setErreur("Code d'autorisation manquant.")
      return
    }

    fetch(`${API_URL}/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const text = await res.text()
        let data
        try { data = JSON.parse(text) } catch { data = null }
        if (!res.ok) {
          throw new Error(data?.message || 'Erreur lors de la connexion Google.')
        }
        return data
      })
      .then((data) => {
        localStorage.setItem('token', data.token)
        localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur))
        navigate('/dashboard')
      })
      .catch((err) => setErreur(err.message))
  }, [searchParams, navigate])

  if (erreur) {
    return (
      <div className="min-h-screen bg-dark-1 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <div className="text-red-500 text-4xl mb-4">!</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 text-sm mb-6">{erreur}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-dark-1 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-dark-3 transition"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-1 flex items-center justify-center">
      <div className="text-center">
        <Loader2 size={40} className="animate-spin text-accent mx-auto mb-4" />
        <p className="text-white text-sm">Connexion via Google en cours...</p>
      </div>
    </div>
  )
}
