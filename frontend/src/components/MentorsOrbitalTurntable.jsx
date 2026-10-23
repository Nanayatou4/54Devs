import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Users, ChevronLeft, ChevronRight, Loader2, Sparkles, PlusCircle } from 'lucide-react'
import { developpeursApi, mentorsApi, publicApi } from '../api'

function getDisplayName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Mentor'
}

function getAvatarLetters(person) {
  return `${person?.prenom?.[0] || ''}${person?.nom?.[0] || ''}`.toUpperCase() || 'M'
}

export default function MentorsOrbitalTurntable() {
  const [mentors, setMentors] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Fetch real mentors from backend
  useEffect(() => {
    let active = true
    setLoading(true)

    const extractMentors = (result) => {
      const list = Array.isArray(result) ? result : result?.contenu || []
      if (list && list.length > 0) {
        return list.map((item) => ({
          ...(item.developpeur || item),
          presentation: item.presentation,
          placesRestantes: item.placesRestantes,
          nombreMentoresMax: item.nombreMentoresMax,
        }))
      }
      return null
    }

    // Try publicApi first, then /api/mentors, then /api/developpeurs
    publicApi
      .mentors(12)
      .then((data) => {
        if (!active) return
        const formatted = extractMentors(data)
        if (formatted) {
          setMentors(formatted)
          setLoading(false)
          return
        }
        return mentorsApi.rechercher({ page: 0, taille: 12, auth: false })
      })
      .then((result) => {
        if (!active || !result) return
        const formatted = extractMentors(result)
        if (formatted) {
          setMentors(formatted)
          setLoading(false)
          return
        }
        return developpeursApi.rechercher({ type: 'ENSEIGNER', page: 0, taille: 12, auth: false })
      })
      .then((devResult) => {
        if (!active || !devResult) return
        const devList = Array.isArray(devResult) ? devResult : devResult?.contenu || []
        setMentors(devList)
      })
      .catch(() => {
        if (active) setMentors([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const total = mentors.length

  // Autoplay rotation when mentors exist
  useEffect(() => {
    if (isPaused || total <= 1) return
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % total)
    }, 4500)
    return () => clearInterval(timer)
  }, [isPaused, total])

  const activeMentor = total > 0 ? mentors[activeIndex % total] : null
  const nextMentor = total > 1 ? mentors[(activeIndex + 1) % total] : null
  const prevMentor = total > 1 ? mentors[(activeIndex - 1 + total) % total] : null

  return (
    <section id="mentors-adn" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36 bg-[#0B0D11] border-t border-white/5 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div className="pointer-events-none absolute top-1/3 right-10 h-[520px] w-[520px] rounded-full bg-[#C9F06A]/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-[400px] w-[400px] rounded-full bg-blue-600/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          
          {/* Left Column: Manifesto */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9F06A]/30 bg-[#C9F06A]/10 text-xs font-bold uppercase tracking-[0.22em] text-[#C9F06A] mb-5">
              <span>// L'ADN DE 54DEVS</span>
            </div>

            <h2 className="text-3xl leading-[1.15] font-extrabold text-white sm:text-4xl md:text-5xl lg:text-5xl font-display">
              Nous ne formons pas seulement des codeurs.{' '}
              <span className="text-[#C9F06A]">Nous forgeons l'élite tech de l'Afrique.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
              Avant de déployer des solutions continentales, nous unissons nos talents aux développeurs et mentors enregistrés sur la plateforme. Chaque mentor sur <strong className="text-white font-semibold">54Devs</strong> transmet son expérience directement depuis ses projets réels.
            </p>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-white/60">
              <p>
                Des ingénieurs seniors et leads techniques partagent leurs méthodes, guident les talents émergents et construisent les licornes technologiques de demain.
              </p>
            </div>

            {/* Mission Box */}
            <div className="mt-8 rounded-2xl border border-white/10 bg-[#14161C]/80 p-6 md:p-7 backdrop-blur-md">
              <p className="text-xs font-bold tracking-[0.25em] text-[#C9F06A] uppercase mb-2">
                // Mentorat Panafricain
              </p>
              <p className="text-sm leading-relaxed text-white/85 sm:text-base">
                Transmission de compétences, revues de code et accompagnement sur des projets réels pour propulser les ingénieurs africains vers les standards internationaux.
              </p>
            </div>

            {/* CTA row */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/mentorship"
                className="group inline-flex items-center gap-2.5 rounded-full bg-[#C9F06A] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-black shadow-[0_8px_24px_-6px_rgba(201, 240, 106,0.55)] transition-all hover:bg-[#D8F87C]"
              >
                <span>Espace Mentorat</span>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/15 text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </Link>
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold tracking-wider text-white uppercase backdrop-blur-sm transition hover:border-[#C9F06A]/50 hover:bg-white/10"
              >
                <PlusCircle size={15} className="text-[#C9F06A]" />
                <span>Devenir mentor (Mon profil)</span>
              </Link>
            </div>
          </div>

          {/* Right Column: 3D Orbital Turntable Scene */}
          <div
            className="relative aspect-[4/5] sm:aspect-[1/1] lg:aspect-auto lg:h-[620px] rounded-3xl border border-white/10 bg-gradient-to-br from-[#16171B]/90 via-[#0E0F12] to-[#0A0B0E] p-4 sm:p-6 flex flex-col justify-between overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Ambient turntable lights */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(201, 240, 106,0.12),transparent_60%)] pointer-events-none" />

            {/* Concentric Orbit Rings SVG */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-[110%] h-[110%] max-w-[580px] max-h-[580px] opacity-40 overflow-visible" viewBox="0 0 500 500" fill="none">
                <circle cx="250" cy="250" r="230" stroke="rgba(201, 240, 106,0.18)" strokeWidth="1.5" strokeDasharray="8 12" />
                <circle cx="250" cy="250" r="165" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
                <circle cx="250" cy="250" r="105" stroke="rgba(201, 240, 106,0.25)" strokeWidth="1" strokeDasharray="4 6" />
                <line x1="250" y1="20" x2="250" y2="480" stroke="rgba(201, 240, 106,0.06)" strokeWidth="1" />
                <line x1="20" y1="250" x2="480" y2="250" stroke="rgba(201, 240, 106,0.06)" strokeWidth="1" />
              </svg>
            </div>

            {/* Top Navigation & Status */}
            <div className="relative z-10 flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-[#C9F06A] animate-ping" />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#C9F06A]">
                  Mentors de la Communauté
                </span>
              </div>

              {total > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveIndex(prev => (prev - 1 + total) % total)}
                    aria-label="Mentor précédent"
                    className="p-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-[#C9F06A] hover:text-black hover:border-[#C9F06A] text-white/70 transition"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-mono font-bold text-white/60 px-1">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(prev => (prev + 1) % total)}
                    aria-label="Mentor suivant"
                    className="p-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-[#C9F06A] hover:text-black hover:border-[#C9F06A] text-white/70 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>

            {/* Central Turntable / Orbit Scene */}
            <div className="relative z-10 flex-1 my-4 flex flex-col items-center justify-center">
              
              {/* Central 54Devs Core Disc */}
              <div className="absolute z-0 flex flex-col items-center justify-center pointer-events-none opacity-85">
                <div className="relative w-24 h-24 rounded-full border-2 border-[#C9F06A]/40 bg-[#16221C]/90 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(201, 240, 106,0.25)]">
                  <span className="text-lg font-black tracking-tight text-white font-display">
                    &lt;54/&gt;
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.25em] text-[#C9F06A] uppercase mt-0.5">
                    DEVS
                  </span>
                  <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-25" />
                </div>
                <p className="mt-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/40">
                  Écosystème Panafricain
                </p>
              </div>

              {/* State 1: Loading */}
              {loading && (
                <div className="relative z-20 flex flex-col items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-[#C9F06A] mb-3" />
                  <p className="text-xs text-white/60 uppercase tracking-widest font-mono">
                    Chargement des mentors depuis l'API...
                  </p>
                </div>
              )}

              {/* State 2: Empty Backend (No mentors registered yet) */}
              {!loading && total === 0 && (
                <div className="relative z-20 w-full max-w-md rounded-2xl border border-dashed border-[#C9F06A]/40 bg-[#141519]/90 p-6 sm:p-8 text-center backdrop-blur-xl">
                  <GraduationCap className="mx-auto text-[#C9F06A] mb-3" size={36} />
                  <h3 className="text-lg font-bold text-white font-display">
                    Aucun mentor enregistré pour le moment
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-2 leading-relaxed">
                    Dès qu'un développeur renseigne des compétences à transmettre dans son profil, il apparaît automatiquement dans cette scène orbitale 3D.
                  </p>
                  <div className="mt-5 flex justify-center gap-3">
                    <Link
                      to="/profile"
                      className="inline-flex items-center gap-2 rounded-full bg-[#C9F06A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:bg-[#D8F87C]"
                    >
                      <PlusCircle size={14} />
                      <span>Ajouter des compétences</span>
                    </Link>
                    <Link
                      to="/developers"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs text-white hover:bg-white/10"
                    >
                      <span>Tous les développeurs</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* State 3: Active Orbiting Mentors from Backend */}
              {!loading && total > 0 && activeMentor && (
                <div className="relative w-full max-w-md h-full flex flex-col justify-between items-center py-2">
                  
                  {/* ACTIVE MENTOR CARD */}
                  <Link
                    to={`/developers/${activeMentor.utilisateurId || activeMentor.id}`}
                    className="relative z-20 w-full rounded-2xl border-2 border-[#C9F06A] bg-[#16171C]/95 p-5 sm:p-6 shadow-[0_0_45px_-5px_rgba(201, 240, 106,0.65)] backdrop-blur-xl transition-all duration-500 transform hover:scale-[1.02] block text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {(activeMentor.photoUrl || activeMentor.avatarUrl) ? (
                            <img
                              src={activeMentor.photoUrl || activeMentor.avatarUrl}
                              alt={getDisplayName(activeMentor)}
                              className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl object-cover border border-[#C9F06A]/50"
                            />
                          ) : (
                            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#C9F06A] to-amber-600 flex items-center justify-center text-black font-black text-lg border border-[#C9F06A]/50 shadow-inner">
                              {getAvatarLetters(activeMentor)}
                            </div>
                          )}
                          {activeMentor.pays && (
                            <span className="absolute -bottom-1 -right-1 text-xs bg-black/80 px-1 py-0.5 rounded-full border border-white/10">
                              🌍
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#C9F06A]">
                              {String(activeIndex + 1).padStart(2, '0')}
                            </span>
                            <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-[#C9F06A]/20 text-[#C9F06A] border border-[#C9F06A]/40">
                              {activeMentor.disponibilite || 'Mentor Actif'}
                            </span>
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
                            {getDisplayName(activeMentor)}
                          </h3>
                          <p className="text-xs text-[#C9F06A]/90 font-medium">
                            {activeMentor.titre || activeMentor.role || [activeMentor.ville, activeMentor.pays].filter(Boolean).join(', ') || 'Ingénieur'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <span className="text-[11px] text-white/50 block uppercase tracking-wider">
                          Niveau
                        </span>
                        <span className="text-xs font-bold text-white font-mono uppercase">
                          {activeMentor.niveau || 'Avancé'}
                        </span>
                      </div>
                    </div>

                    {activeMentor.bio && (
                      <p className="mt-3.5 text-xs sm:text-sm text-white/80 leading-relaxed font-body line-clamp-2">
                        « {activeMentor.bio} »
                      </p>
                    )}

                    {/* Skills to teach from Backend */}
                    <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
                      <div className="flex flex-wrap gap-1.5">
                        {(activeMentor.competencesAEnseigner || activeMentor.competencesMaitrisees || []).slice(0, 3).map(spec => (
                          <span
                            key={spec}
                            className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-white/80"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C9F06A]">
                        <span>Voir le profil</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>

                  {/* Secondary Preview Cards (Prev & Next) */}
                  {total > 1 && (
                    <div className="relative z-10 w-full grid grid-cols-2 gap-3 mt-4">
                      {prevMentor && (
                        <button
                          type="button"
                          onClick={() => setActiveIndex((activeIndex - 1 + total) % total)}
                          className="text-left rounded-xl border border-white/10 bg-[#16221C]/80 p-3 hover:border-[#C9F06A]/50 hover:bg-[#18191f] transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono text-[#C9F06A]">
                              {String(((activeIndex - 1 + total) % total) + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold text-white/80 truncate group-hover:text-white">
                              {getDisplayName(prevMentor)}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 truncate">
                            {prevMentor.titre || prevMentor.pays || 'Mentor'}
                          </p>
                        </button>
                      )}

                      {nextMentor && (
                        <button
                          type="button"
                          onClick={() => setActiveIndex((activeIndex + 1) % total)}
                          className="text-left rounded-xl border border-white/10 bg-[#16221C]/80 p-3 hover:border-[#C9F06A]/50 hover:bg-[#18191f] transition-all duration-300 group"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] font-mono text-[#C9F06A]">
                              {String(((activeIndex + 1) % total) + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-bold text-white/80 truncate group-hover:text-white">
                              {getDisplayName(nextMentor)}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 truncate">
                            {nextMentor.titre || nextMentor.pays || 'Mentor'}
                          </p>
                        </button>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Bottom Section: Indicator Dots + Dynamic Stats */}
            <div className="relative z-10 pt-4 border-t border-white/10 space-y-4">
              {/* Pagination Dots */}
              {total > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {mentors.map((m, idx) => (
                    <button
                      key={m.utilisateurId || m.id || idx}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Afficher ${getDisplayName(m)}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? 'w-8 bg-[#C9F06A]'
                          : 'w-2 bg-white/25 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Qualitative Metric Capsules */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-center backdrop-blur-sm sm:px-4 sm:py-2.5">
                  <p className="text-xs sm:text-sm font-extrabold tracking-wider text-[#C9F06A]">
                    54
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                    Nations Panafricaines
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/50 px-3 py-2 text-center backdrop-blur-sm sm:px-4 sm:py-2.5">
                  <p className="text-xs sm:text-sm font-extrabold tracking-wider text-[#C9F06A]">
                    Mentorat Tech
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                    Accompagnement d'Experts
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
