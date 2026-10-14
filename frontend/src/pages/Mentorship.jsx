import { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
  GraduationCap,
  Loader2,
  MapPin,
  MessageSquare,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  User,
  UserCheck,
  Users,
  X,
  XCircle,
} from 'lucide-react'
import { mentorsApi, mentoratsApi, developpeursApi, getStoredUser } from '../api'
import { STATUT_MENTORAT, ROLE_MENTORAT, STATUT_SEANCE, NIVEAU } from '../lib/libelles'

function displayName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

function avatarLetters(person) {
  return `${person?.prenom?.[0] || ''}${person?.nom?.[0] || ''}`.toUpperCase() || 'M'
}

function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return Number.isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d)
}

function formatDateShort(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return Number.isNaN(d.getTime())
    ? ''
    : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(d)
}

export default function Mentorship() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'explorer'

  const setTab = (newTab) => {
    setSearchParams({ tab: newTab })
  }

  // --- TAB 1: EXPLORER LES MENTORS ---
  const [mentors, setMentors] = useState([])
  const [loadingMentors, setLoadingMentors] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterLevel, setFilterLevel] = useState('')
  const [filterCountry, setFilterCountry] = useState('')
  const [isFallbackMode, setIsFallbackMode] = useState(false)

  // --- TAB 2: MES MENTORATS ---
  const [mesMentorats, setMesMentorats] = useState({ commeMentor: [], commeMentore: [] })
  const [loadingMesMentorats, setLoadingMesMentorats] = useState(false)
  const [mesMentoratsSubTab, setMesMentoratsSubTab] = useState('mentor') // 'mentor' | 'mentore'
  const [expandedMentoratId, setExpandedMentoratId] = useState(null)
  const [mentoratDetails, setMentoratDetails] = useState({}) // { [id]: MentoratDetailDto }
  const [loadingDetailId, setLoadingDetailId] = useState(null)

  // --- TAB 3: MON PROFIL MENTOR ---
  const [monProfil, setMonProfil] = useState(null)
  const [loadingProfil, setLoadingProfil] = useState(false)
  const [profilForm, setProfilForm] = useState({
    presentation: '',
    nombreMentoresMax: 3,
    actif: true,
  })
  const [savingProfil, setSavingProfil] = useState(false)

  // --- MODALS ---
  const [requestModalMentor, setRequestModalMentor] = useState(null)
  const [requestForm, setRequestForm] = useState({ sujet: '', message: '' })
  const [sendingRequest, setSendingRequest] = useState(false)

  const [seanceModalMentoratId, setSeanceModalMentoratId] = useState(null)
  const [seanceForm, setSeanceForm] = useState({
    date: '',
    dureeMinutes: 60,
    sujet: '',
  })
  const [savingSeance, setSavingSeance] = useState(false)

  const [compteRenduModal, setCompteRenduModal] = useState(null) // { mentoratId, seanceId, sujet }
  const [compteRenduText, setCompteRenduText] = useState('')
  const [savingCompteRendu, setSavingCompteRendu] = useState(false)

  const [bilanModal, setBilanModal] = useState(null) // { mentoratId, mode: 'terminer' | 'bilan' }
  const [bilanText, setBilanText] = useState('')
  const [savingBilan, setSavingBilan] = useState(false)

  // Feedback alerts
  const [alert, setAlert] = useState(null) // { type: 'success' | 'error', message: string }

  const currentUser = getStoredUser()

  // Load mentors for Explorer tab
  const fetchMentors = () => {
    setLoadingMentors(true)
    mentorsApi
      .rechercher({
        texte: searchQuery,
        pays: filterCountry,
        niveau: filterLevel || undefined,
        page: 0,
        taille: 20,
      })
      .then((res) => {
        const list = Array.isArray(res) ? res : res?.contenu || []
        if (list.length > 0) {
          setMentors(list)
          setIsFallbackMode(false)
        } else if (!searchQuery && !filterCountry && !filterLevel) {
          // If no dedicated mentors registered yet, fallback to developers who can teach
          return developpeursApi.rechercher({ type: 'ENSEIGNER', page: 0, taille: 20 }).then((devRes) => {
            const devList = Array.isArray(devRes) ? devRes : devRes?.contenu || []
            setMentors(
              devList.map((d) => ({
                developpeur: d,
                presentation: d.bio || 'Prêt à accompagner la nouvelle génération de développeurs.',
                nombreMentoresMax: 3,
                placesRestantes: 3,
              }))
            )
            setIsFallbackMode(true)
          })
        } else {
          setMentors([])
          setIsFallbackMode(false)
        }
      })
      .catch((err) => {
        console.error('Erreur chargement mentors', err)
        setMentors([])
      })
      .finally(() => setLoadingMentors(false))
  }

  // Load Mes Mentorats
  const fetchMesMentorats = () => {
    setLoadingMesMentorats(true)
    mentoratsApi
      .mesMentorats()
      .then((res) => {
        setMesMentorats(res || { commeMentor: [], commeMentore: [] })
      })
      .catch((err) => {
        console.error('Erreur chargement mes mentorats', err)
      })
      .finally(() => setLoadingMesMentorats(false))
  }

  // Load Mon Profil Mentor
  const fetchMonProfil = () => {
    setLoadingProfil(true)
    mentorsApi
      .monProfil()
      .then((res) => {
        if (res) {
          setMonProfil(res)
          setProfilForm({
            presentation: res.presentation || '',
            nombreMentoresMax: res.nombreMentoresMax || 3,
            actif: res.actif !== undefined ? res.actif : true,
          })
        }
      })
      .catch((err) => {
        console.error('Erreur chargement profil mentor', err)
      })
      .finally(() => setLoadingProfil(false))
  }

  useEffect(() => {
    fetchMentors()
  }, [searchQuery, filterLevel, filterCountry])

  useEffect(() => {
    if (activeTab === 'mes-mentorats') {
      fetchMesMentorats()
    } else if (activeTab === 'mon-profil') {
      fetchMonProfil()
    }
  }, [activeTab])

  // Automatically dismiss alerts
  useEffect(() => {
    if (alert) {
      const t = setTimeout(() => setAlert(null), 6000)
      return () => clearTimeout(t)
    }
  }, [alert])

  // Count pending requests as mentor
  const pendingRequestsCount = useMemo(() => {
    return (mesMentorats.commeMentor || []).filter((m) => m.statut === 'EN_ATTENTE').length
  }, [mesMentorats.commeMentor])

  // Load mentorat details on expand
  const handleToggleExpand = async (id) => {
    if (expandedMentoratId === id) {
      setExpandedMentoratId(null)
      return
    }
    setExpandedMentoratId(id)
    if (!mentoratDetails[id]) {
      setLoadingDetailId(id)
      try {
        const detail = await mentoratsApi.detail(id)
        setMentoratDetails((prev) => ({ ...prev, [id]: detail }))
      } catch (err) {
        setAlert({ type: 'error', message: err.message || 'Impossible de charger les détails.' })
      } finally {
        setLoadingDetailId(null)
      }
    }
  }

  // Submit Demande de mentorat
  const handleSubmitDemande = async (e) => {
    e.preventDefault()
    if (!requestModalMentor) return
    setSendingRequest(true)
    try {
      await mentoratsApi.demander({
        mentorId: requestModalMentor.developpeur?.utilisateurId,
        sujet: requestForm.sujet.trim(),
        message: requestForm.message.trim(),
      })
      setAlert({
        type: 'success',
        message: `Votre demande de mentorat a été envoyée avec succès à ${displayName(requestModalMentor.developpeur)} !`,
      })
      setRequestModalMentor(null)
      setRequestForm({ sujet: '', message: '' })
      setTab('mes-mentorats')
      setMesMentoratsSubTab('mentore')
    } catch (err) {
      setAlert({
        type: 'error',
        message: err.message || "Erreur lors de l'envoi de la demande de mentorat.",
      })
    } finally {
      setSendingRequest(false)
    }
  }

  // Mentor decides request
  const handleDecideDemande = async (id, decision) => {
    try {
      await mentoratsApi.decider(id, decision)
      setAlert({
        type: 'success',
        message: decision === 'ACCEPTE' ? 'Demande acceptée ! Le mentorat est actif.' : 'Demande déclinée.',
      })
      fetchMesMentorats()
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Erreur lors de la réponse à la demande.' })
    }
  }

  // Schedule a session
  const handleSubmitSeance = async (e) => {
    e.preventDefault()
    if (!seanceModalMentoratId) return
    setSavingSeance(true)
    try {
      // Backend expects LocalDateTime format: YYYY-MM-DDTHH:mm:ss
      let dateIso = seanceForm.date
      if (dateIso.length === 16) dateIso += ':00'

      await mentoratsApi.planifierSeance(seanceModalMentoratId, {
        date: dateIso,
        dureeMinutes: parseInt(seanceForm.dureeMinutes, 10),
        sujet: seanceForm.sujet.trim() || undefined,
      })

      setAlert({ type: 'success', message: 'Séance de mentorat planifiée avec succès !' })
      setSeanceModalMentoratId(null)
      setSeanceForm({ date: '', dureeMinutes: 60, sujet: '' })

      // Refresh detail
      const refreshed = await mentoratsApi.detail(seanceModalMentoratId)
      setMentoratDetails((prev) => ({ ...prev, [seanceModalMentoratId]: refreshed }))
      fetchMesMentorats()
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Erreur lors de la planification de la séance.' })
    } finally {
      setSavingSeance(false)
    }
  }

  // Submit session compte-rendu
  const handleSubmitCompteRendu = async (e) => {
    e.preventDefault()
    if (!compteRenduModal) return
    setSavingCompteRendu(true)
    try {
      await mentoratsApi.compteRenduSeance(compteRenduModal.mentoratId, compteRenduModal.seanceId, {
        compteRendu: compteRenduText.trim(),
      })
      setAlert({
        type: 'success',
        message: 'Compte-rendu enregistré ! La séance est validée.',
      })
      setCompteRenduModal(null)
      setCompteRenduText('')

      const refreshed = await mentoratsApi.detail(compteRenduModal.mentoratId)
      setMentoratDetails((prev) => ({ ...prev, [compteRenduModal.mentoratId]: refreshed }))
      fetchMesMentorats()
    } catch (err) {
      setAlert({ type: 'error', message: err.message || "Erreur lors de l'enregistrement du compte-rendu." })
    } finally {
      setSavingCompteRendu(false)
    }
  }

  // Terminer ou soumettre bilan
  const handleSubmitBilan = async (e) => {
    e.preventDefault()
    if (!bilanModal) return
    setSavingBilan(true)
    try {
      if (bilanModal.mode === 'terminer') {
        await mentoratsApi.terminer(bilanModal.mentoratId, { bilan: bilanText.trim() || undefined })
        setAlert({ type: 'success', message: 'Mentorat clôturé avec succès.' })
      } else {
        await mentoratsApi.bilan(bilanModal.mentoratId, { bilan: bilanText.trim() })
        setAlert({ type: 'success', message: 'Bilan enregistré avec succès !' })
      }
      setBilanModal(null)
      setBilanText('')

      const refreshed = await mentoratsApi.detail(bilanModal.mentoratId)
      setMentoratDetails((prev) => ({ ...prev, [bilanModal.mentoratId]: refreshed }))
      fetchMesMentorats()
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Erreur lors de la validation du bilan.' })
    } finally {
      setSavingBilan(false)
    }
  }

  // Save Profil Mentor
  const handleSaveProfil = async (e) => {
    e.preventDefault()
    setSavingProfil(true)
    try {
      const res = await mentorsApi.enregistrerProfil({
        presentation: profilForm.presentation.trim(),
        nombreMentoresMax: parseInt(profilForm.nombreMentoresMax, 10),
        actif: profilForm.actif,
      })
      setMonProfil(res)
      setAlert({ type: 'success', message: 'Votre profil mentor a été mis à jour avec succès !' })
    } catch (err) {
      setAlert({
        type: 'error',
        message:
          err.message ||
          "Erreur lors de l'enregistrement. Vérifiez que vous avez renseigné des compétences « Je peux enseigner » sur votre profil.",
      })
    } finally {
      setSavingProfil(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto text-white pb-16">
      {/* Toast Alert */}
      {alert && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-2xl border backdrop-blur-xl animate-in slide-in-from-bottom-5 max-w-md ${
            alert.type === 'success'
              ? 'bg-[#121E19]/95 border-[#C9F06A]/40 text-emerald-300'
              : 'bg-[#261316]/95 border-red-500/40 text-red-300'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 size={20} className="text-[#C9F06A] shrink-0" />
          ) : (
            <XCircle size={20} className="text-red-400 shrink-0" />
          )}
          <p className="text-sm font-medium">{alert.message}</p>
          <button
            onClick={() => setAlert(null)}
            className="ml-auto text-white/50 hover:text-white transition p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hero Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9F06A] mb-2 font-mono">
              // PROGRAMME D'ACCOMPAGNEMENT 54DEVS
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Mentorat & Transmission Tech
            </h1>
            <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl font-body">
              Connectez-vous directement aux développeurs chevronnés d'Afrique, planifiez des séances 1:1, réalisez des revues de code et accélérez votre carrière.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTab('mon-profil')}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#C9F06A]/40 bg-[#C9F06A]/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#C9F06A] hover:bg-[#C9F06A]/20 transition shadow-lg shadow-[#C9F06A]/10"
            >
              <GraduationCap size={16} />
              <span>{monProfil?.estMentor ? 'Gérer mon statut mentor' : 'Devenir mentor'}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 border-b border-white/10 pb-px">
          <button
            onClick={() => setTab('explorer')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all relative ${
              activeTab === 'explorer'
                ? 'text-[#C9F06A]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Users size={16} />
            <span>Explorer les mentors</span>
            {activeTab === 'explorer' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9F06A]" />
            )}
          </button>

          <button
            onClick={() => setTab('mes-mentorats')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all relative ${
              activeTab === 'mes-mentorats'
                ? 'text-[#C9F06A]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Calendar size={16} />
            <span>Mes mentorats</span>
            {pendingRequestsCount > 0 && (
              <span className="ml-1 rounded-full bg-[#C9F06A] text-black px-2 py-0.2 text-[10px] font-black">
                {pendingRequestsCount}
              </span>
            )}
            {activeTab === 'mes-mentorats' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9F06A]" />
            )}
          </button>

          <button
            onClick={() => setTab('mon-profil')}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-bold transition-all relative ${
              activeTab === 'mon-profil'
                ? 'text-[#C9F06A]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Award size={16} />
            <span>Mon profil mentor</span>
            {monProfil?.actif && (
              <span className="h-2 w-2 rounded-full bg-[#C9F06A] animate-pulse" />
            )}
            {activeTab === 'mon-profil' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9F06A]" />
            )}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* TAB 1: EXPLORER LES MENTORS */}
      {/* ========================================================================= */}
      {activeTab === 'explorer' && (
        <div>
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-8 bg-[#16221C]/80 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, compétence, techno ou mot-clé..."
                className="w-full rounded-2xl bg-white/5 border border-white/10 pl-11 pr-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none focus:ring-1 focus:ring-[#C9F06A] transition"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="rounded-2xl bg-[#18251E] border border-white/10 px-4 py-2.5 text-xs text-white/90 focus:border-[#C9F06A] focus:outline-none appearance-none pr-8 cursor-pointer"
                >
                  <option value="">Tous les niveaux</option>
                  <option value="DEBUTANT">Junior / Débutant</option>
                  <option value="INTERMEDIAIRE">Intermédiaire</option>
                  <option value="AVANCE">Avancé / Expert</option>
                </select>
                <Filter
                  size={12}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                />
              </div>

              <input
                type="text"
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                placeholder="Pays (ex: Sénégal, Côte d'Ivoire...)"
                className="rounded-2xl bg-[#18251E] border border-white/10 px-4 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none w-44"
              />

              <button
                onClick={fetchMentors}
                className="p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#C9F06A]/40 text-white/70 hover:text-[#C9F06A] transition shrink-0"
                title="Actualiser la liste"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Fallback Notice */}
          {isFallbackMode && (
            <div className="mb-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center justify-between">
              <span>
                💡 Les développeurs ci-dessous ont déclaré des compétences à transmettre (« Je peux enseigner »). Devenez le premier à activer votre profil de mentor officiel !
              </span>
              <button
                onClick={() => setTab('mon-profil')}
                className="underline font-bold hover:text-white shrink-0 ml-3"
              >
                Activer mon profil
              </button>
            </div>
          )}

          {/* Mentors Grid */}
          {loadingMentors ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[#C9F06A] mb-4" />
              <p className="text-xs text-white/50 uppercase tracking-widest font-mono">
                Chargement des mentors depuis la base...
              </p>
            </div>
          ) : mentors.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#C9F06A]/30 bg-[#16221C]/90 p-12 text-center backdrop-blur-xl">
              <Sparkles className="mx-auto text-[#C9F06A] mb-3" size={32} />
              <p className="font-bold text-white text-lg font-display">
                Aucun mentor ne correspond à vos filtres
              </p>
              <p className="text-sm text-white/60 mt-2 max-w-md mx-auto">
                Essayez d'élargir votre recherche ou soyez le premier à proposer votre accompagnement technique.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setFilterLevel('')
                    setFilterCountry('')
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs text-white hover:bg-white/10 transition"
                >
                  <RefreshCw size={14} />
                  <span>Réinitialiser les filtres</span>
                </button>
                <button
                  onClick={() => setTab('mon-profil')}
                  className="inline-flex items-center gap-2 rounded-full bg-[#C9F06A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:bg-[#D8F87C] transition"
                >
                  <GraduationCap size={15} />
                  <span>Devenir mentor</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mentors.map((item) => {
                const dev = item.developpeur || item
                const isSelf = currentUser && dev?.utilisateurId === currentUser?.id
                const placesRestantes = item.placesRestantes ?? 3
                const isFull = placesRestantes <= 0

                return (
                  <div
                    key={dev.utilisateurId}
                    className="flex flex-col justify-between rounded-3xl border border-white/10 bg-[#16221C]/90 p-6 hover:border-[#C9F06A]/40 hover:bg-[#18251E] transition-all duration-300 backdrop-blur-md group shadow-xl"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <Link
                          to={`/developers/${dev.utilisateurId}`}
                          className="flex items-center gap-3 group-hover:opacity-90"
                        >
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9F06A] to-emerald-600 text-black font-black flex items-center justify-center text-sm ring-2 ring-[#C9F06A]/30 shrink-0">
                            {avatarLetters(dev)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-white text-base font-display truncate group-hover:text-[#C9F06A] transition">
                              {displayName(dev)}
                            </h3>
                            <p className="text-xs text-white/50 truncate flex items-center gap-1 mt-0.5">
                              {dev.pays && <MapPin size={11} className="text-[#C9F06A]" />}
                              {dev.pays ? `${dev.pays}${dev.ville ? ` · ${dev.ville}` : ''}` : dev.titre || 'Développeur 54Devs'}
                            </p>
                          </div>
                        </Link>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                            isFull
                              ? 'bg-red-500/10 border-red-500/25 text-red-400'
                              : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                          }`}
                        >
                          {isFull ? 'Complet' : `${placesRestantes} place${placesRestantes > 1 ? 's' : ''}`}
                        </span>
                      </div>

                      {/* Bio / Presentation */}
                      <p className="text-xs sm:text-sm text-white/70 line-clamp-3 mb-4 leading-relaxed font-body">
                        {item.presentation || dev.bio || 'Disponible pour accompagner des développeurs sur leurs projets et compétences.'}
                      </p>

                      {/* Competences à enseigner */}
                      {(dev.competencesAEnseigner || []).length > 0 && (
                        <div className="mb-4">
                          <p className="text-[10px] font-mono font-bold text-white/40 uppercase mb-1.5">
                            Transmet :
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {dev.competencesAEnseigner.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-lg bg-white/5 border border-white/10 text-white/80 px-2 py-0.5 text-[10px] font-mono"
                              >
                                {skill}
                              </span>
                            ))}
                            {dev.competencesAEnseigner.length > 4 && (
                              <span className="text-[10px] text-white/40 self-center">
                                +{dev.competencesAEnseigner.length - 4}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-white/10 flex items-center gap-2 mt-2">
                      <Link
                        to={`/developers/${dev.utilisateurId}`}
                        className="flex-1 text-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 text-xs font-semibold text-white transition"
                      >
                        Profil
                      </Link>

                      {isSelf ? (
                        <span className="flex-1 text-center py-2.5 text-xs text-white/40 font-mono italic">
                          (C'est vous)
                        </span>
                      ) : (
                        <button
                          disabled={isFull}
                          onClick={() => {
                            setRequestModalMentor(item)
                            setRequestForm({
                              sujet: '',
                              message: '',
                            })
                          }}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition shadow-md ${
                            isFull
                              ? 'bg-white/10 text-white/30 cursor-not-allowed'
                              : 'bg-[#C9F06A] text-black hover:bg-[#D8F87C] shadow-[#C9F06A]/20'
                          }`}
                        >
                          <Send size={13} />
                          <span>Solliciter</span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MES MENTORATS */}
      {/* ========================================================================= */}
      {activeTab === 'mes-mentorats' && (
        <div>
          {/* Subtabs: Comme Mentor vs Comme Mentoré */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => setMesMentoratsSubTab('mentor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                mesMentoratsSubTab === 'mentor'
                  ? 'bg-[#C9F06A] text-black shadow-lg shadow-[#C9F06A]/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <GraduationCap size={15} />
              <span>En tant que Mentor ({mesMentorats.commeMentor?.length || 0})</span>
              {pendingRequestsCount > 0 && (
                <span className="ml-1 rounded-full bg-red-500 text-white px-2 py-0.2 text-[9px] font-black">
                  {pendingRequestsCount} à traiter
                </span>
              )}
            </button>

            <button
              onClick={() => setMesMentoratsSubTab('mentore')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                mesMentoratsSubTab === 'mentore'
                  ? 'bg-[#C9F06A] text-black shadow-lg shadow-[#C9F06A]/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
            >
              <UserCheck size={15} />
              <span>En tant que Mentoré ({mesMentorats.commeMentore?.length || 0})</span>
            </button>
          </div>

          {loadingMesMentorats ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[#C9F06A] mb-4" />
              <p className="text-xs text-white/50 uppercase tracking-widest font-mono">
                Chargement de vos mentorats...
              </p>
            </div>
          ) : mesMentoratsSubTab === 'mentor' ? (
            /* --- EN TANT QUE MENTOR --- */
            <div className="space-y-6">
              {/* Demandes en attente */}
              {pendingRequestsCount > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-amber-400" />
                    <span>Demandes reçues en attente ({pendingRequestsCount})</span>
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {mesMentorats.commeMentor
                      .filter((m) => m.statut === 'EN_ATTENTE')
                      .map((m) => (
                        <div
                          key={m.id}
                          className="rounded-3xl border border-amber-500/30 bg-[#14120F]/90 p-6 backdrop-blur-md shadow-xl"
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                                {avatarLetters(m.mentore)}
                              </div>
                              <div>
                                <h3 className="font-bold text-white text-sm">
                                  {displayName(m.mentore)}
                                </h3>
                                <p className="text-[11px] text-white/40">
                                  Demande reçue le {formatDateShort(m.dateDemande)}
                                </p>
                              </div>
                            </div>
                            <span className="rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 text-[10px] font-bold uppercase">
                              En attente
                            </span>
                          </div>

                          <h4 className="text-sm font-semibold text-white mt-3 font-display">
                            Sujet : {m.sujet || 'Accompagnement général'}
                          </h4>
                          {m.message && (
                            <p className="text-xs text-white/70 mt-1.5 line-clamp-3 bg-white/5 p-3 rounded-xl border border-white/5">
                              « {m.message} »
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10">
                            <button
                              onClick={() => handleDecideDemande(m.id, 'ACCEPTE')}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#C9F06A] text-black py-2.5 text-xs font-bold hover:bg-[#D8F87C] transition"
                            >
                              <CheckCircle2 size={14} />
                              <span>Accepter</span>
                            </button>
                            <button
                              onClick={() => handleDecideDemande(m.id, 'REFUSE')}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-white/70 hover:text-red-300 py-2.5 text-xs font-medium transition"
                            >
                              <XCircle size={14} />
                              <span>Décliner</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Mentorats Actifs & Terminés */}
              <div>
                <h2 className="text-lg font-bold text-white font-display mb-4 flex items-center gap-2">
                  <UserCheck size={18} className="text-[#C9F06A]" />
                  <span>Tous vos accompagnements</span>
                </h2>

                {mesMentorats.commeMentor.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-white/10 bg-[#16221C]/70 p-10 text-center">
                    <p className="text-white/60 text-sm">
                      Vous n'avez pas encore de demande ou d'accompagnement en tant que mentor.
                    </p>
                    <button
                      onClick={() => setTab('mon-profil')}
                      className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#C9F06A] hover:underline"
                    >
                      Configurer vos disponibilités mentor <ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mesMentorats.commeMentor.map((m) => {
                      const isExpanded = expandedMentoratId === m.id
                      const detail = mentoratDetails[m.id]
                      const isEnCours = m.statut === 'ACCEPTE'

                      return (
                        <div
                          key={m.id}
                          className="rounded-3xl border border-white/10 bg-[#16221C]/90 p-5 backdrop-blur-md shadow-xl transition-all"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-2xl bg-[#C9F06A]/20 text-[#C9F06A] font-bold flex items-center justify-center text-sm ring-1 ring-[#C9F06A]/30">
                                {avatarLetters(m.mentore)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-white text-base">
                                    {displayName(m.mentore)}
                                  </h3>
                                  <span
                                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                      m.statut === 'ACCEPTE'
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                        : m.statut === 'TERMINE'
                                        ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                        : m.statut === 'EN_ATTENTE'
                                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                        : 'bg-white/5 text-white/40'
                                    }`}
                                  >
                                    {STATUT_MENTORAT[m.statut] || m.statut}
                                  </span>
                                </div>
                                <p className="text-xs text-white/60 mt-0.5">
                                  Sujet : <strong className="text-white">{m.sujet || 'Mentorat Tech'}</strong> · Débuté le {formatDateShort(m.dateDebut || m.dateDemande)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              {isEnCours && (
                                <button
                                  onClick={() => {
                                    setSeanceModalMentoratId(m.id)
                                    setSeanceForm({
                                      date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                                      dureeMinutes: 60,
                                      sujet: '',
                                    })
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#C9F06A] text-black px-4 py-2 text-xs font-bold hover:bg-[#D8F87C] transition shadow-md shadow-[#C9F06A]/15"
                                >
                                  <Plus size={14} />
                                  <span>Planifier une séance</span>
                                </button>
                              )}

                              {isEnCours && (
                                <button
                                  onClick={() => {
                                    setBilanModal({ mentoratId: m.id, mode: 'terminer' })
                                    setBilanText('')
                                  }}
                                  className="rounded-xl border border-white/10 hover:border-white/20 bg-white/5 px-3 py-2 text-xs text-white/70 hover:text-white transition"
                                >
                                  Clôturer
                                </button>
                              )}

                              <button
                                onClick={() => handleToggleExpand(m.id)}
                                className="inline-flex items-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 text-xs text-white transition"
                              >
                                <span>{isExpanded ? 'Masquer' : 'Séances & Suivi'}</span>
                                {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </button>
                            </div>
                          </div>

                          {/* Expanded Mentorship Drawer */}
                          {isExpanded && (
                            <div className="mt-5 pt-4 border-t border-white/10 animate-in fade-in duration-200">
                              {loadingDetailId === m.id ? (
                                <div className="py-6 text-center text-xs text-white/50 flex items-center justify-center gap-2">
                                  <Loader2 size={16} className="animate-spin text-[#C9F06A]" />
                                  Chargement des séances...
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
                                      Historique des séances ({detail?.seances?.length || 0})
                                    </h4>
                                    {isEnCours && (
                                      <button
                                        onClick={() => {
                                          setSeanceModalMentoratId(m.id)
                                          setSeanceForm({
                                            date: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
                                            dureeMinutes: 60,
                                            sujet: '',
                                          })
                                        }}
                                        className="text-xs font-semibold text-[#C9F06A] hover:underline inline-flex items-center gap-1"
                                      >
                                        <Plus size={12} /> Nouvelle séance
                                      </button>
                                    )}
                                  </div>

                                  {(!detail?.seances || detail.seances.length === 0) ? (
                                    <p className="text-xs text-white/40 italic py-2">
                                      Aucune séance n'a encore été programmée.
                                    </p>
                                  ) : (
                                    <div className="space-y-2.5">
                                      {detail.seances.map((s) => (
                                        <div
                                          key={s.id}
                                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs"
                                        >
                                          <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                              <span className="font-semibold text-white">
                                                {formatDate(s.date)}
                                              </span>
                                              <span className="text-white/40">·</span>
                                              <span className="text-white/60 font-mono">
                                                {s.dureeMinutes} min
                                              </span>
                                              <span
                                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                                  s.statut === 'REALISEE'
                                                    ? 'bg-emerald-500/20 text-emerald-300'
                                                    : 'bg-amber-500/20 text-amber-300'
                                                }`}
                                              >
                                                {STATUT_SEANCE[s.statut] || s.statut}
                                              </span>
                                            </div>
                                            <p className="text-white/80 mt-1 font-medium truncate">
                                              {s.sujet || 'Ordre du jour non spécifié'}
                                            </p>
                                            {s.compteRendu && (
                                              <p className="text-white/60 text-[11px] mt-1 bg-black/30 p-2 rounded-lg">
                                                📝 Compte-rendu : {s.compteRendu}
                                              </p>
                                            )}
                                          </div>

                                          {s.statut === 'PLANIFIEE' && (
                                            <button
                                              onClick={() => {
                                                setCompteRenduModal({
                                                  mentoratId: m.id,
                                                  seanceId: s.id,
                                                  sujet: s.sujet,
                                                })
                                                setCompteRenduText(s.compteRendu || '')
                                              }}
                                              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-[#C9F06A]/20 hover:text-[#C9F06A] border border-white/10 px-3 py-1.5 text-xs font-semibold text-white transition shrink-0"
                                            >
                                              <FileText size={13} />
                                              <span>Rédiger compte-rendu</span>
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Bilans finaux */}
                                  {(detail?.bilanMentor || detail?.bilanMentore) && (
                                    <div className="mt-4 pt-3 border-t border-white/10 text-xs space-y-2">
                                      {detail.bilanMentor && (
                                        <p className="text-white/70">
                                          <strong className="text-white">Votre bilan :</strong> {detail.bilanMentor}
                                        </p>
                                      )}
                                      {detail.bilanMentore && (
                                        <p className="text-white/70">
                                          <strong className="text-[#C9F06A]">Retour du mentoré :</strong> {detail.bilanMentore}
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* --- EN TANT QUE MENTORÉ --- */
            <div className="space-y-4">
              {mesMentorats.commeMentore.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-[#16221C]/70 p-10 text-center">
                  <p className="text-white/60 text-sm">
                    Vous n'avez pas encore sollicité de mentorat.
                  </p>
                  <button
                    onClick={() => setTab('explorer')}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#C9F06A] text-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20"
                  >
                    <Search size={14} />
                    <span>Découvrir les mentors disponibles</span>
                  </button>
                </div>
              ) : (
                mesMentorats.commeMentore.map((m) => {
                  const isExpanded = expandedMentoratId === m.id
                  const detail = mentoratDetails[m.id]

                  return (
                    <div
                      key={m.id}
                      className="rounded-3xl border border-white/10 bg-[#16221C]/90 p-5 backdrop-blur-md shadow-xl"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C9F06A] to-emerald-700 text-black font-black flex items-center justify-center text-sm ring-1 ring-[#C9F06A]/30">
                            {avatarLetters(m.mentor)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-white text-base">
                                {displayName(m.mentor)}
                              </h3>
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                  m.statut === 'ACCEPTE'
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : m.statut === 'TERMINE'
                                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                    : m.statut === 'EN_ATTENTE'
                                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                                    : 'bg-white/5 text-white/40'
                                }`}
                              >
                                {STATUT_MENTORAT[m.statut] || m.statut}
                              </span>
                            </div>
                            <p className="text-xs text-white/60 mt-0.5">
                              Sujet : <strong className="text-white">{m.sujet || 'Mentorat'}</strong> · Demandé le {formatDateShort(m.dateDemande)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {m.statut === 'TERMINE' && (
                            <button
                              onClick={() => {
                                setBilanModal({ mentoratId: m.id, mode: 'bilan' })
                                setBilanText('')
                              }}
                              className="rounded-xl bg-[#C9F06A]/15 border border-[#C9F06A]/30 text-[#C9F06A] px-3.5 py-2 text-xs font-bold hover:bg-[#C9F06A]/25 transition"
                            >
                              Donner mon retour
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleExpand(m.id)}
                            className="inline-flex items-center gap-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 text-xs text-white transition"
                          >
                            <span>{isExpanded ? 'Masquer' : 'Voir les séances'}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </div>
                      </div>

                      {/* Detail Drawer for Mentee */}
                      {isExpanded && (
                        <div className="mt-5 pt-4 border-t border-white/10 animate-in fade-in duration-200">
                          {loadingDetailId === m.id ? (
                            <div className="py-6 text-center text-xs text-white/50 flex items-center justify-center gap-2">
                              <Loader2 size={16} className="animate-spin text-[#C9F06A]" />
                              Chargement...
                            </div>
                          ) : (
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono mb-3">
                                Séances programmées ({detail?.seances?.length || 0})
                              </h4>
                              {(!detail?.seances || detail.seances.length === 0) ? (
                                <p className="text-xs text-white/40 italic py-2">
                                  Votre mentor n'a pas encore programmé de séance. Vous recevrez une notification dès que la première date sera fixée.
                                </p>
                              ) : (
                                <div className="space-y-2.5">
                                  {detail.seances.map((s) => (
                                    <div
                                      key={s.id}
                                      className="p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-white">
                                            {formatDate(s.date)}
                                          </span>
                                          <span className="text-white/40">·</span>
                                          <span className="text-white/60 font-mono">
                                            {s.dureeMinutes} min
                                          </span>
                                        </div>
                                        <span
                                          className={`rounded px-2 py-0.5 text-[9px] font-bold ${
                                            s.statut === 'REALISEE'
                                              ? 'bg-emerald-500/20 text-emerald-300'
                                              : 'bg-amber-500/20 text-amber-300'
                                          }`}
                                        >
                                          {STATUT_SEANCE[s.statut] || s.statut}
                                        </span>
                                      </div>
                                      <p className="text-white/80 mt-1 font-medium">
                                        {s.sujet || 'Séance de travail'}
                                      </p>
                                      {s.compteRendu && (
                                        <p className="text-white/70 text-[11px] mt-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                                          💡 <strong>Compte-rendu du mentor :</strong> {s.compteRendu}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MON PROFIL MENTOR */}
      {/* ========================================================================= */}
      {activeTab === 'mon-profil' && (
        <div className="max-w-3xl">
          {loadingProfil ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={36} className="animate-spin text-[#C9F06A] mb-4" />
              <p className="text-xs text-white/50 uppercase tracking-widest font-mono">
                Chargement de votre profil mentor...
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-[#16221C]/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-xl font-extrabold text-white font-display">
                    Paramètres de votre statut Mentor
                  </h2>
                  <p className="text-xs sm:text-sm text-white/60 mt-1">
                    Définissez vos disponibilités, le nombre maximal de personnes que vous pouvez accompagner en simultané et votre méthode.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                      monProfil?.actif
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/50'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        monProfil?.actif ? 'bg-[#C9F06A]' : 'bg-white/40'
                      }`}
                    />
                    {monProfil?.actif ? 'Disponible' : 'En pause / Inactif'}
                  </span>
                  {monProfil?.estMentor && (
                    <p className="text-[11px] text-white/40 mt-1 font-mono">
                      Places restantes : {monProfil.placesRestantes} / {monProfil.nombreMentoresMax}
                    </p>
                  )}
                </div>
              </div>

              {/* Requirement reminder */}
              <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4 text-xs text-white/70 flex items-start gap-3">
                <GraduationCap size={18} className="text-[#C9F06A] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Condition requise pour être visible :</p>
                  <p className="mt-0.5">
                    Votre profil doit comporter au moins une compétence avec le statut <strong>« Je peux enseigner »</strong>.
                  </p>
                  <Link
                    to="/profile"
                    className="mt-2 inline-flex items-center gap-1 text-[#C9F06A] font-bold hover:underline"
                  >
                    Vérifier mes compétences sur mon profil <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <form onSubmit={handleSaveProfil} className="space-y-6">
                {/* Active Toggle */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div>
                    <label className="text-sm font-bold text-white block">
                      Accepter de nouvelles demandes de mentorat
                    </label>
                    <p className="text-xs text-white/50 mt-0.5">
                      Lorsque cette option est désactivée, vous n'apparaissez plus comme disponible dans l'annuaire.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profilForm.actif}
                    onChange={(e) => setProfilForm({ ...profilForm, actif: e.target.checked })}
                    className="h-5 w-5 accent-[#C9F06A] rounded cursor-pointer"
                  />
                </div>

                {/* Capacity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-white">
                      Nombre maximal de mentorés simultanés
                    </label>
                    <span className="text-sm font-mono font-bold text-[#C9F06A]">
                      {profilForm.nombreMentoresMax} personne{profilForm.nombreMentoresMax > 1 ? 's' : ''}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={profilForm.nombreMentoresMax}
                    onChange={(e) =>
                      setProfilForm({
                        ...profilForm,
                        nombreMentoresMax: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-[#C9F06A] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-white/40 font-mono mt-1">
                    <span>1 (Minimum)</span>
                    <span>5 (Recommandé)</span>
                    <span>10 (Maximum)</span>
                  </div>
                </div>

                {/* Presentation */}
                <div>
                  <label className="text-sm font-bold text-white block mb-1.5">
                    Présentation de mentor (méthode, vision, disponiblités)
                  </label>
                  <textarea
                    rows={5}
                    maxLength={1000}
                    required
                    value={profilForm.presentation}
                    onChange={(e) => setProfilForm({ ...profilForm, presentation: e.target.value })}
                    placeholder="Ex: Architecte backend avec 6 ans d'expérience sur Spring Boot et Kubernetes. J'aide les développeurs juniors/confirmés à concevoir des architectures robustes, faire des revues de PR et réussir leurs entretiens..."
                    className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none focus:ring-1 focus:ring-[#C9F06A] transition resize-none"
                  />
                  <p className="text-right text-[11px] text-white/40 mt-1 font-mono">
                    {profilForm.presentation.length} / 1000 caractères
                  </p>
                </div>

                {/* Submit */}
                <div className="pt-4 border-t border-white/10 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfil}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#C9F06A] text-black px-7 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20 disabled:opacity-50"
                  >
                    {savingProfil ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Enregistrement...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Enregistrer mes préférences</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: DEMANDER UN MENTORAT */}
      {/* ========================================================================= */}
      {requestModalMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[#C9F06A]/30 bg-[#16221C] p-6 sm:p-8 shadow-2xl text-white">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono">
                  Demande d'accompagnement
                </p>
                <h3 className="text-xl font-bold font-display text-white mt-1">
                  Solliciter {displayName(requestModalMentor.developpeur || requestModalMentor)}
                </h3>
              </div>
              <button
                onClick={() => setRequestModalMentor(null)}
                className="text-white/40 hover:text-white transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitDemande} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  Sujet principal de l'accompagnement *
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={requestForm.sujet}
                  onChange={(e) => setRequestForm({ ...requestForm, sujet: e.target.value })}
                  placeholder="Ex: Revue d'architecture Cloud, montée en compétence Docker..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  Votre message d'introduction & objectifs *
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={2000}
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  placeholder="Présentez brièvement vos projets actuels, vos blocages et ce que vous aimeriez aborder ensemble lors des séances..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setRequestModalMentor(null)}
                  className="rounded-2xl border border-white/10 px-5 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#C9F06A] text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20 disabled:opacity-50"
                >
                  {sendingRequest ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Envoyer la demande</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PLANIFIER UNE SEANCE */}
      {/* ========================================================================= */}
      {seanceModalMentoratId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-[#C9F06A]/30 bg-[#16221C] p-6 shadow-2xl text-white">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono">
                  Agenda Mentorat
                </p>
                <h3 className="text-lg font-bold font-display text-white mt-1">
                  Planifier une nouvelle séance
                </h3>
              </div>
              <button
                onClick={() => setSeanceModalMentoratId(null)}
                className="text-white/40 hover:text-white transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitSeance} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  Date et Heure *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={seanceForm.date}
                  onChange={(e) => setSeanceForm({ ...seanceForm, date: e.target.value })}
                  className="w-full rounded-2xl bg-[#18251E] border border-white/10 px-4 py-2.5 text-sm text-white focus:border-[#C9F06A] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  Durée (en minutes) *
                </label>
                <select
                  value={seanceForm.dureeMinutes}
                  onChange={(e) =>
                    setSeanceForm({ ...seanceForm, dureeMinutes: parseInt(e.target.value, 10) })
                  }
                  className="w-full rounded-2xl bg-[#18251E] border border-white/10 px-4 py-2.5 text-sm text-white focus:border-[#C9F06A] focus:outline-none"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure (Recommandé)</option>
                  <option value={90}>1 heure 30</option>
                  <option value={120}>2 heures</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  Ordre du jour / Sujet spécifique
                </label>
                <input
                  type="text"
                  maxLength={200}
                  value={seanceForm.sujet}
                  onChange={(e) => setSeanceForm({ ...seanceForm, sujet: e.target.value })}
                  placeholder="Ex: Revue de code du service Auth, Mocking tests..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSeanceModalMentoratId(null)}
                  className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingSeance}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-[#C9F06A] text-black px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-md shadow-[#C9F06A]/20"
                >
                  {savingSeance ? <Loader2 size={13} className="animate-spin" /> : <Calendar size={13} />}
                  <span>Confirmer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: COMPTE-RENDU DE SEANCE */}
      {/* ========================================================================= */}
      {compteRenduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[#C9F06A]/30 bg-[#16221C] p-6 shadow-2xl text-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono">
                  Validation de la séance
                </p>
                <h3 className="text-lg font-bold font-display text-white mt-1">
                  Rédiger le compte-rendu
                </h3>
              </div>
              <button
                onClick={() => setCompteRenduModal(null)}
                className="text-white/40 hover:text-white transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-white/60 mb-4">
              La rédaction de ce compte-rendu valide la séance comme <strong>RÉALISÉE</strong> et contribue à l'obtention de votre badge <strong>MENTOR</strong> officiel.
            </p>

            <form onSubmit={handleSubmitCompteRendu} className="space-y-4">
              <textarea
                rows={5}
                required
                maxLength={3000}
                value={compteRenduText}
                onChange={(e) => setCompteRenduText(e.target.value)}
                placeholder="Points abordés, blocages résolus, conseils donnés, devoirs ou prochaines étapes pour le mentoré..."
                className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none resize-none"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCompteRenduModal(null)}
                  className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingCompteRendu}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-[#C9F06A] text-black px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-md shadow-[#C9F06A]/20"
                >
                  {savingCompteRendu ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  <span>Valider la séance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CLOTURER / BILAN DE MENTORAT */}
      {/* ========================================================================= */}
      {bilanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-[#C9F06A]/30 bg-[#16221C] p-6 shadow-2xl text-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono">
                  {bilanModal.mode === 'terminer' ? 'Clôture du Mentorat' : 'Retour d’expérience'}
                </p>
                <h3 className="text-lg font-bold font-display text-white mt-1">
                  {bilanModal.mode === 'terminer'
                    ? 'Clôturer ce cycle de mentorat'
                    : 'Rédiger votre retour d’expérience'}
                </h3>
              </div>
              <button
                onClick={() => setBilanModal(null)}
                className="text-white/40 hover:text-white transition p-1"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitBilan} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block mb-1.5">
                  Bilan & Commentaires (optionnel pour clôturer)
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={bilanText}
                  onChange={(e) => setBilanText(e.target.value)}
                  placeholder="Partagez les progrès accomplis, vos recommandations ou vos remerciements..."
                  className="w-full rounded-2xl bg-white/5 border border-white/10 p-4 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#C9F06A] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBilanModal(null)}
                  className="rounded-2xl border border-white/10 px-4 py-2 text-xs text-white/70 hover:bg-white/5 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingBilan}
                  className="inline-flex items-center gap-1.5 rounded-2xl bg-[#C9F06A] text-black px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-md shadow-[#C9F06A]/20"
                >
                  {savingBilan ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                  <span>{bilanModal.mode === 'terminer' ? 'Confirmer la clôture' : 'Enregistrer le bilan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
