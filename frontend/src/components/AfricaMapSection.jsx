import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, Play, Pause, MapPin, Users, FolderGit2, Sparkles, Globe2, PlusCircle } from 'lucide-react'
import { AFRICAN_COUNTRIES } from '../data/africanCountries.data'
import { developpeursApi, publicApi } from '../api'

export default function AfricaMapSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('ALL')

  // Real backend metrics per country
  const [countryStats, setCountryStats] = useState({})
  const [totalStats, setTotalStats] = useState(null)

  const totalCountries = AFRICAN_COUNTRIES.length

  // Fetch real counts from backend
  useEffect(() => {
    let active = true

    // 1. Fetch overall public stats
    publicApi
      .statistiques()
      .then(data => {
        if (active && data) setTotalStats(data)
      })
      .catch(() => {})

    // 2. Fetch developers to count by country
    developpeursApi
      .rechercher({ page: 0, taille: 100 })
      .then(res => {
        if (!active) return
        const list = Array.isArray(res) ? res : res?.contenu || []
        const counts = {}
        list.forEach(dev => {
          const pays = (dev.pays || '').trim().toLowerCase()
          if (pays) {
            counts[pays] = (counts[pays] || 0) + 1
          }
        })
        setCountryStats(prev => ({ ...prev, devsByCountry: counts }))
      })
      .catch(() => {})

    // 3. Fetch projects to count by country
    publicApi
      .projets(100)
      .then(data => {
        if (!active) return
        const list = Array.isArray(data) ? data : data?.contenu || []
        const counts = {}
        list.forEach(proj => {
          const pays = (proj.pays || '').trim().toLowerCase()
          if (pays) {
            counts[pays] = (counts[pays] || 0) + 1
          }
        })
        setCountryStats(prev => ({ ...prev, projsByCountry: counts }))
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [])

  // Filtered countries
  const filteredCountries = useMemo(() => {
    return AFRICAN_COUNTRIES.filter(country => {
      const matchSearch =
        country.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.nomEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())

      const matchRegion = selectedRegion === 'ALL' || country.region === selectedRegion

      return matchSearch && matchRegion
    })
  }, [searchQuery, selectedRegion])

  // Autoplay through the 54 countries
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalCountries)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPlaying, totalCountries])

  const activeCountry = AFRICAN_COUNTRIES[currentIndex] || AFRICAN_COUNTRIES[0]

  // Compute real dynamic count for current country from backend
  const countryNameLower = activeCountry.nom.toLowerCase()
  const realDevsCount = countryStats.devsByCountry?.[countryNameLower] || 0
  const realProjsCount = countryStats.projsByCountry?.[countryNameLower] || 0

  const regions = [
    { label: 'Toutes (54)', value: 'ALL' },
    { label: 'Ouest', value: 'Afrique de l\'Ouest' },
    { label: 'Est', value: 'Afrique de l\'Est' },
    { label: 'Nord', value: 'Afrique du Nord' },
    { label: 'Centrale', value: 'Afrique Centrale' },
    { label: 'Australe', value: 'Afrique Australe' },
  ]

  return (
    <section id="carte-afrique" className="relative px-4 py-20 sm:px-6 sm:py-28 md:px-10 md:py-36 bg-[#0C130F] border-t border-white/5 overflow-hidden">
      
      {/* Background Glows & Grid */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-[#C9F06A]/8 blur-[160px]" />

      <div className="relative mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="inline-block text-xs font-bold tracking-[0.25em] text-[#C9F06A] uppercase mb-3">
            // LE COLLECTIF 54DEVS
          </p>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight font-display">
            54 Ã‰tats. Une Seule Impulsion.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-white/70 leading-relaxed font-body">
            Nous créons. Nous testons. Nous améliorons. Nous industrialisons. Nous répliquons. Chaque initiative du collectif répond à cette même dynamique : transformer une idée en solution, une solution en produit, un produit en modèle réplicable pour l'Afrique.
          </p>
        </div>

        {/* Central Map & Orbital Visual Scene */}
        <div className="relative mt-12 sm:mt-16 flex flex-col items-center justify-center min-h-[520px] sm:min-h-[600px]">
          
          {/* Radar Circles Guide */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] md:w-[620px] md:h-[620px]">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#C9F06A]/20" />
              <div className="absolute inset-8 sm:inset-12 rounded-full border border-white/10" />
              <div className="absolute inset-16 sm:inset-24 rounded-full border border-[#C9F06A]/30" />
              <div className="absolute inset-0 rounded-full animate-radar-sweep pointer-events-none opacity-40">
                <div className="w-1/2 h-0.5 bg-gradient-to-r from-transparent to-[#C9F06A] origin-right" />
              </div>
            </div>
          </div>

          {/* Central Africa Map Disc */}
          <div className="relative z-10 flex flex-col items-center justify-center my-6">
            
            {/* Glowing Map Halo */}
            <div className="relative flex items-center justify-center">
              <div className="absolute -inset-4 rounded-full bg-[#C9F06A]/20 blur-3xl animate-pulse-glow" />
              
              <img
                src="/africa-map.png"
                alt="Carte du continent africain - 54Devs"
                className="relative z-10 w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] md:w-[380px] md:h-[380px] object-contain drop-shadow-[0_0_35px_rgba(201, 240, 106,0.45)] select-none transition-transform duration-700 hover:scale-105"
              />

              {/* Central Map Pulse Pin */}
              <div className="absolute z-20 flex flex-col items-center justify-center pointer-events-none">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9F06A] opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C9F06A] border-2 border-black" />
                </span>
                <span className="mt-1 text-[10px] font-mono font-bold tracking-widest text-[#C9F06A] bg-black/80 px-2 py-0.5 rounded-full border border-[#C9F06A]/40 shadow-lg">
                  {activeCountry.code}
                </span>
              </div>
            </div>

            {/* Orbiting Floating Badges */}
            <div className="relative w-full max-w-lg mt-4 flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
              
              {/* Left Pill */}
              <div className="rounded-full border border-white/20 bg-[#16221C]/80 px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-md shadow-lg text-center transition hover:border-[#C9F06A]/50">
                <span className="block text-[9px] sm:text-[10px] tracking-[0.2em] text-white/50 uppercase">
                  Impact
                </span>
                <span className="block text-sm sm:text-base font-bold text-white">
                  Afrique
                </span>
              </div>

              {/* Center Active Pill */}
              <div className="rounded-full border-2 border-[#C9F06A] bg-[#16221C]/95 px-6 py-2.5 sm:px-7 sm:py-3 backdrop-blur-md shadow-[0_0_35px_-4px_rgba(201, 240, 106,0.7)] text-center transform scale-105 transition-all">
                <span className="block text-[9px] sm:text-[10px] tracking-[0.25em] text-white/70 uppercase font-mono">
                  {activeCountry.region}
                </span>
                <div className="flex items-center justify-center gap-2 mt-0.5">
                  <span className="text-base sm:text-lg">{activeCountry.flag}</span>
                  <span className="text-base sm:text-lg font-extrabold text-[#C9F06A]">
                    {activeCountry.nom}
                  </span>
                </div>
              </div>

              {/* Right Pill */}
              <div className="rounded-full border border-white/20 bg-[#16221C]/80 px-4 py-2 sm:px-5 sm:py-2.5 backdrop-blur-md shadow-lg text-center transition hover:border-[#C9F06A]/50">
                <span className="block text-[9px] sm:text-[10px] tracking-[0.2em] text-white/50 uppercase">
                  Créativité
                </span>
                <span className="block text-sm sm:text-base font-bold text-white">
                  âˆž
                </span>
              </div>

            </div>

            <p className="mt-4 text-[10px] sm:text-xs tracking-[0.35em] text-[#C9F06A] uppercase font-bold">
              Afrique â€¢ 54 Ã‰tats Souverains
            </p>

          </div>

          {/* Autoplay & Slider Controls */}
          <div className="relative z-20 mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(prev => !prev)}
              aria-label={isPlaying ? 'Mettre en pause' : 'Lancer le défilement'}
              className="p-2 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-[#C9F06A] transition"
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
              type="button"
              onClick={() => setCurrentIndex(prev => (prev - 1 + totalCountries) % totalCountries)}
              aria-label="Pays précédent"
              className="p-2 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-[#C9F06A] transition"
            >
              <ChevronLeft size={14} />
            </button>

            {/* Indicator Dots Bar */}
            <div className="flex items-center gap-1 sm:gap-1.5 max-w-[260px] sm:max-w-md overflow-x-hidden py-1">
              <span className="text-xs font-mono font-bold text-[#C9F06A] mr-2">
                {String(currentIndex + 1).padStart(2, '0')}/54
              </span>
              <div className="h-1.5 w-12 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#C9F06A] transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / totalCountries) * 100}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentIndex(prev => (prev + 1) % totalCountries)}
              aria-label="Pays suivant"
              className="p-2 rounded-full border border-white/15 bg-white/5 text-white/70 hover:text-white hover:border-[#C9F06A] transition"
            >
              <ChevronRight size={14} />
            </button>
          </div>

        </div>

        {/* Active Country Spotlight Card (Reflecting real backend data) */}
        <div className="mt-8 max-w-3xl mx-auto rounded-3xl border border-[#C9F06A]/40 bg-gradient-to-r from-[#141519] via-[#101114] to-[#141519] p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 bg-[#C9F06A]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl">{activeCountry.flag}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                    {activeCountry.nom}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C9F06A]/20 text-[#C9F06A] border border-[#C9F06A]/40">
                    {activeCountry.code}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-0.5">
                  Capitale : <strong className="text-white/80">{activeCountry.capitale}</strong> â€¢ Région : <strong className="text-white/80">{activeCountry.region}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] font-bold tracking-widest text-[#C9F06A] uppercase block">
                Statut Backend
              </span>
              <span className="text-xs font-mono text-white/80">
                {realDevsCount > 0 ? `${realDevsCount} membre(s) actif(s)` : 'En attente d\'inscriptions'}
              </span>
            </div>
          </div>

          {/* Real Backend Metrics for this country */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                <Users size={14} className="text-[#C9F06A]" />
                <span>Développeurs inscrits</span>
              </div>
              <p className="text-lg sm:text-xl font-bold font-mono text-white">
                {realDevsCount}
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                <FolderGit2 size={14} className="text-[#C9F06A]" />
                <span>Projets enregistrés</span>
              </div>
              <p className="text-lg sm:text-xl font-bold font-mono text-white">
                {realProjsCount}
              </p>
            </div>

            <div className="col-span-2 sm:col-span-1 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center gap-2 text-white/50 text-xs mb-1">
                <Sparkles size={14} className="text-[#C9F06A]" />
                <span>Orientation tech</span>
              </div>
              <p className="text-xs text-white/80 line-clamp-2">
                {activeCountry.specialite}
              </p>
            </div>
          </div>

          {/* 54 States selector pills */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <p className="text-xs font-bold tracking-wider text-white/60 uppercase">
                Défilement parmi les 54 Ã‰tats :
              </p>
              
              {/* Region filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {regions.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setSelectedRegion(r.value)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
                      selectedRegion === r.value
                        ? 'bg-[#C9F06A] text-black font-bold'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal scrollable pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {filteredCountries.map(c => {
                const isActive = c.code === activeCountry.code
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      const foundIdx = AFRICAN_COUNTRIES.findIndex(item => item.code === c.code)
                      if (foundIdx !== -1) {
                        setCurrentIndex(foundIdx)
                        setIsPlaying(false)
                      }
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition ${
                      isActive
                        ? 'border-[#C9F06A] bg-[#C9F06A]/20 text-[#C9F06A] font-bold shadow-[0_0_15px_rgba(201, 240, 106,0.4)]'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.nom}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/developers"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#C9F06A]/60 hover:bg-white/10"
            >
              <Globe2 size={15} />
              <span>Explorer les développeurs</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-[#C9F06A] px-7 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-[0_8px_24px_-6px_rgba(201, 240, 106,0.55)] transition hover:bg-[#D8F87C]"
            >
              <span>S'inscrire pour {activeCountry.nom} {activeCountry.flag}</span>
              <span>â†—</span>
            </Link>
          </div>

        </div>

      </div>
    </section>
  )
}
