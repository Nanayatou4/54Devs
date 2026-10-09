import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Rocket, Users, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken, projetsApi } from '../api'

const FILTERS = ['All Initiatives', 'Open Source', 'Co-founder Search', 'Startup Lab', 'Social Impact']

const STATUT_LABELS = {
  IDEE: 'Idea', EN_DEVELOPPEMENT: 'In Development', EN_LANCEMENT: 'Launching',
  TERMINE: 'Completed', EN_PAUSE: 'On Pause',
}
const STATUT_COLORS = {
  IDEE: 'bg-primary/10 text-primary',
  EN_DEVELOPPEMENT: 'bg-green/10 text-green',
  EN_LANCEMENT: 'bg-purple-100 text-purple-600',
  TERMINE: 'bg-gray-100 text-gray-600',
  EN_PAUSE: 'bg-yellow-100 text-yellow-700',
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All Initiatives')
  const [myProjects, setMyProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const token = getToken()

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    projetsApi
      .mesProjets()
      .then(setMyProjects)
      .finally(() => setLoading(false))
  }, [token])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Build the Next <span className="text-primary italic">Continental Unicorn</span>
            </h1>
            <p className="text-gray-500 max-w-lg">
              Collaborate on open-source initiatives, join high-impact startup labs, or find the perfect co-founder for your next big idea.
            </p>
          </div>
          <div className="flex flex-col gap-3 shrink-0">
            <Link to="/projects/create" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
              <Plus size={16} /> Submit a Project
            </Link>
            <a href="#startup-lab" className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
              <Rocket size={16} /> Join Startup Lab
            </a>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                activeFilter === f
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Projects */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-primary" />
          </div>
        ) : myProjects.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {myProjects.map(p => (
              <Link key={p.id} to={`/projects/${p.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition group">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
                  <Rocket size={40} className="text-primary/30" />
                  {p.categorie && (
                    <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                      {p.categorie}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/90 text-gray-700 text-[10px] font-semibold px-2.5 py-1 rounded">
                    {p.placesRestantes} spot{p.placesRestantes !== 1 ? 's' : ''} open
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 group-hover:text-primary transition">{p.nom}</h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${STATUT_COLORS[p.statut] || 'bg-gray-100 text-gray-600'}`}>
                      {STATUT_LABELS[p.statut] || p.statut}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span><Users size={12} className="inline mr-1" />{p.membres?.length || 0} members</span>
                    {p.technologies && <span className="truncate">{p.technologies}</span>}
                  </div>
                </div>
              </Link>
            ))}

            {/* Create card */}
            <Link to="/projects/create"
              className="bg-white rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-10 hover:border-primary hover:bg-primary-light transition group min-h-[300px]">
              <div className="w-12 h-12 bg-gray-100 group-hover:bg-primary/10 rounded-full flex items-center justify-center mb-4 transition">
                <Plus size={24} className="text-gray-400 group-hover:text-primary transition" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Start Something New</h3>
              <p className="text-gray-400 text-sm text-center">Have an idea that could change the continent? Share it with the community.</p>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center mb-10">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
              <Rocket size={32} className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No projects yet</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Create your first project to get started. Your projects will appear here once created.
            </p>
            <Link to="/projects/create" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
              <Plus size={16} /> Create Your First Project
            </Link>
          </div>
        )}

        {/* Startup Lab Section */}
        <div id="startup-lab" className="bg-dark rounded-3xl p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">54Devs Startup Lab</h2>
              <p className="text-gray-400 mb-8">
                A 12-week intensive build program where we turn prototypes into venture-backed companies. We provide the infrastructure, the network, and the initial capital.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { label: 'Zero-to-One Support', desc: 'Mentorship from founders who have exited $100M+ companies.' },
                  { label: 'Elite Engineering Team', desc: 'Access to the top 1% of developers on the 54Devs platform.' },
                ].map(item => (
                  <li key={item.label} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">&#10003;</span>
                    </div>
                    <div>
                      <span className="text-white font-semibold text-sm">{item.label}</span>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="bg-green hover:bg-green-hover text-white px-6 py-3 rounded-lg font-semibold transition">
                Apply for Cohort 4
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <span className="text-primary text-2xl font-bold block">$2.4M</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Funding Raised</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
                  <span className="text-primary text-2xl font-bold block">12</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-bold">Startups Launched</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-600 rounded-full shrink-0" />
                <p className="text-gray-300 text-sm italic">
                  "The Lab gave us the technical credibility to close our pre-seed in weeks."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
