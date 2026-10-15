import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { X, Check } from 'lucide-react'
import { competencesApi, profilApi, getToken, getStoredUser } from '../api'
import { styles } from './OnboardingSkills.styles'
import { SUGGESTIONS, experienceLevels } from './OnboardingSkills.data'
import { TYPE_COMPETENCE } from '../lib/libelles'

export default function OnboardingSkills() {
  const navigate = useNavigate()
  const [skills, setSkills] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [experience, setExperience] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  function addSkill(skill) {
    const trimmed = skill.trim()
    if (trimmed && !skills.some(item => item.nom.toLowerCase() === trimmed.toLowerCase()) && skills.length < 8) {
      setSkills([...skills, { nom: trimmed, type: 'MAITRISE' }])
      setInputValue('')
    }
  }

  function removeSkill(skill) {
    setSkills(skills.filter((s) => s.nom !== skill))
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
        .map(skill => {
          const c = catalogue.find(x => x.nom.toLowerCase() === skill.nom.toLowerCase())
          if (!c) introuvables.push(skill.nom)
          return c ? { competence: c, type: skill.type } : null
        })
        .filter(Boolean)
        .map(({ competence, type }) => ({ competenceId: competence.id, type, niveau: niveauMap[experience] || 'DEBUTANT' }))

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
          <span className="text-white font-mono">&lt;/&gt; 54<span className="font-extrabold text-[#C9F06A]">Devs</span></span>
        </Link>
        <div className={styles.stepIndicatorWrapper}>
          <div className={styles.stepIndicatorBars}>
            <div className={styles.stepBarActive} />
            <div className={styles.stepBarActive} />
            <div className={styles.stepBarActive} />
          </div>
          <span className={styles.stepLabel}>Étape 3 sur 3</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>Partagez vos compétences</h1>
        <p className={styles.subtitle}>
          Pour chaque compétence, indiquez si vous la maîtrisez, souhaitez l'apprendre ou pouvez l'enseigner.
        </p>

        <form onSubmit={handleComplete} className="space-y-8">
          {/* Compétences */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={styles.sectionLabel}>
                Compétences principales
              </label>
              <span className="text-[10px] text-white/40 uppercase tracking-wider font-mono">8 compétences maximum</span>
            </div>
            <div className={styles.skillInputWrapper}>
              {skills.map((skill) => (
                <span key={skill.nom} className={styles.skillTag}>
                  {skill.nom}
                  <select
                    aria-label={`Type de compétence pour ${skill.nom}`}
                    value={skill.type}
                    onChange={e => setSkills(current => current.map(item => item.nom === skill.nom ? { ...item, type: e.target.value } : item))}
                    className="bg-[#16221C] text-[10px] font-semibold text-[#C9F06A] outline-none border border-white/10 rounded px-1.5 py-0.5"
                  >
                    {Object.entries(TYPE_COMPETENCE).map(([value, label]) => <option key={value} value={value} className="bg-[#16221C] text-white">{label}</option>)}
                  </select>
                  <button type="button" onClick={() => removeSkill(skill.nom)} aria-label={`Retirer ${skill.nom}`} className="text-white/40 hover:text-red-400 transition">
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={skills.length === 0 ? 'Ajouter une compétence (ex. gestion de projet, Python...)' : ''}
                className={styles.skillInput}
              />
            </div>
            {/* Suggestions */}
            <div className={styles.suggestionRow}>
              <span className={styles.suggestionLabel}>Suggestions :</span>
              {SUGGESTIONS.filter((s) => !skills.some(skill => skill.nom === s)).map((s) => (
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

          {/* Expérience */}
          <div>
            <label className={styles.sectionLabel}>
              Votre expérience
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
              Retour
            </button>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              Terminer mon profil <Check size={16} />
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
