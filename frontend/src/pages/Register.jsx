import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const steps = [
  {
    number: 1,
    title: 'Account Basics',
    description: 'Set up your secure credentials.',
  },
  {
    number: 2,
    title: 'Developer Identity',
    description: 'Profile, country, and focus area.',
  },
  {
    number: 3,
    title: 'Skills & Verified Bio',
    description: 'Establish your skill and reputation.',
  },
]

function getPasswordStrength(password) {
  if (!password) return { level: 0, label: '', color: '' }
  if (password.length < 6) return { level: 1, label: 'WEAK', color: 'bg-red-500' }
  if (password.length < 10) return { level: 2, label: 'MODERATE', color: 'bg-orange-500' }
  return { level: 3, label: 'STRONG', color: 'bg-green-500' }
}

function getLabelColor(label) {
  if (label === 'WEAK') return 'text-red-500'
  if (label === 'MODERATE') return 'text-orange-500'
  return 'text-green-500'
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const strength = getPasswordStrength(password)

  return (
    <div className="min-h-screen bg-dark-1 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-2xl min-h-[650px]">

        {/* Left Panel */}
        <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1639322537228-f710d846310a?w=800&h=1000&fit=crop)',
            }}
          />
          <div className="absolute inset-0 bg-dark-1/75" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="text-accent">&lt;/&gt;</span>
              <span>54<span className="text-accent">Devs</span></span>
            </Link>
          </div>

          <div className="relative z-10 space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    step.number === 1
                      ? 'bg-green-500 text-white'
                      : 'bg-white/15 text-gray-400'
                  }`}
                >
                  {step.number}
                </div>
                <div>
                  <div className={`font-semibold text-sm ${step.number === 1 ? 'text-white' : 'text-gray-400'}`}>
                    {step.title}
                  </div>
                  <div className="text-gray-500 text-xs">{step.description}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-lg px-4 py-2.5 border border-white/15">
              <span className="text-white text-sm font-medium">Join</span>
              <span className="text-accent font-bold text-sm">15,000+</span>
              <span className="text-white text-sm font-medium">developers</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[55%] bg-white flex items-center justify-center p-8 sm:p-10">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
              Create your<br />identity
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              One account, access to all 54 nations' tech talent.
            </p>

            <div className="flex gap-3 mb-6">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                Sync with<br />GitHub
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-50 transition text-sm font-medium text-gray-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with<br />Google
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase whitespace-nowrap">
                or use your email
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">First Name</label>
                  <input
                    type="text"
                    placeholder="Kwame"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-gray-900 mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Mensah"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">Work Email</label>
                <input
                  type="email"
                  placeholder="kwame@54devs.af"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1.5">Create Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i <= strength.level ? strength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider uppercase ${getLabelColor(strength.label)}`}>
                      Security level: {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-accent focus:ring-accent mt-0.5"
                />
                <span className="text-xs text-gray-500 leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className="text-accent hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                  , and consent to pan-African data portability.
                </span>
              </label>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                Continue to Identity <span className="ml-1">&rarr;</span>
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-5">
              Already part of the ecosystem?{' '}
              <Link to="/login" className="text-gray-900 font-semibold hover:underline">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
