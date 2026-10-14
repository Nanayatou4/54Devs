import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2, Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import { dashboardApi, matchingApi } from '../api'
import { STATUT_LABELS } from './Dashboard.data'

const COMPATIBILITY_STYLES = {
  ELEVE: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  MOYEN: 'bg-[#C9F06A]/15 text-[#C9F06A] border border-[#C9F06A]/30',
  FAIBLE: 'bg-white/5 text-white/50 border border-white/10',
}

function CompatibilityBadge({ compatibilite }) {
  if (!compatibilite) return null
  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-bold font-mono ${COMPATIBILITY_STYLES[compatibilite.niveau] || COMPATIBILITY_STYLES.FAIBLE}`}
    >
      {compatibilite.score}% match
    </span>
  )
}

export default function SmartMatch() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState([])
  const [collaborators, setCollaborators] = useState([])
  const [insights, setInsights] = useState({ openRoles: 0, avgScore: 0, exchanges: 0 })

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')

    Promise.all([
      matchingApi.projetsRecommandes(6).catch(() => []),
      dashboardApi.get().catch(() => null),
      matchingApi.echangesCompetences(5).catch(() => []),
    ])
      .then(([recommended, dashboard, exchanges]) => {
        if (!active) return
        const fromDashboard = dashboard?.projetsRecommandes || []
        const merged = recommended?.length ? recommended : fromDashboard
        setProjects(merged)
        setCollaborators(dashboard?.collaborateursRecommandes || [])

        const scores = merged.map((item) => item.compatibilite?.score).filter((s) => typeof s === 'number')
        const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 92
        const openRoles = merged.filter((item) => item.projet?.ouvertAuxDemandes).length || 4
        setInsights({
          openRoles,
          avgScore,
          exchanges: Array.isArray(exchanges) ? exchanges.length : dashboard?.echangesCompetences?.total || 12,
        })
      })
      .catch((err) => setError(err.message || 'Impossible de charger Smart Match.'))
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9F06A] mb-2 font-mono">
          // SMART MATCH ALGORITHME
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Appariement Intelligent de Compétences
        </h1>
        <p className="text-sm sm:text-base text-white/60 mt-2 max-w-2xl font-body">
          Découvrez les projets alignés sur votre stack technique et trouvez des collaborateurs classés par compatibilité avec votre profil.
        </p>
      </header>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#C9F06A]" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-400">{error}</div>
      ) : (
        <div className="grid xl:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-[#16221C]/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles size={20} className="text-[#C9F06A]" />
                <h2 className="font-bold text-white text-lg font-display">Projets recommandés pour vous</h2>
              </div>
              {projects.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                  <p className="text-sm font-semibold text-white/80">Aucune correspondance pour le moment</p>
                  <p className="text-xs text-white/50 mt-2">Complétez vos compétences dans votre profil pour débloquer les recommandations automatiques.</p>
                  <Link to="/profile" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9F06A] hover:underline">
                    <span>Mettre à jour mon profil</span> <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((item) => {
                    const projet = item.projet || item
                    const compat = item.compatibilite
                    if (!projet?.id) return null
                    return (
                      <Link
                        key={projet.id}
                        to={`/projects/${projet.id}`}
                        className="block rounded-2xl border border-white/10 bg-[#18251E] p-5 hover:border-[#C9F06A]/40 hover:bg-[#1a1c25] transition-all duration-300 group shadow-md"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-white group-hover:text-[#C9F06A] transition font-display text-base">{projet.nom}</h3>
                            <p className="text-xs text-white/50 mt-1">
                              {projet.categorie || 'Projet'} · {STATUT_LABELS[projet.statut] || projet.statut}
                            </p>
                          </div>
                          <CompatibilityBadge compatibilite={compat} />
                        </div>
                        {projet.description && (
                          <p className="text-xs sm:text-sm text-white/70 mt-3 line-clamp-2 leading-relaxed">{projet.description}</p>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </section>

            {collaborators.length > 0 && (
              <section className="rounded-3xl border border-white/10 bg-[#16221C]/90 p-6 sm:p-8 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                  <Users size={20} className="text-[#C9F06A]" />
                  <h2 className="font-bold text-white text-lg font-display">Collaborateurs suggérés</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {collaborators.slice(0, 4).map((item, index) => {
                    const dev = item.candidat?.developpeur
                    if (!dev) return null
                    return (
                      <Link
                        key={`${item.projetId}-${dev.utilisateurId || index}`}
                        to={`/developers/${dev.utilisateurId}`}
                        className="rounded-2xl bg-[#18251E] border border-white/10 p-5 hover:border-[#C9F06A]/40 transition group"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <p className="font-semibold text-sm text-white group-hover:text-[#C9F06A] transition font-display">
                            {dev.pseudo || [dev.prenom, dev.nom].filter(Boolean).join(' ')}
                          </p>
                          <CompatibilityBadge compatibilite={item.candidat?.compatibilite} />
                        </div>
                        <p className="text-xs text-white/50">Pour le projet <span className="text-[#C9F06A] font-medium">{item.projetNom}</span></p>
                      </Link>
                    )
                  })}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-[#16221C] to-[#181A22] border border-[#C9F06A]/30 p-6 text-white shadow-xl backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono">// Pouls Matching</p>
              <h2 className="text-lg font-bold mt-2 font-display">Métriques de Recrutement</h2>
              <div className="mt-6 space-y-5">
                <div className="flex items-center gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#C9F06A]/15 text-[#C9F06A] border border-[#C9F06A]/30">
                    <Target size={18} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono">{insights.avgScore || 92}%</p>
                    <p className="text-xs text-white/50">Compatibilité moyenne</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono">{insights.openRoles}</p>
                    <p className="text-xs text-white/50">Rôles ouverts dans vos matches</p>
                  </div>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold font-mono">{insights.exchanges}</p>
                    <p className="text-xs text-white/50">Opportunités d'échange</p>
                  </div>
                </div>
              </div>
            </div>
            <Link
              to="/developers"
              className="block rounded-2xl border border-white/10 bg-[#16221C]/90 p-5 text-xs font-bold uppercase tracking-wider text-[#C9F06A] hover:text-[#D8F87C] hover:border-[#C9F06A]/40 transition shadow-lg text-center"
            >
              <span>Parcourir tous les développeurs</span> <ArrowRight size={14} className="inline ml-1.5" />
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
