import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { projetsApi } from '../api'

const STATUT_LABELS = {
  IDEE: 'Idea Stage',
  EN_DEVELOPPEMENT: 'In Development',
  EN_LANCEMENT: 'Launching',
  TERMINE: 'Completed',
  EN_PAUSE: 'On Pause',
}
const STATUT_COLORS = {
  IDEE: 'bg-primary/20 text-primary',
  EN_DEVELOPPEMENT: 'bg-green/20 text-green',
  EN_LANCEMENT: 'bg-purple-400/20 text-purple-300',
  TERMINE: 'bg-gray-500/20 text-gray-400',
  EN_PAUSE: 'bg-yellow-400/20 text-yellow-300',
}

const CTA_LABELS = {
  EN_DEVELOPPEMENT: 'Request to Join',
  IDEE: 'Support Idea',
  EN_LANCEMENT: 'Explore Jobs',
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projetsApi
      .rechercher({ taille: 3 })
      .then(data => setProjects(data?.contenu || []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="bg-dark py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Discover Real Projects</h2>
            <p className="text-gray-400 text-lg max-w-lg">
              Browse challenges, join teams, and start building. From Idea to Launching, every stage is supported.
            </p>
          </div>
          <Link
            to="/projects"
            className="mt-4 sm:mt-0 border border-white/20 text-white hover:bg-white/10 px-5 py-2.5 rounded-lg font-semibold transition text-center whitespace-nowrap"
          >
            View All Projects
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 size={28} className="animate-spin text-primary" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {projects.map(p => (
              <div key={p.id} className="bg-dark-2 rounded-2xl p-6 border border-white/10 flex flex-col hover:border-white/20 transition">
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUT_COLORS[p.statut] || 'bg-gray-500/20 text-gray-400'}`}>
                    {STATUT_LABELS[p.statut] || p.statut}
                  </span>
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(p.nombreMembres || 1, 4) }).map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-gray-600 border-2 border-dark-2 flex items-center justify-center text-xs text-gray-300 font-medium">
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    {(p.nombreMembres || 0) > 4 && (
                      <div className="w-7 h-7 rounded-full bg-gray-700 border-2 border-dark-2 flex items-center justify-center text-[10px] text-gray-400 font-bold">
                        +{p.nombreMembres - 4}
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{p.nom}</h3>
                <p className="text-gray-400 text-sm mb-4 flex-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {(p.technologies || '').split(',').filter(Boolean).slice(0, 3).map(tag => (
                    <span key={tag.trim()} className="bg-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/projects/${p.id}`}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-semibold transition border border-white/10 text-center block"
                >
                  {CTA_LABELS[p.statut] || 'View Project'}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No projects yet. Be the first to create one!</p>
            <Link to="/projects/create" className="text-primary font-semibold hover:underline">
              Create a Project
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
