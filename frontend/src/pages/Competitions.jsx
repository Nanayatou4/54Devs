import { useEffect, useState } from 'react'
import { CalendarDays, LoaderCircle, Medal, Trophy, Upload } from 'lucide-react'
import { competitionsApi } from '../api'

const panel = 'rounded-2xl border border-white/10 bg-[#16221C]/90 p-5 sm:p-6 shadow-xl'
const field = 'w-full min-w-0 rounded-xl border border-white/15 bg-[#18251E] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20'

function dateLabel(value) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
}
function statusLabel(status) {
  if (status === 'A_VENIR') return 'À venir'
  if (status === 'TERMINEE') return 'Terminée'
  return 'En cours'
}
function medal(rank) {
  if (rank === 0) return '🥇'
  if (rank === 1) return '🥈'
  if (rank === 2) return '🥉'
  return `#${rank + 1}`
}

export default function Competitions() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [forms, setForms] = useState({})
  const [saving, setSaving] = useState(null)
  const [notice, setNotice] = useState('')
  const [rankings, setRankings] = useState({})
  const [rankingLoading, setRankingLoading] = useState(null)
  const [rankingOpen, setRankingOpen] = useState({})

  async function load() {
    setError('')
    try { setItems(await competitionsApi.lister()) }
    catch (err) { setError(err.message || 'Impossible de charger les compétitions.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])
  function update(id, key, value) {
    setForms(current => ({ ...current, [id]: { ...current[id], [key]: value } }))
  }
  async function showRanking(id) {
    if (rankingOpen[id]) {
      setRankingOpen(current => ({ ...current, [id]: false }))
      return
    }
    setRankingOpen(current => ({ ...current, [id]: true }))
    if (rankings[id]) return
    setRankingLoading(id)
    try {
      const data = await competitionsApi.classement(id)
      setRankings(current => ({ ...current, [id]: data }))
    } catch (err) {
      setError(err.message || 'Impossible de charger le classement.')
      setRankingOpen(current => ({ ...current, [id]: false }))
    } finally { setRankingLoading(null) }
  }
  async function submit(event, competition) {
    event.preventDefault()
    const form = forms[competition.id] || {}
    setSaving(competition.id)
    setNotice('')
    setError('')
    try {
      await competitionsApi.soumettre(competition.id, { urlDepot: form.urlDepot?.trim(), description: form.description?.trim() })
      setNotice('Votre dépôt a bien été enregistré.')
      await load()
    } catch (err) { setError(err.message || 'La soumission a échoué.') }
    finally { setSaving(null) }
  }

  return <div className="min-h-screen bg-[#101915] px-4 py-8 text-white sm:px-6 lg:px-8 md:py-12">
    <main className="mx-auto max-w-6xl">
      <header className="mb-8">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[#C9F06A]">Connect · Learn · Build</p>
        <div className="flex flex-wrap items-center gap-3"><Trophy className="text-[#C9F06A]" size={28} /><h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Compétitions</h1></div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">Relevez des défis concrets, partagez votre solution et faites reconnaître votre savoir-faire.</p>
      </header>
      {notice && <div role="status" className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-200">{notice}</div>}
      {error && <div role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>}
      {loading ? <div className={panel + ' py-12 text-center text-white/55'}><LoaderCircle className="mr-2 inline animate-spin text-[#C9F06A]" size={18} />Chargement des compétitions…</div>
        : items.length === 0 ? <section className={panel + ' py-12 text-center'}><Trophy className="mx-auto mb-4 text-[#C9F06A]" size={34} /><h2 className="text-lg font-bold">Aucune compétition publiée pour le moment</h2><p className="mt-2 text-sm text-white/55">Les prochains défis apparaîtront ici. Revenez bientôt !</p></section>
        : <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {items.map(item => {
            const form = forms[item.id] || {}
            const canSubmit = item.statut === 'EN_COURS' && !item.dejaSoumis && item.type === 'SOLO'
            return <article key={item.id} className={panel + ' flex min-w-0 flex-col'}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><span className="rounded-full border border-[#C9F06A]/20 bg-[#C9F06A]/10 px-3 py-1 text-xs font-semibold text-[#C9F06A]">{item.theme}</span><span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">{statusLabel(item.statut)}</span></div>
              <h2 className="text-xl font-bold">{item.titre}</h2><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-white/65">{item.description}</p>
              <div className="mt-5 grid grid-cols-1 gap-2 text-xs text-white/55 sm:grid-cols-2">
                <span className="flex items-center gap-2"><CalendarDays size={14} className="shrink-0 text-[#C9F06A]"/>Début : {dateLabel(item.dateDebut)}</span>
                <span className="flex items-center gap-2"><CalendarDays size={14} className="shrink-0 text-[#C9F06A]"/>Fin : {dateLabel(item.dateFin)}</span>
                <span className="font-semibold text-[#C9F06A]">{item.pointsMaximum} points maximum</span><span>{item.type === 'SOLO' ? 'Participation individuelle' : 'Compétition en équipe (bientôt)'}</span>
              </div>
              {item.dejaSoumis ? <p className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">Soumission enregistrée · {item.monScore ?? 0} point(s)</p>
                : canSubmit ? <form onSubmit={event => submit(event, item)} className="mt-5 space-y-3 border-t border-white/10 pt-5">
                  <label className="block text-xs font-semibold text-white/75">Lien vers votre dépôt GitHub<input required type="url" maxLength={500} value={form.urlDepot || ''} onChange={e => update(item.id, 'urlDepot', e.target.value)} className={field + ' mt-2'} placeholder="https://github.com/votre-compte/votre-projet"/></label>
                  <label className="block text-xs font-semibold text-white/75">Présentez votre solution<textarea required maxLength={3000} rows={3} value={form.description || ''} onChange={e => update(item.id, 'description', e.target.value)} className={field + ' mt-2 resize-y'} placeholder="Expliquez vos choix techniques et votre approche…"/></label>
                  <button disabled={saving === item.id} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-3 text-sm font-bold text-[#101915] transition hover:bg-[#D8F87C] disabled:opacity-50 sm:w-auto">{saving === item.id ? <LoaderCircle size={16} className="animate-spin"/> : <Upload size={16}/>} Soumettre ma solution</button>
                </form> : item.statut === 'A_VENIR' ? <p className="mt-5 text-sm text-white/45">Les soumissions ouvriront à la date de début.</p>
                  : item.type === 'EQUIPE' ? <p className="mt-5 text-sm text-white/45">Le format équipe sera disponible dans une prochaine version.</p>
                    : <p className="mt-5 text-sm text-white/45">Les soumissions sont clôturées.</p>}
              {item.statut === 'TERMINEE' && item.type === 'SOLO' && <div className="mt-5 border-t border-white/10 pt-4">
                <button onClick={() => showRanking(item.id)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#C9F06A]/30 bg-[#C9F06A]/10 px-4 py-2 text-sm font-bold text-[#C9F06A] transition hover:bg-[#C9F06A]/20"><Trophy size={16}/> {rankingOpen[item.id] ? 'Masquer le classement' : 'Voir le classement'}</button>
                {rankingOpen[item.id] && <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
                  <div className="border-b border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-bold">Classement final</div>
                  {rankingLoading === item.id ? <p className="p-4 text-sm text-white/50"><LoaderCircle className="mr-2 inline animate-spin" size={15}/>Chargement du classement…</p>
                    : rankings[item.id]?.length ? <ol className="divide-y divide-white/10">
                      {rankings[item.id].map((entry, index) => <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-3"><span className="w-8 shrink-0 text-center text-lg">{medal(index)}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{entry.pseudo || [entry.prenom, entry.nom].filter(Boolean).join(' ')}</p>{entry.retourEvaluation && <p className="mt-1 line-clamp-2 text-xs text-white/45">{entry.retourEvaluation}</p>}</div></div>
                        <span className="shrink-0 text-sm font-extrabold text-[#C9F06A]">{entry.score} pts</span>
                      </li>)}
                    </ol> : <p className="p-4 text-sm text-white/50">Aucune soumission pour cette compétition.</p>}
                </div>}
              </div>}
            </article>
          })}
        </div>}
    </main>
  </div>
}
