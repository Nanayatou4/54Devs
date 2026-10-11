import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { authApi, buildGitHubAuthUrl, buildGoogleAuthUrl, setAuthSession } from '../api'
import { styles } from './Register.styles'
import { steps, getPasswordStrength } from './Register.data'

// Le « state » OAuth doit être généré au moment du clic (pas au chargement du module),
// sinon plusieurs appels s'écrasent dans sessionStorage et la vérification échoue.
function allerVers(construireUrl) {
  return () => window.location.assign(construireUrl())
}

export default function Register() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [email, setEmail] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)
  const strength = getPasswordStrength(password)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!agreed) { setErreur('Vous devez accepter les conditions.'); return }
    setErreur('')
    setLoading(true)
    try {
      const data = await authApi.inscription({ nom, prenom, email, motDePasse: password })
      setAuthSession(data)
      navigate('/onboarding/profile')
    } catch (err) {
      setErreur(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.wrapper}>

        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <div className={styles.leftBg} style={{ backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }} />
          <div className={styles.leftOverlay} />

          <div className={styles.leftLogo}>
            <Link to="/" className="text-xl font-bold text-white">54<span className="font-extrabold">Devs</span></Link>
          </div>

          <div className={styles.leftIntro}>
            <span className={styles.eyebrow}>Votre point de départ</span>
            <h1 className={styles.leftTitle}>Chaque projet commence par une rencontre.</h1>
            <p className={styles.leftDescription}>
              Créez votre profil, partagez vos compétences et trouvez votre place dans une équipe.
            </p>
          </div>

          <div className={styles.leftSteps}>
            {steps.map(step => (
              <div key={step.number} className="flex items-start gap-4">
                <div className={step.number === 1 ? styles.stepCircleActive : styles.stepCircleInactive}>
                  {step.number}
                </div>
                <div>
                  <div className={step.number === 1 ? styles.stepTitleActive : styles.stepTitleInactive}>{step.title}</div>
                  <div className={styles.stepDescription}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>

          <p className={styles.sideNote}>Développeurs, designers et porteurs d’idées : bienvenue sur 54Devs.</p>
        </div>

        {/* Right Panel */}
        <div className={styles.rightPanel}>
          <div className={styles.rightInner}>
            <div className={styles.mobileLogoWrapper}>
              <Link to="/" className={styles.mobileLogo} aria-label="54Devs, accueil">
                <span className={styles.logoMark}>&lt;/&gt;</span>
                <span>54<span className="font-extrabold">Devs</span></span>
              </Link>
            </div>
            <p className={styles.formEyebrow}>Rejoignez 54Devs</p>
            <h2 className={styles.title}>Créer un compte</h2>
            <p className={styles.subtitle}>Quelques informations suffisent pour commencer.</p>

            <div className={styles.socialButtons}>
              <button type="button" onClick={allerVers(buildGitHubAuthUrl)} className={styles.socialButton}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
                GitHub
              </button>
              <button type="button" onClick={allerVers(buildGoogleAuthUrl)} className={styles.socialButton}>
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                Google
              </button>
            </div>

            <div className={styles.dividerWrapper}>
              <div className={styles.dividerLine} />
              <span className={styles.dividerText}>ou avec votre adresse e-mail</span>
              <div className={styles.dividerLine} />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {erreur && <div className={styles.error} role="alert">{erreur}</div>}

              <div className="grid grid-cols-2 gap-3">
                <div className="flex-1">
                  <label htmlFor="register-first-name" className={styles.label}>Prénom</label>
                  <input id="register-first-name" type="text" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Awa" autoComplete="given-name" required
                    className={styles.input} />
                </div>
                <div className="flex-1">
                  <label htmlFor="register-last-name" className={styles.label}>Nom</label>
                  <input id="register-last-name" type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Diop" autoComplete="family-name" required
                    className={styles.input} />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className={styles.label}>Adresse e-mail</label>
                <input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nom@exemple.com" autoComplete="email" required
                  className={styles.input} />
              </div>

              <div>
                <label htmlFor="register-password" className={styles.label}>Mot de passe</label>
                <div className="relative">
                  <input id="register-password" type={showPassword ? 'text' : 'password'} placeholder="8 caractères minimum" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" required minLength={8}
                    className={`${styles.input} pr-12`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={styles.passwordToggle}
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    aria-pressed={showPassword}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1.5">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`${styles.strengthBar} ${i <= strength.level ? strength.color : styles.strengthBarEmpty}`} />
                      ))}
                    </div>
                    <span className={`${styles.strengthLabel} ${strength.label === 'WEAK' ? 'text-red-500' : strength.label === 'MODERATE' ? 'text-yellow-500' : 'text-green'}`}>
                      Sécurité : {strength.label === 'WEAK' ? 'Faible' : strength.label === 'MODERATE' ? 'Moyen' : 'Fort'}
                    </span>
                  </div>
                )}
              </div>

              <label className={styles.checkboxRow}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className={styles.checkbox} />
                <span className={styles.checkboxText}>
                  J'accepte les conditions d'utilisation et la politique de confidentialité.
                </span>
              </label>

              <button type="submit" disabled={loading}
                className={styles.submitButton}>
                {loading ? <><Loader2 size={16} className="animate-spin" /> Création...</> : <>Créer mon compte <span className="ml-1">&rarr;</span></>}
              </button>
            </form>

            <p className={styles.footer}>
              Vous avez déjà un compte ? <Link to="/login" className={styles.footerLink}>Se connecter</Link>
            </p>
            <Link to="/" className={styles.backLink}>Retour à l’accueil</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
