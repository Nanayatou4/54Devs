import StyledSelect from '../components/StyledSelect'
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, CalendarDays, Check, CheckCircle2, Clock3, LoaderCircle,
  MapPin, Search, ShieldCheck, Users, X,
} from 'lucide-react'
import { competencesApi, mentorsApi, mentoratsApi, profilApi } from '../api'

const panel = 'rounded-3xl border border-white/10 bg-white/[0.07] shadow-xl shadow-black/10 backdrop-blur-xl'
const input = 'mt-2 w-full rounded-xl border border-white/10 bg-[#0d2119]/70 px-4 py-3 text-sm text-white outline-none placeholder:text-white/55 focus:border-[#c9f06a]/60 focus:ring-2 focus:ring-[#c9f06a]/15'
const label = 'block text-sm font-semibold text-white/85'
const primary = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#c9f06a] px-5 text-sm font-bold text-[#102018] transition hover:bg-[#d8fa83] disabled:cursor-not-allowed disabled:opacity-45'
const secondary = 'inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white'
const levels = [['DEBUTANT', 'Débutant'], ['INTERMEDIAIRE', 'Intermédiaire'], ['AVANCE', 'Avancé']]
const levelLabel = Object.fromEntries(levels)

function Page({ eyebrow, title, description, children }) {
  return <main className="min-h-screen bg-[radial-gradient(ellipse_at_45%_0%,rgba(83,160,104,0.2),transparent_45%),linear-gradient(145deg,#10271d,#123829_52%,#10251c)] px-4 py-8 text-[#f3f0e8] sm:px-6 lg:px-10 lg:py-10">
    <div className="mx-auto max-w-7xl">
      <header className={`${panel} mb-7 p-6 sm:p-8`}>
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#c9f06a]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/60 sm:text-base">{description}</p>}
      </header>
      {children}
    </div>
  </main>
}

function Feedback({ error, success }) {
  if (error) return <div role="alert" className="mb-5 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</div>
  if (success) return <div role="status" className="mb-5 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100">{success}</div>
  return null
}

function Loading() {
  return <div className="flex min-h-48 items-center justify-center text-sm text-white/55"><LoaderCircle size={20} className="mr-2 animate-spin text-[#c9f06a]" />Chargement…</div>
}

function personName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

