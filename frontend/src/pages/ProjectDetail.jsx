import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Loader2, Pencil, Save, X, Users, MessageSquare,
  Send, CheckCircle, XCircle, Clock, UserMinus, RefreshCw, AlertTriangle,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken, getStoredUser, projetsApi, competencesApi } from '../api'
import { styles } from './ProjectDetail.styles'
import {
  STATUT_LABELS, STATUT_COLORS, ALL_STATUTS, NIVEAU_LABELS,
  TYPE_LABELS, ROLE_LABELS,
} from './ProjectDetail.data'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = getToken()
  const currentUser = getStoredUser()

  const [projet, setProjet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [erreur, setErreur] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [catalogue, setCatalogue] = useState([])

  const [demandes, setDemandes] = useState([])
  const [demandesLoading, setDemandesLoading] = useState(false)

  const [discussions, setDiscussions] = useState([])
  const [discussionsLoading, setDiscussionsLoading] = useState(false)
  const [discussionPage, setDiscussionPage] = useState(null)
  const [discussionTotalPages, setDiscussionTotalPages] = useState(0)
  const [newMessage, setNewMessage] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef(null)

  const [departs, setDeparts] = useState([])
  const [departsLoading, setDepartsLoading] = useState(false)

  const [showJoinModal, setShowJoinModal] = useState(false)
  const [joinMessage, setJoinMessage] = useState('')
  const [engagementAccepte, setEngagementAccepte] = useState(false)
  const [joining, setJoining] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [joinSuccess, setJoinSuccess] = useState(false)

  const [showMotifModal, setShowMotifModal] = useState(null)
  const [motif, setMotif] = useState('')
  const [removing, setRemoving] = useState(false)
  const [removeError, setRemoveError] = useState('')

  const [changingStatut, setChangingStatut] = useState(false)
  const [listError, setListError] = useState('')

  function loadProjet() {
    setLoading(true)
    setErreur('')
    projetsApi.getById(id)
      .then(setProjet)
      .catch(err => setErreur(err.message || 'Erreur lors du chargement du projet.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!id) return
    loadProjet()
  }, [id])

  useEffect(() => {
    if (!projet) return
    setListError('')
    if (activeTab === 'requests' && projet.estCreateur) loadDemandes()
    if (activeTab === 'discussions' && (projet.estMembre || projet.estCreateur)) loadDiscussionsLast()
    if (activeTab === 'departs' && projet.estCreateur) loadDeparts()
  }, [activeTab, projet?.id])

  function loadDemandes() {
    setDemandesLoading(true)
    projetsApi.getDemandesRecues(id, 'EN_ATTENTE')
      .then(data => setDemandes(Array.isArray(data) ? data : []))
      .catch(err => { setDemandes([]); setListError(err.message) })
      .finally(() => setDemandesLoading(false))
  }

  function loadDiscussionsLast() {
    setDiscussionsLoading(true)
    projetsApi.getDiscussions(id, { page: 0, taille: 20 })
      .then(data => {
        const tp = data?.totalPages || 1
        setDiscussionTotalPages(tp)
        if (tp <= 1) {
          setDiscussions(data?.contenu || [])
          setDiscussionPage(0)
          setDiscussionsLoading(false)
        } else {
          const lastPage = tp - 1
          projetsApi.getDiscussions(id, { page: lastPage, taille: 20 })
            .then(d2 => {
              setDiscussions(d2?.contenu || [])
              setDiscussionPage(lastPage)
            })
            .catch(err => setListError(err.message))
            .finally(() => setDiscussionsLoading(false))
        }
      })
      .catch(err => { setDiscussions([]); setListError(err.message); setDiscussionsLoading(false) })
  }

  function loadPreviousMessages() {
    if (discussionPage == null || discussionPage <= 0) return
    const prev = discussionPage - 1
    setDiscussionsLoading(true)
    projetsApi.getDiscussions(id, { page: prev, taille: 20 })
      .then(data => {
        setDiscussions(old => [...(data?.contenu || []), ...old])
        setDiscussionPage(prev)
      })
      .catch(err => setListError(err.message))
      .finally(() => setDiscussionsLoading(false))
  }

  function loadDeparts() {
    setDepartsLoading(true)
    projetsApi.getDeparts(id)
      .then(data => setDeparts(Array.isArray(data) ? data : []))
      .catch(err => { setDeparts([]); setListError(err.message) })
      .finally(() => setDepartsLoading(false))
  }

  function startEditing() {
    setEditForm({
      nom: projet.nom || '',
      description: projet.description || '',
      probleme: projet.probleme || '',
      solution: projet.solution || '',
      technologies: projet.technologies || '',
      categorie: projet.categorie || '',
      rolesRecherches: projet.rolesRecherches || '',
      nombrePlacesRecherchees: projet.nombrePlacesRecherchees || 3,
      conditionsEngagement: projet.conditionsEngagement || '',
      statut: projet.statut || 'IDEE',
      competencesRecherchees: (projet.competencesRecherchees || []).map(c => ({
        competenceId: c.competenceId,
        obligatoire: c.obligatoire,
        niveauRequis: c.niveauRequis || 'DEBUTANT',
      })),
    })
    setSaveError('')
    setEditing(true)
    if (catalogue.length === 0) {
      competencesApi.lister().then(setCatalogue).catch(() => {})
    }
  }

  async function handleSaveEdit() {
    setSaving(true)
    setSaveError('')
    try {
      const body = {
        nom: editForm.nom,
        description: editForm.description,
        probleme: editForm.probleme?.trim() || null,
        solution: editForm.solution?.trim() || null,
        technologies: editForm.technologies?.trim() || null,
        categorie: editForm.categorie?.trim() || null,
        rolesRecherches: editForm.rolesRecherches?.trim() || null,
        nombrePlacesRecherchees: Number(editForm.nombrePlacesRecherchees) || 3,
        conditionsEngagement: editForm.conditionsEngagement?.trim() || null,
        statut: editForm.statut,
        competencesRecherchees: editForm.competencesRecherchees,
      }
      const updated = await projetsApi.modifier(id, body)
      setProjet(updated)
      setEditing(false)
    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleChangeStatut(newStatut) {
    setChangingStatut(true)
    try {
      await projetsApi.changerStatut(id, newStatut)
      const updated = await projetsApi.getById(id)
      setProjet(updated)
    } catch (err) {
      alert(err.message)
    } finally {
      setChangingStatut(false)
    }
  }

  async function handleJoin() {
    setJoining(true)
    setJoinError('')
    try {
      await projetsApi.envoyerDemande(id, {
        message: joinMessage.trim() || null,
        engagementAccepte: true,
      })
      setJoinSuccess(true)
      setTimeout(() => {
        setShowJoinModal(false)
        setJoinSuccess(false)
        setJoinMessage('')
        setEngagementAccepte(false)
        loadProjet()
      }, 1500)
    } catch (err) {
      setJoinError(err.message)
    } finally {
      setJoining(false)
    }
  }

  async function handleDecision(demandeId, decision) {
    try {
      await projetsApi.deciderDemande(id, demandeId, decision)
      setDemandes(prev => prev.filter(d => d.id !== demandeId))
      loadProjet()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleRemoveMembre() {
    if (!showMotifModal || motif.trim().length < 1) return
    setRemoving(true)
    setRemoveError('')
    try {
      await projetsApi.retirerMembre(id, showMotifModal.utilisateurId, motif.trim())
      const isSelf = showMotifModal.utilisateurId === currentUser?.id
      setShowMotifModal(null)
      setMotif('')
      if (isSelf) {
        navigate('/projects')
      } else {
        loadProjet()
      }
    } catch (err) {
      setRemoveError(err.message)
    } finally {
      setRemoving(false)
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault()
    if (!newMessage.trim()) return
    setSendingMessage(true)
    try {
      await projetsApi.posterDiscussion(id, newMessage.trim())
      setNewMessage('')
      loadDiscussionsLast()
    } catch (err) {
      alert(err.message)
    } finally {
      setSendingMessage(false)
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

  if (erreur || !projet) {
    return (
      <div className={styles.page}>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">{erreur || 'Projet introuvable.'}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={loadProjet} className={styles.btnPrimary}>Réessayer</button>
            <Link to="/projects" className={styles.btnSecondary}>Retour aux projets</Link>
          </div>
        </div>
      </div>
    )
  }

  const isMembre = projet.estMembre || projet.estCreateur
  const tabs = [
    { key: 'overview', label: 'Vue d\'ensemble' },
    { key: 'members', label: 'Membres', count: projet.membres?.length },
    ...(isMembre ? [{ key: 'discussions', label: 'Discussions' }] : []),
    ...(projet.estCreateur ? [
      { key: 'requests', label: 'Demandes' },
      { key: 'departs', label: 'Départs' },
    ] : []),
  ]

  function renderActionButton() {
    if (projet.estCreateur) {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={startEditing} className={styles.btnPrimary}>
            <Pencil size={14} /> Modifier
          </button>
        </div>
      )
    }
    if (projet.estMembre) {
      return (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTab('discussions')} className={styles.btnPrimary}>
            <MessageSquare size={14} /> Espace du projet
          </button>
          <button
            onClick={() => {
              const me = projet.membres?.find(m => m.utilisateurId === currentUser?.id)
              if (me) setShowMotifModal(me)
            }}
            className={styles.btnDanger}
          >
            <UserMinus size={14} /> Quitter le projet
          </button>
        </div>
      )
    }
    if (projet.maDemande?.statut === 'EN_ATTENTE') {
      return (
        <button disabled className="bg-gray-100 text-gray-500 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed">
          <Clock size={14} className="inline mr-1" /> Demande envoyée
        </button>
      )
    }
    if (!projet.ouvertAuxDemandes) {
      return (
        <span className="text-sm font-semibold px-4 py-2 rounded-full bg-gray-100 text-gray-500">
          {projet.statut === 'TERMINE' ? 'Terminé' : 'Complet'}
        </span>
      )
    }
    return (
      <div>
        {projet.maDemande?.statut === 'REFUSEE' && (
          <p className="text-sm text-red-500 mb-2">Votre dernière demande a été refusée.</p>
        )}
        <button onClick={() => setShowJoinModal(true)} className={styles.btnPrimary}>
          Demander à rejoindre
        </button>
      </div>
    )
  }

  function groupCompetences(comps) {
    const groups = {}
    for (const c of comps || []) {
      const key = c.type || 'MAITRISE'
      if (!groups[key]) groups[key] = []
      groups[key].push(c)
    }
    return groups
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.inner}>
        <Link to="/projects" className={styles.backLink}>
          <ArrowLeft size={16} /> Retour aux projets
        </Link>

        <div className={styles.grid}>
          {/* ---- Main Column ---- */}
          <div className={styles.mainColumn}>
            {/* Header */}
            <div className={styles.header}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`${styles.statusBadge} ${STATUT_COLORS[projet.statut] || 'bg-gray-100 text-gray-500'}`}>
                      {STATUT_LABELS[projet.statut] || projet.statut}
                    </span>
                    {projet.categorie && (
                      <span className="text-xs text-slate-300 font-medium">{projet.categorie}</span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{projet.nom}</h1>
                  <p className="text-sm text-slate-300 mt-1">
                    Créé par {projet.createur?.prenom || projet.createur?.pseudo || 'un membre'}{projet.createur?.pays && ` · ${projet.createur.pays}`}
                  </p>
                </div>
                {renderActionButton()}
              </div>
              <p className="text-slate-300 leading-relaxed">{projet.description}</p>
            </div>

            {/* Tabs */}
            <div className={styles.tabsBar}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={activeTab === t.key ? styles.tabActive : styles.tabInactive}>
                  {t.label}
                  {t.count != null && <span className={styles.tabCount}>{t.count}</span>}
                </button>
              ))}
            </div>

            {/* === Overview === */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {projet.probleme && (
                  <div className={styles.overviewCard}>
                    <h3 className="font-bold text-gray-900 mb-2">Problème</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{projet.probleme}</p>
                  </div>
                )}
                {projet.solution && (
                  <div className={styles.overviewCard}>
                    <h3 className="font-bold text-gray-900 mb-2">Solution</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{projet.solution}</p>
                  </div>
                )}
                {projet.technologies && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {projet.technologies.split(',').filter(Boolean).map(t => (
                        <span key={t.trim()} className={styles.techTag}>{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                )}
                {projet.competencesRecherchees?.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Compétences recherchées</h3>
                    <div className="flex flex-wrap gap-2">
                      {projet.competencesRecherchees.map(c => (
                        <span key={c.competenceId}
                          className={`${styles.skillPill} ${c.obligatoire ? styles.skillRequired : styles.skillOptional}`}>
                          {c.nom}
                          {c.obligatoire && ' *'}
                          {c.niveauRequis && ` (${NIVEAU_LABELS[c.niveauRequis] || c.niveauRequis})`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {projet.rolesRecherches && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">Rôles recherchés</h3>
                    <p className="text-gray-600 text-sm">{projet.rolesRecherches}</p>
                  </div>
                )}
                {projet.conditionsEngagement && (
                  <div className={styles.overviewCard}>
                    <h3 className="font-bold text-gray-900 mb-2">Conditions d'engagement</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{projet.conditionsEngagement}</p>
                  </div>
                )}
              </div>
            )}

            {listError && (
              <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                <span>{listError}</span>
                <button
                  onClick={() => {
                    setListError('')
                    if (activeTab === 'requests') loadDemandes()
                    if (activeTab === 'discussions') loadDiscussionsLast()
                    if (activeTab === 'departs') loadDeparts()
                  }}
                  className="font-semibold underline"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* === Members === */}
            {activeTab === 'members' && (
              <div className="space-y-3">
                {(projet.membres || []).map(m => (
                  <div key={m.utilisateurId} className={styles.memberItem}>
                    <div className="flex items-center gap-3">
                      <div className={styles.memberAvatar}>
                        {(m.prenom?.[0] || '') + (m.nom?.[0] || '')}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{m.prenom} {m.nom}</p>
                        <p className="text-gray-400 text-xs">
                          {ROLE_LABELS[m.roleMembre] || m.roleMembre}
                          {m.pays && ` · ${m.pays}`}
                          {m.dateAdhesion && ` · ${new Date(m.dateAdhesion).toLocaleDateString('fr-FR')}`}
                        </p>
                      </div>
                    </div>
                    {projet.estCreateur && m.roleMembre !== 'CREATEUR' && (
                      <button onClick={() => setShowMotifModal(m)} className={styles.btnDanger}>
                        <UserMinus size={14} /> Retirer
                      </button>
                    )}
                    {!projet.estCreateur && projet.estMembre && m.utilisateurId === currentUser?.id && (
                      <button onClick={() => setShowMotifModal(m)} className={styles.btnDanger}>
                        <UserMinus size={14} /> Quitter
                      </button>
                    )}
                  </div>
                ))}
                {(!projet.membres || projet.membres.length === 0) && (
                  <p className="text-gray-400 text-sm text-center py-8">Aucun membre.</p>
                )}
              </div>
            )}

            {/* === Requests (Creator) === */}
            {activeTab === 'requests' && projet.estCreateur && (
              <div>
                {demandesLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
                ) : demandes.length > 0 ? (
                  <div className="space-y-3">
                    {demandes.map(d => {
                      const groups = groupCompetences(d.competences)
                      return (
                        <div key={d.id} className={styles.requestItem}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className={styles.requestAvatar}>
                                {d.demandeur?.prenom?.[0] || '?'}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">
                                  {d.demandeur?.pseudo || `${d.demandeur?.prenom} ${d.demandeur?.nom}`}
                                </p>
                                <p className="text-gray-400 text-xs">
                                  {d.demandeur?.pays}
                                  {d.dateDemande && ` · ${new Date(d.dateDemande).toLocaleDateString('fr-FR')}`}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => handleDecision(d.id, 'ACCEPTEE')} className={styles.acceptButton}>
                                <CheckCircle size={14} /> Accepter
                              </button>
                              <button onClick={() => handleDecision(d.id, 'REFUSEE')} className={styles.refuseButton}>
                                <XCircle size={14} /> Refuser
                              </button>
                            </div>
                          </div>
                          {d.message && <p className="text-gray-600 text-sm mt-1 pl-12">{d.message}</p>}
                          {Object.keys(groups).length > 0 && (
                            <div className="mt-3 pl-12">
                              {Object.entries(groups).map(([type, comps]) => (
                                <div key={type} className={styles.competenceGroup}>
                                  <p className={styles.competenceGroupTitle}>{TYPE_LABELS[type] || type}</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {comps.map(c => (
                                      <span key={c.nom} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                        {c.nom} {c.niveau && `(${NIVEAU_LABELS[c.niveau] || c.niveau})`}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-8">Aucune demande en attente.</p>
                )}
              </div>
            )}

            {/* === Discussions === */}
            {activeTab === 'discussions' && isMembre && (
              <div>
                <div className="flex justify-end mb-3">
                  <button onClick={loadDiscussionsLast} className="text-primary text-xs font-semibold flex items-center gap-1">
                    <RefreshCw size={12} /> Actualiser
                  </button>
                </div>
                <div className={styles.discussionContainer}>
                  <div className={styles.discussionScroll}>
                    {discussionPage != null && discussionPage > 0 && (
                      <div className="text-center mb-4">
                        <button onClick={loadPreviousMessages} disabled={discussionsLoading}
                          className="text-primary text-xs font-semibold hover:underline">
                          Messages précédents
                        </button>
                      </div>
                    )}
                    {discussionsLoading && discussions.length === 0 ? (
                      <div className="flex justify-center py-8"><Loader2 size={24} className="animate-spin text-primary" /></div>
                    ) : discussions.length > 0 ? (
                      discussions.map(d => {
                        const isMe = d.auteur?.id === currentUser?.id
                        return (
                          <div key={d.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={isMe ? styles.discussionBubbleMe : styles.discussionBubbleOther}>
                              {!isMe && <p className="text-xs font-semibold mb-1 opacity-70">{d.auteur?.pseudo || d.auteur?.prenom}</p>}
                              <p className="text-sm">{d.contenu}</p>
                              <p className={isMe ? styles.discussionTimestampMe : styles.discussionTimestampOther}>
                                {d.dateCreation ? new Date(d.dateCreation).toLocaleString('fr-FR') : ''}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-8">Aucun message. Lancez la conversation !</p>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className={styles.messageInputForm}>
                    <div className="flex-1 relative">
                      <input
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value.slice(0, 1000))}
                        placeholder="Écrire un message..."
                        className={styles.messageInput}
                      />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                        {newMessage.length}/1000
                      </span>
                    </div>
                    <button type="submit" disabled={sendingMessage || !newMessage.trim()} className={styles.sendButton}>
                      {sendingMessage ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* === Departures (Creator) === */}
            {activeTab === 'departs' && projet.estCreateur && (
              <div>
                {departsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-primary" /></div>
                ) : departs.length > 0 ? (
                  <div className="space-y-3">
                    {departs.map((d, i) => (
                      <div key={i} className={styles.departItem}>
                        <p className="font-semibold text-gray-900 text-sm">
                          {d.prenom} {d.nom}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">Motif : {d.motif || '—'}</p>
                        <p className="text-gray-400 text-xs mt-1">
                          {d.dateDepart && new Date(d.dateDepart).toLocaleDateString('fr-FR')}
                          {' · '}
                          {d.retireParCreateur ? 'Retiré par le créateur' : 'Parti de lui-même'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-8">Aucun départ enregistré.</p>
                )}
              </div>
            )}
          </div>

          {/* ---- Right Sidebar ---- */}
          <div className={styles.sidebar}>
            {/* Status Change (Creator) */}
            {projet.estCreateur && (
              <div className={styles.statusCard}>
                <h3 className="font-bold text-gray-900 mb-3">Statut du projet</h3>
                <div className="space-y-2">
                  {ALL_STATUTS.map(s => (
                    <button key={s} onClick={() => handleChangeStatut(s)}
                      disabled={changingStatut || projet.statut === s}
                      className={projet.statut === s ? styles.statusButtonActive : styles.statusButtonInactive}>
                      {STATUT_LABELS[s]}
                      {projet.statut === s && ' ✓'}
                    </button>
                  ))}
                </div>
                {changingStatut && (
                  <div className="flex items-center gap-2 mt-2 text-primary text-xs">
                    <Loader2 size={12} className="animate-spin" /> Mise à jour...
                  </div>
                )}
              </div>
            )}

            {/* Team */}
            <div className={styles.teamCard}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Équipe</h3>
                <span className="text-xs text-gray-400 font-medium">
                  {projet.membres?.length || 0} membre{(projet.membres?.length || 0) > 1 ? 's' : ''}
                </span>
              </div>
              {projet.membres?.map(m => (
                <div key={m.utilisateurId} className="flex items-center gap-3 mb-3">
                  <div className={styles.teamMemberAvatar}>
                    {(m.prenom?.[0] || '') + (m.nom?.[0] || '')}
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-semibold">{m.prenom} {m.nom?.[0]}.</p>
                    <p className="text-gray-400 text-xs">{ROLE_LABELS[m.roleMembre] || m.roleMembre}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className={styles.statCard}>
                <span className="text-xl font-bold text-primary block">{projet.membres?.length || 0}</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Membres</span>
              </div>
              <div className={styles.statCard}>
                <span className="text-xl font-bold text-primary block">{projet.placesRestantes ?? 0}</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Places restantes</span>
              </div>
            </div>

            {/* Roles */}
            {projet.rolesRecherches && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-3">Rôles recherchés</h3>
                <div className="space-y-2">
                  {projet.rolesRecherches.split(',').filter(Boolean).map((role, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <span className="text-sm font-medium text-gray-900">{role.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* === Join Modal === */}
      {showJoinModal && (
        <div className={styles.overlay} onClick={() => setShowJoinModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={styles.modalTitle}>Demander à rejoindre</h2>
              <button onClick={() => setShowJoinModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {joinSuccess ? (
              <div className="flex items-center gap-2 text-green text-sm font-medium py-4">
                <CheckCircle size={20} /> Demande envoyée avec succès !
              </div>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Conditions d'engagement</h4>
                  <p className="text-sm text-gray-600">
                    {projet.conditionsEngagement || 'Le créateur n\'a pas précisé de conditions particulières.'}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message (facultatif)
                  </label>
                  <textarea
                    value={joinMessage}
                    onChange={e => setJoinMessage(e.target.value.slice(0, 500))}
                    placeholder="Présentez-vous et expliquez votre motivation..."
                    rows={3}
                    className={`${styles.input} resize-none`}
                  />
                  <span className="text-xs text-gray-400">{joinMessage.length}/500</span>
                </div>

                <label className="flex items-start gap-2 mb-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={engagementAccepte}
                    onChange={e => setEngagementAccepte(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    Je m'engage à contribuer à ce projet jusqu'à sa fin.
                  </span>
                </label>

                {joinError && (
                  <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{joinError}</div>
                )}

                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowJoinModal(false)} className={styles.btnSecondary}>Annuler</button>
                  <button
                    onClick={handleJoin}
                    disabled={joining || !engagementAccepte}
                    className={styles.btnPrimary}
                  >
                    {joining ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Envoyer la demande
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* === Motif Modal (Remove/Quit) === */}
      {showMotifModal && (
        <div className={styles.overlay} onClick={() => setShowMotifModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={styles.modalTitle}>
                {showMotifModal.utilisateurId === currentUser?.id ? 'Quitter le projet' : 'Retirer un membre'}
              </h2>
              <button onClick={() => setShowMotifModal(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {showMotifModal.utilisateurId === currentUser?.id
                ? 'Êtes-vous sûr de vouloir quitter ce projet ?'
                : `Retirer ${showMotifModal.prenom} ${showMotifModal.nom} du projet ?`}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif (obligatoire)
              </label>
              <textarea
                value={motif}
                onChange={e => setMotif(e.target.value.slice(0, 500))}
                placeholder="Expliquez la raison..."
                rows={3}
                className={`${styles.input} resize-none`}
              />
              <span className="text-xs text-gray-400">{motif.length}/500</span>
            </div>

            {removeError && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{removeError}</div>
            )}

            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowMotifModal(null)} className={styles.btnSecondary}>Annuler</button>
              <button
                onClick={handleRemoveMembre}
                disabled={removing || motif.trim().length < 1}
                className={styles.btnDanger}
              >
                {removing ? <Loader2 size={16} className="animate-spin" /> : <UserMinus size={16} />}
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === Edit Modal === */}
      {editing && (
        <div className={styles.overlay} onClick={() => setEditing(false)}>
          <div className={`${styles.modal} max-w-2xl`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={styles.modalTitle}>Modifier le projet</h2>
              <button onClick={() => setEditing(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className={styles.editLabel}>Nom du projet</label>
                <input value={editForm.nom} onChange={e => setEditForm(f => ({ ...f, nom: e.target.value }))}
                  className={styles.input} />
              </div>
              <div>
                <label className={styles.editLabel}>Description</label>
                <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className={`${styles.input} resize-none`} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={styles.editLabel}>Quel problème résout-il ?</label>
                  <textarea value={editForm.probleme} onChange={e => setEditForm(f => ({ ...f, probleme: e.target.value }))}
                    rows={2} className={`${styles.input} resize-none`} />
                </div>
                <div>
                  <label className={styles.editLabel}>Quelle solution proposez-vous ?</label>
                  <textarea value={editForm.solution} onChange={e => setEditForm(f => ({ ...f, solution: e.target.value }))}
                    rows={2} className={`${styles.input} resize-none`} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={styles.editLabel}>Technologies</label>
                  <input value={editForm.technologies} onChange={e => setEditForm(f => ({ ...f, technologies: e.target.value }))}
                    placeholder="React, Spring Boot, ..." className={styles.input} />
                </div>
                <div>
                  <label className={styles.editLabel}>Catégorie</label>
                  <input value={editForm.categorie} onChange={e => setEditForm(f => ({ ...f, categorie: e.target.value }))}
                    className={styles.input} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={styles.editLabel}>Rôles recherchés</label>
                  <input value={editForm.rolesRecherches} onChange={e => setEditForm(f => ({ ...f, rolesRecherches: e.target.value }))}
                    className={styles.input} />
                </div>
                <div>
                  <label className={styles.editLabel}>Places recherchées (sans vous)</label>
                  <input type="number" min={1} max={20} value={editForm.nombrePlacesRecherchees}
                    onChange={e => setEditForm(f => ({ ...f, nombrePlacesRecherchees: parseInt(e.target.value) || 1 }))}
                    className={styles.input} />
                </div>
              </div>
              <div>
                <label className={styles.editLabel}>Conditions d'engagement</label>
                <textarea value={editForm.conditionsEngagement}
                  onChange={e => setEditForm(f => ({ ...f, conditionsEngagement: e.target.value }))}
                  rows={2} placeholder="Disponibilité attendue, durée..." className={`${styles.input} resize-none`} />
              </div>
              <div>
                <label className={styles.editLabel}>Avancement</label>
                <select value={editForm.statut} onChange={e => setEditForm(f => ({ ...f, statut: e.target.value }))}
                  className={styles.input}>
                  {ALL_STATUTS.map(s => <option key={s} value={s}>{STATUT_LABELS[s]}</option>)}
                </select>
              </div>
              {catalogue.length > 0 && (
                <div>
                  <label className={styles.editLabel}>Compétences recherchées ({editForm.competencesRecherchees?.length || 0}/15)</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {catalogue.map(c => {
                      const sel = editForm.competencesRecherchees?.some(s => s.competenceId === c.id)
                      return (
                        <button key={c.id} type="button" onClick={() => {
                          if (sel) {
                            setEditForm(f => ({ ...f, competencesRecherchees: f.competencesRecherchees.filter(s => s.competenceId !== c.id) }))
                          } else if ((editForm.competencesRecherchees?.length || 0) < 15) {
                            setEditForm(f => ({
                              ...f,
                              competencesRecherchees: [...(f.competencesRecherchees || []), { competenceId: c.id, obligatoire: false, niveauRequis: 'DEBUTANT' }],
                            }))
                          }
                        }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition ${sel ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-primary'}`}>
                          {c.nom}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {saveError && <p className="text-red-500 text-sm mt-3">{saveError}</p>}
            <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
              <button onClick={() => setEditing(false)} className={styles.btnSecondary}>Annuler</button>
              <button onClick={handleSaveEdit} disabled={saving} className={styles.btnPrimary}>
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {saving ? 'Sauvegarde...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
