import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

const API_URL = 'http://localhost:8087/api/auth'

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [staySignedIn, setStaySignedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/connexion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, motDePasse }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Email ou mot de passe incorrect.')
      }

      const data = await res.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('utilisateur', JSON.stringify(data.utilisateur))
      navigate('/dashboard')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-1 flex items-start justify-end pt-6 pr-6 pb-16 pl-40">
      {/* Card offset to top-right on dark background */}
      <div className="w-full max-w-[820px] flex rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '80vh' }}>

        {/* Left Panel — dark with image */}
        <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-between p-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1639322537228-f710d846310a?w=1200&h=1000&fit=crop)',
            }}
          />
          <div className="absolute inset-0 bg-dark-1/70" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <span className="text-accent">&lt;/&gt;</span>
              <span>54<span className="text-accent">Devs</span></span>
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-5">
              Join the 54 nations building the{' '}
              <span className="text-accent italic">future of tech.</span>
            </h1>
            <p className="text-gray-300 text-sm leading-relaxed">
              Access mentorship, exclusive projects, and a community that spans the entire continent.
            </p>
          </div>

          <div className="relative z-10 max-w-md bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/15">
            <p className="text-gray-200 italic text-sm mb-4 leading-relaxed">
              "Finding a team for CADEV 2026 was seamless. The reputation system actually rewards
              quality contributions."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white font-bold text-xs">
                MT
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Moussa Traoré</div>
                <div className="text-gray-400 text-xs">Software Dev &bull; Mali</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel — white form with thick white border */}
        <div className="w-full lg:w-[45%] bg-white rounded-2xl ring-[3px] ring-white/80 flex items-center justify-center p-7 m-3 shadow-lg">
          <div className="w-full max-w-[280px]">
            <h2 className="text-xl font-bold text-gray-900 mb-0.5">Welcome Back</h2>
            <p className="text-blue-600 text-xs mb-5">Sign in to continue your journey.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {erreur && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5">
                  {erreur}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-gray-900">Password</label>
                  <a href="#" className="text-[10px] text-accent hover:underline font-medium">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-8 pr-9 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={(e) => setStaySignedIn(e.target.checked)}
                  className="w-3 h-3 rounded border-gray-300 text-accent focus:ring-accent"
                />
                <span className="text-[11px] text-gray-500">Stay signed in for 30 days</span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark-1 hover:bg-dark-3 disabled:opacity-60 text-white py-2 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Connexion...</>
                ) : (
                  <>Sign In <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase whitespace-nowrap">
                or continue with
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition text-xs font-medium text-gray-700">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                GitHub
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition text-xs font-medium text-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>

            <p className="text-center text-[11px] text-gray-500 mt-4">
              New to the community?{' '}
              <Link to="/register" className="text-accent font-semibold hover:underline">
                Join 54 nations today
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
