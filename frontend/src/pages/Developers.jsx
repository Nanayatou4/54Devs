import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Award, BriefcaseBusiness, ExternalLink, Globe2,
  LoaderCircle, MapPin, Search, Users,
} from 'lucide-react'
import { competencesApi, developpeursApi, ROLE_MEMBRE, STATUT_PROJET } from '../api'
import { styles } from './Developers.styles'
import Avatar from '../components/Avatar'
import InviteDeveloperButton from '../components/InviteDeveloperButton'

const LEVELS = [['DEBUTANT', 'Débutant'], ['INTERMEDIAIRE', 'Intermédiaire'], ['AVANCE', 'Avancé']]
const LEVEL_LABELS = Object.fromEntries(LEVELS)
const SKILL_TYPES = [['MAITRISE', 'Maîtrise'], ['ENSEIGNER', 'À transmettre'], ['APPRENDRE', 'À apprendre']]
const SKILL_TYPE_LABELS = Object.fromEntries(SKILL_TYPES)

function displayName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Développeur'
}

function avatarLetters(person) {
  return `${person?.prenom?.[0] || ''}${person?.nom?.[0] || ''}`.toUpperCase() || '?'
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date)
}

function DeveloperCard({ developer }) {
  const skills = developer.competencesMaitrisees || []
  return (
    <Link to={`/developers/${developer.utilisateurId}`} className={`${styles.card} block group`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#C9F06A]/40 shrink-0 bg-[#C9F06A] text-black flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-[#C9F06A]/20">
          <Avatar src={developer.avatarUrl} name={displayName(developer)} className="w-full h-full" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className="font-bold text-white group-hover:text-[#C9F06A] transition font-display">{displayName(developer)}</h2>
            {developer.niveau && <span className="text-xs text-white/40 font-mono">{LEVEL_LABELS[developer.niveau] || developer.niveau}</span>}
          </div>
          {(developer.ville || developer.pays) && <p className="inline-flex items-center gap-1.5 text-xs text-white/50 mt-1"><MapPin size={13} className="text-[#C9F06A]" />{[developer.ville, developer.pays].filter(Boolean).join(', ')}</p>}
          {developer.bio && <p className="text-sm text-white/60 leading-relaxed mt-3 font-body">{developer.bio}</p>}
          {skills.length > 0 && <div className="flex flex-wrap gap-2 mt-4">{skills.slice(0, 6).map(skill => <span key={skill} className={styles.tag}>{skill}</span>)}{skills.length > 6 && <span className={styles.tag}>+{skills.length - 6}</span>}</div>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-xs font-mono">
            {developer.disponibilite && <span className="rounded-full bg-[#C9F06A]/10 border border-[#C9F06A]/20 text-[#C9F06A] px-2.5 py-1 font-semibold">{developer.disponibilite}</span>}
            {(developer.competencesAEnseigner || []).length > 0 && <span className="text-white/40">Peut transmettre : <span className="text-white/70">{developer.competencesAEnseigner.slice(0, 2).join(', ')}</span></span>}
            {(developer.competencesAApprendre || []).length > 0 && <span className="text-white/40">Souhaite apprendre : <span className="text-white/70">{developer.competencesAApprendre.slice(0, 2).join(', ')}</span></span>}
          </div>
        </div>
        <div className="hidden sm:flex flex-col items-end justify-between self-stretch shrink-0">
          <span className="text-xs text-[#C9F06A] opacity-0 group-hover:opacity-100 transition-opacity font-semibold">Voir le profil &rarr;</span>
          <ArrowRight size={18} className="mt-1 text-white/30 group-hover:text-[#C9F06A] group-hover:translate-x-1 transition" />
        </div>
      </div>
    </Link>
  )
}

function DevelopersList() {
  const [catalogue, setCatalogue] = useState([])
  const [draft, setDraft] = useState({ texte: '', competenceId: '', type: '', pays: '', niveau: '', disponibilite: '' })
  const [filters, setFilters] = useState({})
  const [developers, setDevelopers] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => { competencesApi.lister().then(data => setCatalogue(Array.isArray(data) ? data : [])).catch(() => {}) }, [])
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    developpeursApi.rechercher({ ...filters, page, taille: 10 })
      .then(result => {
        if (!active) return
        setDevelopers(result?.contenu || [])
        setTotalPages(result?.totalPages || 0)
        setTotal(result?.totalElements || 0)
      })
      .catch(err => { if (active) setError(err.message || 'Impossible de charger les développeurs.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [filters, page, retryCount])

  function submit(event) {
    event.preventDefault()
    setPage(0)
    setFilters({
      texte: draft.texte.trim(), competenceId: draft.competenceId,
      type: draft.type, pays: draft.pays.trim(), niveau: draft.niveau,
      disponibilite: draft.disponibilite.trim(),
    })
  }

  function setDraftField(field, value) { setDraft(current => ({ ...current, [field]: value })) }

  const hasActiveFilters = Boolean(
    filters.texte || filters.competenceId || filters.type || filters.pays || filters.niveau || filters.disponibilite
  )

  function resetFilters() {
    setDraft({ texte: '', competenceId: '', type: '', pays: '', niveau: '', disponibilite: '' })
    setFilters({})
    setPage(0)
  }

  return (
    <>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Réseau 54Devs</p>
        <h1 className={styles.title}>Trouvez votre prochaine collaboration.</h1>
        <p className={styles.subtitle}>Parcourez les profils, les compétences et les disponibilités de la communauté pour trouver les bons partenaires.</p>
      </header>
      <div className={styles.layout}>
        <section className={`${styles.panel} overflow-hidden`} aria-label="Annuaire des développeurs">
          <form onSubmit={submit}>
            <div className={styles.filters}>
              <label className="relative sm:col-span-2 xl:col-span-3"><span className="sr-only">Rechercher</span><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" /><input value={draft.texte} onChange={event => setDraftField('texte', event.target.value)} className={`${styles.field} pl-10`} placeholder="Nom, pseudonyme ou mot-clé..." /></label>
              <select className={styles.field} value={draft.competenceId} onChange={event => { setDraftField('competenceId', event.target.value); if (!event.target.value) setDraftField('type', '') }} aria-label="Compétence"><option value="" className="bg-[#16221C] text-white">Toutes les compétences</option>{catalogue.map(skill => <option key={skill.id} value={skill.id} className="bg-[#16221C] text-white">{skill.nom}</option>)}</select>
              <select className={styles.field} value={draft.type} onChange={event => setDraftField('type', event.target.value)} aria-label="Type de compétence" disabled={!draft.competenceId}><option value="" className="bg-[#16221C] text-white">Tous les types</option>{SKILL_TYPES.map(([value, label]) => <option key={value} value={value} className="bg-[#16221C] text-white">{label}</option>)}</select>
              <select className={styles.field} value={draft.niveau} onChange={event => setDraftField('niveau', event.target.value)} aria-label="Niveau"><option value="" className="bg-[#16221C] text-white">Tous les niveaux</option>{LEVELS.map(([value, label]) => <option key={value} value={value} className="bg-[#16221C] text-white">{label}</option>)}</select>
              <input className={styles.field} value={draft.pays} onChange={event => setDraftField('pays', event.target.value)} placeholder="Pays (ex. Sénégal)" aria-label="Pays" />
              <input className={styles.field} value={draft.disponibilite} onChange={event => setDraftField('disponibilite', event.target.value)} placeholder="Disponibilité" aria-label="Disponibilité" />
            </div>
            <div className="px-4 sm:px-5 py-3 border-b border-white/10 flex items-center justify-between">
              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs text-[#C9F06A] hover:underline font-semibold"
                >
                  &times; Réinitialiser les filtres
                </button>
              ) : (
                <span className="text-xs text-white/40 font-mono">Filtrez selon vos critères</span>
              )}
              <button type="submit" className={styles.primaryButton}><Search size={16} /> Rechercher</button>
            </div>
          </form>
          {error ? <div className="p-10 text-center"><p className="text-sm text-red-400">{error}</p><button onClick={() => setRetryCount(count => count + 1)} className="mt-3 text-sm font-semibold text-[#C9F06A] hover:underline">Réessayer</button></div>
            : loading ? <div className="p-12 text-center text-sm text-white/40 font-mono"><LoaderCircle size={18} className="inline animate-spin mr-2 text-[#C9F06A]" />Chargement des profils...</div>
              : developers.length ? <>
                {developers.map(developer => <DeveloperCard key={developer.utilisateurId} developer={developer} />)}
                <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between gap-4"><span className="text-xs text-white/40 font-mono">{total} profil{total === 1 ? '' : 's'}</span><div className="flex items-center gap-3"><button disabled={page === 0} onClick={() => setPage(page - 1)} className="text-sm font-semibold text-[#C9F06A] disabled:opacity-30">Précédent</button><span className="text-xs text-white/40 font-mono">{page + 1} / {Math.max(totalPages, 1)}</span><button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)} className="text-sm font-semibold text-[#C9F06A] disabled:opacity-30">Suivant</button></div></div>
              </> : <div className="p-10 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#C9F06A]/10 border border-[#C9F06A]/20 text-[#C9F06A] mb-4"><Users size={22} /></div><h2 className="font-bold text-white font-display text-lg">Aucun profil trouvé</h2><p className="text-sm text-white/60 mt-2">Modifiez vos filtres pour élargir la recherche.</p></div>}
        </section>
        <aside className={`${styles.panel} p-5`}><div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#C9F06A]/10 border border-[#C9F06A]/20 text-[#C9F06A]"><BriefcaseBusiness size={19} /></div><h2 className="font-bold text-sm text-white font-display">Une recherche par compétences</h2><p className="text-sm text-white/60 leading-relaxed mt-2">Filtrez les profils selon ce qu'ils maîtrisent, souhaitent apprendre ou peuvent transmettre.</p><p className="text-xs text-white/40 leading-relaxed mt-4 font-mono">Les profils affichés proviennent du réseau et excluent votre propre compte.</p></aside>
      </div>
    </>
  )
}

function DeveloperDetail({ id }) {
  const navigate = useNavigate()
  const [developer, setDeveloper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    let active = true
    developpeursApi.getById(id).then(data => { if (active) setDeveloper(data) })
      .catch(err => { if (active) setError(err.message || 'Profil introuvable.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id])

  if (loading) return <div className={`${styles.panel} p-12 text-center text-sm text-white/40 font-mono`}><LoaderCircle size={18} className="inline animate-spin mr-2 text-[#C9F06A]" />Chargement du profil...</div>
  if (error || !developer) return <div className={`${styles.panel} p-10 text-center`}><p className="text-sm text-red-400">{error || 'Profil introuvable.'}</p><button onClick={() => navigate('/developers')} className="mt-4 text-sm font-semibold text-[#C9F06A] hover:underline">Retour à l'annuaire</button></div>

  const groupedSkills = (developer.competences || []).reduce((groups, skill) => {
    const key = skill.type || 'MAITRISE'
    groups[key] = [...(groups[key] || []), skill]
    return groups
  }, {})
  const links = [['GitHub', developer.github], ['LinkedIn', developer.linkedin], ['Portfolio', developer.portfolio]].filter(([, url]) => url)

  return <>
    <Link to="/developers" className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-[#C9F06A] mb-5 transition"><ArrowLeft size={16} /> Retour à l'annuaire</Link>
    <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 items-start">
      <aside className={`${styles.panel} p-6 text-center`}>
        <div className="h-24 rounded-2xl bg-gradient-to-r from-[#18251E] via-[#2a2214] to-[#16221C] -mx-6 -mt-6 mb-[-2.75rem] border-b border-white/5" />
        <div className="relative mx-auto h-24 w-24 rounded-3xl overflow-hidden border-2 border-[#C9F06A]/50 ring-4 ring-[#101915] bg-[#C9F06A] text-black shadow-2xl flex items-center justify-center font-bold text-xl">
          <Avatar src={developer.avatarUrl} name={displayName(developer)} className="w-full h-full" />
        </div>
        <h1 className="text-xl font-bold mt-4 text-white font-display">{displayName(developer)}</h1>
        {developer.niveau && <p className="text-sm text-white/40 font-mono mt-1">{LEVEL_LABELS[developer.niveau] || developer.niveau}</p>}
        {(developer.ville || developer.pays) && <p className="inline-flex items-center gap-1.5 text-sm text-white/50 mt-3"><MapPin size={14} className="text-[#C9F06A]" />{[developer.ville, developer.pays].filter(Boolean).join(', ')}</p>}
        {developer.disponibilite && <p className="mt-4 inline-flex rounded-full bg-[#C9F06A]/10 border border-[#C9F06A]/20 px-3 py-1.5 text-xs font-semibold text-[#C9F06A] font-mono">{developer.disponibilite}</p>}
        <div className="mt-5"><InviteDeveloperButton developer={developer} /></div>
        {links.length > 0 && <div className="mt-5 border-t border-white/10 pt-4 space-y-2">{links.map(([label, url]) => <a key={label} href={url} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-sm font-medium text-[#C9F06A] hover:underline"><ExternalLink size={14} />{label}</a>)}</div>}
      </aside>
      <div className="space-y-5">
        <section className={`${styles.panel} p-5 sm:p-7`}><h2 className="text-lg font-bold text-white font-display">À propos</h2><p className="text-sm leading-7 text-white/70 mt-3 whitespace-pre-wrap font-body">{developer.bio || "Ce membre n'a pas encore ajouté de présentation."}</p></section>
        <section className={`${styles.panel} p-5 sm:p-7`}><h2 className="text-lg font-bold text-white font-display mb-4">Compétences</h2>{Object.keys(groupedSkills).length ? <div className="space-y-5">{Object.entries(groupedSkills).map(([type, skills]) => <div key={type}><h3 className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono mb-2">{SKILL_TYPE_LABELS[type] || type}</h3><div className="grid sm:grid-cols-2 gap-2">{skills.map(skill => <div key={`${skill.competenceId}-${skill.type}`} className="rounded-xl bg-[#18251E] border border-white/10 px-4 py-3"><div className="flex items-center justify-between gap-2"><span className="text-sm font-semibold text-white">{skill.nom}</span>{skill.niveau && <span className="text-[11px] text-white/40 font-mono">{LEVEL_LABELS[skill.niveau] || skill.niveau}</span>}</div>{skill.categorie && <p className="text-xs text-white/40 font-mono mt-1">{skill.categorie}</p>}</div>)}</div></div>)}</div> : <p className="text-sm text-white/40">Aucune compétence renseignée.</p>}</section>
        <section className={`${styles.panel} p-5 sm:p-7`}><h2 className="inline-flex items-center gap-2 text-lg font-bold text-white font-display mb-4"><Award size={19} className="text-[#C9F06A]" /> Badges obtenus</h2>{developer.badges?.length ? <div className="grid sm:grid-cols-2 gap-3">{developer.badges.map(badge => <div key={badge.code} className="rounded-2xl border border-[#C9F06A]/20 bg-[#C9F06A]/5 p-4"><h3 className="font-bold text-sm text-white">{badge.nom}</h3><p className="text-xs text-white/60 leading-relaxed mt-1">{badge.description}</p>{badge.dateObtention && <p className="text-[11px] text-[#C9F06A] font-mono mt-2">Obtenu le {formatDate(badge.dateObtention)}</p>}</div>)}</div> : <p className="text-sm text-white/40">Aucun badge obtenu pour le moment.</p>}</section>
        <section className={`${styles.panel} p-5 sm:p-7`}><h2 className="text-lg font-bold text-white font-display mb-4">Projets</h2>{developer.projets?.length ? <div className="grid sm:grid-cols-2 gap-3">{developer.projets.map(project => <Link key={project.id} to={`/projects/${project.id}`} className="rounded-2xl border border-white/10 p-4 hover:border-[#C9F06A]/40 bg-[#18251E] transition"><h3 className="font-bold text-sm text-white">{project.nom}</h3><div className="flex items-center justify-between gap-2 mt-2"><span className="text-xs text-white/40 font-mono">{STATUT_PROJET[project.statut] || project.statut}</span><span className="text-xs text-[#C9F06A] font-mono">{ROLE_MEMBRE[project.roleMembre] || project.roleMembre}</span></div></Link>)}</div> : <p className="text-sm text-white/40">Aucun projet à afficher.</p>}</section>
      </div>
    </div>
  </>
}

export default function Developers() {
  const { id } = useParams()
  return <main className={styles.main}>{id ? <DeveloperDetail key={id} id={id} /> : <DevelopersList />}</main>
}
