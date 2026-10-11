import { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Loader2, Check } from 'lucide-react'
import { authApi, buildGitHubAuthUrl, buildGoogleAuthUrl, setAuthSession } from '../api'
import { styles } from './Login.styles'

function allerVers(construireUrl) {
  return () => window.location.assign(construireUrl())
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
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
      setErreur(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrapper}>
        <aside className={styles.leftPanel}>
          <div className={styles.leftBg} />
          <div className={styles.leftContent}>
            <Link to="/" className={styles.logo} aria-label="54Devs, accueil">
              <span className={styles.logoMark}>&lt;/&gt;</span>
              <span>54<span className="font-extrabold">Devs</span></span>
            </Link>

            <div className={styles.welcomeCopy}>
              <span className={styles.eyebrow}>Ravi de vous retrouver</span>
              <h1 className={styles.welcomeTitle}>Les projets avancent mieux ensemble.</h1>
              <p className={styles.welcomeText}>
                Retrouvez vos projets, vos équipes et les personnes avec qui vous partagez vos idées.
              </p>
              <ul className={styles.benefits}>
                <li><Check size={16} /> Retrouvez les projets qui vous intéressent</li>
                <li><Check size={16} /> Faites connaître vos compétences</li>
                <li><Check size={16} /> Échangez avec une communauté ouverte</li>
              </ul>
            </div>

            <p className={styles.sideNote}>54Devs · Des idées à construire ensemble</p>
          </div>
        </aside>

        <section className={styles.rightPanel} aria-labelledby="login-title">
          <div className={styles.formContent}>
            <div className={styles.mobileLogoWrapper}>
              <Link to="/" className={styles.mobileLogo} aria-label="54Devs, accueil">
                <span className={styles.logoMark}>&lt;/&gt;</span>
                <span>54<span className="font-extrabold">Devs</span></span>
              </Link>
            </div>

            <p className={styles.formEyebrow}>Votre espace 54Devs</p>
            <h2 id="login-title" className={styles.title}>Connectez-vous</h2>
            <p className={styles.subtitle}>Content de vous revoir. Reprenez là où vous en étiez.</p>

            {searchParams.get('expire') === '1' && (
              <div className={styles.notice} role="status">
                Votre session a expiré. Connectez-vous à nouveau pour continuer.
              </div>
            )}

            <div className={styles.socialButtons}>
              <button type="button" onClick={allerVers(buildGitHubAuthUrl)} className={styles.socialButton}>
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                Continuer avec GitHub
              </button>
              <button type="button" onClick={allerVers(buildGoogleAuthUrl)} className={styles.socialButton}>
                <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Continuer avec Google
              </button>
            </div>

            <div className={styles.dividerWrapper}>
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>ou avec votre adresse e-mail</span>
              <span className={styles.dividerLine} />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {erreur && <div className={styles.error} role="alert">{erreur}</div>}

              <div className={styles.field}>
                <label htmlFor="login-email" className={styles.label}>Adresse e-mail</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  autoComplete="email"
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="login-password" className={styles.label}>Mot de passe</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={motDePasse}
                    onChange={e => setMotDePasse(e.target.value)}
                    placeholder="Votre mot de passe"
                    autoComplete="current-password"
                    required
                    className={`${styles.input} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(value => !value)}
                    className={styles.passwordToggle}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading
                  ? <><Loader2 size={17} className="animate-spin" /> Connexion en cours…</>
                  : <>Se connecter <ArrowRight size={17} /></>}
              </button>
            </form>

            <p className={styles.footer}>
              Vous n’avez pas encore de compte ?{' '}
              <Link to="/register" className={styles.footerLink}>Créer un compte</Link>
            </p>
            <Link to="/" className={styles.backLink}>Retour à l’accueil</Link>
          </div>
        </section>
      </div>
    </main>
  )
}
