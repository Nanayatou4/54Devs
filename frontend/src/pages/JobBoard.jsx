import { Link } from 'react-router-dom'
import { ArrowRight, Briefcase, MapPin, Plus } from 'lucide-react'

const SAMPLE_ROLES = [
  { title: 'Senior Fullstack Engineer', company: 'FinTech Hub Dakar', location: 'Dakar · Sénégal 🇸🇳', tag: 'Temps plein' },
  { title: 'Backend Architect (Spring / Go)', company: 'HealthTech Platform', location: 'Nairobi · Kenya 🇰🇪', tag: 'Hybride' },
  { title: 'Lead Mobile (Flutter)', company: 'Logistique & Mobilité', location: 'Abidjan · Côte d\'Ivoire 🇨🇮', tag: 'Remote' },
]

export default function JobBoard() {
  return (
    <div className="max-w-7xl mx-auto text-white">
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9F06A] mb-2 font-mono">
            // ESPACE RECRUTEMENT & CARRIÈRE
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Opportunités à travers le continent
          </h1>
          <p className="text-sm sm:text-base text-white/60 mt-2 max-w-xl font-body">
            Places de choix pour les développeurs au sein des startups et entreprises technologiques panafricaines.
          </p>
        </div>
        <button
          type="button"
          disabled
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C9F06A] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black opacity-60 cursor-not-allowed shadow-lg"
          title="Module en cours de déploiement"
        >
          <Plus size={16} /> Publier une offre
        </button>
      </header>

      <div className="rounded-2xl border border-[#C9F06A]/30 bg-[#C9F06A]/10 p-4 mb-8 text-xs sm:text-sm text-[#C9F06A] font-mono">
        💡 Espace Carrières — Les opportunités d'emploi et de recrutement sont publiées régulièrement par notre réseau de partenaires.
      </div>

      <div className="space-y-3">
        {SAMPLE_ROLES.map((role) => (
          <div
            key={role.title}
            className="rounded-2xl border border-white/10 bg-[#16221C]/90 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-[#C9F06A]/40 transition backdrop-blur-md"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-black/40 border border-white/10 text-[#C9F06A] shrink-0">
              <Briefcase size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-white text-base font-display">{role.title}</h2>
              <p className="text-xs sm:text-sm text-white/70 mt-0.5">{role.company}</p>
              <p className="text-xs text-white/40 flex items-center gap-1 mt-1 font-mono">
                <MapPin size={12} className="text-[#C9F06A]" /> {role.location}
              </p>
            </div>
            <span className="rounded-full bg-[#C9F06A]/15 border border-[#C9F06A]/30 text-[#C9F06A] px-3.5 py-1 text-xs font-bold uppercase tracking-wider shrink-0 font-mono">
              {role.tag}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-white/10 bg-[#16221C]/90 p-8 text-center backdrop-blur-md">
        <p className="text-sm text-white/70">Vous cherchez plutôt des collaborateurs pour construire un projet communautaire ?</p>
        <Link
          to="/projects"
          className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9F06A] hover:underline"
        >
          <span>Explorer les projets 54Devs</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
