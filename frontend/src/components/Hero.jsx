import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Terminal, Code2, Shield, Globe2 } from 'lucide-react'

export default function Hero() {

  return (
    <section className="relative bg-[#101915] overflow-hidden pt-24 pb-28 md:pt-36 md:pb-40 border-b border-white/5 font-body flex flex-col justify-center min-h-[85vh]">
      {/* Background Video Layer with Deep Contrast Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-45 scale-105 transition-opacity duration-1000"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Ambient Dark Gradients: Blends seamlessly with Navbar and Next Section */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#101915]/90 via-[#101915]/60 to-[#101915]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#101915]/50 to-[#101915]/90" />
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-[#C9F06A]/15 blur-[160px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Glowing Pill Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C9F06A]/40 bg-[#C9F06A]/10 text-[#C9F06A] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase px-5 py-2 mb-8 shadow-sm backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-[#C9F06A] animate-ping" />
          <span className="font-mono tracking-widest">LE HUB TECHNOLOGIQUE DES 54 NATIONS</span>
        </div>

        {/* Grand Centered Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-8 font-display">
          Connectez-vous. Apprenez.
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9F06A] via-[#D8F87C] to-[#C9F06A] block mt-2">
            Construisez à travers 54 Nations.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-white/70 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto mb-12">
          L'écosystème où les développeurs africains passent du talent individuel à la souveraineté technologique collective. Mentors, projets collaboratifs et 54 États unis par le code.
        </p>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="group inline-flex items-center justify-center gap-2.5 bg-[#C9F06A] hover:bg-[#D8F87C] text-black px-9 py-4 rounded-full font-bold text-xs uppercase tracking-[0.16em] transition-all shadow-[0_8px_28px_-6px_rgba(201,240,106,0.6)] hover:shadow-[0_12px_36px_-6px_rgba(201,240,106,0.8)] hover:-translate-y-0.5"
          >
            <span>Rejoindre le mouvement</span>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/15 text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </Link>
          <Link
            to="/projects"
            className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 hover:border-[#C9F06A]/50 hover:bg-white/10 text-white px-8 py-4 font-semibold text-xs uppercase tracking-wider transition-all backdrop-blur-sm"
          >
            Explorer les projets
          </Link>
        </div>

        {/* Floating Glass Pill */}
        <div className="inline-flex items-center justify-center gap-3 sm:gap-4 rounded-full border border-[#C9F06A]/30 bg-[#16221C]/80 px-6 sm:px-8 py-3 backdrop-blur-xl shadow-2xl text-xs sm:text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C9F06A] animate-pulse" />
            <span className="text-white font-bold font-mono">54</span>
            <span className="text-white/80 font-medium">Nations Souveraines d'Afrique</span>
          </div>
          <span className="text-white/20 hidden sm:inline">•</span>
          <span className="text-[#C9F06A] font-mono text-xs hidden sm:inline font-semibold">
            Écosystème Tech Continental
          </span>
        </div>
      </div>
    </section>
  )
}
