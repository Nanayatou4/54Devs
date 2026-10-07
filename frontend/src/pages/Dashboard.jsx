import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Rocket, Zap, Users, GraduationCap, Briefcase,
  Settings, LogOut, ChevronRight, User, Pencil, Save, X, MapPin, Globe, Plus, ExternalLink
} from 'lucide-react'
import ProjectsView from './ProjectsView'

const API = 'http://localhost:8087/api'

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'projects', label: 'Projects', icon: Rocket },
  { key: 'smart-match', label: 'Smart Match', icon: Zap },
  { key: 'community', label: 'Community', icon: Users },
  { key: 'mentorship', label: 'Mentorship', icon: GraduationCap },
  { key: 'job-board', label: 'Job Board', icon: Briefcase },
]

function ProfileView({ profil, competences, utilisateur, token, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({})
  const [catalogue, setCatalogue] = useState([])
  const [addingSkill, setAddingSkill] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')

  useEffect(() => {
    if (profil) {
      setForm({
        pseudo: profil.pseudo || '',
        bio: profil.bio || '',
        pays: profil.pays || '',
        ville: profil.ville || '',
        niveau: profil.niveau || 'DEBUTANT',
        disponibilite: profil.disponibilite || '',
        github: profil.github || '',
        linkedin: profil.linkedin || '',
        portfolio: profil.portfolio || '',
      })
    }
  }, [profil])

  useEffect(() => {
    if (!token) return
    fetch(`${API}/competences`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : [])
      .then(setCatalogue)
  }, [token])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    try {
      const res = await fetch(`${API}/profil/moi`, { method: 'PUT', headers, body: JSON.stringify(form) })
      if (res.ok) {
        const updated = await res.json()
        onUpdate(updated)
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function addCompetence(comp) {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    const body = [
      ...competences.map(c => ({ competenceId: c.competenceId, type: c.type, niveau: c.niveau })),
      { competenceId: comp.id, type: 'MAITRISE', niveau: profil?.niveau || 'DEBUTANT' },
    ]
    const res = await fetch(`${API}/profil/moi/competences`, { method: 'PUT', headers, body: JSON.stringify(body) })
    if (res.ok) onUpdate(null, await res.json())
    setAddingSkill(false)
    setSkillSearch('')
  }

  async function removeCompetence(competenceId) {
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    const body = competences
      .filter(c => c.competenceId !== competenceId)
      .map(c => ({ competenceId: c.competenceId, type: c.type, niveau: c.niveau }))
    const res = await fetch(`${API}/profil/moi/competences`, { method: 'PUT', headers, body: JSON.stringify(body) })
    if (res.ok) onUpdate(null, await res.json())
  }

  const initials = utilisateur ? (utilisateur.prenom?.[0] || '') + (utilisateur.nom?.[0] || '') : '?'
  const niveauLabels = { DEBUTANT: 'Junior', INTERMEDIAIRE: 'Mid-Level', AVANCE: 'Senior' }
  const typeLabels = { MAITRISE: 'Mastered', APPRENDRE: 'Learning', ENSEIGNER: 'Teaching' }
  const typeColors = {
    MAITRISE: 'bg-green-500/20 text-green-400 border-green-500/30',
    APPRENDRE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    ENSEIGNER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  }
  const availableSkills = catalogue.filter(c => !competences.some(uc => uc.competenceId === c.id))
  const filteredSkills = skillSearch
    ? availableSkills.filter(c => c.nom.toLowerCase().includes(skillSearch.toLowerCase()))
    : availableSkills.slice(0, 8)

  return (
    <div>
      {/* Profile Header */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white text-xl font-bold">
              {initials.toUpperCase()}
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">{profil?.pseudo || utilisateur?.prenom || 'Dev'}</h2>
              <p className="text-gray-400 text-sm">{utilisateur?.email}</p>
              <div className="flex items-center gap-3 mt-1">
                {profil?.pays && (
                  <span className="flex items-center gap-1 text-gray-500 text-xs">
                    <MapPin size={12} /> {profil.pays}{profil.ville ? `, ${profil.ville}` : ''}
                  </span>
                )}
                <span className="text-accent text-xs font-semibold">{niveauLabels[profil?.niveau] || 'Junior'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
              editing
                ? 'bg-dark-2 text-gray-400 border border-dark-border hover:text-white'
                : 'bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20'
            }`}
          >
            {editing ? <><X size={14} /> Cancel</> : <><Pencil size={14} /> Edit Profile</>}
          </button>
        </div>

        {/* Bio */}
        {editing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Pseudo</label>
                <input value={form.pseudo} onChange={e => handleChange('pseudo', e.target.value)}
                  className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Level</label>
                <select value={form.niveau} onChange={e => handleChange('niveau', e.target.value)}
                  className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition appearance-none">
                  <option value="DEBUTANT">Junior (0-2 yrs)</option>
                  <option value="INTERMEDIAIRE">Mid-Level (2-5 yrs)</option>
                  <option value="AVANCE">Senior (5+ yrs)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Country</label>
                <select value={form.pays} onChange={e => handleChange('pays', e.target.value)}
                  className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition appearance-none">
                  <option value="">Select your country</option>
                  {['Sénégal','Côte d\'Ivoire','Cameroun','Mali','Togo','Bénin','Maroc','Tunisie','Algérie','Égypte','Nigeria','Ghana','Kenya','Rwanda','Éthiopie','Tanzanie','Afrique du Sud','RDC','Guinée','Burkina Faso','Niger','Mauritanie','Madagascar','Gabon','Congo','Tchad','Autre'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">City</label>
                <input value={form.ville} onChange={e => handleChange('ville', e.target.value)}
                  className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Bio</label>
              <textarea value={form.bio} onChange={e => handleChange('bio', e.target.value)} rows={3}
                className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent transition resize-none" />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Availability</label>
              <input value={form.disponibilite} onChange={e => handleChange('disponibilite', e.target.value)} placeholder="e.g. Full-time, Weekends only"
                className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">GitHub</label>
                <input value={form.github} onChange={e => handleChange('github', e.target.value)} placeholder="https://github.com/..."
                  className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">LinkedIn</label>
                <input value={form.linkedin} onChange={e => handleChange('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..."
                  className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Portfolio</label>
                <input value={form.portfolio} onChange={e => handleChange('portfolio', e.target.value)} placeholder="https://..."
                  className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <div>
            {profil?.bio && <p className="text-gray-300 text-sm mb-4">{profil.bio}</p>}
            {!profil?.bio && <p className="text-gray-600 text-sm italic mb-4">No bio yet. Click "Edit Profile" to add one.</p>}
            <div className="flex items-center gap-4">
              {profil?.disponibilite && (
                <span className="text-xs text-gray-400 bg-dark-2 px-3 py-1 rounded-full border border-dark-border">{profil.disponibilite}</span>
              )}
              {profil?.github && (
                <a href={profil.github} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
              )}
              {profil?.linkedin && (
                <a href={profil.linkedin} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              )}
              {profil?.portfolio && (
                <a href={profil.portfolio} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition"><Globe size={16} /></a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-sm">My Skills</h3>
          <button onClick={() => setAddingSkill(!addingSkill)}
            className="flex items-center gap-1 text-accent text-xs font-semibold hover:underline">
            {addingSkill ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Skill</>}
          </button>
        </div>

        {addingSkill && (
          <div className="mb-4">
            <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills..."
              autoFocus
              className="w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition mb-2" />
            <div className="flex flex-wrap gap-2">
              {filteredSkills.map(c => (
                <button key={c.id} onClick={() => addCompetence(c)}
                  className="text-xs bg-dark-2 text-gray-300 border border-dark-border px-3 py-1.5 rounded-lg hover:border-accent hover:text-accent transition">
                  {c.nom} <span className="text-gray-600">({c.categorie})</span>
                </button>
              ))}
              {filteredSkills.length === 0 && <p className="text-gray-600 text-xs">No matching skills found.</p>}
            </div>
          </div>
        )}

        {competences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {competences.map(c => (
              <div key={c.competenceId}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium ${typeColors[c.type] || 'bg-dark-2 text-gray-400 border-dark-border'}`}>
                <span>{c.nom}</span>
                <span className="opacity-60">{typeLabels[c.type]}</span>
                <button onClick={() => removeCompetence(c.competenceId)} className="opacity-40 hover:opacity-100 transition">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-sm">No skills added yet. Click "+ Add Skill" to get started.</p>
        )}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [profil, setProfil] = useState(null)
  const [competences, setCompetences] = useState([])
  const [utilisateur, setUtilisateur] = useState(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const u = localStorage.getItem('utilisateur')
    if (u) setUtilisateur(JSON.parse(u))

    const headers = { Authorization: `Bearer ${token}` }

    fetch(`${API}/profil/moi`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setProfil(data) })

    fetch(`${API}/profil/moi/competences`, { headers })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setCompetences(data) })
  }, [token, navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('utilisateur')
    navigate('/login')
  }

  function handleProfileUpdate(updatedProfil, updatedCompetences) {
    if (updatedProfil) setProfil(updatedProfil)
    if (updatedCompetences) setCompetences(updatedCompetences)
  }

  const displayName = profil?.pseudo || utilisateur?.prenom || 'Dev'

  return (
    <div className="min-h-screen bg-dark-1 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-2 border-r border-dark-border flex flex-col justify-between py-6 px-4 shrink-0">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white px-3 mb-8">
            <span className="text-accent">&lt;/&gt;</span>
            <span>54<span className="text-accent">Devs</span></span>
          </Link>

          {/* User mini-card */}
          <button
            onClick={() => setActive('profile')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-4 transition ${
              active === 'profile'
                ? 'bg-dark-card border border-accent/30'
                : 'bg-dark-card border border-dark-border hover:border-gray-600'
            }`}
          >
            <div className="w-9 h-9 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {((utilisateur?.prenom?.[0] || '') + (utilisateur?.nom?.[0] || '')).toUpperCase() || '?'}
            </div>
            <div className="text-left min-w-0">
              <p className="text-white text-sm font-semibold truncate">{displayName}</p>
              <p className="text-gray-500 text-[10px] truncate">{utilisateur?.email || ''}</p>
            </div>
          </button>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = active === item.key
              return (
                <button
                  key={item.key}
                  onClick={() => setActive(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-gray-400 hover:text-white hover:bg-dark-card'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom section */}
        <div className="space-y-3">
          {/* CADEV 2026 card */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-accent text-xs font-bold uppercase tracking-wider">CADEV 2026</span>
              <span className="text-gray-500 text-[10px]">182 Days Left</span>
            </div>
            <div className="w-full bg-dark-border rounded-full h-1.5 mb-3">
              <div className="bg-accent h-1.5 rounded-full" style={{ width: '35%' }} />
            </div>
            <p className="text-white text-sm font-semibold mb-0.5">Next: Proposal Approval</p>
            <p className="text-gray-500 text-xs mb-3">Required for competition entry.</p>
            <button className="w-full bg-accent hover:bg-accent-hover text-white text-xs font-semibold py-2 rounded-lg transition">
              Approve Current Plan
            </button>
          </div>

          {/* Settings & Logout */}
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white text-sm font-medium transition rounded-lg hover:bg-dark-card">
            <Settings size={18} />
            Settings
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 text-sm font-medium transition rounded-lg hover:bg-dark-card"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {active === 'profile' ? (
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">My Profile</h1>
              <p className="text-gray-400 text-sm">Manage your developer identity and skills.</p>
            </div>
            <ProfileView profil={profil} competences={competences} utilisateur={utilisateur} token={token} onUpdate={handleProfileUpdate} />
          </div>
        ) : active === 'projects' ? (
          <ProjectsView token={token} />
        ) : (
        <div>
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Welcome back, <span className="text-accent">{displayName}</span>
          </h1>
          <p className="text-gray-400 text-sm">Here's what's happening across your network.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Reputation Score', value: '0', sub: 'Starting out' },
            { label: 'Active Projects', value: '0', sub: 'Join or create one' },
            { label: 'Skills', value: String(competences.length), sub: competences.length > 0 ? competences.slice(0, 3).map(c => c.nom).join(', ') : 'Add your skills' },
            { label: 'Connections', value: '0', sub: 'Grow your network' },
          ].map(stat => (
            <div key={stat.label} className="bg-dark-card border border-dark-border rounded-xl p-5">
              <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-2">{stat.label}</p>
              <p className="text-white text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-gray-500 text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-6">
          {/* Active Project Feed */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-sm">Active Project Feed</h2>
              <button className="text-accent text-xs font-semibold hover:underline flex items-center gap-1">
                View All <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Rocket size={32} className="text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm mb-1">No active projects yet</p>
              <p className="text-gray-600 text-xs">Create or join a project to get started.</p>
            </div>
          </div>

          {/* Recommended Collaborators */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-bold text-sm">Recommended Collaborators</h2>
              <button className="text-accent text-xs font-semibold hover:underline flex items-center gap-1">
                See More <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users size={32} className="text-gray-600 mb-3" />
              <p className="text-gray-400 text-sm mb-1">Matching in progress</p>
              <p className="text-gray-600 text-xs">Complete your profile to get matched.</p>
            </div>
          </div>
        </div>

        {/* Upcoming milestones */}
        <div className="mt-6 bg-dark-card border border-dark-border rounded-xl p-6">
          <h2 className="text-white font-bold text-sm mb-4">Upcoming CADEV 2026 Milestones</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { date: 'Nov 2026', title: 'Proposal Deadline', status: 'upcoming' },
              { date: 'Jan 2027', title: 'Team Formation', status: 'locked' },
              { date: 'Mar 2027', title: 'Competition Start', status: 'locked' },
            ].map(m => (
              <div key={m.title} className="bg-dark-2 rounded-lg p-4 border border-dark-border">
                <span className="text-accent text-[10px] font-bold uppercase tracking-wider">{m.date}</span>
                <p className="text-white text-sm font-semibold mt-1">{m.title}</p>
                <span className={`inline-block mt-2 text-[10px] font-bold uppercase tracking-wider ${
                  m.status === 'upcoming' ? 'text-accent' : 'text-gray-600'
                }`}>
                  {m.status === 'upcoming' ? 'Next Step' : 'Locked'}
                </span>
              </div>
            ))}
          </div>
        </div>
        </div>
        )}
      </main>
    </div>
  )
}