function formatDate(value, includeTime = false) {
  if (!value) return 'Date à définir'
  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : `${value}Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('fr-FR', includeTime
    ? { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Dakar' }
    : { dateStyle: 'medium', timeZone: 'Africa/Dakar' }).format(date)
}

function mentorStatus(status) {
  return ({ EN_ATTENTE: 'En attente', ACCEPTE: 'En cours', REFUSE: 'Refusé', TERMINE: 'Terminé' })[status] || status
}

function statusColor(status) {
  if (status === 'ACCEPTE') return 'border-emerald-300/20 bg-emerald-300/10 text-emerald-100'
  if (status === 'REFUSE') return 'border-red-300/20 bg-red-300/10 text-red-100'
  if (status === 'TERMINE') return 'border-white/10 bg-white/10 text-white/65'
  return 'border-amber-300/20 bg-amber-300/10 text-amber-100'
}

export function MentorProfilePage() {
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])
  const [presentation, setPresentation] = useState('')
  const [capacity, setCapacity] = useState(3)
  const [active, setActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    Promise.all([mentorsApi.moi(), profilApi.getMesCompetences()])
      .then(([mentor, mySkills]) => {
        setProfile(mentor)
        setPresentation(mentor.presentation || '')
        setCapacity(mentor.nombreMentoresMax || 3)
        setActive(mentor.estMentor ? mentor.actif : true)
        setSkills(Array.isArray(mySkills) ? mySkills : [])
      })
      .catch(err => setError(err.message || 'Impossible de charger votre profil mentor.'))
      .finally(() => setLoading(false))
  }, [])

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const result = await mentorsApi.enregistrer({ presentation: presentation.trim(), nombreMentoresMax: Number(capacity), actif: active })
      setProfile(result)
      setSuccess('Votre profil mentor a été enregistré.')
    } catch (err) {
      setError(err.message || 'Impossible d’enregistrer votre profil mentor.')
    } finally {
      setSaving(false)
    }
  }

  const teachingSkills = skills.filter(skill => skill.type === 'ENSEIGNER')
  return <Page eyebrow="Mentorat · Votre profil" title={profile?.estMentor ? 'Gérez votre profil de mentor' : 'Devenez mentor'} description="Partagez votre expérience et accompagnez d’autres membres de la communauté.">
    {loading ? <Loading /> : <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <form onSubmit={submit} className={`${panel} space-y-5 p-5 sm:p-7`}>
        <Feedback error={error} success={success} />
        {!teachingSkills.length && <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-relaxed text-amber-100">
          Pour devenir mentor, indiquez d’abord au moins une compétence que vous pouvez transmettre dans votre profil.
          <Link to="/profile" className="ml-1 font-bold text-[#d8fa83] underline underline-offset-2">Compléter mes compétences</Link>
        </div>}
        <label className={label}>Votre présentation
          <textarea required minLength={1} maxLength={1000} rows={5} value={presentation} onChange={event => setPresentation(event.target.value)} className={`${input} resize-y`} placeholder="Votre expérience, votre manière d’accompagner et les sujets sur lesquels vous pouvez aider…" />
          <span className="mt-1 block text-right text-xs font-normal text-white/60">{presentation.length}/1000</span>
        </label>
        <label className={label}>Nombre de personnes accompagnées en même temps
          <input required type="number" min="1" max="10" value={capacity} onChange={event => setCapacity(event.target.value)} className={input} />
        </label>
        {profile?.estMentor && <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/75">
          <input type="checkbox" checked={active} onChange={event => setActive(event.target.checked)} className="h-4 w-4 accent-[#c9f06a]" />
          Mon profil apparaît dans la recherche de mentors
        </label>}
        <button type="submit" disabled={saving || !teachingSkills.length} className={primary}>{saving && <LoaderCircle size={16} className="animate-spin" />}{profile?.estMentor ? 'Enregistrer les changements' : 'Activer mon profil mentor'}</button>
      </form>

      <aside className={`${panel} p-5 sm:p-6`}>
        <div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-[#c9f06a]/10 text-[#c9f06a]"><ShieldCheck size={20} /></div>
        <h2 className="font-bold text-white">Vos domaines d’accompagnement</h2>
        <p className="mt-2 text-sm leading-relaxed text-white/55">Ils proviennent des compétences « Je peux enseigner » de votre profil.</p>
        <div className="mt-4 flex flex-wrap gap-2">{teachingSkills.length ? teachingSkills.map(skill => <span key={skill.competenceId} className="rounded-full border border-[#c9f06a]/20 bg-[#c9f06a]/10 px-3 py-1.5 text-xs font-semibold text-[#d8fa83]">{skill.nom}</span>) : <span className="text-xs text-white/60">Aucune compétence à transmettre indiquée.</span>}</div>
        {profile?.estMentor && <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-2xl font-bold text-white">{profile.placesRestantes}</p><p className="mt-1 text-xs text-white/60">place{profile.placesRestantes === 1 ? '' : 's'} disponible{profile.placesRestantes === 1 ? '' : 's'}</p></div>
          <div className="rounded-2xl bg-white/[0.05] p-4"><p className={`text-sm font-bold ${profile.actif ? 'text-emerald-200' : 'text-white/50'}`}>{profile.actif ? 'Visible' : 'En pause'}</p><p className="mt-1 text-xs text-white/60">statut du profil</p></div>
        </div>}
      </aside>
    </div>}
  </Page>
}

export function MentorDirectoryPage() {
  const [competences, setCompetences] = useState([])
  const [form, setForm] = useState({ texte: '', competenceId: '', pays: '', niveau: '' })
  const [filters, setFilters] = useState({})
  const [result, setResult] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refresh, setRefresh] = useState(0)

  useEffect(() => { competencesApi.lister().then(items => setCompetences(Array.isArray(items) ? items : [])).catch(() => {}) }, [])
  useEffect(() => {
    let active = true
    setLoading(true)
    mentorsApi.rechercher({ ...filters, page, taille: 9 })
      .then(data => { if (active) setResult(data) })
      .catch(err => { if (active) setError(err.message || 'Impossible de charger les mentors.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [filters, page, refresh])

  function search(event) {
    event.preventDefault()
    setPage(0)
    setError('')
    setFilters({ ...form })
  }

  const mentors = result?.contenu || []
  return <Page eyebrow="Mentorat · Communauté" title="Trouvez un mentor" description="Rencontrez des personnes qui peuvent vous aider à progresser sur les compétences qu’elles transmettent.">
    <div className={`${panel} mb-6 p-4 sm:p-5`}>
      <form onSubmit={search} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="relative sm:col-span-2 lg:col-span-2"><span className="sr-only">Rechercher un mentor</span><Search size={16} className="absolute left-3.5 top-[26px] text-white/60" /><input value={form.texte} onChange={event => setForm(current => ({ ...current, texte: event.target.value }))} className={`${input} pl-10`} placeholder="Nom ou présentation" /></label>
        <StyledSelect aria-label="Domaine enseigné" className={input} value={form.competenceId} onChange={event => setForm(current => ({ ...current, competenceId: event.target.value }))}><option value="" className="bg-[#123326]">Tous les domaines</option>{competences.map(skill => <option key={skill.id} value={skill.id} className="bg-[#123326]">{skill.nom}</option>)}</StyledSelect>
        <input aria-label="Pays" className={input} value={form.pays} onChange={event => setForm(current => ({ ...current, pays: event.target.value }))} placeholder="Pays" />
        <div className="flex gap-2"><StyledSelect aria-label="Niveau" className={`${input} min-w-0`} value={form.niveau} onChange={event => setForm(current => ({ ...current, niveau: event.target.value }))}><option value="" className="bg-[#123326]">Tous niveaux</option>{levels.map(([value, text]) => <option key={value} value={value} className="bg-[#123326]">{text}</option>)}</StyledSelect><button className={`${primary} mt-2 px-4`} type="submit" aria-label="Rechercher"><Search size={17} /></button></div>
      </form>
    </div>

    {error && <Feedback error={error} />}
    {loading ? <Loading /> : mentors.length ? <>
      <div className="mb-4 flex items-center justify-between text-sm text-white/50"><span>{result?.totalElements ?? mentors.length} mentor{(result?.totalElements ?? mentors.length) === 1 ? '' : 's'}</span><Link to="/mentorat/profil" className="font-semibold text-[#c9f06a] hover:underline">Devenir mentor <ArrowRight size={14} className="inline" /></Link></div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mentors.map(item => {
          const person = item.developpeur
          return <article key={person.utilisateurId} className={`${panel} flex flex-col p-5 transition hover:border-[#c9f06a]/25`}>
            <div className="flex items-start gap-3"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#c9f06a]/15 font-bold text-[#d8fa83]">{`${person.prenom?.[0] || ''}${person.nom?.[0] || ''}`.toUpperCase() || '54'}</div><div className="min-w-0 flex-1"><h2 className="truncate font-bold text-white">{personName(person)}</h2><p className="mt-1 text-xs text-white/50">{levelLabel[person.niveau] || person.niveau || 'Membre'}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${item.placesRestantes ? 'bg-emerald-300/10 text-emerald-100' : 'bg-white/10 text-white/55'}`}>{item.placesRestantes ? `${item.placesRestantes} place${item.placesRestantes > 1 ? 's' : ''}` : 'Complet'}</span></div>
            {(person.pays || person.ville) && <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-white/50"><MapPin size={13} />{[person.ville, person.pays].filter(Boolean).join(', ')}</p>}
            <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/65">{item.presentation}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{(person.competencesAEnseigner || []).slice(0, 5).map(skill => <span key={skill} className="rounded-full border border-[#c9f06a]/15 bg-[#c9f06a]/10 px-2.5 py-1 text-[10px] font-semibold text-[#d8fa83]">{skill}</span>)}</div>
            <Link to={`/mentors/${person.utilisateurId}`} className={`${item.placesRestantes ? primary : secondary} mt-5 w-full`}>Voir le profil <ArrowRight size={15} /></Link>
          </article>
        })}
      </div>
      {(result?.totalPages || 0) > 1 && <div className="mt-6 flex justify-center gap-3"><button type="button" className={secondary} disabled={page === 0} onClick={() => setPage(value => value - 1)}>Précédents</button><span className="self-center text-sm text-white/55">Page {page + 1} sur {result.totalPages}</span><button type="button" className={secondary} disabled={page + 1 >= result.totalPages} onClick={() => setPage(value => value + 1)}>Suivants</button></div>}
    </> : <div className={`${panel} p-10 text-center`}><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#c9f06a]/10 text-[#c9f06a]"><Users size={24} /></div><h2 className="mt-4 font-bold text-white">Aucun mentor ne correspond</h2><p className="mt-2 text-sm text-white/55">Modifiez les filtres ou revenez plus tard.</p><button className={`${secondary} mt-5`} type="button" onClick={() => { setForm({ texte: '', competenceId: '', pays: '', niveau: '' }); setFilters({}); setPage(0); setError(''); setRefresh(value => value + 1) }}>Effacer les filtres</button></div>}
  </Page>
}

