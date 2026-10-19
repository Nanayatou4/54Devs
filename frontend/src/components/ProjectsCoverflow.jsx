import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  FolderOpen,
  PlusCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
} from 'lucide-react'
import { publicApi, projetsApi, STATUT_PROJET } from '../api'
import { getProjectImage } from '../lib/projectImages'
import Avatar from './Avatar'

function creatorOf(p) {
  const c = p?.createur || {}
  const name = [c.prenom, c.nom].filter(Boolean).join(' ') || c.nomComplet || p?.createurPseudo || p?.createurNom || ''
  return { name, avatar: c.avatarUrl || p?.createurAvatarUrl || null }
}

// Palette of dynamic glowing gradients for backend projects
const PALETTES = [
  {
    accent: '#C9F06A',
    gradient: 'linear-gradient(155deg, rgba(201, 240, 106, 0.22) 0%, rgba(29, 29, 27, 0.95) 55%, #1d1d1b 100%)',
  },
  {
    accent: '#22c55e',
    gradient: 'linear-gradient(155deg, rgba(34, 197, 94, 0.22) 0%, rgba(29, 29, 27, 0.95) 55%, #1d1d1b 100%)',
  },
  {
    accent: '#0ea5e9',
    gradient: 'linear-gradient(155deg, rgba(14, 165, 233, 0.22) 0%, rgba(29, 29, 27, 0.95) 55%, #1d1d1b 100%)',
  },
  {
    accent: '#a855f7',
    gradient: 'linear-gradient(155deg, rgba(168, 85, 247, 0.22) 0%, rgba(29, 29, 27, 0.95) 55%, #1d1d1b 100%)',
  },
  {
    accent: '#ec4899',
    gradient: 'linear-gradient(155deg, rgba(236, 72, 153, 0.22) 0%, rgba(29, 29, 27, 0.95) 55%, #1d1d1b 100%)',
  },
]

