import { useState, useEffect } from 'react'
import {
  Plus, X, ChevronLeft, Pencil, Save, Users, MapPin,
  Clock, CheckCircle, Pause, Lightbulb, Rocket, ArrowRight, Loader2
} from 'lucide-react'
import { competencesApi, projetsApi } from '../api'

const STATUT_LABELS = {
  IDEE: 'Idea', EN_DEVELOPPEMENT: 'In Development', EN_LANCEMENT: 'Launching',
  TERMINE: 'Completed', EN_PAUSE: 'On Pause',
}
const STATUT_COLORS = {
  IDEE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  EN_DEVELOPPEMENT: 'bg-accent/20 text-accent border-accent/30',
  EN_LANCEMENT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  TERMINE: 'bg-green-500/20 text-green-400 border-green-500/30',
  EN_PAUSE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}
const STATUT_ICONS = {
  IDEE: Lightbulb, EN_DEVELOPPEMENT: Rocket, EN_LANCEMENT: ArrowRight,
  TERMINE: CheckCircle, EN_PAUSE: Pause,
}
const NIVEAU_LABELS = { DEBUTANT: 'Junior', INTERMEDIAIRE: 'Mid-Level', AVANCE: 'Senior' }
const CATEGORIES_SUGGESTIONS = ['Agriculture', 'Education', 'FinTech', 'HealthTech', 'E-Commerce', 'Logistics', 'GreenTech', 'GovTech']

