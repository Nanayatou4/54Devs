import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil } from 'lucide-react'
import { styles } from './OnboardingProfile.styles'
import { focusOptions } from './OnboardingProfile.data'

export default function OnboardingProfile() {
  const navigate = useNavigate()
  const [pays, setPays] = useState('')
  const [ville, setVille] = useState('')
  const [focus, setFocus] = useState('')
  const [bio, setBio] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const fileInputRef = useRef(null)

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function handleNext(e) {
    e.preventDefault()
    const profile = { pays, ville, focus, bio }
    localStorage.setItem('onboarding_profile', JSON.stringify(profile))
    navigate('/onboarding/skills')
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
            <div className={styles.stepBarInactive} />
          </div>
          <span className={styles.stepLabel}>Étape 2 sur 3</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>Présentez-vous</h1>
        <p className={styles.subtitle}>
          Dites-nous d'où vous venez et ce que vous aimeriez apporter à la communauté.
        </p>

        <form onSubmit={handleNext} className="space-y-8">
          {/* Profile Photo */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={styles.photoUpload}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Photo de profil" className="w-full h-full rounded-full object-cover" />
              ) : (
                <div className={styles.photoPlaceholder}>
                  ?
                </div>
              )}
              <span className={styles.photoEditBadge}>
                <Pencil size={12} className="text-black" />
              </span>
            </button>
            <div>
              <div className="text-sm font-bold text-white">Photo de profil</div>
              <p className="text-xs text-white/50 mb-1">Ajoutez une photo pour aider la communauté à vous reconnaître.</p>
              <button type="button" onClick={() => fileInputRef.current?.click()} className={styles.helpLink}>
                Choisir une photo
              </button>
            </div>
          </div>

          {/* Country + City */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={styles.sectionLabel}>
                Votre pays
              </label>
              <select
                value={pays}
                onChange={(e) => setPays(e.target.value)}
                required
                className={styles.countrySelect}
              >
                <option value="">Sélectionnez votre pays</option>
                <option value="Sénégal">Sénégal</option>
                <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                <option value="Cameroun">Cameroun</option>
                <option value="Mali">Mali</option>
                <option value="Togo">Togo</option>
                <option value="Bénin">Bénin</option>
                <option value="Maroc">Maroc</option>
                <option value="Tunisie">Tunisie</option>
                <option value="Algérie">Algérie</option>
                <option value="Égypte">Égypte</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Ghana">Ghana</option>
                <option value="Kenya">Kenya</option>
                <option value="Rwanda">Rwanda</option>
                <option value="Éthiopie">Éthiopie</option>
                <option value="Tanzanie">Tanzanie</option>
                <option value="Afrique du Sud">Afrique du Sud</option>
                <option value="RDC">RDC</option>
                <option value="Guinée">Guinée</option>
                <option value="Burkina Faso">Burkina Faso</option>
                <option value="Niger">Niger</option>
                <option value="Mauritanie">Mauritanie</option>
                <option value="Madagascar">Madagascar</option>
                <option value="Gabon">Gabon</option>
                <option value="Congo">Congo</option>
                <option value="Tchad">Tchad</option>
                <option value="Autre">Autre</option>
              </select>
              <p className="text-[10px] text-white/40 mt-1">La communauté est ouverte à tous les pays et à tous les parcours.</p>
            </div>
            <div className="flex-1">
              <label className={styles.sectionLabel}>
                Ville
              </label>
              <input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ex. Dakar, Abidjan, Nairobi"
                className={styles.cityInput}
              />
            </div>
          </div>

          {/* Primary Focus */}
          <div>
            <label className={styles.sectionLabel}>
              Quel est votre domaine ou votre rôle ?
            </label>
            <div className="flex gap-3">
              {focusOptions.map((opt) => {
                const Icon = opt.icon
                const selected = focus === opt.key
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setFocus(opt.key)}
                    className={selected ? styles.focusCardSelected : styles.focusCardUnselected}
                  >
                    <Icon size={20} />
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Professional Bio */}
          <div>
            <label className={styles.sectionLabel}>
              Présentation
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Présentez votre parcours, vos idées ou ce que vous aimeriez apprendre..."
              maxLength={250}
              rows={4}
              className={styles.bioTextarea}
            />
            <p className={styles.bioCharCount}>{bio.length} / 250 caractères</p>
          </div>

          {/* Buttons */}
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={styles.draftButton}
            >
              Enregistrer le brouillon
            </button>
            <button
              type="submit"
              className={styles.nextButton}
            >
              Suivant : compétences et expérience →
            </button>
          </div>
        </form>

        <p className={styles.helpText}>
          Besoin d'aide ? Consultez les informations de votre profil ou réessayez plus tard.
        </p>
      </div>
    </div>
  )
}
