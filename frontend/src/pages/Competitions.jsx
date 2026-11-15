import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  ExternalLink,
  Flame,
  GitBranch,
  GraduationCap,
  Layers,
  LoaderCircle,
  Medal,
  Rocket,
  ShieldCheck,
  Sparkles,
  Trophy,
  Upload,
  Users,
} from 'lucide-react'
import { competitionsApi, badgesApi } from '../api'

const panel = 'rounded-2xl border border-white/10 bg-[#16221C]/90 p-5 sm:p-7 shadow-xl backdrop-blur-sm'
const field = 'w-full min-w-0 rounded-xl border border-white/15 bg-[#18251E] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20'

function dateLabel(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}

function statusBadge(status) {
  if (status === 'EN_COURS') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        En cours
      </span>
    )
  }
  if (status === 'A_VENIR') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
        <Clock size={12} />
        À venir
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
      Terminée
    </span>
  )
}

function medalIcon(rank) {
  if (rank === 0) return '🥇'
  if (rank === 1) return '🥈'
  if (rank === 2) return '🥉'
  return `#${rank + 1}`
}

export default function Competitions() {
  const [activeTab, setActiveTab] = useState('solo') // 'solo' | 'team' | 'hall-of-fame'
  const [items, setItems] = useState([])
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [forms, setForms] = useState({})
  const [saving, setSaving] = useState(null)
  const [rankings, setRankings] = useState({})
  const [rankingLoading, setRankingLoading] = useState(null)
  const [rankingOpen, setRankingOpen] = useState({})

  async function loadData() {
    setError('')
    try {
      const [competitionsData, badgesData] = await Promise.all([
        competitionsApi.lister().catch(() => []),
        badgesApi.mesBadges().catch(() => []),
      ])
      setItems(competitionsData || [])
      setBadges(badgesData || [])
    } catch (err) {
      setError(err.message || 'Impossible de charger les données.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function updateForm(id, key, value) {
    setForms((current) => ({
      ...current,
      [id]: { ...current[id], [key]: value },
    }))
  }

  async function toggleRanking(id) {
    if (rankingOpen[id]) {
      setRankingOpen((current) => ({ ...current, [id]: false }))
      return
    }
    setRankingOpen((current) => ({ ...current, [id]: true }))
    if (rankings[id]) return

    setRankingLoading(id)
    try {
      const data = await competitionsApi.classement(id)
      setRankings((current) => ({ ...current, [id]: data }))
    } catch (err) {
      setError(err.message || 'Impossible de charger le classement.')
      setRankingOpen((current) => ({ ...current, [id]: false }))
    } finally {
      setRankingLoading(null)
    }
  }

  async function submitSolution(event, competition) {
    event.preventDefault()
    const form = forms[competition.id] || {}
    setSaving(competition.id)
    setNotice('')
    setError('')
    try {
      await competitionsApi.soumettre(competition.id, {
        urlDepot: form.urlDepot?.trim(),
        description: form.description?.trim(),
      })
      setNotice('🎉 Félicitations ! Votre solution a été enregistrée avec succès pour évaluation.')
      await loadData()
    } catch (err) {
      setError(err.message || 'La soumission a échoué.')
    } finally {
      setSaving(null)
    }
  }

  // Filtrage
  const soloCompetitions = items.filter((c) => c.type === 'SOLO')
  const teamCompetitions = items.filter((c) => c.type === 'EQUIPE')
  const completedCompetitions = items.filter((c) => c.statut === 'TERMINEE')

  return (
    <div className="min-h-screen bg-[#101915] px-4 py-8 text-white sm:px-6 lg:px-8 md:py-12">
      <main className="mx-auto max-w-6xl space-y-8">
        {/* En-tête Prestige L'Arène 54Devs */}
        <header className="relative overflow-hidden rounded-3xl border border-[#C9F06A]/20 bg-gradient-to-r from-[#16221C] via-[#101915] to-[#16221C] p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C9F06A]/30 bg-[#C9F06A]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#C9F06A] mb-3">
                <Flame size={13} className="text-[#C9F06A]" />
                L'Arène des Bâtisseurs Africains
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
                Défis, Hackathons & <span className="text-[#C9F06A]">Hall of Fame</span>
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed">
                Prouvez votre valeur par le code. Relevez des sprints individuels chaque semaine, construisez des projets d'envergure en équipe chaque mois et gravez votre nom dans la mémoire de la communauté.
              </p>
            </div>

            <div className="flex flex-wrap md:flex-col gap-3 shrink-0">
              <Link
                to="/challenges"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition backdrop-blur-sm"
              >
                <Code2 size={15} className="text-[#C9F06A]" />
                <span>Mini-Quiz & Debugging</span>
                <ChevronRight size={14} className="text-white/40" />
              </Link>
              <Link
                to="/smart-match"
                className="inline-flex items-center gap-2 rounded-xl border border-[#C9F06A]/40 bg-[#C9F06A]/10 hover:bg-[#C9F06A]/20 px-4 py-2.5 text-xs font-bold text-[#C9F06A] transition backdrop-blur-sm"
              >
                <Sparkles size={15} />
                <span>Trouver des coéquipiers</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Notifications */}
        {notice && (
          <div role="status" className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200 shadow-lg">
            {notice}
          </div>
        )}
        {error && (
          <div role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 p-4 text-sm text-red-200 shadow-lg">
            {error}
          </div>
        )}

        {/* Navigation des 3 Piliers */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('solo')}
            className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'solo'
                ? 'bg-[#C9F06A] text-black shadow-lg shadow-[#C9F06A]/20 scale-102'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Flame size={17} />
            <span>1. Challenge Solo Hebdo</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
                activeTab === 'solo' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/80'
              }`}
            >
              {soloCompetitions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'team'
                ? 'bg-[#C9F06A] text-black shadow-lg shadow-[#C9F06A]/20 scale-102'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users size={17} />
            <span>2. Challenge Team Mensuel</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
                activeTab === 'team' ? 'bg-black/20 text-black' : 'bg-white/10 text-white/80'
              }`}
            >
              {teamCompetitions.length || 'Nouveau'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('hall-of-fame')}
            className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'hall-of-fame'
                ? 'bg-[#C9F06A] text-black shadow-lg shadow-[#C9F06A]/20 scale-102'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Trophy size={17} />
            <span>3. Hall of Fame</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[11px] font-mono ${
                activeTab === 'hall-of-fame' ? 'bg-black/20 text-black' : 'bg-[#C9F06A]/20 text-[#C9F06A]'
              }`}
            >
              Panthéon
            </span>
          </button>
        </div>

        {/* CONTENU ONGLET 1 : SPRINT SOLO HEBDO */}
        {activeTab === 'solo' && (
          <section className="space-y-6">
            {/* Guide Méthodologique */}
            <div className="rounded-2xl border border-white/10 bg-[#18251E]/60 p-5 sm:p-6 backdrop-blur-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#C9F06A] mb-3 flex items-center gap-2">
                <Code2 size={16} /> Comment fonctionne le Sprint Solo Hebdomadaire ?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-white/80">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-bold text-white mb-1 font-mono text-sm text-[#C9F06A]">01. Comprendre</div>
                  <p className="text-white/60">Analysez le cahier des charges et concevez l'architecture technique.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-bold text-white mb-1 font-mono text-sm text-[#C9F06A]">02. Développer</div>
                  <p className="text-white/60">Implémentez le code propre, testé et documenté sur votre machine.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-bold text-white mb-1 font-mono text-sm text-[#C9F06A]">03. Publier GitHub</div>
                  <p className="text-white/60">Poussez le projet sur GitHub avec un README soigné et commits clairs.</p>
                </div>
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="font-bold text-white mb-1 font-mono text-sm text-[#C9F06A]">04. Score & Jury</div>
                  <p className="text-white/60">Le jury note votre réalisation et attribue les points au classement.</p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className={`${panel} py-16 text-center text-white/60`}>
                <LoaderCircle className="mr-2 inline animate-spin text-[#C9F06A]" size={20} />
                Chargement des défis solo…
              </div>
            ) : soloCompetitions.length === 0 ? (
              <div className={`${panel} py-16 text-center`}>
                <Trophy className="mx-auto mb-4 text-[#C9F06A]" size={40} />
                <h3 className="text-lg font-bold">Aucun Sprint Solo actif cette semaine</h3>
                <p className="mt-2 text-sm text-white/60 max-w-md mx-auto">
                  Le prochain sujet hebdomadaire sera publié très bientôt. En attendant, entraînez-vous sur les mini-challenges !
                </p>
                <Link
                  to="/challenges"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-5 py-2.5 text-xs font-bold text-black"
                >
                  Accéder aux Mini-Challenges
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {soloCompetitions.map((item) => {
                  const form = forms[item.id] || {}
                  const canSubmit = item.statut === 'EN_COURS' && !item.dejaSoumis

                  return (
                    <article key={item.id} className={`${panel} flex flex-col justify-between`}>
                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <span className="rounded-full border border-[#C9F06A]/30 bg-[#C9F06A]/10 px-3 py-1 text-xs font-semibold text-[#C9F06A]">
                            {item.theme}
                          </span>
                          {statusBadge(item.statut)}
                        </div>

                        {/* Titre & Description */}
                        <h2 className="text-xl font-bold font-display text-white">{item.titre}</h2>
                        <p className="mt-3 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                          {item.description}
                        </p>

                        {/* Dates & Points */}
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-white/60 border-t border-white/10 pt-4">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-[#C9F06A]" />
                            Début : {dateLabel(item.dateDebut)}
                          </span>
                          <span className="flex items-center gap-2">
                            <CalendarDays size={14} className="text-[#C9F06A]" />
                            Fin : {dateLabel(item.dateFin)}
                          </span>
                          <span className="font-semibold text-[#C9F06A]">
                            🏆 {item.pointsMaximum} points max
                          </span>
                          <span className="text-white/50">Sprint individuel 7 jours</span>
                        </div>
                      </div>

                      {/* Statut ou Formulaire */}
                      <div className="mt-6 border-t border-white/10 pt-5">
                        {item.dejaSoumis ? (
                          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4">
                            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                              <CheckCircle2 size={18} />
                              Solution soumise avec succès !
                            </div>
                            <p className="mt-1 text-xs text-emerald-200/80">
                              Votre dépôt est enregistré. Score attribué :{' '}
                              <span className="font-bold font-mono text-white text-sm">
                                {item.monScore ?? 0} / {item.pointsMaximum} pts
                              </span>
                            </p>
                          </div>
                        ) : canSubmit ? (
                          <form onSubmit={(e) => submitSolution(e, item)} className="space-y-3.5">
                            <div>
                              <label className="block text-xs font-semibold text-white/80 mb-1">
                                Lien vers votre dépôt GitHub public <span className="text-[#C9F06A]">*</span>
                              </label>
                              <div className="relative">
                                <svg className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40 fill-current" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                                <input
                                  required
                                  type="url"
                                  maxLength={500}
                                  value={form.urlDepot || ''}
                                  onChange={(e) => updateForm(item.id, 'urlDepot', e.target.value)}
                                  className={`${field} pl-10`}
                                  placeholder="https://github.com/votre-nom/votre-repo"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-white/80 mb-1">
                                Note technique pour le jury <span className="text-[#C9F06A]">*</span>
                              </label>
                              <textarea
                                required
                                maxLength={3000}
                                rows={3}
                                value={form.description || ''}
                                onChange={(e) => updateForm(item.id, 'description', e.target.value)}
                                className={`${field} resize-y`}
                                placeholder="Expliquez vos choix d'architecture, vos technologies et instructions pour tester…"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={saving === item.id}
                              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9F06A] hover:bg-[#D8F87C] px-5 py-3 text-sm font-bold text-black transition-all shadow-md disabled:opacity-50 cursor-pointer"
                            >
                              {saving === item.id ? (
                                <LoaderCircle size={16} className="animate-spin" />
                              ) : (
                                <Upload size={16} />
                              )}
                              Soumettre mon projet au jury
                            </button>
                          </form>
                        ) : item.statut === 'A_VENIR' ? (
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                            ⏳ Ce sprint n'a pas encore débuté. Les soumissions ouvriront à la date de début.
                          </div>
                        ) : (
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/50">
                            Clôturé · Les soumissions pour ce sprint sont fermées.
                          </div>
                        )}

                        {/* Classement */}
                        <div className="mt-4">
                          <button
                            type="button"
                            onClick={() => toggleRanking(item.id)}
                            className="inline-flex items-center gap-2 text-xs font-bold text-[#C9F06A] hover:underline cursor-pointer"
                          >
                            <Trophy size={14} />
                            {rankingOpen[item.id] ? 'Masquer le classement du sprint' : 'Voir le classement du sprint'}
                          </button>

                          {rankingOpen[item.id] && (
                            <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-[#101915]">
                              <div className="border-b border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white flex justify-between">
                                <span>Développeur</span>
                                <span>Note</span>
                              </div>
                              {rankingLoading === item.id ? (
                                <p className="p-4 text-xs text-white/50 text-center">
                                  <LoaderCircle className="mr-2 inline animate-spin" size={14} />
                                  Calcul du classement…
                                </p>
                              ) : rankings[item.id]?.length ? (
                                <ol className="divide-y divide-white/10">
                                  {rankings[item.id].map((entry, index) => (
                                    <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-xs">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <span className="font-bold w-5">{medalIcon(index)}</span>
                                        <span className="font-semibold truncate text-white">
                                          {entry.pseudo || `${entry.prenom} ${entry.nom}`}
                                        </span>
                                        {entry.urlDepot && (
                                          <a
                                            href={entry.urlDepot}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-white/40 hover:text-white"
                                            title="Voir le dépôt GitHub"
                                          >
                                            <ExternalLink size={12} />
                                          </a>
                                        )}
                                      </div>
                                      <span className="font-extrabold text-[#C9F06A] font-mono">
                                        {entry.score} pts
                                      </span>
                                    </li>
                                  ))}
                                </ol>
                              ) : (
                                <p className="p-4 text-xs text-white/50 text-center">
                                  Aucune soumission évaluée pour le moment.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {/* CONTENU ONGLET 2 : HACKATHON TEAM MENSUEL */}
        {activeTab === 'team' && (
          <section className="space-y-6">
            {/* Bannière Grand Hackathon */}
            <div className="rounded-3xl border border-[#C9F06A]/30 bg-gradient-to-br from-[#16221C] via-[#101915] to-[#18251E] p-6 sm:p-10 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="rounded-full border border-[#C9F06A]/40 bg-[#C9F06A]/10 px-4 py-1 text-xs font-bold text-[#C9F06A] uppercase tracking-widest">
                  Hackathon Mensuel Panafricain #1
                </span>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
                  Édition en cours · Clôture fin du mois
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Concevoir une plateforme de gestion de mentorat pour développeurs africains
              </h2>
              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-3xl leading-relaxed">
                Formez une équipe pluridisciplinaire (Frontend, Backend, UI/UX, DevOps) issue d'au moins deux pays africains différents. Répartissez-vous les tâches sur GitHub et livrez un produit collectif complet avec démo en ligne.
              </p>

              {/* Les 4 étapes d'équipe */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5">
                  <div className="flex items-center gap-2 text-[#C9F06A] font-bold text-sm mb-2">
                    <Users size={17} /> 1. Constituer l'équipe
                  </div>
                  <p className="text-xs text-white/60">
                    Trouvez 2 à 4 coéquipiers aux compétences complémentaires via notre algorithme de Smart Match.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5">
                  <div className="flex items-center gap-2 text-[#C9F06A] font-bold text-sm mb-2">
                    <GitBranch size={17} /> 2. Collaborer sur Git
                  </div>
                  <p className="text-xs text-white/60">
                    Création d'un repo partagé, branches de fonctionnalités, revues de code et intégration continue.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5">
                  <div className="flex items-center gap-2 text-[#C9F06A] font-bold text-sm mb-2">
                    <Rocket size={17} /> 3. Déployer en ligne
                  </div>
                  <p className="text-xs text-white/60">
                    Mise en production accessible avec base de données active et URL testable pour le jury.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#16221C]/80 p-5">
                  <div className="flex items-center gap-2 text-[#C9F06A] font-bold text-sm mb-2">
                    <Award size={17} /> 4. Évaluation collective
                  </div>
                  <p className="text-xs text-white/60">
                    Notation sur l'architecture, l'ergonomie, la collaboration Git et l'impact continental.
                  </p>
                </div>
              </div>

              {/* Actions d'équipe */}
              <div className="mt-8 flex flex-wrap gap-4 pt-6 border-t border-white/10">
                <Link
                  to="/smart-match"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] hover:bg-[#D8F87C] px-6 py-3.5 text-xs font-bold text-black uppercase tracking-wider transition shadow-lg shadow-[#C9F06A]/20"
                >
                  <Sparkles size={16} />
                  <span>Matcher avec des coéquipiers</span>
                </Link>

                <Link
                  to="/projects/create"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider transition"
                >
                  <Rocket size={16} className="text-[#C9F06A]" />
                  <span>Déclarer mon projet d'équipe</span>
                </Link>

                <Link
                  to="/developers"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 py-3.5 text-xs font-semibold text-white uppercase tracking-wider transition"
                >
                  <Users size={16} />
                  <span>Annuaire des talents des 54 pays</span>
                </Link>
              </div>
            </div>

            {/* Liste des compétitions d'équipe en base */}
            {teamCompetitions.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Compétitions d'équipe programmées</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {teamCompetitions.map((item) => (
                    <div key={item.id} className={panel}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-[#C9F06A]">{item.theme}</span>
                        {statusBadge(item.statut)}
                      </div>
                      <h4 className="text-lg font-bold text-white">{item.titre}</h4>
                      <p className="text-xs text-white/60 mt-2">{item.description}</p>
                      <div className="mt-4 text-xs text-white/50">
                        Points max : <span className="text-[#C9F06A] font-bold">{item.pointsMaximum}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* CONTENU ONGLET 3 : HALL OF FAME (PANTHÉON) */}
        {activeTab === 'hall-of-fame' && (
          <section className="space-y-8">
            {/* En-tête Hall of Fame */}
            <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 via-[#16221C] to-amber-500/10 p-6 sm:p-8 text-center">
              <Trophy size={42} className="mx-auto text-amber-300 mb-3" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Le Panthéon des Bâtisseurs Africains
              </h2>
              <p className="mt-2 text-sm text-white/70 max-w-xl mx-auto">
                La mémoire vivante de l'excellence technologique. Retrouvez ici les champions des sprints solo, les équipes légendaires et les distinctions de la communauté.
              </p>
            </div>

            {/* Podium des Champions Solo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Medal size={20} className="text-[#C9F06A]" /> Champions Solo Récents
                </h3>
                <span className="text-xs text-white/50">Mis à jour après chaque sprint</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1ère Place */}
                <div className="rounded-2xl border-2 border-[#C9F06A]/40 bg-gradient-to-b from-[#C9F06A]/10 to-[#16221C] p-6 text-center shadow-xl order-1 md:order-2 scale-103">
                  <div className="text-4xl mb-2">🥇</div>
                  <span className="rounded-full bg-[#C9F06A] text-black text-[10px] font-extrabold px-3 py-1 uppercase tracking-widest font-mono">
                    1ère Place · Champion
                  </span>
                  <h4 className="mt-4 text-lg font-bold text-white">Amadou Diallo</h4>
                  <p className="text-xs text-white/60">🇸🇳 Sénégal · Backend Senior</p>
                  <p className="mt-3 text-xs font-mono text-[#C9F06A] font-extrabold bg-black/30 rounded-lg py-1.5 px-3">
                    Projet : Microservices Fintech (98/100)
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      Sprint #4
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-[#C9F06A]">
                      +100 pts
                    </span>
                  </div>
                </div>

                {/* 2ème Place */}
                <div className="rounded-2xl border border-white/15 bg-[#16221C] p-6 text-center shadow-lg order-2 md:order-1">
                  <div className="text-4xl mb-2">🥈</div>
                  <span className="rounded-full bg-white/10 text-white/80 text-[10px] font-bold px-3 py-1 uppercase tracking-widest font-mono">
                    2ème Place
                  </span>
                  <h4 className="mt-4 text-lg font-bold text-white">Grace Kouadio</h4>
                  <p className="text-xs text-white/60">🇨🇮 Côte d'Ivoire · Fullstack</p>
                  <p className="mt-3 text-xs font-mono text-white/80 bg-black/30 rounded-lg py-1.5 px-3">
                    Projet : Auth OAuth2 & RBAC (94/100)
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      Sprint #4
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      +80 pts
                    </span>
                  </div>
                </div>

                {/* 3ème Place */}
                <div className="rounded-2xl border border-white/15 bg-[#16221C] p-6 text-center shadow-lg order-3">
                  <div className="text-4xl mb-2">🥉</div>
                  <span className="rounded-full bg-white/10 text-white/80 text-[10px] font-bold px-3 py-1 uppercase tracking-widest font-mono">
                    3ème Place
                  </span>
                  <h4 className="mt-4 text-lg font-bold text-white">David Mwangi</h4>
                  <p className="text-xs text-white/60">🇰🇪 Kenya · Cloud & DevOps</p>
                  <p className="mt-3 text-xs font-mono text-white/80 bg-black/30 rounded-lg py-1.5 px-3">
                    Projet : CI/CD Pipeline Docker (91/100)
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      Sprint #4
                    </span>
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                      +70 pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Les Équipes Légendaires */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users size={20} className="text-[#C9F06A]" /> Équipes Gagnantes des Hackathons
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rounded-2xl border border-white/10 bg-[#16221C] p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-[#C9F06A] uppercase tracking-wider font-mono">
                        Vainqueur Hackathon Octobre 2026
                      </span>
                      <h4 className="text-xl font-bold text-white mt-1">Team Sahel AgriTech</h4>
                    </div>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <p className="text-xs text-white/70 mt-3 leading-relaxed">
                    Plateforme IoT et SMS basse connectivité pour agriculteurs. Équipe collaborative réunissant 4 développeurs du Sénégal, du Mali et du Niger.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/60">
                    <span className="rounded-md bg-white/5 px-2 py-1">Spring Boot</span>
                    <span className="rounded-md bg-white/5 px-2 py-1">React Native</span>
                    <span className="rounded-md bg-white/5 px-2 py-1">MQTT / LoRa</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#16221C] p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-[#C9F06A] uppercase tracking-wider font-mono">
                        Vainqueur Hackathon Septembre 2026
                      </span>
                      <h4 className="text-xl font-bold text-white mt-1">Team PayAfrik Switch</h4>
                    </div>
                    <span className="text-2xl">🏆</span>
                  </div>
                  <p className="text-xs text-white/70 mt-3 leading-relaxed">
                    Passerelle unifiée de paiement Mobile Money transfrontalière entre la zone UEMOA et l'Afrique de l'Est.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/60">
                    <span className="rounded-md bg-white/5 px-2 py-1">Java 21</span>
                    <span className="rounded-md bg-white/5 px-2 py-1">PostgreSQL</span>
                    <span className="rounded-md bg-white/5 px-2 py-1">Docker</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Galerie des Badges d'Excellence */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#C9F06A]" /> Badges d'Excellence & Réputation
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-white/10 bg-[#16221C] p-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#C9F06A]/15 border border-[#C9F06A]/40 flex items-center justify-center text-[#C9F06A] mb-3">
                    <Trophy size={22} />
                  </div>
                  <h5 className="font-bold text-xs text-white">Challenge Master</h5>
                  <p className="text-[11px] text-white/50 mt-1">5 défis réussis</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#16221C] p-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400 mb-3">
                    <Rocket size={22} />
                  </div>
                  <h5 className="font-bold text-xs text-white">Builder Panafricain</h5>
                  <p className="text-[11px] text-white/50 mt-1">Projet mené à terme</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#16221C] p-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-sky-400/15 border border-sky-400/40 flex items-center justify-center text-sky-400 mb-3">
                    <Sparkles size={22} />
                  </div>
                  <h5 className="font-bold text-xs text-white">Problem Solver</h5>
                  <p className="text-[11px] text-white/50 mt-1">Solutions communautaires</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#16221C] p-4 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-400/15 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3">
                    <Award size={22} />
                  </div>
                  <h5 className="font-bold text-xs text-white">Rising Developer</h5>
                  <p className="text-[11px] text-white/50 mt-1">Étoile montante</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
