import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Award, BookOpenCheck, CheckCircle2, CircleHelp, Clock3,
  Flame, Lightbulb, Loader2, LogOut, Plus, RefreshCw, Rocket,
  Sparkles, Trophy, Users, UsersRound,
} from 'lucide-react'
import { clearAuthSession, dashboardApi, getStoredUser, getToken } from '../api'
import { styles } from './Dashboard.styles'
import { navItems, ROLE_LABELS, STATUT_LABELS } from './Dashboard.data'

const MISSING_LABELS = {
  BIO: 'Ajouter une présentation',
  PAYS: 'Renseigner votre pays',
  VILLE: 'Renseigner votre ville',
  DISPONIBILITE: 'Indiquer votre disponibilité',
  LIEN: 'Ajouter un lien professionnel',
  COMPETENCES: 'Déclarer au moins 3 compétences',
}
const COMPATIBILITY_STYLES = {
  ELEVE: 'bg-emerald-50 text-emerald-700',
  MOYEN: 'bg-blue-50 text-blue-700',
  FAIBLE: 'bg-slate-100 text-slate-600',
}
const COMPATIBILITY_LABELS = { ELEVE: 'Élevée', MOYEN: 'Moyenne', FAIBLE: 'Faible' }

function personName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Membre 54Devs'
}

function initials(person) {
  return `${person?.prenom?.[0] || ''}${person?.nom?.[0] || ''}`.toUpperCase() || '?'
}

function dateLabel(date) {
  if (!date) return ''
  const parsed = new Date(date)
  return Number.isNaN(parsed.getTime()) ? '' : new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(parsed)
}

