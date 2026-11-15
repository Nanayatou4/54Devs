import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ShieldCheck,
  Users,
  FolderGit2,
  GraduationCap,
  HelpCircle,
  Trophy,
  Award,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck,
  UserX,
  Trash2,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { adminApi, questionsApi, getStoredUser } from '../api'
import Avatar from '../components/Avatar'

const TABS = [
  { key: 'overview', label: 'Vue d\'ensemble', icon: TrendingUp },
  { key: 'users', label: 'Utilisateurs & Accès', icon: Users },
  { key: 'moderation', label: 'Modération Q&A', icon: HelpCircle },
  { key: 'challenges', label: 'Défis & Compétitions', icon: Trophy },
]

export default function AdminDashboard() {
  const currentUser = getStoredUser()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedTab = searchParams.get('tab')
  const activeTab = TABS.some((tab) => tab.key === requestedTab) ? requestedTab : 'overview'

  function setActiveTab(tab) {
    setSearchParams(tab === 'overview' ? {} : { tab })
    setActionErrorMessage('')
    setActionSuccessMessage('')
  }
  const [stats, setStats] = useState(null)
  const [loadingStats, setLoadingStats] = useState(true)
  const [statsError, setStatsError] = useState('')

  // Users tab state
  const [users, setUsers] = useState([])
  const [usersPage, setUsersPage] = useState(0)
  const [usersTotalPages, setUsersTotalPages] = useState(1)
  const [usersTotalCount, setUsersTotalCount] = useState(0)
  const [loadingUsers, setLoadingUsers] = useState(false)
  const [userSearchText, setUserSearchText] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('')
  const [userActifFilter, setUserActifFilter] = useState('')
  const [actionSuccessMessage, setActionSuccessMessage] = useState('')
  const [actionErrorMessage, setActionErrorMessage] = useState('')

  // Moderation tab state
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [questionSearch, setQuestionSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)

  // Challenges tab state
  const [challenges, setChallenges] = useState([])
  const [challengesPage, setChallengesPage] = useState(0)
  const [challengesTotalPages, setChallengesTotalPages] = useState(1)
  const [loadingChallenges, setLoadingChallenges] = useState(false)

  // Load statistics
  const loadStats = useCallback(() => {
    setLoadingStats(true)
    setStatsError('')
    adminApi
      .statistiques()
      .then((data) => {
        setStats(data)
      })
      .catch((err) => {
        setStatsError(err.message || 'Impossible de charger les statistiques.')
      })
      .finally(() => setLoadingStats(false))
  }, [])

  // Load users
  const loadUsers = useCallback(() => {
    setLoadingUsers(true)
    adminApi
      .utilisateurs({
        texte: userSearchText,
        role: userRoleFilter || undefined,
        actif: userActifFilter !== '' ? userActifFilter === 'true' : undefined,
        page: usersPage,
        taille: 10,
      })
      .then((res) => {
        setUsers(res.contenu || [])
        setUsersTotalPages(res.totalPages || 1)
        setUsersTotalCount(res.totalElements || 0)
      })
      .catch((err) => {
        setActionErrorMessage(err.message || 'Erreur lors du chargement des utilisateurs.')
      })
      .finally(() => setLoadingUsers(false))
  }, [userSearchText, userRoleFilter, userActifFilter, usersPage])

  // Load questions for moderation
  const loadQuestions = useCallback(() => {
    setLoadingQuestions(true)
    questionsApi
      .lister({ texte: questionSearch, page: 0, taille: 20 })
      .then((res) => {
        setQuestions(res.contenu || [])
      })
      .catch((err) => {
        console.error('Erreur questions:', err)
      })
      .finally(() => setLoadingQuestions(false))
  }, [questionSearch])

  // Load challenges
  const loadChallenges = useCallback(() => {
    setLoadingChallenges(true)
    adminApi
      .challenges({ page: challengesPage, taille: 10 })
      .then((res) => {
        setChallenges(res.contenu || [])
        setChallengesTotalPages(res.totalPages || 1)
      })
      .catch((err) => {
        console.error('Erreur challenges:', err)
      })
      .finally(() => setLoadingChallenges(false))
  }, [challengesPage])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers()
    } else if (activeTab === 'moderation') {
      loadQuestions()
    } else if (activeTab === 'challenges') {
      loadChallenges()
    }
  }, [activeTab, loadUsers, loadQuestions, loadChallenges])

  // Toggle user active status
  async function handleToggleUserActif(user) {
    if (user.id === currentUser?.id) {
      setActionErrorMessage('Vous ne pouvez pas désactiver votre propre compte administrateur.')
      return
    }
    if (user.role === 'ADMIN') {
      setActionErrorMessage('Un compte administrateur ne peut pas être désactivé.')
      return
    }

    const newStatus = !user.actif
    try {
      await adminApi.changerActif(user.id, newStatus)
      setActionSuccessMessage(
        `Le compte de ${user.prenom} ${user.nom} a été ${newStatus ? 'réactivé' : 'désactivé'} avec succès.`
      )
      loadUsers()
      loadStats()
    } catch (err) {
      setActionErrorMessage(err.message || 'Échec de la modification du statut utilisateur.')
    }
  }

  async function handleDeleteChallenge(id) {
    setDeletingId(id)
    try {
      await adminApi.supprimerChallenge(id)
      setActionSuccessMessage('Challenge supprimé.')
      setChallenges((prev) => prev.filter((challenge) => challenge.id !== id))
      loadStats()
    } catch (err) {
      setActionErrorMessage(err.message || 'Impossible de supprimer ce challenge. Les challenges déjà joués sont protégés.')
    } finally {
      setDeletingId(null)
      setConfirmModal(null)
    }
  }

  // Delete question
  async function handleDeleteQuestion(id) {
    setDeletingId(id)
    try {
      await adminApi.supprimerQuestion(id)
      setActionSuccessMessage('Question et réponses supprimées avec succès.')
      setQuestions((prev) => prev.filter((q) => q.id !== id))
      loadStats()
    } catch (err) {
      setActionErrorMessage(err.message || 'Impossible de supprimer la question.')
    } finally {
      setDeletingId(null)
      setConfirmModal(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E1511] text-white font-body pb-16">
      {/* Top Banner / Hero Header */}
      <div className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#14231B] via-[#101B14] to-[#0D1812] px-4 py-8 sm:px-8 sm:py-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C9F06A]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest uppercase text-[#C9F06A]">
              <ShieldCheck size={18} className="text-[#C9F06A]" />
              <span>Espace Administration Centrale</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display mt-2">
              Panneau de Contrôle 54Devs
            </h1>
            <p className="text-sm text-white/60 mt-1.5 max-w-2xl">
              Supervision des métriques clés, modération des contenus et gestion des accès à l'échelle des 54 nations africaines.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                loadStats()
                if (activeTab === 'users') loadUsers()
                if (activeTab === 'moderation') loadQuestions()
                if (activeTab === 'challenges') loadChallenges()
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white transition"
              title="Rafraîchir les données"
            >
              <RefreshCw size={14} className={loadingStats ? 'animate-spin' : ''} />
              <span>Actualiser</span>
            </button>
            <Link
              to="/admin/challenges/creer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] text-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20"
            >
              <Plus size={16} />
              <span>Nouveau Défi</span>
            </Link>
            <Link
              to="/admin/competitions/creer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#C9F06A]/40 bg-[#C9F06A]/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C9F06A] transition hover:bg-[#C9F06A]/20"
            >
              <Trophy size={16} />
              <span>Nouvelle compétition</span>
            </Link>
            <Link
              to="/admin/competitions"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:bg-white/10"
            >
              <Award size={16} />
              <span>Évaluer les compétitions</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto mt-8 max-w-[1600px] px-4 sm:px-8">
        <div className="min-w-0">
        {/* Flash Notifications */}
        {actionSuccessMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button
              onClick={() => setActionSuccessMessage('')}
              className="text-emerald-300 hover:text-white text-xs font-bold ml-4"
            >
              Fermer
            </button>
          </div>
        )}

        {actionErrorMessage && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-rose-400 shrink-0" />
              <span>{actionErrorMessage}</span>
            </div>
            <button
              onClick={() => setActionErrorMessage('')}
              className="text-rose-300 hover:text-white text-xs font-bold ml-4"
            >
              Fermer
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW / STATISTIQUES                                             */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="mt-8 space-y-8 animate-fadeIn">
            {statsError && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                {statsError}
              </div>
            )}

            {/* Core Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Utilisateurs */}
              <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-[#C9F06A]/40 transition">
                <div className="flex items-center justify-between text-white/50">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Utilisateurs</span>
                  <div className="w-9 h-9 rounded-xl bg-[#C9F06A]/10 text-[#C9F06A] flex items-center justify-center">
                    <Users size={18} />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-white font-display mt-3">
                  {stats?.utilisateurs?.total ?? '—'}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {stats?.utilisateurs?.actifs ?? 0} actifs
                  </span>
                  <span>•</span>
                  <span className="text-[#C9F06A]">+{stats?.utilisateurs?.nouveauxSur7Jours ?? 0} (7j)</span>
                </div>
              </div>

              {/* Projets */}
              <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-[#C9F06A]/40 transition">
                <div className="flex items-center justify-between text-white/50">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Projets</span>
                  <div className="w-9 h-9 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
                    <FolderGit2 size={18} />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-white font-display mt-3">
                  {stats?.projets?.total ?? '—'}
                </p>
                <p className="mt-3 text-xs text-white/60">
                  <strong className="text-amber-400 font-semibold">
                    {stats?.projets?.demandesEnAttente ?? 0}
                  </strong>{' '}
                  demande(s) d'adhésion en attente
                </p>
              </div>

              {/* Mentorat */}
              <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-[#C9F06A]/40 transition">
                <div className="flex items-center justify-between text-white/50">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Mentorat</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-400/10 text-purple-400 flex items-center justify-center">
                    <GraduationCap size={18} />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-white font-display mt-3">
                  {stats?.mentorat?.mentorsActifs ?? '—'}
                </p>
                <p className="mt-3 text-xs text-white/60">
                  <span className="text-purple-300 font-semibold">{stats?.mentorat?.mentoratsEnCours ?? 0}</span> en cours ·{' '}
                  <span className="text-emerald-400">{stats?.mentorat?.mentoratsTermines ?? 0}</span> clôturés
                </p>
              </div>

              {/* Challenges & Badges */}
              <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5 backdrop-blur-xl relative overflow-hidden group hover:border-[#C9F06A]/40 transition">
                <div className="flex items-center justify-between text-white/50">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono">Badges & Défis</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
                    <Trophy size={18} />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-white font-display mt-3">
                  {stats?.badgesAttribues ?? '—'}
                </p>
                <p className="mt-3 text-xs text-white/60">
                  <span className="text-amber-300 font-semibold">{stats?.challenges?.total ?? 0}</span> défis ·{' '}
                  <span className="text-emerald-400">{stats?.challenges?.reussites ?? 0}</span> victoires
                </p>
              </div>
            </div>

            {/* Detailed Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Projets par statut */}
              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#16221C]/80 p-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <FolderGit2 size={18} className="text-[#C9F06A]" />
                  <span>Répartition des Projets</span>
                </h3>
                <p className="text-xs text-white/50 mt-1">État actuel des initiatives enregistrées</p>

                <div className="mt-6 space-y-3">
                  {stats?.projets?.parStatut ? (
                    Object.entries(stats.projets.parStatut).map(([statut, count]) => {
                      const total = stats.projets.total || 1
                      const pct = Math.round((count / total) * 100)
                      return (
                        <div key={statut} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-mono">
                            <span className="text-white/80">{statut}</span>
                            <span className="text-[#C9F06A] font-bold">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#C9F06A] to-emerald-400 transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-xs text-white/40">Aucune donnée disponible</p>
                  )}
                </div>
              </div>

              {/* Communauté & Q&A Health */}
              <div className="lg:col-span-6 rounded-2xl border border-white/10 bg-[#16221C]/80 p-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <HelpCircle size={18} className="text-[#C9F06A]" />
                  <span>Santé de la Communauté (Q&A)</span>
                </h3>
                <p className="text-xs text-white/50 mt-1">Taux de résolution et entraide technique</p>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-2xl font-extrabold text-white font-display">
                      {stats?.communaute?.questions ?? 0}
                    </p>
                    <p className="text-[10px] uppercase font-mono text-white/50 mt-1">Questions</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-2xl font-extrabold text-emerald-400 font-display">
                      {stats?.communaute?.reponses ?? 0}
                    </p>
                    <p className="text-[10px] uppercase font-mono text-white/50 mt-1">Réponses</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-2xl font-extrabold text-amber-400 font-display">
                      {stats?.communaute?.questionsSansSolution ?? 0}
                    </p>
                    <p className="text-[10px] uppercase font-mono text-white/50 mt-1">Sans Solution</p>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-[#C9F06A]/20 bg-[#C9F06A]/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-[#C9F06A]" />
                    <div>
                      <p className="text-xs font-bold text-white">Modérer le forum</p>
                      <p className="text-[11px] text-white/60">Gérer et supprimer les contenus non conformes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('moderation')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9F06A] hover:underline"
                  >
                    <span>Inspecter</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Inscriptions Récentes */}
            <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <UserCheck size={18} className="text-[#C9F06A]" />
                    <span>Derniers Membres Inscrits</span>
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">Les 5 dernières adhésions enregistrées</p>
                </div>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-xs font-bold text-[#C9F06A] hover:underline flex items-center gap-1"
                >
                  <span>Tous les utilisateurs</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {stats?.dernieresInscriptions && stats.dernieresInscriptions.length > 0 ? (
                  stats.dernieresInscriptions.map((user) => (
                    <div key={user.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar
                          user={user}
                          size="md"
                          className="ring-1 ring-[#C9F06A]/30 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">
                            {user.prenom} {user.nom}
                          </p>
                          <p className="text-xs text-white/50 font-mono truncate">
                            @{user.pseudo || user.prenom?.toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 shrink-0 text-right">
                        {user.pays && (
                          <div className="hidden sm:flex items-center gap-1 text-xs text-white/60">
                            <MapPin size={13} className="text-[#C9F06A]" />
                            <span>{user.pays}</span>
                          </div>
                        )}
                        <span className="text-xs font-mono text-white/40">
                          {user.dateInscription ? new Date(user.dateInscription).toLocaleDateString('fr-FR') : ''}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/40 py-4 text-center">Aucune inscription récente</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: USERS MANAGEMENT                                                   */}
        {/* ========================================================================= */}
        {activeTab === 'users' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            {/* Filters bar */}
            <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-4 backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Search text */}
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={userSearchText}
                  onChange={(e) => {
                    setUserSearchText(e.target.value)
                    setUsersPage(0)
                  }}
                  placeholder="Rechercher par nom, prénom ou email..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-[#C9F06A] transition placeholder:text-white/40"
                />
              </div>

              {/* Filters dropdowns */}
              <div className="flex items-center gap-3">
                <select
                  value={userRoleFilter}
                  onChange={(e) => {
                    setUserRoleFilter(e.target.value)
                    setUsersPage(0)
                  }}
                  className="rounded-xl border border-white/10 bg-[#121A15] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C9F06A]"
                >
                  <option value="">Tous les rôles</option>
                  <option value="DEVELOPPEUR">Développeur</option>
                  <option value="ADMIN">Administrateur</option>
                </select>

                <select
                  value={userActifFilter}
                  onChange={(e) => {
                    setUserActifFilter(e.target.value)
                    setUsersPage(0)
                  }}
                  className="rounded-xl border border-white/10 bg-[#121A15] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#C9F06A]"
                >
                  <option value="">Tous les états</option>
                  <option value="true">Actifs uniquement</option>
                  <option value="false">Désactivés uniquement</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-white/50">
                      <th className="py-3.5 px-4 sm:px-6">Utilisateur</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Pays</th>
                      <th className="py-3.5 px-4">Rôle</th>
                      <th className="py-3.5 px-4">Statut</th>
                      <th className="py-3.5 px-4">Inscription</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-white/50">
                          <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#C9F06A]" />
                          Chargement des comptes utilisateurs...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-white/40">
                          Aucun utilisateur correspondant trouvé.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => {
                        const isSelf = u.id === currentUser?.id
                        const isAdmin = u.role === 'ADMIN'
                        const isProtected = isSelf || isAdmin

                        return (
                          <tr key={u.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3.5 px-4 sm:px-6">
                              <div className="flex items-center gap-3">
                                <Avatar user={u} size="sm" />
                                <div>
                                  <p className="font-bold text-white">
                                    {u.prenom} {u.nom}
                                  </p>
                                  <p className="text-[11px] text-white/40 font-mono">@{u.pseudo || 'sans-pseudo'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-white/80 font-mono text-[11px]">{u.email}</td>
                            <td className="py-3.5 px-4 text-white/70">{u.pays || '—'}</td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider ${
                                  u.role === 'ADMIN'
                                    ? 'bg-[#C9F06A]/15 text-[#C9F06A] border border-[#C9F06A]/30'
                                    : 'bg-white/10 text-white/80'
                                }`}
                              >
                                {u.role === 'ADMIN' ? 'ADMIN' : 'DEV'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                                  u.actif
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    u.actif ? 'bg-emerald-400' : 'bg-rose-400'
                                  }`}
                                />
                                {u.actif ? 'Actif' : 'Désactivé'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-white/50 font-mono text-[11px]">
                              {u.dateInscription ? new Date(u.dateInscription).toLocaleDateString('fr-FR') : '—'}
                            </td>
                            <td className="py-3.5 px-4 sm:px-6 text-right">
                              {isProtected ? (
                                <span
                                  className="inline-flex items-center gap-1 text-[11px] text-white/30 italic"
                                  title={
                                    isSelf
                                      ? 'Votre propre compte'
                                      : 'Les administrateurs ne peuvent pas être désactivés'
                                  }
                                >
                                  <Lock size={12} />
                                  <span>Protégé</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleToggleUserActif(u)}
                                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                    u.actif
                                      ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20'
                                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                                  }`}
                                >
                                  {u.actif ? (
                                    <>
                                      <UserX size={13} />
                                      <span>Désactiver</span>
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck size={13} />
                                      <span>Réactiver</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination bar */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                <span>
                  Affichage de {users.length} sur {usersTotalCount} utilisateur(s)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={usersPage === 0 || loadingUsers}
                    onClick={() => setUsersPage((p) => Math.max(0, p - 1))}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono text-white px-2">
                    {usersPage + 1} / {usersTotalPages}
                  </span>
                  <button
                    disabled={usersPage >= usersTotalPages - 1 || loadingUsers}
                    onClick={() => setUsersPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: MODERATION Q&A                                                     */}
        {/* ========================================================================= */}
        {activeTab === 'moderation' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            {/* Search bar */}
            <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-4 backdrop-blur-xl flex items-center gap-3">
              <Search size={16} className="text-white/40" />
              <input
                type="text"
                value={questionSearch}
                onChange={(e) => setQuestionSearch(e.target.value)}
                placeholder="Rechercher une question par mot-clé pour modération..."
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/40 font-body"
              />
            </div>

            {/* Questions list */}
            <div className="space-y-4">
              {loadingQuestions ? (
                <div className="p-12 text-center text-white/50">
                  <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#C9F06A]" />
                  Chargement des discussions...
                </div>
              ) : questions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-12 text-center text-white/40">
                  Aucune question trouvée.
                </div>
              ) : (
                questions.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-white/20 transition"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9F06A] bg-[#C9F06A]/10 px-2 py-0.5 rounded-md">
                          {q.categorie || 'Général'}
                        </span>
                        {q.resolue && (
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <CheckCircle2 size={11} /> Résolue
                          </span>
                        )}
                        <span className="text-xs text-white/40 font-mono">
                          {q.dateCreation ? new Date(q.dateCreation).toLocaleDateString('fr-FR') : ''}
                        </span>
                      </div>
                      <Link
                        to={`/questions/${q.id}`}
                        className="text-base font-bold text-white hover:text-[#C9F06A] transition line-clamp-1"
                      >
                        {q.titre}
                      </Link>
                      <p className="text-xs text-white/60 line-clamp-2 mt-1">{q.contenu}</p>
                      <div className="mt-2 text-xs text-white/40 flex items-center gap-4">
                        <span>Par {q.auteur?.pseudo || q.auteur?.prenom || 'Membre'}</span>
                        <span>•</span>
                        <span>{q.nombreReponses || 0} réponse(s)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <Link
                        to={`/questions/${q.id}`}
                        className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition"
                        title="Voir la question"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            id: q.id,
                            titre: q.titre,
                            action: () => handleDeleteQuestion(q.id),
                          })
                        }
                        disabled={deletingId === q.id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs font-semibold transition"
                      >
                        <Trash2 size={14} />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: CHALLENGES MANAGEMENT                                              */}
        {/* ========================================================================= */}
        {activeTab === 'challenges' && (
          <div className="mt-8 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Défis & Compétitions</h3>
                <p className="text-xs text-white/50">Gestion des challenges avec suivi des participants et taux de réussite</p>
              </div>
              <Link
                to="/admin/challenges/creer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] text-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20"
              >
                <Plus size={16} />
                <span>Créer un Défi</span>
              </Link>
              <Link to="/admin/competitions" className="inline-flex items-center gap-2 rounded-xl border border-[#C9F06A]/30 bg-[#C9F06A]/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#C9F06A] hover:bg-[#C9F06A]/20 transition">
                <Trophy size={15} /> Évaluer les compétitions
              </Link>
              <Link to="/admin/competitions/creer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:bg-white/10 transition">
                <Award size={15} /> Gérer les compétitions
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 overflow-hidden backdrop-blur-xl shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-mono uppercase tracking-wider text-white/50">
                      <th className="py-3.5 px-4 sm:px-6">Titre du Défi</th>
                      <th className="py-3.5 px-4">Type</th>
                      <th className="py-3.5 px-4">Difficulté</th>
                      <th className="py-3.5 px-4">Points</th>
                      <th className="py-3.5 px-4">Participants</th>
                      <th className="py-3.5 px-4">Réussites</th>
                      <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {loadingChallenges ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-white/50">
                          <RefreshCw size={20} className="animate-spin mx-auto mb-2 text-[#C9F06A]" />
                          Chargement des challenges...
                        </td>
                      </tr>
                    ) : challenges.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-white/40">
                          Aucun challenge enregistré.
                        </td>
                      </tr>
                    ) : (
                      challenges.map((c) => (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3.5 px-4 sm:px-6">
                            <p className="font-bold text-white line-clamp-1">{c.titre}</p>
                            <p className="text-[11px] text-white/40 font-mono">
                              Du {c.dateDebut} au {c.dateFin}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#C9F06A]">
                            {c.type}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                c.difficulte === 'FACILE'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : c.difficulte === 'MOYEN'
                                  ? 'bg-amber-500/15 text-amber-400'
                                  : 'bg-rose-500/15 text-rose-400'
                              }`}
                            >
                              {c.difficulte}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[#C9F06A] font-bold">
                            +{c.points} pts
                          </td>
                          <td className="py-3.5 px-4 text-white/80 font-mono">
                            {c.nombreParticipants ?? 0}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-mono font-semibold">
                            {c.nombreReussites ?? 0}
                          </td>
                          <td className="py-3.5 px-4 sm:px-6 text-right">
                            <div className="inline-flex items-center gap-3">
                              <Link to={`/admin/challenges/${c.id}/modifier`} className="text-xs text-sky-300 hover:underline">Modifier</Link>
                              <Link
                                to={`/admin/challenges/${c.id}`}
                                className="inline-flex items-center gap-1 text-xs text-[#C9F06A] hover:underline"
                              >
                                <span>Consulter</span>
                                <ExternalLink size={12} />
                              </Link>
                              <button
                                type="button"
                                onClick={() => setConfirmModal({
                                  id: c.id,
                                  titre: c.titre,
                                  action: () => handleDeleteChallenge(c.id),
                                  challenge: true,
                                })}
                                disabled={deletingId === c.id}
                                title="Supprimer le challenge s'il n'a aucune participation"
                                className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 disabled:opacity-40"
                              >
                                <Trash2 size={13} /> Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Challenges pagination */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
                <span>Page {challengesPage + 1} sur {challengesTotalPages}</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={challengesPage === 0 || loadingChallenges}
                    onClick={() => setChallengesPage((p) => Math.max(0, p - 1))}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={challengesPage >= challengesTotalPages - 1 || loadingChallenges}
                    onClick={() => setChallengesPage((p) => p + 1)}
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="rounded-2xl border border-white/15 bg-[#16221C] p-6 max-w-md w-full shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-white font-display">Confirmation de suppression</h3>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement cet élément :
              <strong className="block text-white mt-1">« {confirmModal.titre} »</strong>
              {confirmModal.challenge ? 'Un challenge ne peut être supprimé que s’il n’a aucune participation.' : 'Toutes les réponses associées seront également supprimées.'}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmModal.action}
                className="px-4 py-2.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-500/20"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
