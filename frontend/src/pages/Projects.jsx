import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search, FolderOpen, AlertCircle, ChevronLeft, ChevronRight, MapPin, Users, X } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projetsApi, competencesApi } from '../api'
import { styles } from './Projects.styles'
import { STATUT_OPTIONS, STATUT_LABELS, STATUT_COLORS } from './Projects.data'

const TAILLE = 10
const DEBOUNCE_MS = 300

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()

  /* --- Derive filter values from URL --- */
  const texte = searchParams.get('texte') || ''
  const statut = searchParams.get('statut') || ''
  const competenceId = searchParams.get('competenceId') || ''
  const categorie = searchParams.get('categorie') || ''
  const technologie = searchParams.get('technologie') || ''
  const page = parseInt(searchParams.get('page') || '0', 10)

  /* --- Local state for debounced text inputs --- */
  const [texteInput, setTexteInput] = useState(texte)
  const [categorieInput, setCategorieInput] = useState(categorie)
  const [technologieInput, setTechnologieInput] = useState(technologie)
  const debounceTexte = useRef(null)
  const debounceCategorie = useRef(null)
  const debounceTechnologie = useRef(null)

  /* --- API data --- */
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [competences, setCompetences] = useState([])

  /* --- Load competences catalogue once --- */
  useEffect(() => {
    competencesApi.lister().then(data => {
      if (Array.isArray(data)) setCompetences(data)
    }).catch(() => {})
  }, [])

  /* --- Sync local inputs when URL changes externally (back/forward) --- */
  useEffect(() => { setTexteInput(texte) }, [texte])
  useEffect(() => { setCategorieInput(categorie) }, [categorie])
  useEffect(() => { setTechnologieInput(technologie) }, [technologie])

  /* --- Helper: update search params --- */
  const updateParams = useCallback((updates, resetPage = true) => {
    setSearchParams(prev => {
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
  }, [setSearchParams])

  /* --- Debounce: texte --- */
  useEffect(() => {
    if (debounceTexte.current) clearTimeout(debounceTexte.current)
    debounceTexte.current = setTimeout(() => {
      if (texteInput !== texte) updateParams({ texte: texteInput })
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceTexte.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texteInput])

  /* --- Debounce: categorie --- */
  useEffect(() => {
    if (debounceCategorie.current) clearTimeout(debounceCategorie.current)
    debounceCategorie.current = setTimeout(() => {
      if (categorieInput !== categorie) updateParams({ categorie: categorieInput })
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceCategorie.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorieInput])

  /* --- Debounce: technologie --- */
  useEffect(() => {
    if (debounceTechnologie.current) clearTimeout(debounceTechnologie.current)
    debounceTechnologie.current = setTimeout(() => {
      if (technologieInput !== technologie) updateParams({ technologie: technologieInput })
    }, DEBOUNCE_MS)
    return () => clearTimeout(debounceTechnologie.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [technologieInput])

  /* --- Fetch projects when URL params change --- */
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    projetsApi
      .rechercher({ texte, statut, competenceId, categorie, technologie, page, taille: TAILLE })
      .then(data => {
        if (!cancelled) setResult(data)
      })
      .catch(err => {
        if (!cancelled) setError(err.message || 'Une erreur est survenue.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [texte, statut, competenceId, categorie, technologie, page])

  /* --- Has any filter active? --- */
  const hasFilters = !!(texte || statut || competenceId || categorie || technologie)

  const clearFilters = () => {
    setTexteInput('')
    setCategorieInput('')
    setTechnologieInput('')
    setSearchParams({})
  }

  const goToPage = (p) => {
    updateParams({ page: p === 0 ? '' : String(p) }, false)
  }

  const projets = result?.contenu || []
  const totalPages = result?.totalPages || 0

  return (
    <div className={styles.page}>
      <Navbar />

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Découvrir les projets</h1>
            <p className={styles.subtitle}>
              Trouvez un projet qui vous inspire ou publiez le vôtre
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link to="/dashboard" className={styles.myProjectsLink}>
              <FolderOpen size={16} /> Mes projets
            </Link>
            <Link to="/projects/create" className={styles.publishButton}>
              <Plus size={16} /> Publier un projet
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.searchRow}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un projet par nom, description..."
                value={texteInput}
                onChange={e => setTexteInput(e.target.value)}
                className={`${styles.searchInput} pl-9`}
              />
            </div>
          </div>
          <div className={styles.filtersGrid}>
            <div>
              <label className={styles.filterLabel}>Statut</label>
              <select
                value={statut}
                onChange={e => updateParams({ statut: e.target.value })}
                className={styles.filterSelect}
              >
                {STATUT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.filterLabel}>Compétence recherchée</label>
              <select
                value={competenceId}
                onChange={e => updateParams({ competenceId: e.target.value })}
                className={styles.filterSelect}
              >
                <option value="">Toutes</option>
                {competences.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={styles.filterLabel}>Catégorie</label>
              <input
                type="text"
                placeholder="Ex : Agriculture, Fintech..."
                value={categorieInput}
                onChange={e => setCategorieInput(e.target.value)}
                className={styles.filterInput}
              />
            </div>
            <div>
              <label className={styles.filterLabel}>Technologie</label>
              <input
                type="text"
                placeholder="Ex : React, Spring Boot..."
                value={technologieInput}
                onChange={e => setTechnologieInput(e.target.value)}
                className={styles.filterInput}
              />
            </div>
          </div>
        </div>

        {/* Loading state: skeleton cards */}
        {loading && (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineShort} />
                <div className={styles.skeletonLine} />
                <div className={styles.skeletonLineXs} />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className={styles.errorState}>
            <div className={styles.errorIconWrapper}>
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <h2 className={styles.errorTitle}>Erreur de chargement</h2>
            <p className={styles.errorText}>{error}</p>
            <button
              onClick={() => {
                setError(null)
                setLoading(true)
                projetsApi
                  .rechercher({ texte, statut, competenceId, categorie, technologie, page, taille: TAILLE })
                  .then(setResult)
                  .catch(err => setError(err.message || 'Une erreur est survenue.'))
                  .finally(() => setLoading(false))
              }}
              className={styles.retryButton}
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && projets.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <Search size={32} className="text-primary" />
            </div>
            {hasFilters ? (
              <>
                <h2 className={styles.emptyTitle}>Aucun projet ne correspond à votre recherche.</h2>
                <p className={styles.emptyText}>
                  Essayez de modifier vos filtres ou d'élargir votre recherche.
                </p>
                <button onClick={clearFilters} className={styles.clearFiltersButton}>
                  <X size={16} /> Effacer les filtres
                </button>
              </>
            ) : (
              <>
                <h2 className={styles.emptyTitle}>Soyez le premier à publier un projet</h2>
                <p className={styles.emptyText}>
                  Aucun projet n'a encore été publié. Lancez-vous !
                </p>
                <Link to="/projects/create" className={styles.emptyCreateButton}>
                  <Plus size={16} /> Publier un projet
                </Link>
              </>
            )}
          </div>
        )}

        {/* Project cards */}
        {!loading && !error && projets.length > 0 && (
          <>
            <div className={styles.projectsGrid}>
              {projets.map(p => (
                <Link key={p.id} to={`/projects/${p.id}`} className={styles.projectCard}>
                  <div className={styles.cardBody}>
                    <div className={styles.cardHeaderRow}>
                      <h3 className={styles.cardTitle}>{p.nom}</h3>
                      <CardBadge project={p} />
                    </div>
                    <p className={styles.cardDescription}>{p.description}</p>

                    {/* Competences pills */}
                    {p.competencesRecherchees?.length > 0 && (
                      <div className={styles.cardSkills}>
                        {p.competencesRecherchees.map(skill => (
                          <span key={skill} className={styles.cardSkillPill}>{skill}</span>
                        ))}
                      </div>
                    )}

                    {/* Footer: creator + places */}
                    <div className={styles.cardFooter}>
                      <span className={styles.cardCreator}>
                        <Users size={12} />
                        {p.createur?.prenom || p.createur?.pseudo || 'Anonyme'}
                        {p.createur?.pays && (
                          <>
                            <MapPin size={10} className="ml-1" />
                            {p.createur.pays}
                          </>
                        )}
                      </span>
                      <span className={styles.cardPlaces}>
                        {p.placesRestantes} place{p.placesRestantes !== 1 ? 's' : ''} restante{p.placesRestantes !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} goToPage={goToPage} />
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  )
}

/* --- Card badge (status or closed) --- */
function CardBadge({ project: p }) {
  if (!p.ouvertAuxDemandes && p.placesRestantes === 0) {
    return <span className={styles.cardBadgeClosed}>Complet</span>
  }
  if (p.statut === 'TERMINE') {
    return <span className={`${styles.cardStatus} ${STATUT_COLORS.TERMINE}`}>Terminé</span>
  }
  return (
    <span className={`${styles.cardStatus} ${STATUT_COLORS[p.statut] || 'bg-gray-100 text-gray-600'}`}>
      {STATUT_LABELS[p.statut] || p.statut}
    </span>
  )
}

/* --- Pagination component --- */
function Pagination({ page, totalPages, goToPage }) {
  const pages = []
  const maxVisible = 5
  let start = Math.max(0, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible)
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible)
  }

  for (let i = start; i < end; i++) {
    pages.push(i)
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page === 0}
        className={`${styles.pageButton} ${page === 0 ? styles.pageButtonDisabled : styles.pageButtonInactive}`}
      >
        <ChevronLeft size={16} />
      </button>

      {start > 0 && (
        <>
          <button onClick={() => goToPage(0)} className={`${styles.pageButton} ${styles.pageButtonInactive}`}>1</button>
          {start > 1 && <span className="text-gray-400 px-1">...</span>}
        </>
      )}

      {pages.map(i => (
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`${styles.pageButton} ${i === page ? styles.pageButtonActive : styles.pageButtonInactive}`}
        >
          {i + 1}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400 px-1">...</span>}
          <button onClick={() => goToPage(totalPages - 1)} className={`${styles.pageButton} ${styles.pageButtonInactive}`}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages - 1}
        className={`${styles.pageButton} ${page >= totalPages - 1 ? styles.pageButtonDisabled : styles.pageButtonInactive}`}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
