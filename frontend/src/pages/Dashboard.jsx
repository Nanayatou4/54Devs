import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Award, BookOpenCheck, CircleHelp, Clock3,
  Flame, GraduationCap, Lightbulb, Loader2, Plus, RefreshCw, Rocket,
  Sparkles, Trophy, Users, UsersRound,
} from 'lucide-react'
import { dashboardApi, getStoredUser, getToken } from '../api'
import { getProjectImage } from '../lib/projectImages'
import { styles } from './Dashboard.styles'
import { ROLE_LABELS, STATUT_LABELS } from './Dashboard.data'
import Avatar from '../components/Avatar'
import InviteDeveloperButton from '../components/InviteDeveloperButton'

const MISSING_LABELS = {
  BIO: 'Ajouter une présentation',
  PAYS: 'Renseigner votre pays',
  VILLE: 'Renseigner votre ville',
  DISPONIBILITE: 'Indiquer votre disponibilité',
  LIEN: 'Ajouter un lien professionnel',
  COMPETENCES: 'Déclarer au moins 3 compétences',
}
const COMPATIBILITY_STYLES = {
  ELEVE: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  MOYEN: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  FAIBLE: 'bg-slate-800 text-slate-400 border border-white/10',
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
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <h2 className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-white font-display">
        <Icon size={18} className="text-[#C9F06A]" />
        {title}
      </h2>
      {to && (
        <Link to={to} className="inline-flex items-center gap-1 text-xs font-semibold text-[#C9F06A] hover:text-[#D8F87C] transition-colors">
          {linkLabel}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

function Compatibility({ value }) {
  if (!value) return null
  const groups = [
    ['correspondantes', 'Correspondances', 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'],
    ['aApprendre', 'À apprendre', 'bg-blue-500/15 text-blue-400 border border-blue-500/25'],
    ['manquantes', 'À acquérir', 'bg-slate-800 text-slate-400 border border-white/10'],
  ].filter(([field]) => value[field]?.length)

  return (
    <div className="mt-4 pt-3 border-t border-white/5">
      <div className="flex items-center justify-between gap-3">
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${COMPATIBILITY_STYLES[value.niveau] || COMPATIBILITY_STYLES.FAIBLE}`}>
          Compatibilité {value.score}% · {COMPATIBILITY_LABELS[value.niveau] || value.niveau}
        </span>
      </div>
      {groups.length > 0 && (
        <div className="mt-3 space-y-2">
          {groups.map(([field, label, color]) => (
            <div key={field} className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400 mr-1">{label} :</span>
              {value[field].map(skill => (
                <span key={skill} className={`rounded-lg px-2.5 py-0.5 text-[10px] font-medium font-mono ${color}`}>
                  {skill}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project, compatibility, recommended = false }) {
  if (!project) return null
  return (
    <Link to={`/projects/${project.id}`} className={`${styles.projectCard} group overflow-hidden p-0 flex flex-col`}>
      <div className="relative h-36 w-full overflow-hidden border-b border-white/10 bg-[#0E1511]">
        <img
          src={getProjectImage(project)}
          alt={project.nom}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141E19] via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="bg-black/75 backdrop-blur-md border border-[#C9F06A]/30 text-[#C9F06A] text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {project.categorie || 'PROJET'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          {recommended ? (
            <span className="bg-[#C9F06A] text-black text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
              <Sparkles size={11} /> Recommandé
            </span>
          ) : (
            <span className="bg-black/75 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
              {STATUT_LABELS[project.statut] || project.statut}
            </span>
          )}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-bold text-white group-hover:text-[#C9F06A] transition font-display truncate text-base">
              {project.nom}
            </h3>
            {recommended ? (
              <Sparkles size={16} className="shrink-0 text-[#C9F06A]" />
            ) : (
              <Rocket size={16} className="shrink-0 text-slate-500" />
            )}
          </div>
          {project.description && (
            <p className="text-sm text-slate-300 leading-relaxed mt-2 line-clamp-2 font-body">
              {project.description}
            </p>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
            {project.roleMembre && (
              <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[11px] font-mono">
                {ROLE_LABELS[project.roleMembre] || project.roleMembre}
              </span>
            )}
            {project.nombreMembres != null && (
              <span>{project.nombreMembres} membre{project.nombreMembres === 1 ? '' : 's'}</span>
            )}
            {project.ouvertAuxDemandes && project.placesRestantes > 0 && (
              <span className="text-emerald-400 font-semibold">
                {project.placesRestantes} place{project.placesRestantes === 1 ? '' : 's'} disponible{project.placesRestantes === 1 ? '' : 's'}
              </span>
            )}
          </div>
          {compatibility && <Compatibility value={compatibility} />}
          {project.demandesEnAttente > 0 && (
            <p className="mt-3 rounded-xl bg-[#C9F06A]/15 border border-[#C9F06A]/25 px-3 py-2 text-xs font-semibold text-[#C9F06A]">
              {project.demandesEnAttente} demande{project.demandesEnAttente === 1 ? '' : 's'} à traiter
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#C9F06A] group-hover:text-[#D8F87C]">
            Voir le projet <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function EmptyRecommendation({ needsSkills }) {
  return (
    <div className="rounded-3xl border border-dashed border-white/15 bg-slate-900/60 p-8 text-center backdrop-blur-sm">
      <p className="text-sm font-semibold text-slate-300">
        {needsSkills ? 'Déclarez vos compétences pour recevoir des recommandations.' : 'Aucun projet ne correspond pour l’instant.'}
      </p>
      {needsSkills && (
        <Link to="/profile" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C9F06A] hover:text-[#D8F87C]">
          Compléter mon profil <ArrowRight size={14} />
        </Link>
      )}
    </div>
  )
}

function DeveloperSuggestion({ item }) {
  const developer = item?.candidat?.developpeur
  if (!developer) return null
  return (
    <div className="rounded-3xl border border-white/10 bg-[#141E19]/90 p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 shrink-0 rounded-2xl overflow-hidden border border-[#C9F06A]/40 bg-[#C9F06A] text-black shadow-md flex items-center justify-center font-bold text-xs ring-2 ring-[#C9F06A]/20">
          <Avatar src={developer.avatarUrl} name={personName(developer)} className="w-full h-full" />
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/developers/${developer.utilisateurId}`} className="font-bold text-sm text-white hover:text-[#C9F06A] transition font-display">
            {personName(developer)}
          </Link>
          <p className="text-xs text-slate-400 mt-0.5">
            Pour <Link to={`/projects/${item.projetId}`} className="text-[#C9F06A] hover:underline">{item.projetNom}</Link>
          </p>
        </div>
      </div>
      {developer.competencesMaitrisees?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {developer.competencesMaitrisees.slice(0, 4).map(skill => (
            <span key={skill} className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] text-slate-300 font-mono">
              {skill}
            </span>
          ))}
        </div>
      )}
      <Compatibility value={item.candidat.compatibilite} />
      <div className="mt-4"><InviteDeveloperButton developer={developer} /></div>
      <Link to={`/developers/${developer.utilisateurId}`} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#C9F06A] hover:text-[#D8F87C]">
        Voir le profil <ArrowRight size={13} />
      </Link>
    </div>
  )
}

function DashboardContent({ data }) {
  const user = data.utilisateur || getStoredUser() || {}
  const name = user.pseudo || user.prenom || 'Membre'
  const missing = data.profil?.manquants || []
  const requestsToHandle = data.demandesATraiter || 0
  const mentorshipRequests = data.demandesMentoratATraiter || 0
  const invitationsEnAttente = data.invitationsEnAttente || 0
  const myProjects = data.mesProjets || []
  const pendingApplications = data.mesDemandesEnAttente || []
  const recommendedProjects = data.projetsRecommandes || []
  const recommendedDevelopers = data.collaborateursRecommandes || []
  const questions = data.questionsPourMoi || []
  const exchanges = data.echangesCompetences || { total: 0, exemples: [] }
  const challenge = data.challengeDuJour

  return (
    <>
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9F06A] mb-2">
            Votre espace 54Devs
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-display">
            Bonjour, {name}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            {requestsToHandle > 0 || mentorshipRequests > 0
              ? `Vous avez ${requestsToHandle + mentorshipRequests} notification${requestsToHandle + mentorshipRequests > 1 ? 's' : ''} en attente (${requestsToHandle} projet${requestsToHandle > 1 ? 's' : ''}, ${mentorshipRequests} mentorat${mentorshipRequests > 1 ? 's' : ''}).`
              : 'Voici les opportunités de collaboration, projets recommandés et challenges du jour.'}
          </p>
        </div>
        <Link to="/projects/create" className={styles.primaryButton}>
          <Plus size={16} /> Nouveau projet
        </Link>
      </header>

      {invitationsEnAttente > 0 && (
        <section className="mb-8 flex flex-col gap-4 rounded-3xl border border-[#C9F06A]/30 bg-[#C9F06A]/10 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-bold text-white">{invitationsEnAttente === 1 ? 'Vous avez 1 invitation à rejoindre un projet' : `Vous avez ${invitationsEnAttente} invitations à rejoindre un projet`}</h2><p className="mt-1 text-sm text-white/55">Consultez les conditions puis acceptez ou refusez les propositions.</p></div>
          <Link to="/invitations" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2.5 text-xs font-bold text-black">Voir mes invitations <ArrowRight size={14} /></Link>
        </section>
      )}

      {/* 3 Raccourcis d'action immédiate */}
      <section className="grid sm:grid-cols-3 gap-4 mb-8" aria-label="Actions rapides">
        <Link
          to="/projects"
          className="group rounded-2xl border border-white/10 bg-[#141E19]/80 hover:bg-[#16221C] hover:border-[#C9F06A]/40 p-5 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#C9F06A]/15 text-[#C9F06A] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Rocket size={20} />
            </div>
            <ArrowRight size={16} className="text-white/40 group-hover:text-[#C9F06A] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-display group-hover:text-[#C9F06A] transition">
              Explorer les Projets
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Découvrez les initiatives panafricaines ou rejoignez une équipe.
            </p>
          </div>
        </Link>

        <Link
          to="/developers"
          className="group rounded-2xl border border-white/10 bg-[#141E19]/80 hover:bg-[#16221C] hover:border-[#C9F06A]/40 p-5 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <ArrowRight size={16} className="text-white/40 group-hover:text-[#C9F06A] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-display group-hover:text-[#C9F06A] transition">
              Trouver des Collaborateurs
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Connectez-vous avec des développeurs et mentors des 54 pays.
            </p>
          </div>
        </Link>

        <Link
          to="/questions"
          className="group rounded-2xl border border-white/10 bg-[#141E19]/80 hover:bg-[#16221C] hover:border-[#C9F06A]/40 p-5 transition-all shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CircleHelp size={20} />
            </div>
            <ArrowRight size={16} className="text-white/40 group-hover:text-[#C9F06A] group-hover:translate-x-1 transition-all" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base font-display group-hover:text-[#C9F06A] transition">
              Entraide & Questions
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Posez une question technique ou partagez vos connaissances.
            </p>
          </div>
        </Link>
      </section>

      {/* Demandes de mentorat en attente */}
      {mentorshipRequests > 0 && (
        <section className="mb-8 rounded-3xl border border-[#C9F06A]/30 bg-emerald-500/10 p-5 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#C9F06A]/20 text-[#C9F06A]">
                <GraduationCap size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white font-display">
                  {mentorshipRequests === 1
                    ? '1 demande de mentorat en attente'
                    : `${mentorshipRequests} demandes de mentorat en attente`}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Des développeurs souhaitent bénéficier de votre accompagnement.
                </p>
              </div>
            </div>
            <Link
              to="/mentorship?tab=mes-mentorats"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9F06A] text-black font-bold text-xs px-4 py-2.5 hover:bg-[#D8F87C] transition shrink-0 shadow-lg shadow-[#C9F06A]/20"
            >
              Gérer les demandes <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      )}

      {/* Profil completion bar */}
      {data.profil && data.profil.pourcentage < 100 && (
        <section className="mb-8 rounded-3xl border border-white/10 bg-[#141E19]/90 p-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-bold text-white font-display">Complétez votre profil</h2>
                <span className="text-sm font-bold text-[#C9F06A]">{data.profil.pourcentage}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#C9F06A] to-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, data.profil.pourcentage || 0))}%` }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {missing.map(item => (
                  <span key={item} className="rounded-xl bg-white/5 border border-white/10 px-3 py-1 text-xs text-slate-300">
                    {MISSING_LABELS[item] || item}
                  </span>
                ))}
              </div>
            </div>
            <Link to="/profile" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 px-5 py-3 text-sm font-semibold text-white transition">
              Compléter mon profil <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* Challenge of the day */}
      {challenge ? (
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#16221C] to-[#1A2720] border border-[#C9F06A]/20 p-6 sm:p-8 text-white mb-8 shadow-2xl">
          <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#C9F06A]/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9F06A]">
                <Flame size={14} /> Challenge du jour
              </p>
              <h2 className="text-xl sm:text-2xl font-bold mt-2 font-display">{challenge.titre}</h2>
              <p className="text-sm text-slate-300 mt-2">
                {challenge.type} · {challenge.difficulte} · <strong className="text-[#C9F06A]">{challenge.points} points</strong>
              </p>
            </div>
            <Link
              to={`/challenges/${challenge.id}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C9F06A] to-emerald-400 px-6 py-3 text-sm font-bold text-black hover:from-[#C9F06A] hover:to-emerald-500 transition shadow-lg shadow-[#C9F06A]/20"
            >
              {challenge.maParticipation?.statut === 'REUSSIE' ? 'Revoir le challenge' : 'Relever le défi'}
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      ) : (
        <section className="mb-8 rounded-3xl border border-white/10 bg-[#141E19]/80 p-5 flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#C9F06A]/10 text-[#C9F06A]">
            <Lightbulb size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-sm text-white">Pas de challenge programmé aujourd'hui</h2>
            <Link to="/challenges" className="text-xs text-[#C9F06A] font-semibold hover:underline">
              Voir tous les challenges disponibles
            </Link>
          </div>
        </section>
      )}

      {/* Mes projets */}
      {myProjects.length > 0 ? (
        <section className="mb-10">
          <SectionTitle icon={Rocket} title="Mes projets" to="/projects" />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {myProjects.slice(0, 6).map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      ) : (
        <section className="mb-10 rounded-3xl border border-white/10 bg-[#141E19]/80 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C9F06A]/15 text-[#C9F06A]">
              <Rocket size={24} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-white font-display text-base">Vous ne participez à aucun projet</h2>
              <p className="text-sm text-slate-400 mt-1">Découvrez les projets de la communauté ou publiez votre propre idée.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/projects" className={styles.secondaryButton}>Découvrir</Link>
              <Link to="/projects/create" className={styles.primaryButton}>
                <Plus size={15} /> Publier
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Demandes en attente */}
      {pendingApplications.length > 0 && (
        <section className="mb-10">
          <SectionTitle icon={Clock3} title="Mes demandes en attente" to="/projects" />
          <div className="grid md:grid-cols-2 gap-4">
            {pendingApplications.slice(0, 5).map(application => (
              <Link
                key={application.id}
                to={`/projects/${application.projetId}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#141E19]/80 p-4 hover:border-[#C9F06A]/30 transition group"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#C9F06A]/15 text-[#C9F06A]">
                  <Clock3 size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-white truncate group-hover:text-[#C9F06A] transition">
                    {application.projetNom}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Envoyée le {dateLabel(application.dateDemande)}
                  </p>
                </div>
                <ArrowRight size={16} className="text-slate-500 group-hover:text-[#C9F06A] transition" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Projets recommandés */}
      <section className="mb-10">
        <SectionTitle icon={Sparkles} title="Projets recommandés" to="/projects" />
        <p className="text-xs text-slate-400 -mt-2 mb-4">
          Suggestions basées sur les compétences de votre profil avec le score de compatibilité.
        </p>
        {recommendedProjects.length ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recommendedProjects.slice(0, 3).map(item => (
              <ProjectCard key={item.projet?.id} project={item.projet} compatibility={item.compatibilite} recommended />
            ))}
          </div>
        ) : (
          <EmptyRecommendation needsSkills={missing.includes('COMPETENCES')} />
        )}
      </section>

      {/* Collaborateurs recommandés */}
      {recommendedDevelopers.length > 0 && (
        <section className="mb-10">
          <SectionTitle icon={UsersRound} title="Collaborateurs recommandés" to="/projects" linkLabel="Mes projets" />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {recommendedDevelopers.slice(0, 6).map((item, index) => (
              <DeveloperSuggestion key={`${item.projetId}-${item.candidat?.developpeur?.utilisateurId || index}`} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Questions & Echanges de compétences */}
      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        {questions.length > 0 && (
          <section className={`${styles.card} h-fit`}>
            <SectionTitle icon={CircleHelp} title="Questions pour vous" to="/questions" />
            <p className="text-xs text-slate-400 -mt-2 mb-4">Questions techniques ouvertes correspondant à vos compétences.</p>
            <div className="space-y-3">
              {questions.slice(0, 3).map(question => (
                <Link
                  key={question.id}
                  to={`/questions/${question.id}`}
                  className="block rounded-2xl bg-white/5 border border-white/10 p-4 hover:border-[#C9F06A]/30 transition group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-sm text-white group-hover:text-[#C9F06A] transition font-display">
                      {question.titre}
                    </h3>
                    {question.categorie && (
                      <span className="shrink-0 rounded-lg bg-white/10 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                        {question.categorie}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{question.extrait}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Users size={13} /> {question.nombreReponses} réponse{question.nombreReponses === 1 ? '' : 's'}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className={`${styles.card} h-fit`}>
          <SectionTitle icon={BookOpenCheck} title="Échanges de compétences" to="/developers" linkLabel="Trouver des développeurs" />
          {exchanges.total > 0 ? (
            <>
              <p className="text-xs text-slate-400 -mt-2 mb-4">Échanges réciproques trouvés : {exchanges.total}</p>
              <div className="space-y-3">
                {(exchanges.exemples || []).slice(0, 3).map(exchange => (
                  <Link
                    key={exchange.developpeur.utilisateurId}
                    to={`/developers/${exchange.developpeur.utilisateurId}`}
                    className="block rounded-2xl border border-white/10 bg-white/5 p-4 hover:border-[#C9F06A]/30 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#C9F06A]/15 text-xs font-bold text-[#C9F06A]">
                        {initials(exchange.developpeur)}
                      </div>
                      <span className="font-semibold text-sm text-white font-display">{personName(exchange.developpeur)}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mt-3 text-xs">
                      <div>
                        <span className="text-slate-400">Peut vous enseigner :</span>
                        <p className="text-emerald-400 font-medium mt-1">{exchange.ilPeutMEnseigner.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Vous pouvez lui enseigner :</span>
                        <p className="text-[#C9F06A] font-medium mt-1">{exchange.jePeuxLuiEnseigner.join(', ')}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5 text-center">
              <p className="text-sm text-slate-300">Indiquez les compétences que vous souhaitez apprendre et transmettre pour trouver des échanges réciproques.</p>
              <Link to="/profile" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#C9F06A] hover:text-[#D8F87C]">
                Mettre à jour mes compétences <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </section>
      </div>

      {data.badges && (
        <Link
          to="/profile"
          className="flex items-center gap-4 rounded-3xl border border-[#C9F06A]/25 bg-[#C9F06A]/10 p-5 hover:bg-[#C9F06A]/15 transition shadow-lg"
        >
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#C9F06A]/20 text-[#C9F06A]">
            <Trophy size={22} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-white text-sm font-display">Vos badges de réputation</h2>
            <p className="text-xs text-slate-300 mt-1">
              {data.badges.obtenus} badge{data.badges.obtenus === 1 ? '' : 's'} obtenu{data.badges.obtenus === 1 ? '' : 's'} sur {data.badges.total}
            </p>
          </div>
          <ArrowRight size={18} className="text-[#C9F06A]" />
        </Link>
      )}
    </>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const token = getToken()
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
    const user = getStoredUser()
    if (user?.role === 'ADMIN') {
      navigate('/admin', { replace: true })
      return
    }
    loadDashboard()
  }, [token, navigate, loadDashboard])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 size={32} className="animate-spin text-[#C9F06A]" />
        <span className="ml-3 text-sm text-slate-400">Chargement de votre tableau de bord...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mx-auto mt-12 max-w-xl rounded-3xl border border-white/10 bg-slate-900/90 p-8 text-center shadow-2xl">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-red-500/15 text-red-400">
          <RefreshCw size={22} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-white font-display">Le tableau de bord est momentanément indisponible</h1>
        <p className="mt-2 text-sm text-slate-400">{error}</p>
        <button type="button" onClick={loadDashboard} className={`${styles.primaryButton} mt-6`}>
          <RefreshCw size={15} /> Réessayer
        </button>
      </div>
    )
  }

  return data ? <DashboardContent data={data} /> : null
}
