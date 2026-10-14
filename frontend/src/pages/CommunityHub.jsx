import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Loader2, MapPin, Search, UserPlus, Users } from 'lucide-react'
import { developpeursApi } from '../api'

function displayName(person) {
  return person?.pseudo || [person?.prenom, person?.nom].filter(Boolean).join(' ') || 'Développeur'
}

function avatarLetters(person) {
  return `${person?.prenom?.[0] || ''}${person?.nom?.[0] || ''}`.toUpperCase() || '?'
}

export default function CommunityHub() {
  const [search, setSearch] = useState('')
  const [developers, setDevelopers] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    developpeursApi
      .rechercher({ texte: search, page: 0, taille: 12 })
      .then((result) => {
        if (!active) return
        setDevelopers(result?.contenu || [])
        setTotal(result?.totalElements || 0)
      })
      .catch(() => {
        if (active) setDevelopers([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [search])

  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9F06A] mb-2 font-mono">
            // COMMUNAUTÃ‰ 54DEVS
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Connectez-vous à l'élite <span className="text-[#C9F06A]">tech panafricaine</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 mt-2 max-w-xl font-body">
            Découvrez des ingénieurs à travers 54 nations, filtrez par stack et pays, et développez votre réseau.
          </p>
        </div>
        <Link
          to="/register"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10 hover:border-[#C9F06A]/50 transition shrink-0"
        >
          <UserPlus size={16} /> Inviter un pair
        </Link>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#16221C]/90 p-4 mb-8 flex flex-col sm:flex-row gap-3 shadow-xl backdrop-blur-md">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, rôle ou compétence..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-white/15 bg-[#18251E] text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#C9F06A]/20 focus:border-[#C9F06A] transition"
          />
        </div>
        <Link
          to="/developers"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9F06A] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#D8F87C] transition shadow-lg shadow-[#C9F06A]/20"
        >
          <span>Recherche avancée</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-[#C9F06A]" />
        </div>
      ) : developers.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#C9F06A]/30 bg-[#16221C]/90 p-16 text-center shadow-xl backdrop-blur-md">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#C9F06A]/15 text-[#C9F06A] mb-5 border border-[#C9F06A]/30">
            <Users size={32} />
          </div>
          <h2 className="text-xl font-bold text-white font-display">La communauté s'agrandit</h2>
          <p className="text-sm text-white/60 mt-2 max-w-md mx-auto">
            Soyez parmi les premiers à vous connecter. Complétez votre profil pour apparaître ici.
          </p>
          <Link
            to="/profile"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#C9F06A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#D8F87C] transition shadow-lg"
          >
            <span>Compléter mon profil</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-white/50 mb-4 font-mono uppercase tracking-wider">
            {total} membre{total === 1 ? '' : 's'} enregistré{total === 1 ? '' : 's'}
          </p>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {developers.map((dev) => (
              <Link
                key={dev.utilisateurId}
                to={`/developers/${dev.utilisateurId}`}
                className="rounded-2xl border border-white/10 bg-[#16221C]/90 p-5 hover:border-[#C9F06A]/40 hover:bg-[#18251E] hover:shadow-2xl transition-all duration-300 group backdrop-blur-md"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#C9F06A] text-sm font-black text-black shrink-0 ring-2 ring-[#C9F06A]/30">
                    {avatarLetters(dev)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-white truncate group-hover:text-[#C9F06A] transition font-display">
                      {displayName(dev)}
                    </h3>
                    {(dev.ville || dev.pays) && (
                      <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-[#C9F06A]" /> {[dev.ville, dev.pays].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
                {dev.bio && <p className="text-xs sm:text-sm text-white/70 mt-3 line-clamp-2 leading-relaxed">« {dev.bio} »</p>}
                {(dev.competencesMaitrisees || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3.5 pt-3 border-t border-white/10">
                    {dev.competencesMaitrisees.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-white/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
