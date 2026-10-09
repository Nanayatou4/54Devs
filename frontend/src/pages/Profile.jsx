import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Calendar, MessageSquare, ArrowRight, Loader2,
  Pencil, X, Save, Camera, ExternalLink, Link2, Globe,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {
  authApi,
  clearAuthSession,
  competencesApi,
  getProfilePhoto,
  getStoredUser,
  getToken,
  profilApi,
  projetsApi,
  setAuthSession,
  setProfilePhoto,
} from '../api'

const NIVEAU_LABELS = { DEBUTANT: 'Junior', INTERMEDIAIRE: 'Mid-Level', AVANCE: 'Senior' }
const NIVEAUX = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE']

export default function Profile() {
  const navigate = useNavigate()
  const token = getToken()

  const [profil, setProfil] = useState(null)
  const [competences, setCompetences] = useState([])
  const [utilisateur, setUtilisateur] = useState(null)
  const [loading, setLoading] = useState(true)
  const [myProjects, setMyProjects] = useState([])

  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  const [form, setForm] = useState({})
  const [photoPreview, setPhotoPreview] = useState(() => getProfilePhoto())
  const fileRef = useRef(null)

  const [catalogue, setCatalogue] = useState([])
  const [editCompetences, setEditCompetences] = useState([])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    const stored = getStoredUser()
    if (stored) setUtilisateur(stored)

    Promise.all([
      profilApi.getMonProfil().catch(() => null),
      profilApi.getMesCompetences().catch(() => []),
      authApi.moi().catch(() => null),
      projetsApi.mesProjets().catch(() => []),
    ]).then(([p, c, u, projects]) => {
      if (p) setProfil(p)
      setCompetences(c || [])
      if (u) {
        setUtilisateur(u)
        setAuthSession({ token, utilisateur: u })
      }
      setMyProjects(projects || [])
      setLoading(false)
    })
  }, [token, navigate])

  function startEditing() {
    setForm({
      pseudo: profil?.pseudo || '',
      bio: profil?.bio || '',
      pays: profil?.pays || '',
      ville: profil?.ville || '',
      niveau: profil?.niveau || 'DEBUTANT',
      disponibilite: profil?.disponibilite || '',
      github: profil?.github || '',
      linkedin: profil?.linkedin || '',
      portfolio: profil?.portfolio || '',
    })
    setEditCompetences(
      competences.map(c => ({
        competenceId: c.competenceId,
        type: c.type || 'MAITRISE',
        niveau: c.niveau || 'DEBUTANT',
      }))
    )
    setSaveError('')
    setEditing(true)
    if (catalogue.length === 0) {
      competencesApi.lister().then(setCatalogue).catch(() => {})
    }
  }

  function cancelEditing() {
    setEditing(false)
    setPhotoPreview(getProfilePhoto())
    setSaveError('')
  }

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  function toggleCompetence(id) {
    setEditCompetences(prev => {
      const exists = prev.find(c => c.competenceId === id)
      if (exists) return prev.filter(c => c.competenceId !== id)
      return [...prev, { competenceId: id, type: 'MAITRISE', niveau: 'DEBUTANT' }]
    })
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')
    try {
      const updated = await profilApi.updateMonProfil({
        pseudo: form.pseudo || `${utilisateur?.prenom || ''} ${utilisateur?.nom || ''}`.trim(),
        bio: form.bio || null,
        pays: form.pays || null,
        ville: form.ville || null,
        niveau: form.niveau || null,
        disponibilite: form.disponibilite || null,
        github: form.github || null,
        linkedin: form.linkedin || null,
        portfolio: form.portfolio || null,
      })
      setProfil(updated)

      const updatedComp = await profilApi.replaceMesCompetences(editCompetences)
      setCompetences(updatedComp)

      if (photoPreview) setProfilePhoto(photoPreview)

      setEditing(false)
    } catch (err) {
      setSaveError(err.message || 'Erreur lors de la sauvegarde.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      </div>
    )
  }

  const displayName = profil?.pseudo || `${utilisateur?.prenom || ''} ${utilisateur?.nom || ''}`.trim() || 'Developer'
  const initials = ((utilisateur?.prenom?.[0] || '') + (utilisateur?.nom?.[0] || '')).toUpperCase()

  function handleLogout() {
    clearAuthSession()
    navigate('/')
  }

  const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition'
  const labelClass = 'block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1'

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* ---- Left Column ---- */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden relative">
              <div className="h-24 bg-gradient-to-r from-dark to-dark-2" />

              {!editing && (
                <button
                  onClick={startEditing}
                  className="absolute top-28 right-4 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition shadow-sm z-10"
                  title="Edit profile"
                >
                  <Pencil size={14} />
                </button>
              )}

              <div className="px-6 pb-6 -mt-10 text-center">
                <div className="relative inline-block">
                  {editing ? (
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-xl font-bold text-gray-600 mx-auto overflow-hidden relative group"
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-full">
                        <Camera size={20} className="text-white" />
                      </div>
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                      />
                    </button>
                  ) : (
                    <div className="w-20 h-20 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center text-xl font-bold text-gray-600 mx-auto overflow-hidden">
                      {photoPreview ? (
                        <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                      ) : (
                        initials
                      )}
                    </div>
                  )}
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-green border-2 border-white rounded-full" />
                </div>

                {editing ? (
                  <div className="mt-3 space-y-3 text-left">
                    <div>
                      <label className={labelClass}>Display Name</label>
                      <input value={form.pseudo} onChange={e => set('pseudo', e.target.value)} placeholder="Your display name" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={labelClass}>Country</label>
                        <input value={form.pays} onChange={e => set('pays', e.target.value)} placeholder="e.g. Senegal" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>City</label>
                        <input value={form.ville} onChange={e => set('ville', e.target.value)} placeholder="e.g. Dakar" className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Level</label>
                      <select value={form.niveau} onChange={e => set('niveau', e.target.value)} className={inputClass}>
                        {NIVEAUX.map(n => (
                          <option key={n} value={n}>{NIVEAU_LABELS[n]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Availability</label>
                      <input value={form.disponibilite} onChange={e => set('disponibilite', e.target.value)} placeholder="e.g. Full-time, Weekends only..." className={inputClass} />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-900 mt-3">{displayName}</h2>
                    <p className="text-gray-500 text-sm">
                      {profil?.niveau ? NIVEAU_LABELS[profil.niveau] || profil.niveau : 'Software Developer'}
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                      {profil?.pays && (
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {profil.ville ? `${profil.ville}, ` : ''}{profil.pays}
                        </span>
                      )}
                      <span className="flex items-center gap-1"><Calendar size={12} /> Joined 2024</span>
                    </div>
                    {profil?.disponibilite && (
                      <p className="text-xs text-primary font-medium mt-2">{profil.disponibilite}</p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 bg-dark text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-dark-2 transition">Follow</button>
                      <button className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Links (edit mode) or Engagement (view mode) */}
            {editing ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
                <h3 className="font-bold text-gray-900 mb-2">Links</h3>
                <div>
                  <label className={labelClass}><ExternalLink size={12} className="inline mr-1" />GitHub</label>
                  <input value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Link2 size={12} className="inline mr-1" />LinkedIn</label>
                  <input value={form.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}><Globe size={12} className="inline mr-1" />Portfolio</label>
                  <input value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://..." className={inputClass} />
                </div>
              </div>
            ) : (
              <>
                {/* Social Links */}
                {(profil?.github || profil?.linkedin || profil?.portfolio) && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-3">Links</h3>
                    <div className="space-y-2">
                      {profil.github && (
                        <a href={profil.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition">
                          <ExternalLink size={16} /> GitHub
                        </a>
                      )}
                      {profil.linkedin && (
                        <a href={profil.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition">
                          <Link2 size={16} /> LinkedIn
                        </a>
                      )}
                      {profil.portfolio && (
                        <a href={profil.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition">
                          <Globe size={16} /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Engagement */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Engagement</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <span className="text-lg font-bold text-gray-900">{myProjects.length}</span>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Projects</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <span className="text-lg font-bold text-gray-900">0</span>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Followers</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <span className="text-lg font-bold text-gray-900">0</span>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Contributions</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <span className="text-lg font-bold text-gray-900">0</span>
                      <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Mentored</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <button onClick={handleLogout} className="w-full text-red-500 text-sm font-semibold hover:underline">
              Log out
            </button>
          </div>

          {/* ---- Right Column ---- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Save / Cancel bar (edit mode) */}
            {editing && (
              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4">
                <span className="text-sm font-semibold text-gray-900">Editing Profile</span>
                <div className="flex items-center gap-3">
                  {saveError && <span className="text-red-500 text-sm">{saveError}</span>}
                  <button onClick={cancelEditing} className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-semibold transition">
                    <X size={16} /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* About */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">About Me</h2>
              {editing ? (
                <textarea
                  value={form.bio}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Tell the community about yourself..."
                  rows={4}
                  maxLength={1000}
                  className={`${inputClass} resize-none`}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {profil?.bio || 'No bio yet. Click the edit icon to tell the community about yourself.'}
                </p>
              )}
            </div>

            {/* Expertise / Competences */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Expertise</h3>
              {editing ? (
                <div>
                  <p className="text-gray-500 text-sm mb-3">Select your skills from the catalogue:</p>
                  <div className="flex flex-wrap gap-2">
                    {catalogue.map(c => {
                      const selected = editCompetences.some(ec => ec.competenceId === c.id)
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleCompetence(c.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                            selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300'
                          }`}
                        >
                          {c.nom}
                        </button>
                      )
                    })}
                  </div>
                  {editCompetences.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Selected ({editCompetences.length})</p>
                      {editCompetences.map(ec => {
                        const info = catalogue.find(c => c.id === ec.competenceId)
                        return (
                          <div key={ec.competenceId} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
                            <span className="text-sm font-medium text-gray-900 flex-1">{info?.nom || `#${ec.competenceId}`}</span>
                            <select
                              value={ec.niveau}
                              onChange={e => setEditCompetences(prev => prev.map(
                                c => c.competenceId === ec.competenceId ? { ...c, niveau: e.target.value } : c
                              ))}
                              className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              {NIVEAUX.map(n => <option key={n} value={n}>{NIVEAU_LABELS[n]}</option>)}
                            </select>
                            <button
                              onClick={() => toggleCompetence(ec.competenceId)}
                              className="text-gray-400 hover:text-red-500 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ) : competences.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {competences.map(c => (
                    <span key={c.competenceId} className="border border-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg font-medium">
                      {c.nom}
                      {c.niveau && (
                        <span className="text-gray-400 ml-1 text-xs">
                          ({NIVEAU_LABELS[c.niveau] || c.niveau})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No skills added yet. Click the edit icon to add your expertise.</p>
              )}
            </div>

            {/* Featured Projects (view mode only) */}
            {!editing && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Featured Projects</h3>
                  <Link to="/projects" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                </div>
                {myProjects.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {myProjects.slice(0, 4).map(p => (
                      <Link
                        key={p.id}
                        to={`/projects/${p.id}`}
                        className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <span className="text-primary text-lg font-bold">&#9889;</span>
                          </div>
                          <span className="text-[10px] font-bold text-green bg-green/10 px-2 py-0.5 rounded">
                            {p.roleMembre === 'CREATEUR' ? 'LEAD DEV' : 'CONTRIBUTOR'}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-1">{p.nom}</h4>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{p.description}</p>
                        <span className="text-primary text-sm font-semibold inline-flex items-center gap-1 hover:underline">
                          Explore Project <ArrowRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                    <p className="text-gray-400 text-sm">No projects yet.</p>
                    <Link to="/projects/create" className="text-primary text-sm font-semibold hover:underline mt-2 inline-block">
                      Create your first project
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
