import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users, Settings, LogOut, ChevronRight, Pencil, Save, X, MapPin, Globe, Plus,
  Rocket, Loader2, Clock, FileText,
} from 'lucide-react'
import {
  clearAuthSession,
  competencesApi,
  demandesApi,
  getStoredUser,
  getToken,
  profilApi,
  projetsApi,
} from '../api'
import { styles } from './Dashboard.styles'
import {
  navItems, niveauLabels, typeLabels, typeColors,
  STATUT_LABELS, STATUT_COLORS, ROLE_LABELS,
  STATUT_DEMANDE_LABELS, STATUT_DEMANDE_COLORS,
} from './Dashboard.data'

function ProfileView({ profil, competences, utilisateur, token, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const [catalogue, setCatalogue] = useState([])
  const [addingSkill, setAddingSkill] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')

  useEffect(() => {
    if (profil) {
      setForm({
        pseudo: profil.pseudo || '',
        bio: profil.bio || '',
        pays: profil.pays || '',
        ville: profil.ville || '',
        niveau: profil.niveau || 'DEBUTANT',
        disponibilite: profil.disponibilite || '',
        github: profil.github || '',
        linkedin: profil.linkedin || '',
        portfolio: profil.portfolio || '',
      })
    }
  }, [profil])

  useEffect(() => {
    if (!token) return
    competencesApi.lister().then(setCatalogue).catch(() => setCatalogue([]))
  }, [token])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await profilApi.updateMonProfil(form)
      onUpdate(updated)
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  async function addCompetence(comp) {
    const body = [
      ...competences.map(c => ({ competenceId: c.competenceId, type: c.type, niveau: c.niveau })),
      { competenceId: comp.id, type: 'MAITRISE', niveau: profil?.niveau || 'DEBUTANT' },
    ]
    const updated = await profilApi.replaceMesCompetences(body)
    onUpdate(null, updated)
    setAddingSkill(false)
    setSkillSearch('')
  }

  async function removeCompetence(competenceId) {
    const body = competences
      .filter(c => c.competenceId !== competenceId)
      .map(c => ({ competenceId: c.competenceId, type: c.type, niveau: c.niveau }))
    const updated = await profilApi.replaceMesCompetences(body)
    onUpdate(null, updated)
  }

  const initials = utilisateur ? (utilisateur.prenom?.[0] || '') + (utilisateur.nom?.[0] || '') : '?'
  const availableSkills = catalogue.filter(c => !competences.some(uc => uc.competenceId === c.id))
  const filteredSkills = skillSearch
    ? availableSkills.filter(c => c.nom.toLowerCase().includes(skillSearch.toLowerCase()))
    : availableSkills.slice(0, 8)

  return (
    <div>
      {/* Profile Header */}
      <div className={styles.profileHeader}>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={styles.profileAvatar}>
              {initials.toUpperCase()}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{profil?.pseudo || utilisateur?.prenom || 'Dev'}</h2>
              <p className="text-gray-400 text-sm">{utilisateur?.email}</p>
              <div className="flex items-center gap-3 mt-1">
                {profil?.pays && (
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={12} /> {profil.pays}{profil.ville ? `, ${profil.ville}` : ''}
                  </span>
                )}
                <span className="text-accent text-xs font-semibold">{niveauLabels[profil?.niveau] || 'Débutant'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={editing ? styles.editProfileButtonActive : styles.editProfileButtonInactive}
          >
            {editing ? <><X size={14} /> Annuler</> : <><Pencil size={14} /> Modifier le profil</>}
          </button>
        </div>

        {/* Bio */}
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.profileLabel}>Pseudo</label>
                <input value={form.pseudo} onChange={e => handleChange('pseudo', e.target.value)}
                  className={styles.profileInput} />
              </div>
              <div>
                <label className={styles.profileLabel}>Niveau</label>
                <select value={form.niveau} onChange={e => handleChange('niveau', e.target.value)}
                  className={styles.profileInputSelect}>
                  <option value="DEBUTANT">Débutant (0-2 ans)</option>
                  <option value="INTERMEDIAIRE">Intermédiaire (2-5 ans)</option>
                  <option value="AVANCE">Avancé (5+ ans)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={styles.profileLabel}>Pays</label>
                <select value={form.pays} onChange={e => handleChange('pays', e.target.value)}
                  className={styles.profileInputSelect}>
                  <option value="">Sélectionnez votre pays</option>
                  {['Sénégal','Côte d\'Ivoire','Cameroun','Mali','Togo','Bénin','Maroc','Tunisie','Algérie','Égypte','Nigeria','Ghana','Kenya','Rwanda','Éthiopie','Tanzanie','Afrique du Sud','RDC','Guinée','Burkina Faso','Niger','Mauritanie','Madagascar','Gabon','Congo','Tchad','Autre'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={styles.profileLabel}>Ville</label>
                <input value={form.ville} onChange={e => handleChange('ville', e.target.value)}
                  className={styles.profileInput} />
              </div>
            </div>
            <div>
              <label className={styles.profileLabel}>Bio</label>
              <textarea value={form.bio} onChange={e => handleChange('bio', e.target.value)} rows={3}
                className={styles.profileInputTextarea} />
            </div>
            <div>
              <label className={styles.profileLabel}>Disponibilité</label>
              <input value={form.disponibilite} onChange={e => handleChange('disponibilite', e.target.value)} placeholder="ex. Temps plein, Weekends uniquement"
                className={styles.profileInputWithPlaceholder} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={styles.profileLabel}>GitHub</label>
                <input value={form.github} onChange={e => handleChange('github', e.target.value)} placeholder="https://github.com/..."
                  className={styles.profileInputWithPlaceholder} />
              </div>
              <div>
                <label className={styles.profileLabel}>LinkedIn</label>
                <input value={form.linkedin} onChange={e => handleChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..."
                  className={styles.profileInputWithPlaceholder} />
              </div>
              <div>
                <label className={styles.profileLabel}>Portfolio</label>
                <input value={form.portfolio} onChange={e => handleChange('portfolio', e.target.value)} placeholder="https://..."
                  className={styles.profileInputWithPlaceholder} />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className={styles.saveButton}>
              <Save size={16} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        ) : (
          <div>
            {profil?.bio && <p className="text-gray-300 text-sm mb-4">{profil.bio}</p>}
            {!profil?.bio && <p className="text-gray-600 text-sm italic mb-4">Aucune bio pour le moment. Cliquez sur "Modifier le profil" pour en ajouter une.</p>}
            <div className="flex items-center gap-4">
              {profil?.disponibilite && (
                <span className={styles.availabilityBadge}>{profil.disponibilite}</span>
              )}
              {profil?.github && (
                <a href={profil.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              )}
              {profil?.linkedin && (
                <a href={profil.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {profil?.portfolio && (
                <a href={profil.portfolio} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition"><Globe size={16} /></a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className={styles.skillsCard}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm">Mes compétences</h3>
          <button onClick={() => setAddingSkill(!addingSkill)} className={styles.addSkillButton}>
            {addingSkill ? <><X size={14} /> Annuler</> : <><Plus size={14} /> Ajouter</>}
          </button>
        </div>

        {addingSkill && (
          <div className="mb-4">
            <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Rechercher une compétence..."
              autoFocus
              className={styles.skillSearchInput} />
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map(c => (
                <button key={c.id} onClick={() => addCompetence(c)} className={styles.skillSuggestionButton}>
                  {c.nom} <span className="text-gray-600">({c.categorie})</span>
                </button>
              ))}
              {filteredSkills.length === 0 && <p className="text-gray-600 text-xs">Aucune compétence trouvée.</p>}
            </div>
          </div>
        )}

        {competences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {competences.map(c => (
              <div key={c.competenceId}
                className={`${styles.skillBadge} ${typeColors[c.type] || 'bg-dark-2 text-gray-400 border-dark-border'}`}>
                <span>{c.nom}</span>
                <span className="opacity-60">{typeLabels[c.type]}</span>
                <button onClick={() => removeCompetence(c.competenceId)} className="opacity-40 hover:opacity-100 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">Aucune compétence ajoutée. Cliquez sur "+ Ajouter" pour commencer.</p>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [profil, setProfil] = useState(null)
  const [competences, setCompetences] = useState([])
  const [utilisateur, setUtilisateur] = useState(null)
  const [mesProjets, setMesProjets] = useState([])
  const [mesDemandes, setMesDemandes] = useState([])
  const [loadingProjets, setLoadingProjets] = useState(true)
  const [loadingDemandes, setLoadingDemandes] = useState(true)
  const [erreurProjets, setErreurProjets] = useState('')
  const [erreurDemandes, setErreurDemandes] = useState('')

  const token = getToken()

  function chargerMesProjets() {
    setLoadingProjets(true)
    setErreurProjets('')
    projetsApi.mesProjets()
      .then(data => setMesProjets(Array.isArray(data) ? data : []))
      .catch(err => setErreurProjets(err.message || 'Impossible de charger vos projets.'))
      .finally(() => setLoadingProjets(false))
  }

  function chargerMesDemandes() {
    setLoadingDemandes(true)
    setErreurDemandes('')
    demandesApi.mesDemandes()
      .then(data => setMesDemandes(Array.isArray(data) ? data : []))
      .catch(err => setErreurDemandes(err.message || 'Impossible de charger vos demandes.'))
      .finally(() => setLoadingDemandes(false))
  }

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const stored = getStoredUser()
    if (stored) setUtilisateur(stored)

    Promise.all([
      profilApi.getMonProfil().catch(() => null),
      profilApi.getMesCompetences().catch(() => null),
    ]).then(([p, c]) => {
      if (p) setProfil(p)
      if (c) setCompetences(c)
    })

    chargerMesProjets()
    chargerMesDemandes()
  }, [token, navigate])

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  function handleProfileUpdate(updatedProfil, updatedCompetences) {
    if (updatedProfil) setProfil(updatedProfil)
    if (updatedCompetences) setCompetences(updatedCompetences)
  }

  const displayName = profil?.pseudo || utilisateur?.prenom || 'Dev'
  const demandesEnAttente = mesDemandes.filter(d => d.statut === 'EN_ATTENTE')

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          {/* Logo */}
          <Link to="/" className={styles.sidebarLogo}>
            <span className="text-accent">&lt;/&gt;</span>
            <span>54<span className="text-accent">Devs</span></span>
          </Link>

          {/* User mini-card */}
          <button
            onClick={() => setActive('profile')}
            className={`${styles.userCard} ${active === 'profile' ? styles.userCardActive : styles.userCardInactive}`}
          >
            <div className={styles.userAvatar}>
              {((utilisateur?.prenom?.[0] || '') + (utilisateur?.nom?.[0] || '')).toUpperCase() || '?'}
            </div>
            <div className="text-left min-w-0">
              <p className="text-white text-sm font-semibold truncate">{displayName}</p>
              <p className="text-gray-500 text-[10px] truncate">{utilisateur?.email || ''}</p>
            </div>
          </button>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = active === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === 'projects') {
                      navigate('/projects')
                    } else {
                      setActive(item.key)
                    }
                  }}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="space-y-3">
          {/* Simplified CADEV card */}
          <div className={styles.cadevCard}>
            <span className="text-accent text-xs font-bold uppercase tracking-wider">CADEV 2026</span>
            <p className="text-white text-sm font-semibold mt-2 mb-1">Concours africain des développeurs</p>
            <p className="text-gray-500 text-xs mb-3">Créez ou rejoignez un projet pour participer.</p>
            <Link to="/projects/new" className={`block text-center ${styles.cadevApplyButton}`}>
              Publier un projet
            </Link>
          </div>

          {/* Settings & Logout */}
          <button className={styles.settingsButton}>
            <Settings size={18} />
            Paramètres
          </button>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {active === 'profile' ? (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">Mon profil</h1>
              <p className="text-gray-400 text-sm">Gérez votre identité de développeur et vos compétences.</p>
            </div>
            <ProfileView profil={profil} competences={competences} utilisateur={utilisateur} token={token} onUpdate={handleProfileUpdate} />
          </div>
        ) : (
        <div>
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Bienvenue, <span className="text-accent">{displayName}</span>
          </h1>
          <p className="text-gray-400 text-sm">Voici un aperçu de votre activité.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className={styles.statCard}>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2">Mes projets</p>
            <p className="text-white text-2xl font-bold mb-1">{loadingProjets ? '...' : mesProjets.length}</p>
            <p className="text-gray-500 text-xs">
              {loadingProjets ? 'Chargement...' : mesProjets.length > 0
                ? mesProjets.slice(0, 2).map(p => p.nom).join(', ')
                : 'Aucun projet pour le moment'}
            </p>
          </div>
          <div className={styles.statCard}>
            <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2">Compétences</p>
            <p className="text-white text-2xl font-bold mb-1">{competences.length}</p>
            <p className="text-gray-500 text-xs">
              {competences.length > 0
                ? competences.slice(0, 3).map(c => c.nom).join(', ')
                : 'Ajoutez vos compétences'}
            </p>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Mes projets */}
          <div className={styles.feedCard}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-sm">Mes projets</h2>
              <Link to="/projects" className="text-accent text-xs font-semibold hover:underline flex items-center gap-1">
                Voir tout <ChevronRight size={14} />
              </Link>
            </div>

            {loadingProjets ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="animate-spin text-accent" />
              </div>
            ) : erreurProjets ? (
              <div className={styles.emptyStateInline}>
                <p className="text-red-400 text-sm mb-3">{erreurProjets}</p>
                <button onClick={chargerMesProjets} className={styles.secondaryButton}>Réessayer</button>
              </div>
            ) : mesProjets.length > 0 ? (
              <div className="space-y-3">
                {mesProjets.slice(0, 5).map(p => (
                  <Link key={p.id} to={`/projects/${p.id}`} className={styles.projectCard}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <h3 className={styles.projectCardName}>{p.nom}</h3>
                      </div>
                      <span className={`${styles.statusBadge} ${STATUT_COLORS[p.statut] || ''} ml-2`}>
                        {STATUT_LABELS[p.statut] || p.statut}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-500">
                      <span className={`${styles.roleBadge} ${p.roleMembre === 'CREATEUR' ? 'text-accent' : 'text-gray-500'}`}>
                        {ROLE_LABELS[p.roleMembre] || p.roleMembre}
                      </span>
                      <span><Users size={10} className="inline mr-1" />{p.nombreMembres} membre{p.nombreMembres > 1 ? 's' : ''}</span>
                      {p.roleMembre === 'CREATEUR' && p.demandesEnAttente > 0 && (
                        <span className={styles.pendingBadge}>
                          {p.demandesEnAttente} demande{p.demandesEnAttente > 1 ? 's' : ''} à traiter
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyStateInline}>
                <Rocket size={32} className="text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm mb-1">Vous ne participez à aucun projet.</p>
                <p className="text-gray-600 text-xs mb-4">Créez ou rejoignez un projet pour commencer.</p>
                <div className="flex gap-3">
                  <Link to="/projects" className={styles.secondaryButton}>
                    Découvrir les projets
                  </Link>
                  <Link to="/projects/create" className={styles.actionButton}>
                    <Plus size={16} /> Publier un projet
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mes demandes en cours */}
          <div className={styles.feedCard}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-sm">Mes demandes en cours</h2>
            </div>

            {loadingDemandes ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={24} className="animate-spin text-accent" />
              </div>
            ) : erreurDemandes ? (
              <div className={styles.emptyStateInline}>
                <p className="text-red-400 text-sm mb-3">{erreurDemandes}</p>
                <button onClick={chargerMesDemandes} className={styles.secondaryButton}>Réessayer</button>
              </div>
            ) : demandesEnAttente.length > 0 ? (
              <div className="space-y-3">
                {demandesEnAttente.map(d => (
                  <Link key={d.id} to={`/projects/${d.projetId}`} className={styles.demandeRow}>
                    <div className="min-w-0 flex-1">
                      <p className="text-white text-sm font-medium truncate">{d.projetNom || `Projet #${d.projetId}`}</p>
                      {d.dateDemande && (
                        <p className="text-gray-600 text-[10px] flex items-center gap-1 mt-0.5">
                          <Clock size={10} /> {new Date(d.dateDemande).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <span className={`${styles.statusBadge} ${STATUT_DEMANDE_COLORS[d.statut] || ''}`}>
                      {STATUT_DEMANDE_LABELS[d.statut] || d.statut}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.emptyStateInline}>
                <FileText size={32} className="text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm mb-1">Aucune demande en cours.</p>
                <p className="text-gray-600 text-xs">Vos demandes d'adhésion aux projets apparaîtront ici.</p>
              </div>
            )}
          </div>
        </div>
        </div>
        )}
      </main>
    </div>
  )
}
