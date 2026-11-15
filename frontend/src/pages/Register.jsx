import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { authApi, buildGitHubAuthUrl, buildGoogleAuthUrl, setAuthSession } from '../api'
import { styles } from './Register.styles'
import { getPasswordStrength } from './Register.data'
import Logo from '../components/Logo'

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

  function getStrengthDetails(score) {
    if (!password) return { label: 'SECURITY LEVEL: REQUIRED', color: 'bg-slate-200', text: 'text-slate-400' }
    if (score <= 1) return { label: 'SECURITY LEVEL: WEAK', color: 'bg-red-500', text: 'text-red-500' }
    if (score === 2) return { label: 'SECURITY LEVEL: MODERATE', color: 'bg-orange-500', text: 'text-orange-500' }
    return { label: 'SECURITY LEVEL: STRONG', color: 'bg-emerald-500', text: 'text-emerald-500' }
  }

  const strengthDetails = getStrengthDetails(strength.score)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!agreed) {
      setErreur('Vous devez accepter les conditions pour continuer.')
      return
    }
    setErreur('')
    setLoading(true)
    try {
      const data = await authApi.inscription({ nom, prenom, email, motDePasse: password })
      setAuthSession(data)
      navigate('/onboarding/profile')
    } catch (err) {
      setErreur(err.message || 'Erreur lors de l\'inscription.')
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
    <div className={styles.page}>
      <div className={styles.pageBgGlow} />
      <div className={styles.pageBgGlowRight} />

      <div className={styles.wrapper}>
        
        {/* Left Side: Stepper & Pan-African Developer Community */}
        <div className={styles.leftPanel}>
          <div className={styles.leftBgNetwork} />
          
          <div className="mb-6">
            <Logo variant="full" className="h-10 sm:h-11 w-auto" to="/" />
          </div>

          <div className={styles.stepsList}>
            {/* Step 1 */}
            <div className={styles.stepRow}>
              <div className={styles.stepNumberActive}>1</div>
              <div>
                <h3 className={styles.stepTitleActive}>Account Basics</h3>
                <p className={styles.stepSubtitle}>Set up your secure credentials.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles.stepRow}>
              <div className={styles.stepNumberInactive}>2</div>
              <div>
                <h3 className={styles.stepTitleInactive}>Developer Identity</h3>
                <p className={styles.stepSubtitle}>Profile, country, and focus area.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className={styles.stepRow}>
              <div className={styles.stepNumberInactive}>3</div>
              <div>
                <h3 className={styles.stepTitleInactive}>Skills & Verified Bio</h3>
                <p className={styles.stepSubtitle}>Establish your skill and reputation.</p>
              </div>
            </div>
          </div>

          <div className={styles.communityBadge}>
            <span>Join</span>
            <span className={styles.communityBadgeHighlight}>15,000+</span>
            <span>developers</span>
          </div>
        </div>

        {/* Right Side: Register Card Form */}
        <div className={styles.rightPanel}>
          <div className="max-w-sm w-full mx-auto">
            <h2 className={styles.title}>Create your identity</h2>
            <p className={styles.subtitle}>One account, access to all 54 nations' tech talent.</p>

            {/* Social Auth */}
            <div className={styles.socialGrid}>
              <button
                type="button"
                onClick={() => handleOAuth(buildGitHubAuthUrl)}
                className={styles.socialButton}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Sync with GitHub</span>
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
                <span>Sign up with Google</span>
              </button>
            </div>

            <div className={styles.dividerRow}>
              <div className={styles.dividerLine}>
                <div className={styles.dividerBorder} />
              </div>
              <span className={styles.dividerText}>or use your email</span>
            </div>

            {erreur && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.nameGrid}>
                <div className={styles.field}>
                  <label htmlFor="prenom" className={styles.label}>First Name</label>
                  <input
                    id="prenom"
                    type="text"
                    required
                    value={prenom}
                    onChange={e => setPrenom(e.target.value)}
                    placeholder="Kwame"
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="nom" className={styles.label}>Last Name</label>
                  <input
                    id="nom"
                    type="text"
                    required
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    placeholder="Mensah"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email" className={styles.label}>Work Email</label>
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

              <div className={styles.field}>
                <label htmlFor="password" className={styles.label}>Create Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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

              {/* Password strength bar */}
              <div className={styles.strengthSection}>
                <div className={styles.strengthBarContainer}>
                  <div className={`${styles.strengthBar} ${strength.score >= 1 ? strengthDetails.color : 'bg-slate-200'}`} />
                  <div className={`${styles.strengthBar} ${strength.score >= 2 ? strengthDetails.color : 'bg-slate-200'}`} />
                  <div className={`${styles.strengthBar} ${strength.score >= 3 ? strengthDetails.color : 'bg-slate-200'}`} />
                </div>
                <p className={`${styles.strengthLabel} ${strengthDetails.text}`}>
                  {strengthDetails.label}
                </p>
              </div>

              <div className={styles.checkboxRow}>
                <input
                  id="agreed"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="agreed" className={styles.checkboxText}>
                  I agree to the <span className="text-[#C9F06A] font-semibold hover:underline">Terms of Service</span> and <span className="text-[#C9F06A] font-semibold hover:underline">Privacy Policy</span>, and consent to pan-African data portability.
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
                    <span>Continue to Identity</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className={styles.footer}>
              Already part of the ecosystem?
              <Link to="/login" className={styles.footerLink}>
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
