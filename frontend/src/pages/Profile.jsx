import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, ArrowRight, Loader2, Award, CheckCircle2,
  Pencil, X, Save, Camera, ExternalLink, Link2, Globe,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  clearAuthSession,
  badgesApi,
  competencesApi,
  getProfilePhoto,
  getStoredUser,
  getToken,
  profilApi,
  projetsApi,
  setProfilePhoto,
  ROLE_MEMBRE,
  STATUT_PROJET,
} from '../api'
import { styles } from './Profile.styles'
import { NIVEAU_LABELS, NIVEAUX } from './Profile.data'
import { TYPE_COMPETENCE } from '../lib/libelles'

export default function Profile() {
  const navigate = useNavigate()
  const token = getToken()

  const [profil, setProfil] = useState(null)
  const [competences, setCompetences] = useState([])
  const [badges, setBadges] = useState([])
  const [badgesError, setBadgesError] = useState('')
  const [utilisateur, setUtilisateur] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myProjects, setMyProjects] = useState([])
  const [projectsError, setProjectsError] = useState('')

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({})
  const [photoPreview, setPhotoPreview] = useState(() => getProfilePhoto())
  const fileRef = useRef(null)

  const [catalogue, setCatalogue] = useState([])
  const [editCompetences, setEditCompetences] = useState([])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    const stored = getStoredUser()
    if (stored) setUtilisateur(stored)

    Promise.all([
      profilApi.getMonProfil().catch(() => null),
      profilApi.getMesCompetences().catch(() => []),
      badgesApi.mesBadges().catch(err => {
        setBadgesError(err.message || 'Impossible de charger les badges.')
        return []
      }),
      projetsApi.mesProjets().catch(err => {
        setProjectsError(err.message || 'Impossible de charger vos projets.')
        return []
      }),
    ]).then(([p, c, userBadges, projects]) => {
      if (p) setProfil(p)
      setCompetences(c || [])
      setBadges(Array.isArray(userBadges) ? userBadges : [])
      setMyProjects(Array.isArray(projects) ? projects : [])
      setLoading(false)
    })
  }, [token, navigate])

  function startEditing() {
    setForm({
      pseudo: profil?.pseudo || '',
      bio: profil?.bio || '',
      pays: profil?.pays || '',
      ville: profil?.ville || '',
      niveau: profil?.niveau || 'DEBUTANT',
      disponibilite: profil?.disponibilite || '',
      github: profil?.github || '',
      linkedin: profil?.linkedin || '',
      portfolio: profil?.portfolio || '',
    })
    setEditCompetences(
      competences.map(c => ({
        competenceId: c.competenceId,
        type: c.type || 'MAITRISE',
        niveau: c.niveau || 'DEBUTANT',
      }))
    )
    setSaveError('')
    setEditing(true)
    if (catalogue.length === 0) {
      competencesApi.lister()
        .then(data => {
          const list = Array.isArray(data) ? data : []
          console.log('[Profile] Competences loaded:', list.length)
          setCatalogue(list)
        })
        .catch(err => {
          console.error('[Profile] Failed to load competences:', err)
          setSaveError('Impossible de charger les compétences. Vérifiez que le backend est lancé.')
        })
    }
  }

  function cancelEditing() {
    setEditing(false)
    setPhotoPreview(getProfilePhoto())
    setSaveError('')
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  function toggleCompetence(id) {
    setEditCompetences(prev => {
      const exists = prev.find(c => c.competenceId === id)
      if (exists) return prev.filter(c => c.competenceId !== id)
      return [...prev, { competenceId: id, type: 'MAITRISE', niveau: 'DEBUTANT' }]
    })
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await profilApi.updateMonProfil({
        pseudo: form.pseudo || `${utilisateur?.prenom || ''} ${utilisateur?.nom || ''}`.trim(),
        bio: form.bio || null,
        pays: form.pays || null,
        ville: form.ville || null,
        niveau: form.niveau || null,
        disponibilite: form.disponibilite || null,
        github: form.github || null,
        linkedin: form.linkedin || null,
        portfolio: form.portfolio || null,
      })
      setProfil(updated)

      const updatedComp = await profilApi.replaceMesCompetences(editCompetences)
      setCompetences(updatedComp)

      if (photoPreview) setProfilePhoto(photoPreview)

      setEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const displayName = profil?.pseudo || `${utilisateur?.prenom || ''} ${utilisateur?.nom || ''}`.trim() || 'Membre'
  const initials = ((utilisateur?.prenom?.[0] || '') + (utilisateur?.nom?.[0] || '')).toUpperCase()
  const roleLabel = profil?.niveau ? `Niveau ${NIVEAU_LABELS[profil.niveau] || profil.niveau}` : 'Membre de la communauté'

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.inner}>
        <div className={styles.grid}>

          {/* ---- Left Column ---- */}
          <div className={styles.leftColumn}>
            {/* Profile Card */}
            <div className={styles.profileCard}>
              <div className={styles.profileBanner} />
              {!editing && (
                <button
                  onClick={startEditing}
                  className={styles.editButton}
                  title="Modifier le profil"
                >
                  <Pencil size={14} />
                </button>
              )}

              <div className={styles.cardBody}>
                <div className="relative inline-block -mt-16">
                  {editing ? (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className={styles.avatarButton}
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                      ) : initials}
                      <div className={styles.avatarOverlay}>
                        <Camera size={24} className="text-white" />
                      </div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </button>
                  ) : (
                    <div className={styles.avatarDiv}>
                      {photoPreview ? (
                        <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                      ) : initials}
                    </div>
                  )}
                </div>

                {editing ? (
                  <div className="mt-4 space-y-3 text-left">
                    <div>
                      <label className={styles.label}>Nom affiché</label>
                      <input value={form.pseudo} onChange={e => set('pseudo', e.target.value)} placeholder="Votre nom ou pseudonyme" className={styles.input} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={styles.label}>Pays</label>
                        <input value={form.pays} onChange={e => set('pays', e.target.value)} placeholder="Ex. Sénégal" className={styles.input} />
                      </div>
                      <div>
                        <label className={styles.label}>Ville</label>
                        <input value={form.ville} onChange={e => set('ville', e.target.value)} placeholder="Ex. Dakar" className={styles.input} />
                      </div>
                    </div>
                    <div>
                      <label className={styles.label}>Niveau</label>
                      <select value={form.niveau} onChange={e => set('niveau', e.target.value)} className={styles.input}>
                        {NIVEAUX.map(n => (
                          <option key={n} value={n}>{NIVEAU_LABELS[n]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={styles.label}>Disponibilité</label>
                      <input value={form.disponibilite} onChange={e => set('disponibilite', e.target.value)} placeholder="Ex. soirs et week-ends, disponible à temps plein..." className={styles.input} />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className={styles.name}>{displayName}</h2>
                    <p className={styles.role}>{roleLabel}</p>
                    <div className={styles.locationInfo}>
                      {profil?.pays && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-primary" /> {profil.ville ? `${profil.ville}, ` : ''}{profil.pays}
                        </span>
                      )}
                      <span className="text-xs text-gray-500">Membre de 54Devs</span>
                    </div>
                    {profil?.disponibilite && <span className="inline-flex mt-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">{profil.disponibilite}</span>}

                  </>
                )}
              </div>
            </div>

            {/* Links (edit mode) */}
            {editing && (
              <div className={styles.linksCard}>
                <h3 className="font-bold text-gray-900 mb-2">Liens</h3>
                <div>
                  <label className={styles.label}><ExternalLink size={12} className="inline mr-1" />GitHub</label>
                  <input value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/..." className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}><Link2 size={12} className="inline mr-1" />LinkedIn</label>
                  <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className={styles.input} />
                </div>
                <div>
                  <label className={styles.label}><Globe size={12} className="inline mr-1" />Portfolio</label>
                  <input value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://..." className={styles.input} />
                </div>
              </div>
            )}

            {/* Engagement Card */}
            {!editing && (
              <div className={styles.engagementCard}>
                <h3 className="font-bold text-gray-900 mb-4">Engagement</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className={styles.statBox}>
                    <span className="text-xl font-bold text-gray-900">{myProjects.length}</span>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mt-0.5">Projets</p>
                  </div>
                  <div className={styles.statBox}>
                    <span className="text-xl font-bold text-gray-900">{competences.length}</span>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold mt-0.5">Compétences</p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Links */}
            {!editing && (profil?.github || profil?.linkedin || profil?.portfolio) && (
              <div className={styles.socialLinksCard}>
                <h3 className="font-bold text-gray-900 mb-3">Mes liens</h3>
                <div className="space-y-2">
                  {profil.github && (
                    <a href={profil.github} target="_blank" rel="noreferrer" className={styles.socialLink}>
                      <ExternalLink size={16} /> GitHub
                    </a>
                  )}
                  {profil.linkedin && (
                    <a href={profil.linkedin} target="_blank" rel="noreferrer" className={styles.socialLink}>
                      <Link2 size={16} /> LinkedIn
                    </a>
                  )}
                  {profil.portfolio && (
                    <a href={profil.portfolio} target="_blank" rel="noreferrer" className={styles.socialLink}>
                      <Globe size={16} /> Portfolio
                    </a>
                  )}
                </div>
              </div>
            )}

            <button onClick={handleLogout} className={styles.logoutButton}>
              Se déconnecter
            </button>
          </div>

          {/* ---- Right Column ---- */}
          <div className={styles.rightColumn}>
            {/* Save / Cancel bar (edit mode) */}
            {editing && (
              <div className={styles.saveBar}>
                <span className="text-sm font-semibold text-gray-900">Modification du profil</span>
                <div className="flex items-center gap-3">
                  {saveError && <span className="text-red-500 text-sm">{saveError}</span>}
                  <button onClick={cancelEditing} className={styles.cancelButton}>
                    <X size={16} /> Annuler
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className={styles.saveButton}
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            )}

            {/* About Me */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">À propos</h2>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Présentez-vous à la communauté…"
                  rows={4}
                  maxLength={1000}
                  className={`${styles.input} resize-none`}
                />
              ) : (
                <p className={styles.aboutSection}>
                  {profil?.bio || 'Aucune présentation pour le moment. Modifiez votre profil pour vous présenter à la communauté.'}
                </p>
              )}
            </div>

            {/* Expertise */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Compétences</h3>
              {editing ? (
                <div>
                  <p className="text-gray-500 text-sm mb-3">Choisissez vos compétences dans le catalogue :</p>
                  <div className="flex flex-wrap gap-2">
                    {catalogue.map(c => {
                      const selected = editCompetences.some(ec => ec.competenceId === c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCompetence(c.id)}
                          className={selected ? styles.expertiseTagSelected : styles.expertiseTagUnselected}
                        >
                          {c.nom}
                        </button>
                      )
                    })}
                  </div>
                  {editCompetences.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Sélectionnées ({editCompetences.length})</p>
                      {editCompetences.map(ec => {
                        const info = catalogue.find(c => c.id === ec.competenceId)
                        return (
                          <div key={ec.competenceId} className={styles.competenceRow}>
                            <span className="text-sm font-medium text-gray-900 flex-1">{info?.nom || `#${ec.competenceId}`}</span>
                            <select
                              aria-label={`Type de compétence pour ${info?.nom || `#${ec.competenceId}`}`}
                              value={ec.type || 'MAITRISE'}
                              onChange={e => setEditCompetences(prev => prev.map(
                                c => c.competenceId === ec.competenceId ? { ...c, type: e.target.value } : c
                              ))}
                              className={styles.competenceSelect}
                            >
                              {Object.entries(TYPE_COMPETENCE).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                            </select>
                            <select
                              aria-label={`Niveau pour ${info?.nom || `#${ec.competenceId}`}`}
                              value={ec.niveau}
                              onChange={e => setEditCompetences(prev => prev.map(
                                c => c.competenceId === ec.competenceId ? { ...c, niveau: e.target.value } : c
                              ))}
                              className={styles.competenceSelect}
                            >
                              {NIVEAUX.map(n => <option key={n} value={n}>{NIVEAU_LABELS[n]}</option>)}
                            </select>
                            <button
                              type="button"
                              aria-label={`Retirer ${info?.nom || `la compétence ${ec.competenceId}`}`}
                              onClick={() => toggleCompetence(ec.competenceId)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : competences.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {competences.map(c => (
                    <span key={c.competenceId} className={`${styles.expertiseTag} inline-flex flex-col items-start`}>
                      {c.nom}
                      <span className="text-[10px] font-medium text-slate-500">{TYPE_COMPETENCE[c.type] || TYPE_COMPETENCE.MAITRISE}</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Aucune compétence ajoutée pour le moment.</p>
              )}
            </div>

            {/* Featured Projects */}
            {!editing && (
              <div>
                <section className={`${styles.badgesCard} mb-8`}>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Badges</h3>
                      <p className="text-sm text-gray-500 mt-1">Vos étapes et votre progression dans la communauté.</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{badges.filter(b => b.obtenu).length} / {badges.length} obtenus</span>
                  </div>
                  {badgesError ? <p className="text-sm text-red-600">{badgesError}</p> : badges.length ? (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {badges.map(badge => {
                        const progress = badge.progression
                        const ratio = progress?.objectif > 0 ? Math.min(100, Math.round((progress.actuel / progress.objectif) * 100)) : 0
                        return (
                          <article key={badge.code} className={`${styles.badgeItem} ${badge.obtenu ? styles.badgeEarned : styles.badgePending}`}>
                            <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${badge.obtenu ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                              {badge.obtenu ? <CheckCircle2 size={19} /> : <Award size={19} />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-sm text-slate-900">{badge.nom}</h4>
                              <p className="text-xs text-slate-500 leading-relaxed mt-1">{badge.description}</p>
                              {badge.obtenu ? (
                                badge.dateObtention && <p className="text-[11px] font-medium text-emerald-700 mt-2">Obtenu le {new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(badge.dateObtention))}</p>
                              ) : progress && (
                                <div className="mt-3">
                                  <div className="flex justify-between text-[11px] text-slate-500 mb-1"><span>Progression</span><span>{progress.actuel} / {progress.objectif}</span></div>
                                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden"><div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${ratio}%` }} /></div>
                                </div>
                              )}
                            </div>
                          </article>
                        )
                      })}
                    </div>
                  ) : <p className="text-sm text-gray-500">Aucun badge à afficher pour le moment.</p>}
                </section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Mes projets</h3>
                  <Link to="/projects" className="text-primary text-sm font-semibold hover:underline">Voir tout</Link>
                </div>
                {projectsError ? (
                  <div className={styles.emptyState}>
                    <p className="text-red-500 text-sm">{projectsError}</p>
                  </div>
                ) : myProjects.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {myProjects.slice(0, 4).map(p => (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        className={styles.projectCard}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-dark rounded-xl flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{p.nom?.[0]?.toUpperCase() || '?'}</span>
                          </div>
                          <span className={p.roleMembre === 'CREATEUR' ? styles.projectRoleLead : styles.projectRoleContributor}>
                            {ROLE_MEMBRE[p.roleMembre] || p.roleMembre}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{p.nom}</h4>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{p.description}</p>

                        <div className="mb-4 flex items-center justify-between text-[11px]">
                          <span className="text-gray-400 font-semibold uppercase tracking-wider">
                            {STATUT_PROJET[p.statut] || p.statut}
                          </span>
                          <span className="text-gray-500 font-medium">
                            {p.nombreMembres} membre{p.nombreMembres > 1 ? 's' : ''}
                          </span>
                        </div>

                        <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                          Voir le projet <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p className="text-gray-400 text-sm">Vous ne participez à aucun projet.</p>
                    <Link to="/projects/create" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">
                      Publier un projet
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
