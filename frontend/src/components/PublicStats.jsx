import { useEffect, useState } from 'react'
import { publicApi } from '../api'

export default function PublicStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let active = true
    publicApi.statistiques()
      .then(data => { if (active && data) setStats(data) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const metrics = [
    { value: '54', label: 'Nations Africaines' },
    { value: stats ? `${Number(stats.developpeurs ?? 0).toLocaleString('fr-FR')}` : '0', label: 'Développeurs Inscrits' },
    { value: stats ? `${Number(stats.projets ?? 0).toLocaleString('fr-FR')}` : '0', label: 'Projets Publiés' },
    { value: '100%', label: 'Panafricain' },
  ]

  return (
    <section aria-label="Statistiques de la communauté 54Devs" className="bg-[#0C130F] border-y border-white/5 py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center relative z-10">
        {metrics.map(m => (
          <div key={m.label} className="group rounded-3xl border border-white/10 bg-[#16221C]/70 p-6 sm:p-8 backdrop-blur-md hover:border-[#C9F06A]/40 hover:bg-[#16171d] transition-all duration-300">
            <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#C9F06A] tracking-tight font-display mb-2 group-hover:scale-105 transition-transform font-mono">
              {m.value}
            </p>
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-body">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