function SectionTitle({ icon: Icon, title, to, linkLabel = 'Voir tout' }) {
  return <div className="flex items-center justify-between gap-3 mb-4"><h2 className="inline-flex items-center gap-2 text-base font-bold text-slate-900"><Icon size={18} className="text-blue-600" />{title}</h2>{to && <Link to={to} className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800">{linkLabel}<ArrowRight size={14} /></Link>}</div>
}

function Compatibility({ value }) {
  if (!value) return null
  const groups = [
    ['correspondantes', 'Correspondances', 'bg-emerald-50 text-emerald-700'],
    ['aApprendre', 'À apprendre', 'bg-blue-50 text-blue-700'],
    ['manquantes', 'À acquérir', 'bg-slate-100 text-slate-600'],
  ].filter(([field]) => value[field]?.length)
  return <div className="mt-4">
    <div className="flex items-center justify-between gap-3"><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${COMPATIBILITY_STYLES[value.niveau] || COMPATIBILITY_STYLES.FAIBLE}`}>Compatibilité {value.score}% · {COMPATIBILITY_LABELS[value.niveau] || value.niveau}</span></div>
    {groups.length > 0 && <div className="mt-3 space-y-2">{groups.map(([field, label, color]) => <div key={field} className="flex flex-wrap items-center gap-1.5"><span className="text-[11px] text-slate-400 mr-1">{label}</span>{value[field].map(skill => <span key={skill} className={`rounded-full px-2 py-1 text-[10px] font-medium ${color}`}>{skill}</span>)}</div>)}</div>}
  </div>
}

function ProjectCard({ project, compatibility, recommended = false }) {
  if (!project) return null
  return <Link to={`/projects/${project.id}`} className={`${styles.projectCard} group`}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0"><h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition truncate">{project.nom}</h3><p className="text-xs text-slate-500 mt-1">{project.categorie || 'Projet'} · {STATUT_LABELS[project.statut] || project.statut}</p></div>
      {recommended ? <Sparkles size={17} className="shrink-0 text-blue-600" /> : <Rocket size={17} className="shrink-0 text-slate-400" />}
    </div>
    {project.description && <p className="text-sm text-slate-600 leading-relaxed mt-3 line-clamp-2">{project.description}</p>}
    <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-slate-500">
      {project.roleMembre && <span>{ROLE_LABELS[project.roleMembre] || project.roleMembre}</span>}
      {project.nombreMembres != null && <span>{project.nombreMembres} membre{project.nombreMembres === 1 ? '' : 's'}</span>}
      {project.ouvertAuxDemandes && project.placesRestantes > 0 && <span className="text-emerald-700">{project.placesRestantes} place{project.placesRestantes === 1 ? '' : 's'} disponible{project.placesRestantes === 1 ? '' : 's'}</span>}
    </div>
    {compatibility && <Compatibility value={compatibility} />}
    {project.demandesEnAttente > 0 && <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">{project.demandesEnAttente} demande{project.demandesEnAttente === 1 ? '' : 's'} à traiter</p>}
    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">Voir le projet <ArrowRight size={14} /></span>
  </Link>
}

function EmptyRecommendation({ needsSkills }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
    <p className="text-sm font-semibold text-slate-700">{needsSkills ? 'Déclarez vos compétences pour recevoir des recommandations.' : 'Aucun projet ne correspond pour l’instant.'}</p>
    {needsSkills && <Link to="/profile" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Compléter mon profil <ArrowRight size={14} /></Link>}
  </div>
}

function DeveloperSuggestion({ item }) {
  const developer = item?.candidat?.developpeur
  if (!developer) return null
  return <div className="rounded-2xl border border-slate-200 p-4">
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700">{initials(developer)}</div>
      <div className="min-w-0 flex-1"><Link to={`/developers/${developer.utilisateurId}`} className="font-bold text-sm text-slate-900 hover:text-blue-700">{personName(developer)}</Link><p className="text-xs text-slate-500 mt-0.5">Pour <Link to={`/projects/${item.projetId}`} className="text-blue-700 hover:underline">{item.projetNom}</Link></p></div>
    </div>
    {developer.competencesMaitrisees?.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{developer.competencesMaitrisees.slice(0, 4).map(skill => <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] text-slate-600">{skill}</span>)}</div>}
    <Compatibility value={item.candidat.compatibilite} />
    <Link to={`/developers/${developer.utilisateurId}`} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-700">Voir le profil <ArrowRight size={13} /></Link>
  </div>
}

function DashboardContent({ data }) {
  const user = data.utilisateur || getStoredUser() || {}
  const name = user.pseudo || user.prenom || 'Membre'
  const missing = data.profil?.manquants || []
  const requestsToHandle = data.demandesATraiter || 0
  const myProjects = data.mesProjets || []
  const pendingApplications = data.mesDemandesEnAttente || []
  const recommendedProjects = data.projetsRecommandes || []
  const recommendedDevelopers = data.collaborateursRecommandes || []
  const questions = data.questionsPourMoi || []
  const exchanges = data.echangesCompetences || { total: 0, exemples: [] }
  const challenge = data.challengeDuJour

  return <>
    <header className="mb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 mb-2">Votre espace 54Devs</p><h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Bonjour, {name}</h1><p className="text-sm text-slate-500 mt-1">{requestsToHandle > 0 ? `Vous avez ${requestsToHandle} demande${requestsToHandle === 1 ? '' : 's'} à traiter sur vos projets.` : 'Voici les nouveautés et les pistes de collaboration pour vous.'}</p></div>
      <Link to="/projects/create" className={styles.primaryButton}><Plus size={16} /> Nouveau projet</Link>
    </header>

    {data.profil && data.profil.pourcentage < 100 && <section className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1"><div className="flex items-center justify-between gap-3"><h2 className="font-bold text-slate-900">Complétez votre profil</h2><span className="text-sm font-bold text-blue-700">{data.profil.pourcentage}%</span></div><div className="h-2 rounded-full bg-blue-100 mt-3 overflow-hidden"><div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.max(0, Math.min(100, data.profil.pourcentage || 0))}%` }} /></div><div className="flex flex-wrap gap-2 mt-3">{missing.map(item => <span key={item} className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600">{MISSING_LABELS[item] || item}</span>)}</div></div>
        <Link to="/profile" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Compléter mon profil <ArrowRight size={15} /></Link>
      </div>
    </section>}

    {challenge ? <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#17243a] to-[#233653] p-6 sm:p-8 text-white mb-7">
      <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div><p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-300"><Flame size={14} /> Challenge du jour</p><h2 className="text-xl sm:text-2xl font-bold mt-2">{challenge.titre}</h2><p className="text-sm text-slate-300 mt-2">{challenge.type} · {challenge.difficulte} · {challenge.points} points</p></div>
        <Link to={`/challenges/${challenge.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-blue-50">{challenge.maParticipation?.statut === 'REUSSIE' ? 'Revoir le challenge' : 'Relever le défi'} <ArrowRight size={16} /></Link>
      </div>
    </section> : <section className="mb-7 rounded-2xl border border-slate-200 bg-white p-5 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600"><Lightbulb size={18} /></div><div><h2 className="font-semibold text-sm">Pas de challenge aujourd’hui</h2><Link to="/challenges" className="text-xs text-blue-700 font-semibold hover:underline">Voir les autres challenges</Link></div></section>}

    {myProjects.length > 0 ? <section className="mb-8"><SectionTitle icon={Rocket} title="Mes projets" to="/projects" /><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{myProjects.slice(0, 6).map(project => <ProjectCard key={project.id} project={project} />)}</div></section> : <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><div className="flex flex-col sm:flex-row sm:items-center gap-4"><div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700"><Rocket size={22} /></div><div className="flex-1"><h2 className="font-bold">Vous ne participez à aucun projet</h2><p className="text-sm text-slate-500 mt-1">Découvrez les projets de la communauté ou partagez une idée.</p></div><Link to="/projects" className={styles.secondaryButton}>Découvrir</Link><Link to="/projects/create" className={styles.primaryButton}><Plus size={15} /> Publier</Link></div></section>}

    {pendingApplications.length > 0 && <section className="mb-8"><SectionTitle icon={Clock3} title="Mes demandes en attente" to="/projects" /><div className="grid md:grid-cols-2 gap-3">{pendingApplications.slice(0, 5).map(application => <Link key={application.id} to={`/projects/${application.projetId}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 hover:border-blue-200 transition"><div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><Clock3 size={18} /></div><div className="min-w-0 flex-1"><p className="font-semibold text-sm truncate">{application.projetNom}</p><p className="text-xs text-slate-500 mt-1">Envoyée le {dateLabel(application.dateDemande)}</p></div><ArrowRight size={16} className="text-slate-400" /></Link>)}</div></section>}

    <section className="mb-8"><SectionTitle icon={Sparkles} title="Projets recommandés" to="/projects" /><p className="text-xs text-slate-500 -mt-2 mb-4">Suggestions basées sur les compétences de votre profil, avec les correspondances détaillées.</p>{recommendedProjects.length ? <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{recommendedProjects.slice(0, 3).map(item => <ProjectCard key={item.projet?.id} project={item.projet} compatibility={item.compatibilite} recommended />)}</div> : <EmptyRecommendation needsSkills={missing.includes('COMPETENCES')} />}</section>

    {recommendedDevelopers.length > 0 && <section className="mb-8"><SectionTitle icon={UsersRound} title="Collaborateurs recommandés" to="/projects" linkLabel="Mes projets" /><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{recommendedDevelopers.slice(0, 6).map((item, index) => <DeveloperSuggestion key={`${item.projetId}-${item.candidat?.developpeur?.utilisateurId || index}`} item={item} />)}</div></section>}

    <div className="grid xl:grid-cols-2 gap-6 mb-8">
      {questions.length > 0 && <section className={`${styles.card} h-fit`}><SectionTitle icon={CircleHelp} title="Questions pour vous" to="/questions" /><p className="text-xs text-slate-500 -mt-2 mb-4">Des questions sans réponse liées à vos compétences.</p><div className="space-y-3">{questions.slice(0, 3).map(question => <Link key={question.id} to={`/questions/${question.id}`} className="block rounded-xl bg-slate-50 p-4 hover:bg-blue-50/70 transition"><div className="flex items-start justify-between gap-3"><h3 className="font-semibold text-sm text-slate-800">{question.titre}</h3>{question.categorie && <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] text-slate-600">{question.categorie}</span>}</div><p className="text-xs text-slate-500 mt-2 line-clamp-2">{question.extrait}</p><span className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-500"><Users size={13} />{question.nombreReponses} réponse{question.nombreReponses === 1 ? '' : 's'}</span></Link>)}</div></section>}

      <section className={`${styles.card} h-fit`}><SectionTitle icon={BookOpenCheck} title="Échanges de compétences" to="/developers" linkLabel="Trouver des développeurs" />{exchanges.total > 0 ? <><p className="text-xs text-slate-500 -mt-2 mb-4">Échanges réciproques trouvés : {exchanges.total}</p><div className="space-y-3">{(exchanges.exemples || []).slice(0, 3).map(exchange => <Link key={exchange.developpeur.utilisateurId} to={`/developers/${exchange.developpeur.utilisateurId}`} className="block rounded-xl border border-slate-200 p-4 hover:border-blue-200 transition"><div className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-100 text-xs font-bold text-blue-700">{initials(exchange.developpeur)}</div><span className="font-semibold text-sm">{personName(exchange.developpeur)}</span></div><div className="grid sm:grid-cols-2 gap-3 mt-3 text-xs"><div><span className="text-slate-400">Peut vous enseigner</span><p className="text-emerald-700 font-medium mt-1">{exchange.ilPeutMEnseigner.join(', ')}</p></div><div><span className="text-slate-400">Vous pouvez lui enseigner</span><p className="text-blue-700 font-medium mt-1">{exchange.jePeuxLuiEnseigner.join(', ')}</p></div></div></Link>)}</div></> : <div className="rounded-xl bg-slate-50 p-5"><p className="text-sm text-slate-600">Indiquez les compétences que vous souhaitez apprendre et transmettre pour trouver des échanges réciproques.</p><Link to="/profile" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">Mettre à jour mes compétences <ArrowRight size={14} /></Link></div>}</section>
    </div>

    {data.badges && <Link to="/profile" className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-5 hover:bg-amber-50 transition"><div className="grid h-11 w-11 place-items-center rounded-xl bg-amber-100 text-amber-700"><Trophy size={20} /></div><div className="flex-1"><h2 className="font-bold text-sm">Vos badges</h2><p className="text-xs text-slate-600 mt-1">{data.badges.obtenus} badge{data.badges.obtenus === 1 ? '' : 's'} obtenu{data.badges.obtenus === 1 ? '' : 's'} sur {data.badges.total}</p></div><ArrowRight size={17} className="text-amber-700" /></Link>}
  </>
}

export default function Dashboard() {
  const navigate = useNavigate()
  const token = getToken()
  const [active, setActive] = useState('dashboard')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = useCallback(() => {
    setLoading(true)
    setError('')
    dashboardApi.get()
      .then(setData)
      .catch(err => setError(err.message || 'Impossible de charger le tableau de bord.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    loadDashboard()
  }, [token, navigate, loadDashboard])

  function handleLogout() { clearAuthSession(); navigate('/') }

  return <div className={styles.page}>
    <aside className={styles.sidebar}>
      <div>
        <Link to="/" className={styles.sidebarLogo}><span className="text-primary">&lt;/&gt;</span><span>54<span className="text-primary">Devs</span></span></Link>
        <Link to="/profile" className={`${styles.userCard} ${styles.userCardInactive}`}>
          <div className={styles.userAvatar}>{initials(data?.utilisateur || getStoredUser())}</div>
          <div className="text-left min-w-0"><p className="text-white text-sm font-semibold truncate">{personName(data?.utilisateur || getStoredUser())}</p><p className="text-gray-400 text-[10px] truncate">{data?.utilisateur?.pays || 'Mon profil'}</p></div>
        </Link>
        <nav className="space-y-1" aria-label="Navigation principale">
          {navItems.map(item => { const Icon = item.icon; const isActive = active === item.key; const destinations = { projects: '/projects', questions: '/questions', challenges: '/challenges', developers: '/developers' }; return <button key={item.key} onClick={() => { const destination = destinations[item.key]; if (destination) navigate(destination); else setActive(item.key) }} className={`${styles.navItem} ${isActive ? styles.navItemActive : styles.navItemInactive}`}><Icon size={18} />{item.label}</button> })}
        </nav>
      </div>
      <div className="space-y-3">
        <div className={styles.publishCard}><span className="text-primary text-xs font-bold uppercase tracking-wider">À vous de jouer</span><p className="text-white text-sm font-semibold mt-2 mb-1">Une idée à partager ?</p><p className="text-gray-400 text-xs mb-3">Publiez votre projet et trouvez des personnes pour le faire avancer.</p><Link to="/projects/create" className={`block text-center ${styles.projectActionButton}`}>Publier un projet</Link></div>
        <button onClick={handleLogout} className={styles.logoutButton}><LogOut size={18} />Déconnexion</button>
      </div>
    </aside>

    <main className={styles.mainContent}>
      {loading ? <div className="flex min-h-[50vh] items-center justify-center"><Loader2 size={28} className="animate-spin text-blue-600" /><span className="ml-3 text-sm text-slate-500">Chargement de votre tableau de bord…</span></div>
        : error ? <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-50 text-red-600"><RefreshCw size={20} /></div><h1 className="mt-4 text-xl font-bold">Le tableau de bord est indisponible</h1><p className="mt-2 text-sm text-slate-500">{error}</p><button onClick={loadDashboard} className={`${styles.primaryButton} mt-5`}><RefreshCw size={15} /> Réessayer</button></div>
          : data ? <DashboardContent data={data} /> : null}
    </main>
  </div>
}
