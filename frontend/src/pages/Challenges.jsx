import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Award, CalendarDays, CheckCircle2, Clock3, Code2, Flame, LoaderCircle, Medal, MessageSquareText, RotateCcw, Send, Trophy,
} from 'lucide-react'
import { challengesApi } from '../api'
import { styles } from './Challenges.styles'

const TYPES = [
  ['DEBUG', 'Débogage'], ['ALGORITHME', 'Algorithme'], ['SECURITE', 'Sécurité'],
  ['ARCHITECTURE', 'Architecture'], ['TECHNOLOGIE', 'Technologie'], ['AFRIQUE', 'Enjeux africains'],
]
const DIFFICULTIES = [['FACILE', 'Facile'], ['MOYEN', 'Intermédiaire'], ['DIFFICILE', 'Difficile']]
const TYPE_LABELS = Object.fromEntries(TYPES)
const DIFFICULTY_LABELS = Object.fromEntries(DIFFICULTIES)

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

function Leaderboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    challengesApi.classement({ taille: 5 })
      .then(setData)
      .catch((err) => setError(err.message || 'Classement indisponible.'))
  }, [])

  const rows = data?.classement?.contenu || []
  const mine = data?.moi

  return (
    <section className={`${styles.panel} h-fit overflow-hidden`}>
      <div className="flex items-center gap-2 border-b border-white/10 p-5">
        <Trophy size={17} className="text-[#C9F06A]" />
        <h2 className="font-bold text-sm text-white font-display">Classement</h2>
      </div>
      {mine && (
        <div className="mx-4 mt-4 rounded-xl border border-white/10 bg-[#18251E] p-4">
          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#C9F06A]">Votre progression</p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <span className="font-bold text-white font-display">{mine.rang ? `Rang ${mine.rang}` : 'Pas encore classé'}</span>
            <span className="font-mono text-sm font-bold text-[#C9F06A]">{mine.scoreTotal} pts</span>
          </div>
          <p className="mt-1 text-xs font-mono text-white/40">{mine.challengesReussis} challenge{mine.challengesReussis === 1 ? '' : 's'} réussi{mine.challengesReussis === 1 ? '' : 's'}</p>
        </div>
      )}
      {error ? <p className="p-5 text-xs text-white/45">{error}</p> : rows.length ? (
        <ol className="p-3">
          {rows.map((row) => (
            <li key={row.rang} className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-white/[0.03]">
              <span className={`w-7 text-center text-xs font-bold font-mono ${row.rang <= 3 ? 'text-[#C9F06A]' : 'text-white/40'}`}>
                {row.rang <= 3 ? <Medal size={17} className="inline text-[#C9F06A]" /> : row.rang}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{row.utilisateur?.pseudo || [row.utilisateur?.prenom, row.utilisateur?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'}</span>
              <span className="font-mono text-xs font-bold text-[#C9F06A]">{row.scoreTotal} pts</span>
            </li>
          ))}
        </ol>
      ) : data ? <p className="p-5 text-sm text-white/40">Le classement apparaîtra après les premières participations.</p> : <p className="p-5 text-sm text-white/40">Chargement du classement…</p>}
    </section>
  )
}

function DailyChallenge() {
  const [challenge, setChallenge] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    challengesApi.duJour()
      .then(setChallenge)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className={`${styles.panel} p-8 text-center text-sm text-white/50`}>Chargement du challenge du jour…</div>
  if (!challenge) return (
    <div className={`${styles.panel} p-8 text-center`}>
      <h2 className="font-bold text-white font-display">Aucun challenge du jour</h2>
      <p className="mt-2 text-sm text-white/55">{error ? 'Le challenge du jour est momentanément indisponible.' : 'Revenez plus tard pour découvrir le prochain défi.'}</p>
    </div>
  )

  return (
    <section className={styles.daily}>
      <div className="absolute -right-10 -top-24 h-64 w-64 rounded-full bg-[#C9F06A]/10 blur-3xl" />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <p className="mr-2 inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-[0.16em] text-[#C9F06A]"><Flame size={14} /> À relever aujourd'hui</p>
          <span className={`${styles.pill} border border-[#C9F06A]/20 bg-[#C9F06A]/10 text-[#C9F06A]`}>{TYPE_LABELS[challenge.type] || challenge.type}</span>
          <span className={`${styles.pill} border border-white/10 bg-white/5 text-white/70`}>{DIFFICULTY_LABELS[challenge.difficulte] || challenge.difficulte}</span>
        </div>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-extrabold text-white font-display sm:text-3xl">{challenge.titre}</h2>
            {challenge.enonce && <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-white/70">{challenge.enonce}</p>}
            {challenge.extraitCode && (
              <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#090A0E]/70">
                <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-white/45"><Code2 size={13} className="text-[#C9F06A]" />{challenge.langage || 'Extrait de code'}</div>
                <pre className="max-h-24 overflow-hidden px-3 py-2.5 text-xs leading-5 text-white/70"><code>{challenge.extraitCode}</code></pre>
              </div>
            )}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/55">
              <span className="inline-flex items-center gap-1.5 font-semibold text-[#C9F06A]"><Award size={14} />{challenge.points} points</span>
              {challenge.dateFin && <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} />Jusqu’au {dateLabel(challenge.dateFin)}</span>}
              {challenge.nombreEssaisMax && <span className="inline-flex items-center gap-1.5"><RotateCcw size={14} />{challenge.nombreEssaisMax} essais maximum</span>}
            </div>
          </div>
          <Link to={`/challenges/${challenge.id}`} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C9F06A] px-5 py-3 text-sm font-bold text-black shadow-lg shadow-[#C9F06A]/20 transition hover:bg-[#D8F87C]">Relever le défi <ArrowRight size={16} /></Link>
        </div>
      </div>
    </section>
  )
}

function ChallengeDetail({ id, backPath }) {
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
    if (!answer.trim()) return setError('Saisissez votre réponse avant de l\'envoyer.')
    setSaving(true)
    try {
      const outcome = await challengesApi.repondre(id, answer.trim())
      setResult(outcome)
      setAnswer('')
      await load(false)
    } catch (err) { setError(err.message || 'Votre réponse n\'a pas pu être envoyée.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className={`${styles.panel} p-12 text-center text-sm text-white/40 font-mono`}><LoaderCircle size={20} className="inline animate-spin mr-2 text-[#C9F06A]" />Chargement du challenge...</div>
  if (!challenge) return (
    <div className={`${styles.panel} p-10 text-center`}>
      <p className="text-sm text-red-300">{error || 'Ce challenge est introuvable ou sa fiche est vide.'}</p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <button type="button" onClick={() => load()} className="text-sm font-semibold text-[#C9F06A] hover:underline">Réessayer</button>
        <button type="button" onClick={() => navigate(backPath)} className="text-sm font-semibold text-white/60 hover:text-white">Retour aux challenges</button>
      </div>
    </div>
  )

  const participation = challenge.maParticipation
  const canAnswer = challenge.ouvert && participation?.statut !== 'REUSSIE' && participation?.statut !== 'ECHOUEE'
  const visibleExplanation = result?.explication || challenge.explication

  return (
    <>
      <Link to={backPath} className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-[#C9F06A] mb-5 transition"><ArrowLeft size={16} /> Tous les challenges</Link>
      <div className={styles.layout}>
        <article className={`${styles.panel} ${styles.detail}`}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className={`${styles.pill} bg-[#C9F06A]/10 border border-[#C9F06A]/20 text-[#C9F06A]`}>{TYPE_LABELS[challenge.type] || challenge.type}</span>
            <span className={`${styles.pill} bg-white/5 border border-white/10 text-white/70`}>{DIFFICULTY_LABELS[challenge.difficulte] || challenge.difficulte}</span>
            {!challenge.ouvert && <span className={`${styles.pill} bg-white/5 border border-white/10 text-white/40`}>Terminé</span>}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">{challenge.titre}</h1>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/40 font-mono pb-5 border-b border-white/10">
            <span className="inline-flex items-center gap-1.5"><Award size={14} className="text-[#C9F06A]" />{challenge.points} points</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} />Du {dateLabel(challenge.dateDebut)} au {dateLabel(challenge.dateFin)}</span>
            <span className="inline-flex items-center gap-1.5"><CheckCircle2 size={14} />{challenge.nombreReussites} réussite{challenge.nombreReussites === 1 ? '' : 's'}</span>
          </div>

          <h2 className="font-bold mt-6 mb-2 text-white font-display text-lg">Énoncé</h2>
          <p className="whitespace-pre-wrap text-sm text-white/80 leading-7 font-body">{challenge.enonce}</p>
          {challenge.extraitCode && <div className="mt-5"><div className="text-xs text-white/40 font-mono mb-2">{challenge.langage || 'Extrait de code'}</div><pre className={styles.code}><code>{challenge.extraitCode}</code></pre></div>}

          {participation && <div className="mt-6 rounded-2xl bg-[#18251E] border border-white/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold text-white">Votre participation : {statusLabel(participation)}</span><span className="text-xs text-white/40 font-mono">{participation.essaisRestants} essai{participation.essaisRestants === 1 ? '' : 's'} restant{participation.essaisRestants === 1 ? '' : 's'} · {participation.score} pts</span></div>
            {participation.derniereReponse && <p className="text-xs text-white/40 font-mono mt-2">Dernière réponse : {participation.derniereReponse}</p>}
          </div>}

          {error && challenge && <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
          {result && <div className={`mt-5 rounded-2xl border p-4 ${result.correct ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
            <div className="font-bold">{result.correct ? 'Bonne réponse !' : result.essaisRestants > 0 ? 'Ce n\'est pas encore la bonne réponse.' : 'Vous avez utilisé tous vos essais.'}</div>
            <p className="text-sm mt-1">{result.correct ? `Vous gagnez ${result.score} points.` : `${result.essaisRestants} essai${result.essaisRestants === 1 ? '' : 's'} restant${result.essaisRestants === 1 ? '' : 's'}.`}</p>
          </div>}

          {canAnswer ? <form onSubmit={submit} className="mt-6 border-t border-white/10 pt-6">
            <label htmlFor="challenge-answer" className="block text-xs font-bold text-[#C9F06A] font-mono uppercase mb-2">Votre réponse</label>
            <div className="flex flex-col sm:flex-row gap-3"><input id="challenge-answer" value={answer} onChange={event => setAnswer(event.target.value)} maxLength={500} className={styles.field} placeholder="Saisissez votre réponse..." /><button disabled={saving || !answer.trim()} className={`${styles.button} shrink-0`}>{saving ? 'Vérification...' : <><Send size={16} /> Envoyer</>}</button></div>
            <p className="mt-2 text-xs text-white/40 font-mono">Il vous reste {participation?.essaisRestants ?? challenge.nombreEssaisMax} essai{(participation?.essaisRestants ?? challenge.nombreEssaisMax) === 1 ? '' : 's'}.</p>
          </form> : <p className="mt-6 border-t border-white/10 pt-5 text-sm text-white/50">{challenge.ouvert ? 'Votre participation est terminée.' : 'Ce challenge n\'accepte plus de réponses.'}</p>}

          {visibleExplanation && <section className="mt-6 rounded-2xl border border-[#C9F06A]/20 bg-[#C9F06A]/10 p-5"><h2 className="font-bold text-[#C9F06A] font-display">Explication</h2><p className="whitespace-pre-wrap text-sm text-white/80 leading-6 mt-2">{visibleExplanation}</p></section>}
        </article>
        <aside className="space-y-5"><Leaderboard /><section className={`${styles.panel} p-5`}><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#C9F06A]/10 border border-[#C9F06A]/20 text-[#C9F06A]"><MessageSquareText size={19} /></div><h2 className="font-bold text-sm text-white font-display">Réponse vérifiée automatiquement</h2><p className="text-sm text-white/60 leading-relaxed mt-2">Le système ignore les majuscules, les accents et les espaces dans votre réponse.</p></section></aside>
      </div>
    </>
  )
}

export default function Challenges() {
  const { id } = useParams()
  const { pathname } = useLocation()
  const backPath = pathname.startsWith('/admin/challenges/') ? '/admin?tab=challenges' : '/challenges'
  return <div className={styles.page}><main className={styles.main}>
    {id ? <ChallengeDetail key={id} id={id} backPath={backPath} /> : <><header className={styles.header}><div><p className={styles.eyebrow}>Pratique & progression</p><h1 className={styles.title}>Challenge du jour</h1><p className={styles.subtitle}>Un défi technique à relever aujourd’hui. Répondez correctement pour gagner des points.</p></div></header><div className={styles.layout}><DailyChallenge /><Leaderboard /></div></>}
  </main></div>
}
