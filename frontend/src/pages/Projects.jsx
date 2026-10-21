import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Plus,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  X,
  ArrowRight,
  Share2,
  Sparkles,
  Layers,
  HeartHandshake,
} from 'lucide-react'
import { projetsApi, competencesApi, getStoredUser } from '../api'
import { getProjectImage } from '../lib/projectImages'
import Avatar from '../components/Avatar'

const TAILLE = 9
const DEBOUNCE_MS = 300

const INITIATIVE_PRESETS = [
  { label: 'Toutes les initiatives', value: '' },
  { label: 'Open Source', value: 'Open Source' },
  { label: 'Recherche de coéquipier', value: 'Co-founder' },
  { label: 'Impact Social', value: 'Social Impact' },
]

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()

  /* --- URL filters --- */
  const texte = searchParams.get('texte') || ''
  const statut = searchParams.get('statut') || ''
  const competenceId = searchParams.get('competenceId') || ''
  const categorie = searchParams.get('categorie') || ''
  const technologie = searchParams.get('technologie') || ''
  const initiative = searchParams.get('initiative') || ''
  const page = parseInt(searchParams.get('page') || '0', 10)

  /* --- Local inputs --- */
  const [texteInput, setTexteInput] = useState(texte)
  const debounceTexte = useRef(null)

  /* --- API data --- */
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [competences, setCompetences] = useState([])

  useEffect(() => {
    competencesApi
      .lister()
      .then((data) => {
        if (Array.isArray(data)) setCompetences(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setTexteInput(texte)
  }, [texte])

  const updateParams = useCallback(
    (updates, resetPage = true) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev)
        for (const [key, value] of Object.entries(updates)) {
          if (value) {
            next.set(key, value)
          } else {
            next.delete(key)
          }
        }
        if (resetPage) {
          next.delete('page')
        }
        return next
      })
    },
    [setSearchParams]
  )

  useEffect(() => {
    if (debounceTexte.current) clearTimeout(debounceTexte.current)
    debounceTexte.current = setTimeout(() => {
      if (texteInput !== texte) updateParams({ texte: texteInput })
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceTexte.current)
  }, [texteInput, texte, updateParams])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // Merge initiative into texte or category search if selected
    const queryTexte = [texte, initiative].filter(Boolean).join(' ')

    projetsApi
      .rechercher({
        texte: queryTexte || undefined,
        statut: statut || undefined,
        competenceId: competenceId || undefined,
        categorie: categorie || undefined,
        technologie: technologie || undefined,
        page,
        taille: TAILLE,
      })
      .then((data) => {
        if (!cancelled) setResult(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Impossible de charger les projets.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [texte, statut, competenceId, categorie, technologie, initiative, page])

  const projets = result?.contenu || []
  const totalPages = result?.totalPages || 0
  const currentUser = getStoredUser()

  function goToPage(p) {
    updateParams({ page: String(p) }, false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() {
    setTexteInput('')
    setSearchParams({})
  }

  const hasFilters = Boolean(texte || statut || competenceId || categorie || technologie || initiative)

  return (
    <div className="min-h-screen bg-[#101915] text-white pb-20 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* ========================================================================= */}
        {/* HERO HEADER: "Build the Next Continental Unicorn"                         */}
        {/* ========================================================================= */}
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C9F06A] font-mono">
              // ÉCOSYSTÈME DE PROJETS 54DEVS
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-display mt-2 leading-[1.1]">
              Construire les Projets de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9F06A] via-[#D8F87C] to-[#C9F06A] italic font-serif">
                Demain
              </span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base mt-3 leading-relaxed">
              Collaborez sur des initiatives open-source, rejoignez des startups en phase d'accélération ou trouvez vos associés à travers 54 pays.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/projects/create"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9F06A] hover:bg-[#D8F87C] text-black px-6 py-3.5 text-xs font-bold uppercase tracking-wider transition shadow-lg shadow-[#C9F06A]/20 hover:-translate-y-0.5"
            >
              <Plus size={16} />
              <span>Publier un projet</span>
            </Link>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* INITIATIVE FILTER CHIPS (Matching Capture)                                */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {INITIATIVE_PRESETS.map((item) => {
            const active = (initiative === item.value) || (!initiative && !item.value)
            return (
              <button
                key={item.label}
                onClick={() => updateParams({ initiative: item.value })}
                className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide whitespace-nowrap transition-all ${
                  active
                    ? 'bg-[#C9F06A] text-black shadow-md shadow-[#C9F06A]/20'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Rechercher un projet, une technologie (React, Spring, Python...), un mot-clé..."
            value={texteInput}
            onChange={(e) => setTexteInput(e.target.value)}
            className="w-full pl-11 pr-11 py-3.5 border border-white/10 bg-[#16221C] rounded-2xl text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C9F06A] transition shadow-inner"
          />
          {texteInput && (
            <button
              onClick={() => setTexteInput('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Header */}
        {!loading && !error && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-white font-display">
              Projets disponibles ({result?.totalElements ?? projets.length})
            </h2>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs text-[#C9F06A] hover:underline font-semibold"
              >
                <X size={13} /> Réinitialiser les filtres
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* PROJECTS GRID: CARDS WITH IMAGES & "START SOMETHING NEW" CARD            */}
        {/* ========================================================================= */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-white/10 bg-[#16221C] p-6 h-80 animate-pulse flex flex-col justify-between"
              >
                <div className="h-40 bg-white/5 rounded-2xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-3 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center text-red-300">
            <AlertCircle size={32} className="mx-auto mb-2 text-red-400" />
            <p className="font-bold">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projets.map((p) => {
              const creatorAvatar =
                p.createur?.avatarUrl || null
              const isCreator = Boolean(currentUser?.id && p.createur?.id === currentUser.id)
              const imageUrl = getProjectImage(p)

              return (
                <div
                  key={p.id}
                  className="rounded-3xl border border-white/10 bg-[#16221C] hover:border-[#C9F06A]/40 transition-all duration-300 overflow-hidden flex flex-col group shadow-xl hover:shadow-2xl hover:shadow-[#C9F06A]/10"
                >
                  {/* Project Cover Image */}
                  <Link
                    to={`/projects/${p.id}`}
                    className="relative h-48 w-full overflow-hidden block bg-black/40"
                  >
                    <img
                      src={imageUrl}
                      alt={p.nom}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16221C] via-transparent to-black/40" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 text-[#C9F06A] border border-[#C9F06A]/30 backdrop-blur-md">
                        {p.categorie || 'INITIATIVE'}
                      </span>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase backdrop-blur-md border ${
                          p.ouvertAuxDemandes
                            ? 'bg-emerald-500/25 border-emerald-500/40 text-emerald-300'
                            : 'bg-white/10 border-white/20 text-white/60'
                        }`}
                      >
                        {p.placesRestantes > 0
                          ? `${p.placesRestantes} PLACES DISPO`
                          : 'COMPLET'}
                      </span>
                    </div>
                  </Link>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/projects/${p.id}`}>
                        <h3 className="font-bold text-white text-lg font-display group-hover:text-[#C9F06A] transition line-clamp-1">
                          {p.nom}
                        </h3>
                      </Link>
                      <p className="text-white/60 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed font-body">
                        {p.description}
                      </p>

                      {/* Tech stack pills */}
                      {p.technologies && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.technologies
                            .split(',')
                            .slice(0, 3)
                            .map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/70"
                              >
                                {t.trim()}
                              </span>
                            ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer: Collaborator Avatars & Action */}
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        {/* Overlapping profile avatars */}
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2 overflow-hidden">
                            <Avatar src={creatorAvatar} name={p.createur?.pseudo || [p.createur?.prenom, p.createur?.nom].filter(Boolean).join(' ') || 'Membre'} className="h-6 w-6 ring-2 ring-[#16221C]" textClassName="text-[9px]" />
                          </div>
                          <span className="text-xs text-white/50 truncate max-w-[140px]">
                            {p.nombreMembres > 1
                              ? `${p.nombreMembres} membres actifs`
                              : `Par ${p.createur?.pseudo || p.createur?.prenom || 'Membre 54Devs'}`}
                          </span>
                        </div>

                        {p.createur?.pays && (
                          <span className="text-[11px] text-white/40 flex items-center gap-1 font-mono shrink-0">
                            <MapPin size={11} className="text-[#C9F06A]" />
                            {p.createur.pays}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/projects/${p.id}`}
                          className={`flex-1 text-center py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition ${isCreator ? 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10' : 'bg-[#C9F06A] text-black hover:bg-[#D8F87C] shadow-md shadow-[#C9F06A]/15'}`}
                        >
                          {isCreator ? 'Gérer mon projet' : p.ouvertAuxDemandes ? 'Postuler / Rejoindre' : 'Voir le projet'}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            const url = window.location.origin + `/projects/${p.id}`
                            if (navigator.share) {
                              navigator.share({ title: p.nom, text: p.description, url })
                            } else {
                              navigator.clipboard?.writeText(url)
                              alert('Lien copié dans le presse-papier !')
                            }
                          }}
                          title="Partager ce projet"
                          className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 text-white/70 hover:text-white transition shrink-0"
                        >
                          <Share2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* "Start Something New" Card (Matching Capture) */}
            <Link
              to="/projects/create"
              className="rounded-3xl border-2 border-dashed border-white/20 hover:border-[#C9F06A] bg-white/[0.02] hover:bg-white/[0.05] p-8 flex flex-col items-center justify-center text-center group transition min-h-[380px] shadow-lg"
            >
              <div className="w-14 h-14 rounded-full bg-white/10 group-hover:bg-[#C9F06A] group-hover:text-black flex items-center justify-center text-[#C9F06A] mb-4 transition shadow-lg">
                <Plus size={26} />
              </div>
              <h3 className="font-bold text-white text-xl font-display group-hover:text-[#C9F06A] transition">
                Lancer un nouveau projet
              </h3>
              <p className="text-xs text-white/50 mt-2 max-w-xs leading-relaxed font-body">
                Vous avez une idée qui peut transformer le continent ? Partagez-la avec les développeurs de 54Devs et trouvez vos coéquipiers.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9F06A] group-hover:translate-x-1 transition-transform">
                Publier mon projet <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                  page === i
                    ? 'bg-[#C9F06A] text-black font-extrabold shadow-md shadow-[#C9F06A]/20'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
