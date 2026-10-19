import { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import { authApi, buildGitHubAuthUrl, buildGoogleAuthUrl, setAuthSession } from '../api'
import { styles } from './Login.styles'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [staySignedIn, setStaySignedIn] = useState(true)
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      const data = await authApi.connexion({ email, motDePasse })
      setAuthSession(data)
      navigate(location.state?.from || '/dashboard')
    } catch (err) {
      setErreur(err.message || 'Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  function handleOAuth(buildUrl) {
    try {
      window.location.assign(buildUrl())
    } catch (err) {
      setErreur(err.message || 'Impossible de démarrer la connexion.')
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.pageBgGlow} />
      <div className={styles.pageBgGlowRight} />

      <div className={styles.wrapper}>
        
        {/* Left Side: Brand & African Network Quote */}
        <aside className={styles.leftPanel}>
          <div className={styles.leftBgNetwork} />
          
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>&lt;/&gt;</span>
            <span>54Devs</span>
          </Link>

          <div className={styles.heroCopy}>
            <h1 className={styles.heroTitle}>
              Join the 54 nations building the{' '}
              <span className={styles.heroHighlight}>future of tech.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Access mentorship, exclusive projects, and a community that spans the entire continent.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#18251E]/80 p-5 backdrop-blur-sm shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-[#C9F06A]/15 border border-[#C9F06A]/30 flex items-center justify-center text-[#C9F06A] font-mono font-bold text-xs">
                54
              </div>
              <div>
                <h3 className="text-white text-xs font-bold font-display uppercase tracking-wider">
                  Écosystème Panafricain
                </h3>
                <p className="text-white/50 text-[11px]">54 nations unies par le code</p>
              </div>
            </div>
            <p className="text-white/70 text-xs leading-relaxed">
              Collaborez sur des projets réels, échangez avec des mentors et développez votre réputation technique sur le continent.
            </p>
          </div>
        </aside>

        {/* Right Side: Form Card */}
        <section className={styles.rightPanel}>
          <div className="max-w-sm w-full mx-auto">
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Sign in to continue your journey.</p>

            {erreur && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Work Email</label>
                <div className={styles.inputWrapper}>
                  <Mail size={16} className={styles.inputIcon} />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="anna503@gmail.com"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className={styles.label}>Password</label>
                  <a href="#forgot" className={styles.forgotLink}>Forgot password?</a>
                </div>
                <div className={styles.inputWrapper}>
                  <Lock size={16} className={styles.inputIcon} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={motDePasse}
                    onChange={e => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    className={styles.input}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className={styles.passwordToggle}
                    aria-label="Afficher/masquer le mot de passe"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className={styles.checkboxRow}>
                <input
                  id="staySignedIn"
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={e => setStaySignedIn(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="staySignedIn" className={styles.checkboxLabel}>
                  Stay signed in for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={styles.submitButton}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className={styles.dividerRow}>
              <div className={styles.dividerLine}>
                <div className={styles.dividerBorder} />
              </div>
              <span className={styles.dividerText}>or continue with</span>
            </div>

            <div className={styles.socialGrid}>
              <button
                type="button"
                onClick={() => handleOAuth(buildGitHubAuthUrl)}
                className={styles.socialButton}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuth(buildGoogleAuthUrl)}
                className={styles.socialButton}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>
            </div>

            <p className={styles.footer}>
              New to the community?
              <Link to="/register" className={styles.footerLink}>
                Join 54 nations today
              </Link>
            </p>
          </div>
        </section>

      </div>
    </main>
  )
}
