import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Zap, Lock, ArrowRight, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { getToken, projetsApi } from '../api'

const STATUT_LABELS = {
  IDEE: 'Idea', EN_DEVELOPPEMENT: 'In Development', EN_LANCEMENT: 'Launching',
  TERMINE: 'Completed', EN_PAUSE: 'On Pause',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const [projet, setProjet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const token = getToken()

  useEffect(() => {
    if (!token || !id) return
    projetsApi
      .getById(id)
      .then((data) => setProjet(data))
      .catch(() => setProjet(null))
      .finally(() => setLoading(false))
  }, [id, token])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32"><Loader2 size={32} className="animate-spin text-primary" /></div>
      </div>
    )
  }

  if (!projet) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 text-lg mb-4">Project not found.</p>
          <Link to="/projects" className="text-primary font-semibold hover:underline">Back to Projects</Link>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'documentation', label: 'Documentation' },
    { key: 'issues', label: 'Issues', count: 12 },
    { key: 'updates', label: 'Updates' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/projects" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-6 transition">
          <ArrowLeft size={16} /> Back to Project Lab
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2">
            {/* Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&h=300&fit=crop"
                alt={projet.nom}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6">
                {projet.categorie && (
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded mr-2">
                    {projet.categorie}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-white mt-2">{projet.nom}</h1>
                <p className="text-gray-300 text-sm mt-2 max-w-xl">{projet.description}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`pb-3 text-sm font-medium transition relative ${
                    activeTab === t.key ? 'text-gray-900 border-b-2 border-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}>
                  {t.label}
                  {t.count && <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs px-1.5 py-0.5 rounded">{t.count}</span>}
                </button>
              ))}
            </div>

            {/* Content */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Project</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {projet.description}
              </p>
              {projet.probleme && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  Current focus: {projet.probleme}
                </p>
              )}

              {/* Roadmap */}
              <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">Roadmap & Milestones</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle size={18} className="text-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phase 1: Project Setup</h3>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-gray-600 text-sm mt-1">Project created and initial team formed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Zap size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Phase 2: Development</h3>
                    <p className="text-primary text-sm font-medium">In Progress</p>
                    <p className="text-gray-600 text-sm mt-1">{projet.solution || 'Building core features and infrastructure.'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <Lock size={16} className="text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-400">Phase 3: Launch</h3>
                    <p className="text-gray-400 text-sm">Scheduled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* War Room */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">The War Room</h3>
                <span className="flex items-center gap-1.5 text-green text-xs font-semibold">
                  <span className="w-2 h-2 bg-green rounded-full" /> LIVE
                </span>
              </div>
              {projet.membres?.slice(0, 2).map((m, i) => (
                <div key={i} className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {(m.prenom?.[0] || '') + (m.nom?.[0] || '')}
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-semibold">{m.prenom} {m.nom?.[0]}.</p>
                    <p className="text-gray-500 text-xs">{m.roleMembre === 'CREATEUR' ? 'Project lead' : 'Team member'}</p>
                  </div>
                </div>
              ))}
              <button className="w-full bg-dark text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-dark-2 transition mt-2">
                Enter War Room
              </button>
              <p className="text-gray-400 text-[10px] text-center mt-2 uppercase tracking-wider font-bold">
                Only for approved contributors
              </p>
            </div>

            {/* Open Roles */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">Open Roles</h3>
              {projet.rolesRecherches ? (
                <div className="space-y-3">
                  {projet.rolesRecherches.split(',').map((role, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{role.trim()}</h4>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">1 Slot</span>
                      </div>
                      <button className="text-primary text-sm font-semibold mt-2 inline-flex items-center gap-1 hover:underline">
                        Apply Role <ArrowRight size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No open roles currently.</p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <span className="text-xl font-bold text-primary block">{projet.membres?.length || 0}</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Members</span>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <span className="text-xl font-bold text-primary block">{projet.placesRestantes || 0}</span>
                <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Spots Open</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
