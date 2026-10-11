import { useEffect, useState } from 'react'
import { publicApi } from '../api'

const METRICS = [
  ['projets', 'Projets'],
  ['developpeurs', 'Développeurs actifs'],
  ['questions', 'Questions'],
  ['challenges', 'Challenges'],
]

export default function PublicStats() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let active = true
    publicApi.statistiques().then(data => { if (active) setStats(data) }).catch(() => {})
    return () => { active = false }
  }, [])

  if (!stats) return null

  return (
    <section aria-label="Statistiques de la communauté" className="bg-white border-y border-slate-100 py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {METRICS.map(([key, label]) => <div key={key} className="text-center">
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">{Number(stats[key] || 0).toLocaleString('fr-FR')}</p>
          <p className="mt-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
        </div>)}
      </div>
    </section>
  )
}
