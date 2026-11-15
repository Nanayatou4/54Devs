import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink, LoaderCircle, Save, Trophy } from 'lucide-react'
import { adminCompetitionsApi, getStoredUser } from '../api'

const box = 'rounded-2xl border border-white/10 bg-[#16221C]/90 p-5'
const input = 'w-full rounded-xl border border-white/15 bg-[#101915] px-3 py-2.5 text-sm text-white outline-none focus:border-[#C9F06A]'

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
    } catch (err) { setError(err.message || 'Chargement impossible.') }
    finally { setLoading(false) }
  }
  async function loadSubmissions(id) {
    if (!id) { setSubmissions([]); return }
    try {
      const data = await adminCompetitionsApi.soumissions(id)
      setSubmissions(data)
      setDrafts(Object.fromEntries(data.map(s => [s.id, { score: String(s.score ?? 0), retourEvaluation: s.retourEvaluation || '' }])))
    } catch (err) { setError(err.message || 'Impossible de charger les dépôts.') }
  }
  useEffect(() => { loadCompetitions() }, [])
  useEffect(() => { loadSubmissions(selected) }, [selected])

  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />

  async function save(submission) {
    const draft = drafts[submission.id] || {}
    setSaving(submission.id); setError(''); setSuccess('')
    try {
      await adminCompetitionsApi.evaluer(Number(selected), submission.id, {
        score: Number(draft.score), retourEvaluation: draft.retourEvaluation || '',
      })
      setSuccess('Évaluation enregistrée.')
      await loadSubmissions(selected)
    } catch (err) { setError(err.message || 'Évaluation impossible.') }
    finally { setSaving(null) }
  }

  const competition = competitions.find(c => String(c.id) === selected)
  return <main className="min-h-screen bg-[#101915] px-4 py-8 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl">
      <Link to="/admin?tab=challenges" className="mb-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-[#C9F06A]"><ArrowLeft size={16}/> Administration</Link>
      <header className="mb-7"><p className="text-xs font-bold uppercase tracking-widest text-[#C9F06A]">Jury · Administration</p><h1 className="mt-2 text-3xl font-extrabold">Évaluation des compétitions</h1><p className="mt-2 text-sm text-white/55">Consultez les dépôts GitHub et attribuez un score avec un retour au participant.</p></header>
      {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
      {success && <p role="status" className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">{success}</p>}
      <section className={box}>
        <label className="block text-sm font-semibold">Compétition
          <select value={selected} onChange={e => setSelected(e.target.value)} className={input + ' mt-2'}>
            {competitions.map(c => <option key={c.id} value={c.id} className="bg-[#101915]">{c.titre}</option>)}
          </select>
        </label>
        {competition && <p className="mt-3 text-xs text-white/45">{competition.pointsMaximum} points maximum · {competition.statut}</p>}
      </section>
      <div className="mt-5 space-y-4">
        {loading ? <div className={box + ' text-center text-white/50'}><LoaderCircle className="mr-2 inline animate-spin"/>Chargement…</div>
          : !selected ? <div className={box + ' text-center text-white/50'}>Aucune compétition créée.</div>
            : submissions.length === 0 ? <div className={box + ' text-center text-white/50'}>Aucune soumission pour cette compétition.</div>
              : submissions.map(s => {
                const draft = drafts[s.id] || {}
                return <article key={s.id} className={box}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div><h2 className="font-bold">{s.pseudo || [s.prenom, s.nom].filter(Boolean).join(' ')}</h2><p className="mt-1 text-xs text-white/45">Soumis le {new Date(s.dateSoumission).toLocaleString('fr-FR')}</p></div>
                    <a href={s.urlDepot} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-[#C9F06A]/30 px-3 py-2 text-xs font-semibold text-[#C9F06A] hover:bg-[#C9F06A]/10"><ExternalLink size={14}/> Ouvrir le dépôt GitHub</a>
                  </div>
                  <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-white/70">{s.description}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-[150px_1fr]">
                    <label className="text-xs font-semibold text-white/65">Score / {competition?.pointsMaximum || '—'}
                      <input type="number" min="0" max={competition?.pointsMaximum || 1000} value={draft.score ?? 0} onChange={e => setDrafts(d => ({...d,[s.id]:{...d[s.id],score:e.target.value}}))} className={input + ' mt-2'}/>
                    </label>
                    <label className="text-xs font-semibold text-white/65">Retour du jury
                      <textarea rows={2} maxLength={2000} value={draft.retourEvaluation || ''} onChange={e => setDrafts(d => ({...d,[s.id]:{...d[s.id],retourEvaluation:e.target.value}}))} className={input + ' mt-2 resize-y'} placeholder="Points forts, axes d'amélioration…"/>
                    </label>
                  </div>
                  <div className="mt-3 flex justify-end"><button onClick={() => save(s)} disabled={saving === s.id} className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2.5 text-xs font-bold text-[#101915] disabled:opacity-50">{saving === s.id ? <LoaderCircle size={14} className="animate-spin"/> : <Save size={14}/>} Enregistrer l'évaluation</button></div>
                </article>
              })}
      </div>
      <div className="mt-6 flex items-center gap-2 text-xs text-white/40"><Trophy size={14}/> Le classement est visible par les membres après la clôture de la compétition.</div>
    </div>
  </main>
}