export function MentorPublicProfilePage() {
  const { id } = useParams()
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showRequest, setShowRequest] = useState(false)
  const [sujet, setSujet] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    let active = true
    mentorsApi.detail(id).then(data => { if (active) setMentor(data) }).catch(err => { if (active) setError(err.message || 'Mentor introuvable.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  async function sendRequest(event) {
    event.preventDefault()
    setSending(true)
    setError('')
    try {
      await mentoratsApi.demander({ mentorId: Number(id), sujet: sujet.trim() || null, message: message.trim() || null })
      setSent(true)
      setShowRequest(false)
    } catch (err) {
      setError(err.message || 'Impossible d’envoyer la demande.')
    } finally { setSending(false) }
  }

  if (loading) return <Page eyebrow="Mentorat" title="Profil du mentor"><Loading /></Page>
  if (error && !mentor) return <Page eyebrow="Mentorat" title="Profil indisponible"><Feedback error={error} /><Link className={secondary} to="/mentors"><ArrowLeft size={15} /> Retour à la recherche</Link></Page>
  const person = mentor.developpeur
  return <Page eyebrow="Mentorat · Profil" title={personName(person)} description={[person.ville, person.pays].filter(Boolean).join(', ') || 'Communauté 54Devs'}>
    <Link to="/mentors" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-[#c9f06a]"><ArrowLeft size={15} /> Tous les mentors</Link>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className={`${panel} p-6 sm:p-8`}>
        <div className="flex flex-wrap items-center gap-3"><span className="rounded-full border border-[#c9f06a]/15 bg-[#c9f06a]/10 px-3 py-1 text-xs font-semibold text-[#d8fa83]">{levelLabel[person.niveau] || person.niveau || 'Membre'}</span>{mentor.mentoratsTermines > 0 && <span className="inline-flex items-center gap-1 text-xs text-white/55"><CheckCircle2 size={14} className="text-emerald-200" />{mentor.mentoratsTermines} mentorat{mentor.mentoratsTermines > 1 ? 's' : ''} terminé{mentor.mentoratsTermines > 1 ? 's' : ''}</span>}</div>
        <h2 className="mt-6 text-lg font-bold text-white">Présentation</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/65">{mentor.presentation}</p>
        <h2 className="mt-7 text-lg font-bold text-white">Compétences transmises</h2><div className="mt-3 flex flex-wrap gap-2">{(person.competencesAEnseigner || []).map(skill => <span key={skill} className="rounded-full border border-[#c9f06a]/15 bg-[#c9f06a]/10 px-3 py-1.5 text-xs font-semibold text-[#d8fa83]">{skill}</span>)}</div>
        {person.bio && <><h2 className="mt-7 text-lg font-bold text-white">À propos</h2><p className="mt-2 text-sm leading-relaxed text-white/60">{person.bio}</p></>}
      </section>
      <aside className={`${panel} p-5 sm:p-6`}>
        <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-2xl font-bold text-white">{mentor.placesRestantes}</p><p className="mt-1 text-xs text-white/60">place{mentor.placesRestantes === 1 ? '' : 's'} disponible{mentor.placesRestantes === 1 ? '' : 's'}</p></div><div className="rounded-2xl bg-white/[0.05] p-4"><p className="text-2xl font-bold text-white">{mentor.nombreMentoresMax}</p><p className="mt-1 text-xs text-white/60">mentoré{mentor.nombreMentoresMax > 1 ? 's' : ''} max.</p></div></div>
        {sent ? <div role="status" className="mt-5 rounded-xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100"><CheckCircle2 size={17} className="mr-2 inline" />Votre demande a été envoyée.</div> : <button type="button" disabled={!mentor.placesRestantes} onClick={() => setShowRequest(true)} className={`${mentor.placesRestantes ? primary : secondary} mt-5 w-full`}>{mentor.placesRestantes ? 'Demander un mentorat' : 'Aucune place disponible'}</button>}
        {error && <p role="alert" className="mt-3 text-sm text-red-200">{error}</p>}
      </aside>
    </div>
    {showRequest && <div className="fixed inset-0 z-[70] grid place-items-center bg-[#07150f]/75 p-4 backdrop-blur-sm" onMouseDown={event => event.target === event.currentTarget && setShowRequest(false)}><form onSubmit={sendRequest} className={`${panel} w-full max-w-lg space-y-4 p-6 sm:p-8`}>
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-[#c9f06a]">Nouvelle demande</p><h2 className="mt-2 text-xl font-bold text-white">Contacter {personName(person)}</h2></div><button type="button" aria-label="Fermer" onClick={() => setShowRequest(false)} className="rounded-lg p-2 text-white/50 hover:bg-white/10"><X size={18} /></button></div>
      <label className={label}>Sujet (facultatif)<input maxLength={200} value={sujet} onChange={event => setSujet(event.target.value)} className={input} placeholder="Ex. Progresser en Spring Security" /></label>
      <label className={label}>Message (facultatif)<textarea maxLength={500} rows={4} value={message} onChange={event => setMessage(event.target.value)} className={`${input} resize-y`} placeholder="Présentez votre objectif et ce que vous cherchez à apprendre." /></label>
      {error && <Feedback error={error} />}
      <div className="flex justify-end gap-3"><button type="button" onClick={() => setShowRequest(false)} className={secondary}>Annuler</button><button disabled={sending} className={primary}>{sending ? <LoaderCircle size={16} className="animate-spin" /> : null}Envoyer la demande</button></div>
    </form></div>}
  </Page>
}

function MentoratCard({ item, role }) {
  const other = role === 'mentor' ? item.mentore : item.mentor
  return <Link to={`/mentorat/${item.id}`} className={`${panel} block p-5 transition hover:border-[#c9f06a]/25`}>
    <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-white/60">{role === 'mentor' ? 'Accompagnement de' : 'Avec'}</p><h3 className="mt-1 font-bold text-white">{personName(other)}</h3></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusColor(item.statut)}`}>{mentorStatus(item.statut)}</span></div>
    <p className="mt-4 text-sm font-semibold text-[#e7efdf]">{item.sujet || 'Mentorat sans sujet défini'}</p>
    {item.message && <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-white/55">{item.message}</p>}
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/60"><span className="inline-flex items-center gap-1"><CalendarDays size={13} />Demandé le {formatDate(item.dateDemande)}</span>{item.statut === 'ACCEPTE' && <span>{item.seancesRealisees} réalisée{item.seancesRealisees === 1 ? '' : 's'} · {item.seancesPlanifiees} planifiée{item.seancesPlanifiees === 1 ? '' : 's'}</span>}</div>
    {role === 'mentor' && item.statut === 'EN_ATTENTE' && <p className="mt-4 text-xs font-bold text-[#c9f06a]">Votre réponse est attendue · Ouvrir <ArrowRight size={13} className="inline" /></p>}
  </Link>
}

export function MyMentoratsPage() {
  const [data, setData] = useState(null)
  const [tab, setTab] = useState('mentore')
  const [error, setError] = useState('')
  useEffect(() => { mentoratsApi.mesMentorats().then(setData).catch(err => setError(err.message || 'Impossible de charger vos mentorats.')) }, [])
  const received = data?.commeMentor || []
  const receivedPending = received.filter(item => item.statut === 'EN_ATTENTE').length
  const list = tab === 'mentor' ? received : data?.commeMentore || []
  return <Page eyebrow="Mentorat · Votre espace" title="Mes mentorats" description="Retrouvez les demandes reçues et les accompagnements auxquels vous participez.">
    <div className="mb-5 flex flex-wrap gap-3"><Link to="/mentorat/profil" className={secondary}><ShieldCheck size={16} /> Mon profil mentor</Link><Link to="/mentors" className={primary}><Search size={16} /> Trouver un mentor</Link></div>
    {error && <Feedback error={error} />}
    {!data && !error ? <Loading /> : <>
      <div role="tablist" aria-label="Mes rôles en mentorat" className={`${panel} mb-5 flex gap-2 p-2`}>
        <button role="tab" aria-selected={tab === 'mentore'} onClick={() => setTab('mentore')} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${tab === 'mentore' ? 'bg-[#c9f06a] text-[#102018]' : 'text-white/60 hover:bg-white/[0.05]'}`}>Je suis mentoré</button>
        <button role="tab" aria-selected={tab === 'mentor'} onClick={() => setTab('mentor')} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition ${tab === 'mentor' ? 'bg-[#c9f06a] text-[#102018]' : 'text-white/60 hover:bg-white/[0.05]'}`}>Je suis mentor{receivedPending > 0 ? ` · ${receivedPending} à traiter` : ''}</button>
      </div>
      {list.length ? <div className="grid gap-4 lg:grid-cols-2">{list.map(item => <MentoratCard key={item.id} item={item} role={tab} />)}</div> : <div className={`${panel} p-10 text-center`}><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#c9f06a]/10 text-[#c9f06a]"><Users size={21} /></div><h2 className="mt-4 font-bold text-white">Aucun mentorat dans cette liste</h2><p className="mt-2 text-sm text-white/55">{tab === 'mentor' ? 'Créez un profil mentor pour recevoir des demandes.' : 'Parcourez les profils et trouvez une personne qui peut vous accompagner.'}</p><Link to={tab === 'mentor' ? '/mentorat/profil' : '/mentors'} className={`${primary} mt-5`}>{tab === 'mentor' ? 'Devenir mentor' : 'Trouver un mentor'} <ArrowRight size={15} /></Link></div>}
    </>}
  </Page>
}

function futureLocalDateTime() {
  const date = new Date(Date.now() + 60 * 60 * 1000)
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Dakar', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]))
  const minute = Math.ceil(Number(values.minute) / 15) * 15
  if (minute === 60) {
    const nextHour = new Date(date.getTime() + 60 * 60 * 1000)
    const next = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Dakar', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(nextHour).map(part => [part.type, part.value]))
    return `${next.year}-${next.month}-${next.day}T${next.hour}:00`
  }
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${String(minute).padStart(2, '0')}`
}

export function MentoratDetailPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [date, setDate] = useState(futureLocalDateTime())
  const [duration, setDuration] = useState(60)
  const [sessionTopic, setSessionTopic] = useState('')
  const [reportDrafts, setReportDrafts] = useState({})
  const [endingBilan, setEndingBilan] = useState('')
  const [myBilan, setMyBilan] = useState('')
  const [busy, setBusy] = useState(false)

  const reload = useCallback(() => {
    setError('')
    return mentoratsApi.detail(id).then(result => {
      setData(result)
      setMyBilan(result.monRole === 'MENTOR' ? result.bilanMentor || '' : result.bilanMentore || '')
      setReportDrafts(Object.fromEntries((result.seances || []).map(session => [session.id, session.compteRendu || ''])))
    }).catch(err => setError(err.message || 'Impossible de charger ce mentorat.'))
  }, [id])
  useEffect(() => { reload() }, [reload])

  async function perform(action, successMessage) {
    setBusy(true)
    setError('')
    setNotice('')
    try {
      await action()
      await reload()
      setNotice(successMessage)
    } catch (err) {
      setError(err.message || 'Cette action n’a pas pu aboutir.')
    } finally { setBusy(false) }
  }

  if (!data) return <Page eyebrow="Mentorat" title="Détail du mentorat">{error ? <><Feedback error={error} /><Link to="/mentorat" className={secondary}><ArrowLeft size={15} /> Mes mentorats</Link></> : <Loading />}</Page>
  const item = data.mentorat
  const isMentor = data.monRole === 'MENTOR'
  const otherPerson = isMentor ? item.mentore : item.mentor
  const ended = item.statut === 'TERMINE'
  return <Page eyebrow="Mentorat · Suivi" title={item.sujet || `Mentorat avec ${personName(otherPerson)}`} description={`${isMentor ? 'Vous accompagnez' : 'Votre mentor'} · ${personName(otherPerson)}`}>
    <Link to="/mentorat" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-white/55 hover:text-[#c9f06a]"><ArrowLeft size={15} /> Mes mentorats</Link>
    <Feedback error={error} success={notice} />
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <section className={`${panel} p-5 sm:p-7`}>
          <div className="flex flex-wrap items-center justify-between gap-3"><span className={`rounded-full border px-3 py-1 text-xs font-bold ${statusColor(item.statut)}`}>{mentorStatus(item.statut)}</span><span className="text-xs text-white/60">Demande du {formatDate(item.dateDemande, true)}</span></div>
          {item.message && <p className="mt-5 whitespace-pre-wrap text-sm leading-relaxed text-white/65">{item.message}</p>}
          {isMentor && item.statut === 'EN_ATTENTE' && <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => perform(() => mentoratsApi.decider(id, 'ACCEPTE'), 'Demande acceptée.')} className={primary}><Check size={16} /> Accepter</button><button type="button" disabled={busy} onClick={() => perform(() => mentoratsApi.decider(id, 'REFUSE'), 'Demande refusée.')} className={secondary}><X size={16} /> Refuser</button></div>}
        </section>

        {item.statut === 'ACCEPTE' && isMentor && <form onSubmit={event => { event.preventDefault(); perform(() => mentoratsApi.planifier(id, { date, dureeMinutes: Number(duration), sujet: sessionTopic.trim() || null }), 'Séance planifiée.').then(() => setSessionTopic('')) }} className={`${panel} space-y-4 p-5 sm:p-7`}>
          <div><p className="text-xs font-bold uppercase tracking-widest text-[#c9f06a]">Organisation</p><h2 className="mt-1 text-lg font-bold text-white">Planifier une séance</h2></div>
          <div className="grid gap-4 sm:grid-cols-2"><label className={label}>Date et heure · Dakar (GMT)<input required type="datetime-local" min={futureLocalDateTime()} value={date} onChange={event => setDate(event.target.value)} className={input} /></label><label className={label}>Durée (minutes)<input required type="number" min="15" max="240" step="15" value={duration} onChange={event => setDuration(event.target.value)} className={input} /></label></div>
          <label className={label}>Sujet (facultatif)<input maxLength={200} value={sessionTopic} onChange={event => setSessionTopic(event.target.value)} className={input} placeholder="Objectif de la séance" /></label>
          <button disabled={busy} className={primary}><CalendarDays size={16} /> Planifier</button>
        </form>}

        <section className={`${panel} p-5 sm:p-7`}>
          <div className="mb-5 flex items-center gap-2"><CalendarDays size={18} className="text-[#c9f06a]" /><h2 className="text-lg font-bold text-white">Séances <span className="text-sm font-medium text-white/60">({data.seances.length})</span></h2></div>
          {data.seances.length ? <div className="space-y-4">{data.seances.map(session => <article key={session.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="inline-flex items-center gap-1.5 text-sm font-bold text-white"><Clock3 size={15} className="text-[#c9f06a]" />{formatDate(session.date, true)}</p><p className="mt-1 text-xs text-white/50">{session.dureeMinutes} minutes{session.sujet ? ` · ${session.sujet}` : ''}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${session.statut === 'REALISEE' ? 'bg-emerald-300/10 text-emerald-100' : 'bg-amber-300/10 text-amber-100'}`}>{session.statut === 'REALISEE' ? 'Réalisée' : 'Planifiée'}</span></div>
            {isMentor && <form onSubmit={event => { event.preventDefault(); perform(() => mentoratsApi.compteRendu(id, session.id, reportDrafts[session.id]?.trim()), 'Compte rendu enregistré.') }} className="mt-4 space-y-3"><label className={label}>{session.compteRendu ? 'Modifier le compte rendu' : 'Compte rendu'}<textarea required minLength={1} maxLength={3000} rows={3} value={reportDrafts[session.id] || ''} onChange={event => setReportDrafts(current => ({ ...current, [session.id]: event.target.value }))} className={`${input} resize-y`} placeholder="Résumé de ce qui a été travaillé et des prochaines étapes…" /></label><button disabled={busy || !reportDrafts[session.id]?.trim()} className={secondary}>Enregistrer le compte rendu</button></form>}
            {!isMentor && session.compteRendu && <div className="mt-4 rounded-xl bg-white/[0.05] p-4"><p className="text-xs font-bold uppercase tracking-wider text-white/60">Compte rendu</p><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/70">{session.compteRendu}</p></div>}
            {isMentor && session.compteRendu && <p className="mt-3 whitespace-pre-wrap rounded-xl bg-white/[0.05] p-4 text-sm leading-relaxed text-white/70">{session.compteRendu}</p>}
          </article>)}</div> : <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-white/50">Aucune séance planifiée pour le moment.</p>}
        </section>
      </div>

      <aside className="space-y-5">
        <section className={`${panel} p-5`}><p className="text-xs font-bold uppercase tracking-widest text-[#c9f06a]">Progression</p><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/[0.05] p-3"><p className="text-xl font-bold text-white">{item.seancesRealisees}</p><p className="mt-1 text-xs text-white/60">réalisée{item.seancesRealisees === 1 ? '' : 's'}</p></div><div className="rounded-xl bg-white/[0.05] p-3"><p className="text-xl font-bold text-white">{item.seancesPlanifiees}</p><p className="mt-1 text-xs text-white/60">planifiée{item.seancesPlanifiees === 1 ? '' : 's'}</p></div></div></section>
        {item.statut === 'ACCEPTE' && <form onSubmit={event => { event.preventDefault(); perform(() => mentoratsApi.terminer(id, endingBilan.trim()), 'Mentorat terminé. Vous pourrez ajouter ou modifier votre bilan.') }} className={`${panel} p-5`}><h2 className="font-bold text-white">Terminer le mentorat</h2><p className="mt-2 text-xs leading-relaxed text-white/50">Cela libère une place pour le mentor. Votre bilan est facultatif.</p><textarea maxLength={2000} rows={4} value={endingBilan} onChange={event => setEndingBilan(event.target.value)} className={`${input} resize-y`} placeholder="Votre bilan personnel (facultatif)" /><button disabled={busy} className={`${secondary} mt-3 w-full`}>Terminer l’accompagnement</button></form>}
        {ended && <form onSubmit={event => { event.preventDefault(); perform(() => mentoratsApi.bilan(id, myBilan.trim()), 'Votre bilan a été enregistré.') }} className={`${panel} p-5`}><h2 className="font-bold text-white">Votre bilan</h2><p className="mt-2 text-xs leading-relaxed text-white/50">Partagez un retour sur cet accompagnement. Vous pourrez le modifier ensuite.</p><textarea required maxLength={2000} rows={5} value={myBilan} onChange={event => setMyBilan(event.target.value)} className={`${input} resize-y`} placeholder="Ce que vous avez appris ou ce que vous retenez…" /><button disabled={busy || !myBilan.trim()} className={`${primary} mt-3 w-full`}>Enregistrer mon bilan</button></form>}
        {ended && <section className={`${panel} p-5`}><h2 className="font-bold text-white">Bilan de l’autre participant</h2><p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-white/65">{(isMentor ? data.bilanMentore : data.bilanMentor) || 'Pas encore rédigé.'}</p></section>}
      </aside>
    </div>
  </Page>
}