function ProjectForm({ token, catalogue, onCreated, onCancel, existing }) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nom: existing?.nom || '',
    description: existing?.description || '',
    probleme: existing?.probleme || '',
    solution: existing?.solution || '',
    categorie: existing?.categorie || '',
    technologies: existing?.technologies || '',
    statut: existing?.statut || 'IDEE',
    nombrePlacesRecherchees: existing?.nombrePlacesRecherchees || 3,
    rolesRecherches: existing?.rolesRecherches || '',
    competencesRecherchees: existing?.competencesRecherchees?.map(c => ({
      competenceId: c.competenceId, obligatoire: c.obligatoire, niveauRequis: c.niveauRequis
    })) || [],
  })
  const [skillSearch, setSkillSearch] = useState('')

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  function addSkill(comp) {
    if (form.competencesRecherchees.length >= 15) return
    if (form.competencesRecherchees.some(c => c.competenceId === comp.id)) return
    set('competencesRecherchees', [...form.competencesRecherchees, { competenceId: comp.id, obligatoire: false, niveauRequis: 'DEBUTANT', _nom: comp.nom }])
    setSkillSearch('')
  }

  function removeSkill(compId) {
    set('competencesRecherchees', form.competencesRecherchees.filter(c => c.competenceId !== compId))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const body = {
      ...form,
      nombrePlacesRecherchees: Number(form.nombrePlacesRecherchees),
      competencesRecherchees: form.competencesRecherchees.map(({ competenceId, obligatoire, niveauRequis }) => ({ competenceId, obligatoire, niveauRequis })),
    }
    try {
      const projet = existing
        ? await projetsApi.modifier(existing.id, body)
        : await projetsApi.creer(body)
      onCreated(projet)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const availableSkills = catalogue.filter(c => !form.competencesRecherchees.some(s => s.competenceId === c.id))
  const filtered = skillSearch ? availableSkills.filter(c => c.nom.toLowerCase().includes(skillSearch.toLowerCase())) : availableSkills.slice(0, 6)
  const inputClass = "w-full bg-dark-2 border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-accent transition"
  const labelClass = "block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5">{error}</div>}

      <div>
        <label className={labelClass}>Project Name *</label>
        <input value={form.nom} onChange={e => set('nom', e.target.value)} required minLength={3} maxLength={100} placeholder="e.g. AgriConnect" className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)} required maxLength={2000} rows={3} placeholder="Describe what the project does..." className={`${inputClass} resize-none`} />
        <p className="text-[10px] text-gray-600 text-right mt-1">{form.description.length} / 2000</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Problem</label>
          <textarea value={form.probleme} onChange={e => set('probleme', e.target.value)} maxLength={1000} rows={2} placeholder="What problem does it solve?" className={`${inputClass} resize-none`} />
        </div>
        <div>
          <label className={labelClass}>Solution</label>
          <textarea value={form.solution} onChange={e => set('solution', e.target.value)} maxLength={1000} rows={2} placeholder="How does it solve it?" className={`${inputClass} resize-none`} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Category</label>
          <input value={form.categorie} onChange={e => set('categorie', e.target.value)} maxLength={100} placeholder="e.g. Agriculture" className={inputClass} list="cat-suggestions" />
          <datalist id="cat-suggestions">
            {CATEGORIES_SUGGESTIONS.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div>
          <label className={labelClass}>Technologies</label>
          <input value={form.technologies} onChange={e => set('technologies', e.target.value)} maxLength={255} placeholder="e.g. Java, Spring Boot, React" className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Status *</label>
          <select value={form.statut} onChange={e => set('statut', e.target.value)} className={`${inputClass} appearance-none`}>
            {Object.entries(STATUT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Team Size Needed *</label>
          <input type="number" value={form.nombrePlacesRecherchees} onChange={e => set('nombrePlacesRecherchees', e.target.value)} min={1} max={20} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Roles Needed</label>
          <input value={form.rolesRecherches} onChange={e => set('rolesRecherches', e.target.value)} maxLength={500} placeholder="e.g. Frontend dev, Designer" className={inputClass} />
        </div>
      </div>

      {/* Required Skills */}
      <div>
        <label className={labelClass}>Required Skills ({form.competencesRecherchees.length}/15)</label>
        {form.competencesRecherchees.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {form.competencesRecherchees.map(s => {
              const comp = catalogue.find(c => c.id === s.competenceId)
              return (
                <div key={s.competenceId} className="inline-flex items-center gap-1.5 bg-dark-2 border border-dark-border rounded-lg px-2.5 py-1 text-xs text-gray-300">
                  <span>{comp?.nom || `#${s.competenceId}`}</span>
                  <select value={s.niveauRequis} onChange={e => {
                    const updated = form.competencesRecherchees.map(c => c.competenceId === s.competenceId ? { ...c, niveauRequis: e.target.value } : c)
                    set('competencesRecherchees', updated)
                  }} className="bg-transparent text-accent text-[10px] border-none outline-none appearance-none cursor-pointer">
                    <option value="DEBUTANT">Junior</option>
                    <option value="INTERMEDIAIRE">Mid</option>
                    <option value="AVANCE">Senior</option>
                  </select>
                  <label className="flex items-center gap-1 text-[10px] text-gray-500 cursor-pointer">
                    <input type="checkbox" checked={s.obligatoire} onChange={e => {
                      const updated = form.competencesRecherchees.map(c => c.competenceId === s.competenceId ? { ...c, obligatoire: e.target.checked } : c)
                      set('competencesRecherchees', updated)
                    }} className="w-2.5 h-2.5 rounded" /> Req
                  </label>
                  <button type="button" onClick={() => removeSkill(s.competenceId)} className="text-gray-600 hover:text-red-400"><X size={12} /></button>
                </div>
              )
            })}
          </div>
        )}
        <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)} placeholder="Search skills to add..." className={inputClass} />
        {skillSearch && (
          <div className="flex flex-wrap gap-2 mt-2">
            {filtered.map(c => (
              <button key={c.id} type="button" onClick={() => addSkill(c)}
                className="text-xs bg-dark-2 text-gray-300 border border-dark-border px-3 py-1 rounded-lg hover:border-accent hover:text-accent transition">
                {c.nom}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-5 py-2.5 rounded-lg border border-dark-border text-gray-400 text-sm font-semibold hover:text-white transition">Cancel</button>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
          {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> {existing ? 'Update Project' : 'Create Project'}</>}
        </button>
      </div>
    </form>
  )
}

function ProjectDetail({ projet, token, catalogue, onBack, onRefresh }) {
  const [editing, setEditing] = useState(false)
  const [changingStatus, setChangingStatus] = useState(false)

  function handleUpdated(updated) {
    onRefresh(updated)
    setEditing(false)
  }

  async function handleStatusChange(newStatut) {
    try {
      const updated = await projetsApi.changerStatut(projet.id, newStatut)
      onRefresh(updated)
    } catch {
      /* ignore */
    }
    setChangingStatus(false)
  }

  const StatusIcon = STATUT_ICONS[projet.statut] || Lightbulb

  return (
    <div>
      {/* Back button */}
      <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-white text-sm mb-6 transition">
        <ChevronLeft size={16} /> Back to Projects
      </button>

      {/* Hero */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-6">
        {editing ? (
          <div>
            <h2 className="text-white text-lg font-bold mb-4">Edit Project</h2>
            <ProjectForm token={token} catalogue={catalogue} existing={projet} onCreated={handleUpdated} onCancel={() => setEditing(false)} />
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-white text-2xl font-bold">{projet.nom}</h1>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${STATUT_COLORS[projet.statut]}`}>
                    <StatusIcon size={12} /> {STATUT_LABELS[projet.statut]}
                  </span>
                </div>
                {projet.categorie && <span className="text-gray-500 text-xs uppercase tracking-wider">{projet.categorie}</span>}
              </div>
              <div className="flex items-center gap-2">
                {projet.estCreateur && (
                  <>
                    <div className="relative">
                      <button onClick={() => setChangingStatus(!changingStatus)}
                        className="px-3 py-2 rounded-lg border border-dark-border text-gray-400 text-xs font-semibold hover:text-white transition">
                        Change Status
                      </button>
                      {changingStatus && (
                        <div className="absolute right-0 top-full mt-1 bg-dark-2 border border-dark-border rounded-lg shadow-xl z-10 py-1 w-48">
                          {Object.entries(STATUT_LABELS).map(([k, v]) => (
                            <button key={k} onClick={() => handleStatusChange(k)}
                              className={`w-full text-left px-3 py-2 text-xs hover:bg-dark-card transition ${projet.statut === k ? 'text-accent font-bold' : 'text-gray-300'}`}>
                              {v}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent/10 text-accent border border-accent/30 text-xs font-semibold hover:bg-accent/20 transition">
                      <Pencil size={14} /> Edit
                    </button>
                  </>
                )}
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{projet.description}</p>

            {(projet.probleme || projet.solution) && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {projet.probleme && (
                  <div className="bg-dark-2 rounded-lg p-4 border border-dark-border">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Problem</p>
                    <p className="text-gray-300 text-sm">{projet.probleme}</p>
                  </div>
                )}
                {projet.solution && (
                  <div className="bg-dark-2 rounded-lg p-4 border border-dark-border">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-1">Solution</p>
                    <p className="text-gray-300 text-sm">{projet.solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Users size={14} /> {projet.membres?.length || 0} members</span>
              <span>{projet.placesRestantes} spot{projet.placesRestantes !== 1 ? 's' : ''} left</span>
              {projet.technologies && <span>Tech: <span className="text-gray-300">{projet.technologies}</span></span>}
              {projet.dateCreation && <span className="flex items-center gap-1"><Clock size={12} /> {new Date(projet.dateCreation).toLocaleDateString()}</span>}
            </div>
          </>
        )}
      </div>

      {!editing && (
        <div className="grid grid-cols-2 gap-6">
          {/* Team Members */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-white font-bold text-sm mb-4">Team Members</h3>
            {projet.membres?.length > 0 ? (
              <div className="space-y-3">
                {projet.membres.map(m => (
                  <div key={m.utilisateurId} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent text-xs font-bold">
                      {(m.prenom?.[0] || '') + (m.nom?.[0] || '')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{m.pseudo || m.prenom}</p>
                      <p className="text-gray-500 text-[10px]">{m.pays || ''}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${m.roleMembre === 'CREATEUR' ? 'text-accent' : 'text-gray-500'}`}>
                      {m.roleMembre === 'CREATEUR' ? 'Creator' : 'Member'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No members yet.</p>
            )}
            {projet.rolesRecherches && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Roles Needed</p>
                <p className="text-gray-300 text-sm">{projet.rolesRecherches}</p>
              </div>
            )}
          </div>

          {/* Required Skills */}
          <div className="bg-dark-card border border-dark-border rounded-xl p-6">
            <h3 className="text-white font-bold text-sm mb-4">Required Skills</h3>
            {projet.competencesRecherchees?.length > 0 ? (
              <div className="space-y-2">
                {projet.competencesRecherchees.map(c => (
                  <div key={c.competenceId} className="flex items-center justify-between bg-dark-2 rounded-lg px-3 py-2 border border-dark-border">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">{c.nom}</span>
                      <span className="text-gray-600 text-[10px]">{c.categorie}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-accent text-[10px] font-semibold">{NIVEAU_LABELS[c.niveauRequis]}</span>
                      {c.obligatoire && <span className="text-red-400 text-[10px] font-bold">Required</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600 text-sm">No specific skills required.</p>
            )}

            {/* Creator info */}
            {projet.createur && (
              <div className="mt-4 pt-4 border-t border-dark-border">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-2">Created By</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {(projet.createur.prenom?.[0] || '')}
                  </div>
                  <span className="text-gray-300 text-sm">{projet.createur.pseudo || projet.createur.prenom}</span>
                  {projet.createur.pays && <span className="text-gray-600 text-xs flex items-center gap-1"><MapPin size={10} />{projet.createur.pays}</span>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProjectsView({ token }) {
  const [view, setView] = useState('list')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [catalogue, setCatalogue] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    competencesApi.lister().then(setCatalogue).catch(() => setCatalogue([]))
  }, [token])

  useEffect(() => {
    if (!token) return
    projetsApi
      .mesProjets()
      .then(setProjects)
      .finally(() => setLoading(false))
  }, [token])

  function handleCreated(projet) {
    setProjects(prev => [projet, ...prev])
    setSelectedProject(projet)
    setView('detail')
  }

  function handleRefresh(updated) {
    setSelectedProject(updated)
    setProjects(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  if (view === 'create') {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Create Project</h1>
          <p className="text-gray-400 text-sm">Create a new CADEV 2026 project and find your team.</p>
        </div>
        <div className="bg-dark-card border border-dark-border rounded-xl p-6">
          <ProjectForm token={token} catalogue={catalogue} onCreated={handleCreated} onCancel={() => setView('list')} />
        </div>
      </div>
    )
  }

  if (view === 'detail' && selectedProject) {
    return <ProjectDetail projet={selectedProject} token={token} catalogue={catalogue} onBack={() => setView('list')} onRefresh={handleRefresh} />
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">My Projects</h1>
          <p className="text-gray-400 text-sm">Manage your CADEV 2026 projects.</p>
        </div>
        <button onClick={() => setView('create')}
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
          <Plus size={16} /> Create Project
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-accent" />
        </div>
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {projects.map(p => {
            const StatusIcon = STATUT_ICONS[p.statut] || Lightbulb
            return (
              <button key={p.id} onClick={() => { setSelectedProject(p); setView('detail') }}
                className="bg-dark-card border border-dark-border rounded-xl p-5 text-left hover:border-accent/50 transition group">
                <div className="flex items-start justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-bold text-sm truncate group-hover:text-accent transition">{p.nom}</h3>
                    {p.categorie && <span className="text-gray-500 text-[10px] uppercase tracking-wider">{p.categorie}</span>}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold shrink-0 ml-2 ${STATUT_COLORS[p.statut]}`}>
                    <StatusIcon size={10} /> {STATUT_LABELS[p.statut]}
                  </span>
                </div>
                <p className="text-gray-400 text-xs line-clamp-2 mb-3">{p.description}</p>
                <div className="flex items-center gap-4 text-[10px] text-gray-500">
                  <span><Users size={12} className="inline mr-1" />{p.membres?.length || 0} members</span>
                  <span>{p.placesRestantes} spot{p.placesRestantes !== 1 ? 's' : ''} open</span>
                  {p.technologies && <span className="truncate">{p.technologies}</span>}
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-xl p-12 text-center">
          <Rocket size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-1">No projects yet</p>
          <p className="text-gray-600 text-xs mb-4">Create your first CADEV 2026 project.</p>
          <button onClick={() => setView('create')}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition">
            <Plus size={16} /> Create Project
          </button>
        </div>
      )}
    </div>
  )
}
