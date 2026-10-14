import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTA() {
  return (
    <section className="bg-[#101915] py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 relative overflow-hidden font-body">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-[32px] bg-[#C9F06A] p-8 sm:p-14 md:p-16 text-[#101915] shadow-2xl overflow-hidden">
          {/* Ambient decorative radar / contour rings inspired by the reference design */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-black/10 pointer-events-none -mr-20 hidden lg:block" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-black/10 pointer-events-none -mr-8 hidden lg:block" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-black/15 pointer-events-none 4 hidden lg:block" />

          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#101915]/80 font-mono mb-4">
              <span className="h-2 w-2 rounded-full bg-[#101915]" />
              LE RÉSEAU TECH DES 54 ÉTATS
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#101915] tracking-tight font-display mb-4 leading-[1.12]">
              Une idée grandit quand elle est partagée.
            </h2>

            <p className="text-[#101915]/80 text-base sm:text-lg mb-8 leading-relaxed max-w-xl">
              Trouvez des coéquipiers, partagez vos compétences et bâtissez ensemble les prochaines grandes solutions du continent avec la communauté 54Devs.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#101915] text-[#C9F06A] hover:bg-black px-8 py-4 font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:-translate-y-0.5"
              >
                <span>Créer mon compte</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center rounded-full border-2 border-[#101915]/30 hover:border-[#101915] text-[#101915] hover:bg-black/5 px-8 py-4 font-bold text-xs uppercase tracking-wider transition-all"
              >
                Explorer les projets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
