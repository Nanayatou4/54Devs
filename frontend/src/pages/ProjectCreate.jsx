import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight, Save, X, Loader2, Users, CheckCircle,
  Rocket, ExternalLink,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { competencesApi, getToken, projetsApi } from '../api'
import { styles } from './ProjectCreate.styles'
import { CATEGORIES, STATUT_LABELS } from './ProjectCreate.data'

export default function ProjectCreate() {
  const navigate = useNavigate()
  const token = getToken()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [catalogue, setCatalogue] = useState([])
  const [createdProject, setCreatedProject] = useState(null)

  const [form, setForm] = useState({
    nom: '',
    description: '',
    probleme: '',
    solution: '',
    categorie: '',
    technologies: '',
    statut: 'IDEE',
    nombrePlacesRecherchees: 3,
    rolesRecherches: '',
    conditionsEngagement: '',
    competencesRecherchees: [],
  })

  useEffect(() => {
    if (!token) return
    competencesApi.lister().then(setCatalogue).catch(() => {})
  }, [token])

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  function goToNextStep() {
    if (step === 1) {
      if (form.nom.trim().length < 3) {
        setError('Le nom du projet doit contenir au moins 3 caractères.')
        return
      }
      if (!form.description.trim()) {
        setError('Ajoutez une description pour présenter votre projet.')
        return
      }
    }
    setError('')
    setStep(step + 1)
  }

  async function handleSubmit() {
    setSaving(true)
    setError('')

    const nom = (form.nom || '').trim()
    const description = (form.description || '').trim()

    if (nom.length < 3) {
      setError('Le nom du projet doit contenir au moins 3 caractères.')
      setSaving(false)
      return
    }
    if (!description) {
      setError('Veuillez fournir une description.')
      setSaving(false)
      return
    }
    if (!token) {
      setError('Vous devez être connecté pour créer un projet.')
      setSaving(false)
      return
    }

    try {
      const projet = await projetsApi.creer({
        nom,
        description,
        probleme: form.probleme?.trim() || null,
        solution: form.solution?.trim() || null,
        categorie: form.categorie?.trim() || null,
        technologies: form.technologies?.trim() || null,
        statut: form.statut,
        nombrePlacesRecherchees: Math.max(1, Number(form.nombrePlacesRecherchees) || 1),
        rolesRecherches: form.rolesRecherches?.trim() || null,
        conditionsEngagement: form.conditionsEngagement?.trim() || null,
        competencesRecherchees: form.competencesRecherchees.map(({ competenceId, obligatoire, niveauRequis }) => ({
          competenceId, obligatoire, niveauRequis,
        })),
      })

      setCreatedProject(projet)
      // Redirect after a short delay
      setTimeout(() => navigate(`/projects/${projet.id}`), 3000)
    } catch (err) {
      setError(err.message || 'Une erreur inattendue est survenue.')
      setSaving(false)
    }
  }

  // ---------- SUCCESS VIEW ----------
  if (createdProject) {
    const p = createdProject
    const techs = (p.technologies || '').split(',').filter(Boolean)

    return (
      <div className={styles.page}>
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className={styles.successBanner}>
            <CheckCircle size={20} className="text-green shrink-0" />
            <p className="text-green font-semibold text-sm">Projet créé avec succès ! Redirection automatique dans quelques secondes...</p>
          </div>

          <div className={styles.successCard}>
            <div className={styles.successHeader}>
              <Rocket size={48} className="text-primary/30" />
              {p.categorie && (
                <span className={styles.successCategory}>
                  {p.categorie}
                </span>
              )}
              <span className={styles.successStatus}>
                {STATUT_LABELS[p.statut] || p.statut}
              </span>
            </div>

            <div className={styles.successBody}>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{p.nom}</h1>
              <p className="text-gray-500 leading-relaxed mb-6">{p.description}</p>

              {p.probleme && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Problème</h3>
                  <p className="text-gray-600 text-sm">{p.probleme}</p>
                </div>
              )}

              {p.solution && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Solution</h3>
                  <p className="text-gray-600 text-sm">{p.solution}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className={styles.statBox}>
                  <Users size={18} className="text-primary mx-auto mb-1" />
                  <span className="text-lg font-bold text-gray-900 block">{p.nombrePlacesRecherchees}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Places recherchées</span>
                </div>
                <div className={styles.statBox}>
                  <span className="text-lg font-bold text-primary block">{p.placesRestantes ?? p.nombrePlacesRecherchees}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Places restantes</span>
                </div>
                <div className={styles.statBox}>
                  <span className="text-lg font-bold text-gray-900 block">{p.membres?.length || 1}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Membres</span>
                </div>
              </div>

              {techs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map(t => (
                      <span key={t.trim()} className={styles.techTag}>{t.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {p.rolesRecherches && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Rôles recherchés</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.rolesRecherches.split(',').map(r => (
                      <span key={r.trim()} className={styles.roleTag}>{r.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {p.conditionsEngagement && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Conditions d'engagement</h3>
                  <p className="text-gray-600 text-sm">{p.conditionsEngagement}</p>
                </div>
              )}

              {p.competencesRecherchees?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Compétences recherchées</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.competencesRecherchees.map(c => (
                      <span key={c.competenceId} className={styles.skillTag}>
                        {c.nom || `Compétence #${c.competenceId}`}
                        {c.obligatoire && <span className="ml-1 text-red-500">*</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <Link to={`/projects/${p.id}`} className={styles.successViewButton}>
                  <ExternalLink size={16} /> Voir le projet
                </Link>
                <Link to="/projects" className={styles.successBrowseButton}>
                  Parcourir tous les projets
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ---------- CREATION FORM ----------
  const stepLabels = { 1: 'Informations', 2: 'Équipe & Technologies', 3: 'Récapitulatif' }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>54<span className="font-extrabold">Devs</span></Link>
          <div className="flex items-center gap-4">
            <span className={styles.stepLabel}>Étape {step} sur 3 : {stepLabels[step]}</span>
            <Link to="/projects" className={styles.closeButton}><X size={20} /></Link>
          </div>
        </div>
      </div>

      <div className={styles.inner}>
        <div className="max-w-2xl mx-auto text-center mb-8 md:mb-10">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-4">Nouveau projet</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">Faisons avancer votre idée</h1>
          <p className="text-slate-500 mt-3 leading-relaxed">Présentez votre projet et les profils qui pourraient vous aider à le réaliser.</p>
        </div>
        <div className={styles.stepperWrapper}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center" aria-current={s === step ? 'step' : undefined}>
              <div className={s <= step ? styles.stepCircleActive : styles.stepCircleInactive}>{s < step ? <CheckCircle size={16} /> : s}</div>
              {i < 2 && <div className={s < step ? styles.stepConnectorActive : styles.stepConnectorInactive} />}
            </div>
          ))}
        </div>

        <div className={styles.card}>
          {error && <div className={styles.error}>{error}</div>}

          {step === 1 && (
            <div>
              <h2 className={styles.cardTitle}>Décrivez votre projet</h2>
              <p className={styles.cardSubtitle}>Présentez votre idée. Chaque projet commence par une vision claire et une mission précise.</p>

              <div className="mb-6">
                <label className={styles.label}>Nom du projet *</label>
                <input value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="ex. AgriConnect, SaharaAI..." maxLength={100} className={styles.input} required />
                <p className="text-[10px] text-gray-400 text-right mt-1">{form.nom.length} / 100</p>
              </div>

              <div className="mb-6">
                <label className={styles.label}>Description *</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Décrivez ce que fait votre projet et pourquoi il est important..."
                  rows={4} maxLength={2000} className={`${styles.input} resize-none`} />
                <p className="text-[10px] text-gray-400 text-right mt-1">{form.description.length} / 2000</p>
              </div>

              <div className="mb-6">
                <label className={styles.label}>Quel problème résout-il ?</label>
                <textarea value={form.probleme} onChange={e => set('probleme', e.target.value)}
                  placeholder="Décrivez le problème que votre projet cherche à résoudre..."
                  rows={3} maxLength={1000} className={`${styles.input} resize-none`} />
                <p className="text-[10px] text-gray-400 text-right mt-1">{form.probleme.length} / 1000</p>
              </div>

              <div className="mb-8">
                <label className={styles.label}>Quelle solution proposez-vous ?</label>
                <textarea value={form.solution} onChange={e => set('solution', e.target.value)}
                  placeholder="Expliquez comment votre projet résout ce problème..."
                  rows={3} maxLength={1000} className={`${styles.input} resize-none`} />
                <p className="text-[10px] text-gray-400 text-right mt-1">{form.solution.length} / 1000</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className={styles.cardTitle}>Équipe & Technologies</h2>
              <p className={styles.cardSubtitle}>Définissez vos besoins en termes d'équipe et d'outils.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-6">
                <div>
                  <label className={styles.label}>Catégorie</label>
                  <select value={form.categorie} onChange={e => set('categorie', e.target.value)} className={`${styles.input} appearance-none`}>
                    <option value="">Sélectionner...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={styles.label}>Avancement du projet *</label>
                  <select value={form.statut} onChange={e => set('statut', e.target.value)} className={`${styles.input} appearance-none`}>
                    {Object.entries(STATUT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 mb-6">
                <div>
                  <label className={styles.label}>Combien de personnes recherchez-vous (sans vous compter) ? *</label>
                  <input type="number" value={form.nombrePlacesRecherchees} onChange={e => set('nombrePlacesRecherchees', e.target.value)} min={1} max={20} className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}>Rôles recherchés</label>
                  <input value={form.rolesRecherches} onChange={e => set('rolesRecherches', e.target.value)} placeholder="ex. Développeur Frontend, Designer, DevOps" maxLength={500} className={styles.input} />
                </div>
              </div>

              <div className="mb-6">
                <label className={styles.label}>Technologies (séparées par des virgules)</label>
                <input value={form.technologies} onChange={e => set('technologies', e.target.value)} placeholder="ex. React, Spring Boot, PostgreSQL" maxLength={255} className={styles.input} />
              </div>

              <div className="mb-6">
                <label className={styles.label}>Conditions d'engagement (disponibilité attendue, durée...)</label>
                <textarea value={form.conditionsEngagement} onChange={e => set('conditionsEngagement', e.target.value)}
                  placeholder="ex. Disponible 10h/semaine minimum, projet sur 3 mois..."
                  rows={3} maxLength={1000} className={`${styles.input} resize-none`} />
                <p className="text-[10px] text-gray-400 text-right mt-1">{form.conditionsEngagement.length} / 1000</p>
              </div>

              <div className="mb-8">
                <label className={styles.label}>Compétences recherchées ({form.competencesRecherchees.length}/15)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {catalogue.slice(0, 12).map(c => {
                    const selected = form.competencesRecherchees.some(s => s.competenceId === c.id)
                    return (
                      <button key={c.id} type="button" onClick={() => {
                        if (selected) set('competencesRecherchees', form.competencesRecherchees.filter(s => s.competenceId !== c.id))
                        else if (form.competencesRecherchees.length < 15) set('competencesRecherchees', [...form.competencesRecherchees, { competenceId: c.id, obligatoire: false, niveauRequis: 'DEBUTANT' }])
                      }} className={selected ? styles.skillTagSelected : styles.skillTagUnselected}>
                        {c.nom}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className={styles.cardTitle}>Récapitulatif</h2>
              <p className={styles.cardSubtitle}>Vérifiez les informations avant de publier votre projet.</p>

              <div className="space-y-4">
                <div className={styles.reviewItem}>
                  <span className={styles.reviewItemLabel}>Nom du projet</span>
                  <p className={styles.reviewItemValue}>{form.nom || '—'}</p>
                </div>
                <div className={styles.reviewItem}>
                  <span className={styles.reviewItemLabel}>Description</span>
                  <p className="text-gray-600 text-sm mt-1">{form.description || '—'}</p>
                </div>
                {form.probleme && (
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Problème</span>
                    <p className="text-gray-600 text-sm mt-1">{form.probleme}</p>
                  </div>
                )}
                {form.solution && (
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Solution</span>
                    <p className="text-gray-600 text-sm mt-1">{form.solution}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Catégorie</span>
                    <p className="text-gray-900 mt-1">{form.categorie || '—'}</p>
                  </div>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Avancement</span>
                    <p className="text-gray-900 mt-1">{STATUT_LABELS[form.statut]}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Personnes recherchées</span>
                    <p className="text-gray-900 mt-1">{form.nombrePlacesRecherchees}</p>
                  </div>
                  {form.rolesRecherches && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewItemLabel}>Rôles recherchés</span>
                      <p className="text-gray-900 mt-1">{form.rolesRecherches}</p>
                    </div>
                  )}
                </div>
                {form.technologies && (
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Technologies</span>
                    <p className="text-gray-900 mt-1">{form.technologies}</p>
                  </div>
                )}
                {form.conditionsEngagement && (
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Conditions d'engagement</span>
                    <p className="text-gray-600 text-sm mt-1">{form.conditionsEngagement}</p>
                  </div>
                )}
                {form.competencesRecherchees.length > 0 && (
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewItemLabel}>Compétences recherchées</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {form.competencesRecherchees.map(s => {
                        const comp = catalogue.find(c => c.id === s.competenceId)
                        return (
                          <span key={s.competenceId} className="bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-lg font-medium">
                            {comp?.nom || `#${s.competenceId}`}
                            {s.obligatoire && <span className="ml-1 text-red-500">*</span>}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className={styles.navRow}>
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className={styles.backButton}>
                Retour
              </button>
            ) : (
              <button onClick={() => navigate('/projects')} className={styles.cancelButton}>
                Annuler
              </button>
            )}
            {step < 3 ? (
              <button onClick={goToNextStep}
                className={styles.nextButton}>
                Suivant : {step === 1 ? 'Équipe & Technologies' : 'Récapitulatif'} <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving || !form.nom}
                className={styles.submitButton}>
                {saving ? <><Loader2 size={16} className="animate-spin" /> Création en cours...</> : <><Save size={16} /> Publier le projet</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
