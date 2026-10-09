import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Zap, Check } from 'lucide-react'
import { competencesApi, profilApi, getToken, getStoredUser } from '../api'

const SUGGESTIONS = ['TypeScript', 'Python', 'Docker', 'PostgreSQL', 'AWS']

const experienceLevels = [
  { value: '0-2', label: '0-2', sub: 'Junior' },
  { value: '2-5', label: '2-5', sub: 'Mid-Level' },
  { value: '5-8', label: '5-8', sub: 'Senior' },
  { value: '8+', label: '8+', sub: 'Expert' },
]

export default function OnboardingSkills() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [experience, setExperience] = useState('')
  const [smartMatching, setSmartMatching] = useState(true)
  const [loading, setLoading] = useState(false)

  function addSkill(skill) {
    const trimmed = skill.trim()
    if (trimmed && !skills.includes(trimmed) && skills.length < 8) {
      setSkills([...skills, trimmed])
      setInputValue('')
    }
  }

  function removeSkill(skill) {
    setSkills(skills.filter((s) => s !== skill))
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(inputValue)
    }
  }

  async function handleComplete(e) {
    e.preventDefault()
    setLoading(true)

    const token = getToken()
    if (!token) {
      navigate('/login')
      return
    }
    const profileData = JSON.parse(localStorage.getItem('onboarding_profile') || '{}')
    const utilisateur = getStoredUser()

    try {
      const niveauMap = { '0-2': 'DEBUTANT', '2-5': 'INTERMEDIAIRE', '5-8': 'AVANCE', '8+': 'AVANCE' }

      await profilApi.updateMonProfil({
        pseudo: profileData.pseudo || utilisateur?.prenom || 'dev',
        bio: profileData.bio || '',
        pays: profileData.pays || '',
        ville: profileData.ville || '',
        niveau: niveauMap[experience] || 'DEBUTANT',
        disponibilite: '',
        github: '',
        linkedin: '',
        portfolio: '',
      })

      const catalogue = await competencesApi.lister()

      const competencesBody = skills
        .map(name => catalogue.find(c => c.nom.toLowerCase() === name.toLowerCase()))
        .filter(Boolean)
        .map(c => ({ competenceId: c.id, type: 'MAITRISE', niveau: niveauMap[experience] || 'DEBUTANT' }))

      if (competencesBody.length > 0) {
        await profilApi.replaceMesCompetences(competencesBody)
      }

      localStorage.removeItem('onboarding_profile')
      navigate('/projects')
    } catch {
      navigate('/projects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="text-gray-900">54<span className="font-extrabold">Devs</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-8 h-1.5 rounded-full bg-primary" />
            <div className="w-8 h-1.5 rounded-full bg-primary" />
            <div className="w-8 h-1.5 rounded-full bg-primary" />
          </div>
          <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Step 3 of 3</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Validate your talent</h1>
        <p className="text-sm text-gray-500 text-center mb-10">
          Your reputation starts here. Sync your work and define your stack.
        </p>

        <form onSubmit={handleComplete} className="space-y-8">
          {/* Sync GitHub */}
          <div className="bg-dark rounded-2xl p-6 flex items-center justify-between">
            <div>
              <h3 className="text-white font-bold text-sm mb-1">Sync GitHub Profile</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Automatically verify your contributions and earn the<br />
                <span className="text-primary font-semibold">verified contributor</span> badge immediately.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2.5 rounded-lg text-xs font-semibold hover:bg-gray-100 transition shrink-0"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Connect GitHub
            </button>
          </div>

          {/* Primary Tech Stack */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
                Primary Tech Stack
              </label>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Select up to 8 skills</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 min-h-[44px]">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-md"
                >
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="text-gray-500 hover:text-gray-700">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={skills.length === 0 ? 'Add skill (e.g. Python, Docker...)' : ''}
                className="flex-1 min-w-[120px] text-sm text-gray-900 placeholder-gray-400 outline-none border-none bg-transparent"
              />
            </div>
            {/* Suggestions */}
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Suggestions:</span>
              {SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className="text-[11px] text-gray-500 border border-gray-200 rounded-md px-2 py-0.5 hover:bg-gray-50 hover:border-gray-300 transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label className="block text-[11px] font-bold text-gray-900 uppercase tracking-wider mb-3">
              Years of Experience
            </label>
            <div className="flex gap-3">
              {experienceLevels.map((level) => {
                const selected = experience === level.value
                return (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setExperience(level.value)}
                    className={`flex-1 py-4 rounded-xl border-2 text-center transition ${
                      selected
                        ? 'border-primary bg-primary-light'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`text-xl font-bold ${selected ? 'text-primary' : 'text-gray-900'}`}>
                      {level.label}
                    </div>
                    <div className={`text-[10px] uppercase tracking-wider font-medium mt-0.5 ${selected ? 'text-primary' : 'text-gray-400'}`}>
                      {level.sub}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Smart Matching */}
          <div className="bg-gray-50 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Zap size={16} className="text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">Enable Smart Matching</h3>
                <p className="text-xs text-gray-500">
                  Allow teams to discover you for CADEV 2026 projects based on your skills.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSmartMatching(!smartMatching)}
              className={`w-11 h-6 rounded-full transition-colors shrink-0 ${
                smartMatching ? 'bg-primary' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  smartMatching ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/onboarding/profile')}
              className="flex-1 py-2.5 rounded-full border border-gray-300 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition flex items-center justify-center gap-2"
            >
              Complete Onboarding <Check size={16} />
            </button>
          </div>
        </form>

        <p className="text-center text-[11px] text-gray-400 mt-6 flex items-center justify-center gap-1">
          <span className="text-primary">&#9679;</span>
          Verified pan-African talent network &bull; 256-bit encrypted identity
        </p>
      </div>
    </div>
  )
}
