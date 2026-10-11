import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Award, CheckCircle2, Clock3, Code2, Flame,
  Lightbulb, LoaderCircle, Medal, MessageSquareText, Send, ShieldCheck, Trophy,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import { challengesApi } from '../api'
import { styles } from './Challenges.styles'

const TYPES = [
  ['DEBUG', 'Débogage'], ['ALGORITHME', 'Algorithme'], ['SECURITE', 'Sécurité'],
  ['ARCHITECTURE', 'Architecture'], ['TECHNOLOGIE', 'Technologie'], ['AFRIQUE', 'Enjeux africains'],
]
const DIFFICULTIES = [['FACILE', 'Facile'], ['MOYEN', 'Intermédiaire'], ['DIFFICILE', 'Difficile']]
const TYPE_LABELS = Object.fromEntries(TYPES)
const DIFFICULTY_LABELS = Object.fromEntries(DIFFICULTIES)

function nameOf(user) {
  return user?.pseudo || [user?.prenom, user?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

function dateLabel(date) {
  if (!date) return '—'
  const parsed = new Date(`${date}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(parsed)
}

function statusLabel(participation) {
  if (!participation) return 'Pas encore commencé'
  if (participation.statut === 'REUSSIE') return 'Réussi'
  if (participation.statut === 'ECHOUEE') return 'Essais épuisés'
  return 'En cours'
}

function ChallengeCard({ challenge }) {
  const completed = challenge.maParticipation?.statut === 'REUSSIE'
  return (
    <Link to={`/challenges/${challenge.id}`} className={`${styles.challenge} group`}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-900 text-blue-300"><Code2 size={22} /></div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`${styles.pill} bg-blue-50 text-blue-700`}>{TYPE_LABELS[challenge.type] || challenge.type}</span>
            <span className={`${styles.pill} ${challenge.difficulte === 'DIFFICILE' ? 'bg-orange-50 text-orange-700' : challenge.difficulte === 'MOYEN' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>{DIFFICULTY_LABELS[challenge.difficulte] || challenge.difficulte}</span>
            {completed && <span className={`${styles.pill} bg-emerald-50 text-emerald-700`}><CheckCircle2 size={12} className="mr-1" />Réussi</span>}
            {!challenge.ouvert && <span className={`${styles.pill} bg-slate-100 text-slate-500`}>Terminé</span>}
          </div>
          <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition">{challenge.titre}</h2>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Award size={14} className="text-blue-600" />{challenge.points} points</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} />{challenge.nombreReussites} réussite{challenge.nombreReussites === 1 ? '' : 's'}</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} />Jusqu’au {dateLabel(challenge.dateFin)}</span>
            {challenge.maParticipation && <span>{statusLabel(challenge.maParticipation)}</span>}
          </div>
        </div>
        <ArrowRight size={18} className="hidden sm:block mt-1 text-slate-300 group-hover:text-blue-600 transition" />
      </div>
    </Link>
  )
}

function Leaderboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => {
    challengesApi.classement({ taille: 5 }).then(setData).catch(err => setError(err.message || 'Classement indisponible.'))
  }, [])
  const rows = data?.classement?.contenu || []
  const mine = data?.moi

  return (
    <section className={`${styles.panel} overflow-hidden`}>
      <div className="p-5 border-b border-slate-100 flex items-center gap-2"><Trophy size={17} className="text-amber-500" /><h2 className="font-bold text-sm">Classement</h2></div>
      {mine && <div className="mx-4 mt-4 rounded-xl bg-blue-50 p-4">
        <p className="text-[11px] uppercase tracking-wider font-bold text-blue-700">Votre progression</p>
        <div className="flex items-end justify-between mt-2"><span className="font-bold text-slate-900">{mine.rang ? `Rang ${mine.rang}` : 'Pas encore classé'}</span><span className="text-sm font-bold text-blue-700">{mine.scoreTotal} pts</span></div>
        <p className="text-xs text-slate-500 mt-1">{mine.challengesReussis} challenge{mine.challengesReussis === 1 ? '' : 's'} réussi{mine.challengesReussis === 1 ? '' : 's'}</p>
      </div>}
      {error ? <p className="p-5 text-xs text-slate-500">{error}</p> : rows.length ? <ol className="p-3">
        {rows.map(row => <li key={row.rang} className="flex items-center gap-3 rounded-xl px-2 py-3">
          <span className={`w-7 text-center text-xs font-bold ${row.rang <= 3 ? 'text-amber-600' : 'text-slate-400'}`}>{row.rang <= 3 ? <Medal size={17} className="inline" /> : row.rang}</span>
          <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{nameOf(row.utilisateur)}</span>
          <span className="text-xs font-bold text-slate-600">{row.scoreTotal} pts</span>
        </li>)}
      </ol> : <p className="p-5 text-sm text-slate-500">Le classement apparaîtra dès les premières participations.</p>}
    </section>
  )
}

function DailyChallenge() {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    challengesApi.duJour().then(setChallenge).catch(() => setChallenge(null)).finally(() => setLoading(false))
  }, [])
  if (loading || !challenge) return null
  return (
    <section className={styles.daily}>
      <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-blue-500/15 blur-3xl" />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] font-bold text-blue-300"><Flame size={14} /> À relever aujourd’hui</p>
          <h2 className="text-2xl sm:text-3xl font-bold mt-3">{challenge.titre}</h2>
          <p className="text-sm text-slate-300 mt-2">{TYPE_LABELS[challenge.type] || challenge.type} · {DIFFICULTY_LABELS[challenge.difficulte] || challenge.difficulte} · {challenge.points} points</p>
        </div>
        <Link to={`/challenges/${challenge.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50 transition">Voir le challenge <ArrowRight size={16} /></Link>
      </div>
    </section>
  )
}

function ChallengeList() {
  const [challenges, setChallenges] = useState([])
  const [type, setType] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [availability, setAvailability] = useState('true')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [retryCount, setRetryCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    challengesApi.lister({ type, difficulte: difficulty, ouvert: availability === '' ? null : availability === 'true', page, taille: 10 })
      .then(result => {
        if (!active) return
        setChallenges(result?.contenu || [])
        setTotalPages(result?.totalPages || 0)
        setTotal(result?.totalElements || 0)
      })
      .catch(err => { if (active) setError(err.message || 'Impossible de charger les challenges.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [type, difficulty, availability, page, retryCount])

  function changeFilter(setter, value) { setter(value); setPage(0) }

  return (
    <>
      <DailyChallenge />
      <div className={styles.layout}>
        <section className={`${styles.panel} overflow-hidden`} aria-label="Liste des challenges">
          <div className={styles.controls}>
            <select className={styles.select} value={type} onChange={event => changeFilter(setType, event.target.value)} aria-label="Filtrer par type">
              <option value="">Tous les thèmes</option>{TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select className={styles.select} value={difficulty} onChange={event => changeFilter(setDifficulty, event.target.value)} aria-label="Filtrer par difficulté">
              <option value="">Toutes les difficultés</option>{DIFFICULTIES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select className={styles.select} value={availability} onChange={event => changeFilter(setAvailability, event.target.value)} aria-label="Filtrer par disponibilité">
              <option value="true">En cours</option><option value="">Tous</option><option value="false">Terminés</option>
            </select>
          </div>
          {error ? <div className="p-10 text-center"><p className="text-sm text-red-700">{error}</p><button onClick={() => setRetryCount(count => count + 1)} className="mt-3 text-sm font-semibold text-blue-600">Réessayer</button></div>
            : loading ? <div className="p-12 text-center text-sm text-slate-500">Chargement des challenges…</div>
              : challenges.length ? <>
                {challenges.map(challenge => <ChallengeCard key={challenge.id} challenge={challenge} />)}
                <div className="px-5 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500">{total} challenge{total === 1 ? '' : 's'}</span>
                  <div className="flex items-center gap-3"><button disabled={page === 0} onClick={() => setPage(page - 1)} className="text-sm font-semibold text-blue-700 disabled:opacity-40">Précédent</button><span className="text-xs text-slate-500">{page + 1} / {Math.max(totalPages, 1)}</span><button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="text-sm font-semibold text-blue-700 disabled:opacity-40">Suivant</button></div>
                </div>
              </> : <div className="p-10 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600 mb-4"><Lightbulb size={22} /></div><h2 className="font-bold">Aucun challenge trouvé</h2><p className="text-sm text-slate-500 mt-2">Essayez d’autres filtres ou revenez plus tard.</p></div>}
        </section>

        <aside className="space-y-5">
          <Leaderboard />
          <section className={`${styles.panel} p-5`}>
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={19} /></div>
            <h2 className="font-bold text-sm">Comment ça marche</h2>
            <p className="text-sm leading-relaxed text-slate-500 mt-2">Chaque challenge a un nombre d’essais limité. Les points sont attribués lorsque la réponse est correcte.</p>
          </section>
        </aside>
      </div>
    </>
  )
}

function ChallengeDetail({ id }) {
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [answer, setAnswer] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true)
    setError('')
    try { setChallenge(await challengesApi.getById(id)) }
    catch (err) { setError(err.message || 'Challenge introuvable.') }
    finally { if (showLoader) setLoading(false) }
  }, [id])

  useEffect(() => { load() }, [load])

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (!answer.trim()) return setError('Saisissez votre réponse avant de l’envoyer.')
    setSaving(true)
    try {
      const outcome = await challengesApi.repondre(id, answer.trim())
      setResult(outcome)
      setAnswer('')
      await load(false)
    } catch (err) { setError(err.message || 'Votre réponse n’a pas pu être envoyée.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className={`${styles.panel} p-12 text-center text-sm text-slate-500`}><LoaderCircle size={20} className="inline animate-spin mr-2" />Chargement du challenge…</div>
  if (error && !challenge) return <div className={`${styles.panel} p-10 text-center`}><p className="text-sm text-red-700">{error}</p><button onClick={() => navigate('/challenges')} className="mt-4 text-sm font-semibold text-blue-600">Retour aux challenges</button></div>
  if (!challenge) return null

  const participation = challenge.maParticipation
  const canAnswer = challenge.ouvert && participation?.statut !== 'REUSSIE' && participation?.statut !== 'ECHOUEE'
  const visibleExplanation = result?.explication || challenge.explication

  return (
    <>
      <Link to="/challenges" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900 mb-5"><ArrowLeft size={16} /> Tous les challenges</Link>
      <div className={styles.layout}>
        <article className={`${styles.panel} ${styles.detail}`}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`${styles.pill} bg-blue-50 text-blue-700`}>{TYPE_LABELS[challenge.type] || challenge.type}</span>
            <span className={`${styles.pill} bg-slate-100 text-slate-700`}>{DIFFICULTY_LABELS[challenge.difficulte] || challenge.difficulte}</span>
            {!challenge.ouvert && <span className={`${styles.pill} bg-slate-100 text-slate-500`}>Terminé</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{challenge.titre}</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500 pb-5 border-b border-slate-100">
            <span className="inline-flex items-center gap-1.5"><Award size={14} className="text-blue-600" />{challenge.points} points</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} />Du {dateLabel(challenge.dateDebut)} au {dateLabel(challenge.dateFin)}</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} />{challenge.nombreReussites} réussite{challenge.nombreReussites === 1 ? '' : 's'}</span>
          </div>

          <h2 className="font-bold mt-6 mb-2">Énoncé</h2>
          <p className="whitespace-pre-wrap text-sm text-slate-600 leading-7">{challenge.enonce}</p>
          {challenge.extraitCode && <div className="mt-5"><div className="text-xs text-slate-500 mb-2">{challenge.langage || 'Extrait de code'}</div><pre className={styles.code}><code>{challenge.extraitCode}</code></pre></div>}

          {participation && <div className="mt-6 rounded-2xl bg-slate-50 border border-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold">Votre participation : {statusLabel(participation)}</span><span className="text-xs text-slate-500">{participation.essaisRestants} essai{participation.essaisRestants === 1 ? '' : 's'} restant{participation.essaisRestants === 1 ? '' : 's'} · {participation.score} pts</span></div>
            {participation.derniereReponse && <p className="text-xs text-slate-500 mt-2">Dernière réponse : {participation.derniereReponse}</p>}
          </div>}

          {error && challenge && <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          {result && <div className={`mt-5 rounded-2xl border p-4 ${result.correct ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            <div className="font-bold">{result.correct ? 'Bonne réponse !' : result.essaisRestants > 0 ? 'Ce n’est pas encore la bonne réponse.' : 'Vous avez utilisé tous vos essais.'}</div>
            <p className="text-sm mt-1">{result.correct ? `Vous gagnez ${result.score} points.` : `${result.essaisRestants} essai${result.essaisRestants === 1 ? '' : 's'} restant${result.essaisRestants === 1 ? '' : 's'}.`}</p>
          </div>}

          {canAnswer ? <form onSubmit={submit} className="mt-6 border-t border-slate-100 pt-6">
            <label htmlFor="challenge-answer" className="block text-sm font-bold mb-2">Votre réponse</label>
            <div className="flex flex-col sm:flex-row gap-3"><input id="challenge-answer" value={answer} onChange={event => setAnswer(event.target.value)} maxLength={500} className={styles.field} placeholder="Saisissez votre réponse…" /><button disabled={saving || !answer.trim()} className={`${styles.button} shrink-0`}>{saving ? 'Vérification…' : <><Send size={16} /> Envoyer</>}</button></div>
            <p className="mt-2 text-xs text-slate-400">Il vous reste {participation?.essaisRestants ?? challenge.nombreEssaisMax} essai{(participation?.essaisRestants ?? challenge.nombreEssaisMax) === 1 ? '' : 's'}.</p>
          </form> : <p className="mt-6 border-t border-slate-100 pt-5 text-sm text-slate-500">{challenge.ouvert ? 'Votre participation est terminée.' : 'Ce challenge n’accepte plus de réponses.'}</p>}

          {visibleExplanation && <section className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5"><h2 className="font-bold text-blue-900">Explication</h2><p className="whitespace-pre-wrap text-sm text-blue-900/80 leading-6 mt-2">{visibleExplanation}</p></section>}
        </article>
        <aside className="space-y-5"><Leaderboard /><section className={`${styles.panel} p-5`}><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-700"><MessageSquareText size={19} /></div><h2 className="font-bold text-sm">Réponse vérifiée automatiquement</h2><p className="text-sm text-slate-500 leading-relaxed mt-2">Le système ignore les majuscules, les accents et les espaces dans votre réponse.</p></section></aside>
      </div>
    </>
  )
}

export default function Challenges() {
  const { id } = useParams()
  return <div className={styles.page}><Navbar /><main className={styles.main}>
    {id ? <ChallengeDetail key={id} id={id} /> : <><header className={styles.header}><div><p className={styles.eyebrow}>Pratique & progression</p><h1 className={styles.title}>Challenges techniques</h1><p className={styles.subtitle}>Résolvez des problèmes concrets, testez vos connaissances et cumulez des points au fil de vos réussites.</p></div></header><ChallengeList /></>}
  </main></div>
}
