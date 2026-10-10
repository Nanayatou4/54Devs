import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Check } from 'lucide-react'
import { competencesApi, profilApi, getToken, getStoredUser } from '../api'
import { styles } from './OnboardingSkills.styles'
import { SUGGESTIONS, experienceLevels } from './OnboardingSkills.data'

export default function OnboardingSkills() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [experience, setExperience] = useState('')
  const [erreur, setErreur] = useState('')
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
    setErreur('')

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
        bio: profileData.bio?.trim() || null,
        pays: profileData.pays?.trim() || null,
        ville: profileData.ville?.trim() || null,
        niveau: niveauMap[experience] || 'DEBUTANT',
        disponibilite: null,
        github: null,
        linkedin: null,
        portfolio: null,
      })

      const catalogue = await competencesApi.lister()
      const introuvables = []

      const competencesBody = skills
        .map(name => {
          const c = catalogue.find(x => x.nom.toLowerCase() === name.toLowerCase())
          if (!c) introuvables.push(name)
          return c
        })
        .filter(Boolean)
        .map(c => ({ competenceId: c.id, type: 'MAITRISE', niveau: niveauMap[experience] || 'DEBUTANT' }))

      if (competencesBody.length > 0) {
        await profilApi.replaceMesCompetences(competencesBody)
      }

      localStorage.removeItem('onboarding_profile')
      if (introuvables.length > 0) {
        setErreur(`Compétences absentes du catalogue (non enregistrées) : ${introuvables.join(', ')}. Vous pourrez les ajouter depuis votre profil.`)
        setTimeout(() => navigate('/projects'), 3500)
      } else {
        navigate('/projects')
      }
    } catch (err) {
      setErreur(err.message || 'Impossible d\'enregistrer votre profil. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className="text-gray-900">54<span className="font-extrabold">Devs</span></span>
        </Link>
        <div className={styles.stepIndicatorWrapper}>
          <div className={styles.stepIndicatorBars}>
            <div className={styles.stepBarActive} />
            <div className={styles.stepBarActive} />
            <div className={styles.stepBarActive} />
          </div>
          <span className={styles.stepLabel}>Step 3 of 3</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>Validate your talent</h1>
        <p className={styles.subtitle}>
          Your reputation starts here. Sync your work and define your stack.
        </p>

        <form onSubmit={handleComplete} className="space-y-8">
          {/* Primary Tech Stack */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={styles.sectionLabel}>
                Primary Tech Stack
              </label>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider">Select up to 8 skills</span>
            </div>
            <div className={styles.skillInputWrapper}>
              {skills.map((skill) => (
                <span key={skill} className={styles.skillTag}>
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
                className={styles.skillInput}
              />
            </div>
            {/* Suggestions */}
            <div className={styles.suggestionRow}>
              <span className={styles.suggestionLabel}>Suggestions:</span>
              {SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addSkill(s)}
                  className={styles.suggestionButton}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Years of Experience */}
          <div>
            <label className={styles.sectionLabel}>
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
                    className={selected ? styles.experienceCardSelected : styles.experienceCardUnselected}
                  >
                    <div className={selected ? styles.experienceValueSelected : styles.experienceValueUnselected}>
                      {level.label}
                    </div>
                    <div className={selected ? styles.experienceSubSelected : styles.experienceSubUnselected}>
                      {level.sub}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {erreur && (
            <p className="text-sm text-red-600" role="alert">{erreur}</p>
          )}

          {/* Buttons */}
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate('/onboarding/profile')}
              className={styles.backButton}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              Complete Onboarding <Check size={16} />
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