export default function ProjectsCoverflow() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Fetch real projects from the backend API
  useEffect(() => {
    let active = true
    setLoading(true)

    publicApi
      .projets(12)
      .then(data => {
        if (!active) return
        const list = Array.isArray(data) ? data : data?.contenu || []
        setProjects(list)
      })
      .catch(() => {
        // Fallback to projetsApi if publicApi fails
        if (!active) return
        projetsApi
          .rechercher({ page: 0, taille: 12, auth: false })
          .then(data => {
            if (!active) return
            const list = Array.isArray(data) ? data : data?.contenu || []
            setProjects(list)
          })
          .catch(() => {
            if (active) setProjects([])
          })
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const total = projects.length

  // Autoplay rotation when projects exist
  useEffect(() => {
    if (isPaused || total <= 1) return
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % total)
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused, total])

  const activeProject = total > 0 ? projects[activeIndex % total] : null

  function getCardTransform(index) {
    const diff = (index - activeIndex + total) % total
    let normalizedDiff = diff
    if (diff > total / 2) normalizedDiff = diff - total

    if (normalizedDiff === 0) {
      return {
        transform: 'translateX(0%) translateZ(40px) scale(1.08)',
        zIndex: 30,
        opacity: 1,
        filter: 'brightness(1)',
      }
    } else if (normalizedDiff === 1 || normalizedDiff === -(total - 1)) {
      return {
        transform: 'translateX(70%) translateZ(-40px) rotateY(-22deg) scale(0.88)',
        zIndex: 20,
        opacity: 0.75,
        filter: 'brightness(0.75)',
      }
    } else if (normalizedDiff === -1 || normalizedDiff === total - 1) {
      return {
        transform: 'translateX(-70%) translateZ(-40px) rotateY(22deg) scale(0.88)',
        zIndex: 20,
        opacity: 0.75,
        filter: 'brightness(0.75)',
      }
    } else if (normalizedDiff === 2) {
      return {
        transform: 'translateX(130%) translateZ(-100px) rotateY(-32deg) scale(0.72)',
        zIndex: 10,
        opacity: 0.35,
        filter: 'brightness(0.5)',
      }
    } else if (normalizedDiff === -2) {
      return {
        transform: 'translateX(-130%) translateZ(-100px) rotateY(32deg) scale(0.72)',
        zIndex: 10,
        opacity: 0.35,
        filter: 'brightness(0.5)',
      }
    } else {
      return {
        transform: 'translateX(0%) translateZ(-200px) scale(0.5)',
        zIndex: 0,
        opacity: 0,
        pointerEvents: 'none',
      }
    }
  }

  return (
    <section id="projets-publies" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36 bg-[#0B0D11] border-t border-white/5 overflow-hidden">
      
      {/* Background Ambience & Grid */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 h-[550px] w-[550px] rounded-full bg-[#C9F06A]/8 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="inline-block text-xs font-bold tracking-[0.25em] text-[#C9F06A] uppercase mb-3">
            // ÉCOSYSTÈME & PORTFOLIO
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-display">
            Les Projets Publiés de la Communauté
          </h2>
          <p className="mt-5 text-base sm:text-lg text-white/65 leading-relaxed font-body">
            Chaque entité ci-dessous est un projet réellement enregistré dans l'écosystème — dès qu'un projet est publié, il apparaît en direct dans ce carrousel 3D.
          </p>
        </div>

        {/* State 1: Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 size={36} className="animate-spin text-[#C9F06A] mb-4" />
            <p className="text-xs text-white/60 uppercase tracking-widest font-mono">
              Récupération des projets depuis l'API...
            </p>
          </div>
        )}

        {/* State 2: Empty Backend (No projects registered yet) */}
        {!loading && total === 0 && (
          <div className="max-w-xl mx-auto rounded-3xl border border-dashed border-[#C9F06A]/40 bg-[#16221C]/90 p-8 sm:p-12 text-center backdrop-blur-xl">
            <FolderOpen className="mx-auto text-[#C9F06A] mb-4" size={44} />
            <h3 className="text-xl font-bold text-white font-display">
              Aucun projet publié dans la base de données
            </h3>
            <p className="text-sm text-white/65 mt-2.5 leading-relaxed">
              Publiez un projet via le formulaire pour qu'il s'affiche immédiatement dans ce carrousel 3D Coverflow.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                to="/projects/create"
                className="inline-flex items-center gap-2 rounded-full bg-[#C9F06A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:bg-[#D8F87C]"
              >
                <PlusCircle size={15} />
                <span>Publier le premier projet</span>
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs text-white hover:bg-white/10"
              >
                <span>Explorer l'espace projets</span>
              </Link>
            </div>
          </div>
        )}

        {/* State 3: Active 3D Coverflow Carousel from Backend */}
        {!loading && total > 0 && (
          <div
            className="relative w-full py-8 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* 3D Scene Wrapper */}
            <div className="relative h-[380px] sm:h-[420px] max-w-5xl mx-auto flex items-center justify-center perspective-1200">
              {projects.map((proj, idx) => {
                const isCenter = idx === activeIndex
                const style = getCardTransform(idx)
                const palette = PALETTES[idx % PALETTES.length]
                const techList = (proj.technologies || '')
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)

                return (
                  <div
                    key={proj.id || idx}
                    onClick={() => setActiveIndex(idx)}
                    style={{
                      transform: style.transform,
                      zIndex: style.zIndex,
                      opacity: style.opacity,
                      filter: style.filter,
                      background: palette.gradient,
                    }}
                    className={`absolute w-[240px] sm:w-[280px] h-[320px] sm:h-[360px] rounded-2xl border backdrop-blur-xl p-5 flex flex-col justify-between cursor-pointer transition-all duration-500 select-none preserve-3d ${
                      isCenter
                        ? 'border-[#C9F06A]/80 shadow-[0_20px_50px_-10px_rgba(201, 240, 106,0.5)]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Grid inside card */}
                    <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none rounded-2xl" />

                    {/* Top Badge */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase ${
                          isCenter
                            ? 'bg-[#C9F06A]/20 text-[#C9F06A] border border-[#C9F06A]/40'
                            : 'bg-white/10 text-white/70 border border-white/15'
                        }`}
                      >
                        {STATUT_PROJET[proj.statut] || proj.statut || 'PROJET'}
                      </span>
                      {proj.pays && (
                        <span className="text-xs text-white/70 font-mono">
                          {proj.pays}
                        </span>
                      )}
                    </div>

                    {/* Cover image */}
                    <div className="relative z-10 flex flex-1 items-center justify-center my-3">
                      <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border border-white/10">
                        <img
                          src={getProjectImage(proj)}
                          alt={proj.nom || proj.titre}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      </div>
                    </div>

                    {/* Bottom Info */}
                    <div className="relative z-10 pt-3 border-t border-white/10 flex items-center gap-3">
                      <Avatar
                        src={creatorOf(proj).avatar}
                        name={creatorOf(proj).name || 'Créateur'}
                        className="h-9 w-9 ring-2"
                        style={{ '--tw-ring-color': palette.accent }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-bold text-white font-display truncate">
                          {proj.nom || proj.titre}
                        </p>
                        <p className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase truncate">
                          {creatorOf(proj).name ? `par ${creatorOf(proj).name}` : (proj.categorie || 'TECHNOLOGIE')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Navigation Controls */}
            {total > 1 && (
              <div className="relative z-30 mt-8 flex flex-col sm:flex-row items-center justify-center gap-5">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(prev => (prev - 1 + total) % total)}
                    aria-label="Projet précédent"
                    className="p-2.5 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-black hover:bg-[#C9F06A] hover:border-[#C9F06A] transition duration-200"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {/* Indicator Pills */}
                  <div className="flex items-center gap-1.5 px-3">
                    {projects.map((p, idx) => (
                      <button
                        key={p.id || idx}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Voir projet ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? 'w-8 bg-[#C9F06A]'
                            : 'w-1.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveIndex(prev => (prev + 1) % total)}
                    aria-label="Projet suivant"
                    className="p-2.5 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-black hover:bg-[#C9F06A] hover:border-[#C9F06A] transition duration-200"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Detailed Spotlight Card of the Active Project from Backend */}
            {activeProject && (
              <div className="mt-12 max-w-4xl mx-auto rounded-3xl border border-white/15 bg-[#16221C]/90 p-6 sm:p-9 backdrop-blur-xl shadow-2xl relative">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-white/10">
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                      <img
                        src={getProjectImage(activeProject)}
                        alt={activeProject.nom || activeProject.titre}
                        className="w-full h-full rounded-2xl object-cover border border-white/10"
                      />
                      <Avatar
                        src={creatorOf(activeProject).avatar}
                        name={creatorOf(activeProject).name || 'Créateur'}
                        className="absolute -bottom-2 -right-2 h-8 w-8 ring-2 ring-[#16221C]"
                        textClassName="text-[10px]"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-bold tracking-[0.2em] text-[#C9F06A] uppercase mb-1">
                        // Projet Actif #{activeProject.id}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                          {activeProject.nom || activeProject.titre}
                        </h3>
                        <span className="rounded-full border px-3 py-0.5 text-xs font-bold tracking-wider uppercase border-[#C9F06A]/40 bg-[#C9F06A]/10 text-[#C9F06A]">
                          {activeProject.categorie || 'Général'}
                        </span>
                        <span className="rounded-full border border-white/15 bg-white/5 px-3 py-0.5 text-xs text-white/60">
                          {STATUT_PROJET[activeProject.statut] || activeProject.statut}
                        </span>
                      </div>
                      {(activeProject.pays || activeProject.ville) && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-white/50">
                          <MapPin size={13} className="text-[#C9F06A]" />
                          <span>{[activeProject.ville, activeProject.pays].filter(Boolean).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Backend Metrics */}
                  <div className="grid grid-cols-2 gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 text-center">
                    <div className="px-3">
                      <span className="text-base sm:text-lg font-bold font-mono text-[#C9F06A] block">
                        {activeProject.nombreMembres ?? 1}
                      </span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider block mt-0.5">
                        Membres
                      </span>
                    </div>
                    <div className="px-3">
                      <span className="text-base sm:text-lg font-bold font-mono text-[#C9F06A] block">
                        {activeProject.placesRestantes ?? 0}
                      </span>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider block mt-0.5">
                        Places libres
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description & Technologies */}
                <div className="mt-6 space-y-4">
                  <p className="text-sm sm:text-base text-white/75 leading-relaxed font-body">
                    {activeProject.description || activeProject.extrait || 'Projet en cours de développement.'}
                  </p>

                  {activeProject.technologies && (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-xs font-mono font-bold text-white/50 uppercase mr-1">
                        Technologies :
                      </span>
                      {activeProject.technologies
                        .split(',')
                        .map(s => s.trim())
                        .filter(Boolean)
                        .map(tech => (
                          <span
                            key={tech}
                            className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono font-medium text-white/80 border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action CTAs */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      to={`/projects/${activeProject.id}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#C9F06A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_8px_24px_-6px_rgba(201, 240, 106,0.55)] transition hover:bg-[#D8F87C]"
                    >
                      <span>Voir la fiche complète</span>
                      <span>↗</span>
                    </Link>

                    <Link
                      to="/projects/create"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                    >
                      <PlusCircle size={15} />
                      <span>Publier un nouveau projet</span>
                    </Link>
                  </div>

                  <Link
                    to="/projects"
                    className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] hover:underline flex items-center gap-1.5"
                  >
                    <span>Explorer tous les projets</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  )
}
