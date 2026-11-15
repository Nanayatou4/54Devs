import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  LoaderCircle,
  Save,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react'
import { adminCompetitionsApi, getStoredUser } from '../api'

const box = 'rounded-2xl border border-white/10 bg-[#16221C]/90 p-5 sm:p-6 shadow-xl backdrop-blur-sm'
const input =
  'w-full rounded-xl border border-white/15 bg-[#18251E] px-3.5 py-2.5 text-sm text-white placeholder-white/35 outline-none transition focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20'

export default function AdminCompetitionManagement() {
  const user = getStoredUser()
  const [competitions, setCompetitions] = useState([])
  const [selected, setSelected] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [drafts, setDrafts] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadCompetitions() {
    setError('')
    try {
      const data = await adminCompetitionsApi.lister()
      setCompetitions(data)
      if (!selected && data.length) setSelected(String(data[0].id))
    } catch (err) {
      setError(err.message || 'Chargement impossible.')
    } finally {
      setLoading(false)
    }
  }

  async function loadSubmissions(id) {
    if (!id) {
      setSubmissions([])
      return
    }
    try {
      const data = await adminCompetitionsApi.soumissions(id)
      setSubmissions(data)
      setDrafts(
        Object.fromEntries(
          data.map((s) => [
            s.id,
            { score: String(s.score ?? 0), retourEvaluation: s.retourEvaluation || '' },
          ])
        )
      )
    } catch (err) {
      setError(err.message || 'Impossible de charger les dépôts.')
    }
  }

  useEffect(() => {
    loadCompetitions()
  }, [])

  useEffect(() => {
    loadSubmissions(selected)
  }, [selected])

  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />

  async function saveEvaluation(submission) {
    const draft = drafts[submission.id] || {}
    setSaving(submission.id)
    setError('')
    setSuccess('')
    try {
      await adminCompetitionsApi.evaluer(Number(selected), submission.id, {
        score: Number(draft.score),
        retourEvaluation: draft.retourEvaluation || '',
      })
      setSuccess(`Évaluation enregistrée pour ${submission.pseudo || submission.prenom} !`)
      await loadSubmissions(selected)
    } catch (err) {
      setError(err.message || 'Évaluation impossible.')
    } finally {
      setSaving(null)
    }
  }

  const currentCompetition = competitions.find((c) => String(c.id) === selected)

  return (
    <main className="min-h-screen bg-[#101915] px-4 py-8 text-white sm:px-6 lg:px-8 md:py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Navigation retour */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin?tab=challenges"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-[#C9F06A] transition uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Retour au Panneau d'Administration
          </Link>
          <Link
            to="/admin/competitions/creer"
            className="text-xs font-bold text-[#C9F06A] hover:underline"
          >
            + Créer une nouvelle compétition ↗
          </Link>
        </div>

        {/* En-tête Console Jury */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#16221C] via-[#101915] to-[#16221C] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9F06A]/10 text-[#C9F06A] border border-[#C9F06A]/30">
              <Trophy size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9F06A] font-mono">
              Console d'Évaluation du Jury
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Notation & Feedbacks des Projets Soumis
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-2xl leading-relaxed">
            Passez en revue les dépôts GitHub des participants, testez leurs réalisations et attribuez les scores officiels avec des commentaires constructifs.
          </p>
        </header>

        {/* Alertes */}
        {success && (
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200 shadow-xl">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            {success}
          </div>
        )}
        {error && (
          <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200 shadow-xl">
            {error}
          </div>
        )}

        {/* Sélecteur de Compétition */}
        <div className={box}>
          <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-2">
            Sélectionnez la compétition à évaluer
          </label>
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-[#18251E] px-4 py-3 text-sm text-white font-semibold outline-none focus:border-[#C9F06A] transition cursor-pointer"
          >
            {competitions.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#18251E]">
                {c.titre} ({c.theme} · {c.pointsMaximum} pts max)
              </option>
            ))}
          </select>

          {currentCompetition && (
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/60 border-t border-white/10 pt-3">
              <span>Format : <strong className="text-white">{currentCompetition.type === 'SOLO' ? 'Solo Hebdo' : 'Équipe'}</strong></span>
              <span>Barème : <strong className="text-[#C9F06A] font-mono">{currentCompetition.pointsMaximum} points max</strong></span>
              <span>Soumissions reçues : <strong className="text-white font-mono">{submissions.length}</strong></span>
            </div>
          )}
        </div>

        {/* Liste des Soumissions à évaluer */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users size={18} className="text-[#C9F06A]" /> Candidatures des Développeurs ({submissions.length})
            </h2>
          </div>

          {loading ? (
            <div className={`${box} py-12 text-center text-xs text-white/50`}>
              <LoaderCircle className="mr-2 inline animate-spin text-[#C9F06A]" size={16} />
              Chargement des projets soumis…
            </div>
          ) : submissions.length === 0 ? (
            <div className={`${box} py-12 text-center text-xs text-white/50`}>
              Aucun participant n'a encore soumis de dépôt pour cette compétition.
            </div>
          ) : (
            <div className="space-y-5">
              {submissions.map((sub) => {
                const draft = drafts[sub.id] || { score: '0', retourEvaluation: '' }
                const maxPts = currentCompetition?.pointsMaximum || 100

                return (
                  <article
                    key={sub.id}
                    className="rounded-3xl border border-white/10 bg-[#16221C] p-6 shadow-xl space-y-5 hover:border-white/20 transition"
                  >
                    {/* En-tête soumission */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">
                            {sub.pseudo || `${sub.prenom} ${sub.nom}`}
                          </span>
                          {sub.evaluee ? (
                            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                              Évalué ({sub.score} pts)
                            </span>
                          ) : (
                            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-300 animate-pulse">
                              En attente d'évaluation
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 mt-1">
                          Soumis le {new Date(sub.dateSoumission).toLocaleString('fr-FR')}
                        </p>
                      </div>

                      {/* Lien GitHub bouton pro */}
                      {sub.urlDepot && (
                        <a
                          href={sub.urlDepot}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-[#C9F06A]/40 bg-[#C9F06A]/10 hover:bg-[#C9F06A]/20 px-4 py-2 text-xs font-bold text-[#C9F06A] transition shrink-0"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          <span>Examiner le code sur GitHub</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>

                    {/* Note d'approche du candidat */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1.5">
                        Explications & Approche technique du développeur :
                      </h4>
                      <p className="rounded-xl border border-white/5 bg-[#101915] p-4 text-xs text-white/80 leading-relaxed whitespace-pre-wrap">
                        {sub.description || 'Aucune description fournie.'}
                      </p>
                    </div>

                    {/* Bloc Notation du Jury */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end border-t border-white/10 pt-4">
                      <div className="sm:col-span-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                          Note attribuée (max {maxPts})
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={maxPts}
                            value={draft.score}
                            onChange={(e) =>
                              setDrafts((prev) => ({
                                ...prev,
                                [sub.id]: { ...draft, score: e.target.value },
                              }))
                            }
                            className={input}
                          />
                          <span className="absolute right-3 top-2.5 text-xs text-white/40 font-mono">
                            /{maxPts}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-1.5">
                          Commentaire & Conseils du Jury
                        </label>
                        <input
                          type="text"
                          maxLength={2000}
                          placeholder="Points forts, architecture, pistes d'amélioration..."
                          value={draft.retourEvaluation}
                          onChange={(e) =>
                            setDrafts((prev) => ({
                              ...prev,
                              [sub.id]: { ...draft, retourEvaluation: e.target.value },
                            }))
                          }
                          className={input}
                        />
                      </div>

                      <div className="sm:col-span-1">
                        <button
                          type="button"
                          disabled={saving === sub.id}
                          onClick={() => saveEvaluation(sub)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9F06A] hover:bg-[#D8F87C] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all shadow-md disabled:opacity-50 cursor-pointer"
                        >
                          {saving === sub.id ? (
                            <LoaderCircle size={15} className="animate-spin" />
                          ) : (
                            <Save size={15} />
                          )}
                          <span>Valider la note</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
