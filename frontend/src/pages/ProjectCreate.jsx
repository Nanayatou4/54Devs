import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight, Save, X, Loader2, Code, Rocket, Users, CheckCircle,
  MapPin, ExternalLink,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ApiError, competencesApi, getToken, projetsApi } from '../api'

const CATEGORIES = ['Agriculture', 'Education', 'FinTech', 'HealthTech', 'E-Commerce', 'Logistics', 'GreenTech', 'GovTech']
const STATUT_LABELS = {
  IDEE: 'Idea', EN_DEVELOPPEMENT: 'In Development', EN_LANCEMENT: 'Launching',
  TERMINE: 'Completed', EN_PAUSE: 'On Pause',
}

export default function ProjectCreate() {
  const navigate = useNavigate()
  const token = getToken()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [catalogue, setCatalogue] = useState([])
  const [createdProject, setCreatedProject] = useState(null)

  const [form, setForm] = useState({
    type: 'open-source',
    nom: '',
    pitch: '',
    description: '',
    categorie: '',
    technologies: '',
    statut: 'IDEE',
    nombrePlacesRecherchees: 3,
    rolesRecherches: '',
    competencesRecherchees: [],
  })

  useEffect(() => {
    if (!token) return
    competencesApi.lister().then(setCatalogue).catch(() => {})
  }, [token])

  function set(field, value) { setForm(prev => ({ ...prev, [field]: value })) }

  async function handleSubmit() {
    setSaving(true)
    setError('')

    const nom = (form.nom || '').trim()
    const description = (form.description || form.pitch || '').trim()

    if (nom.length < 3) {
      setError('Le nom du projet doit contenir au moins 3 caractères.')
      setSaving(false)
      return
    }
    if (!description) {
      setError('Veuillez fournir une description ou un pitch.')
      setSaving(false)
      return
    }
    if (!token) {
      setError('Vous devez être connecté pour créer un projet.')
      setSaving(false)
      return
    }

    try {
      const projet = await projetsApi.creer({
        nom,
        description,
        probleme: (form.pitch || '').trim() || null,
        solution: '',
        categorie: form.categorie || null,
        technologies: form.technologies || null,
        statut: form.statut,
        nombrePlacesRecherchees: Math.max(1, Number(form.nombrePlacesRecherchees) || 1),
        rolesRecherches: form.rolesRecherches || null,
        competencesRecherchees: form.competencesRecherchees.map(({ competenceId, obligatoire, niveauRequis }) => ({
          competenceId, obligatoire, niveauRequis,
        })),
      })

      setCreatedProject(projet)
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        setError(err.message)
      } else {
        setError(err.message || 'Une erreur inattendue est survenue.')
      }
      setSaving(false)
    }
  }

  // ---------- SUCCESS VIEW ----------
  if (createdProject) {
    const p = createdProject
    const techs = (p.technologies || '').split(',').filter(Boolean)

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="bg-green/10 border border-green/30 rounded-xl p-4 flex items-center gap-3 mb-8">
            <CheckCircle size={20} className="text-green shrink-0" />
            <p className="text-green font-semibold text-sm">Project created successfully! Review the details below and publish when ready.</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative">
              <Rocket size={48} className="text-primary/30" />
              {p.categorie && (
                <span className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                  {p.categorie}
                </span>
              )}
              <span className="absolute top-4 right-4 bg-white/90 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {STATUT_LABELS[p.statut] || p.statut}
              </span>
            </div>

            <div className="p-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{p.nom}</h1>
              <p className="text-gray-500 leading-relaxed mb-6">{p.description}</p>

              {p.probleme && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">Problem</h3>
                  <p className="text-gray-600 text-sm">{p.probleme}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Users size={18} className="text-primary mx-auto mb-1" />
                  <span className="text-lg font-bold text-gray-900 block">{p.nombrePlacesRecherchees}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Team Size</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <span className="text-lg font-bold text-primary block">{p.placesRestantes ?? p.nombrePlacesRecherchees}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Spots Open</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <span className="text-lg font-bold text-gray-900 block">{p.membres?.length || 1}</span>
                  <span className="text-gray-400 text-[10px] uppercase tracking-wider font-bold">Members</span>
                </div>
              </div>

              {techs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {techs.map(t => (
                      <span key={t.trim()} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-medium">{t.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {p.rolesRecherches && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Roles Needed</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.rolesRecherches.split(',').map(r => (
                      <span key={r.trim()} className="border border-gray-200 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium">{r.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {p.competencesRecherchees?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.competencesRecherchees.map(c => (
                      <span key={c.competenceId} className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-lg font-medium">
                        {c.nom || `Skill #${c.competenceId}`}
                        {c.obligatoire && <span className="ml-1 text-red-500">*</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <Link
                  to={`/projects/${p.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                  <ExternalLink size={16} /> View Published Project
                </Link>
                <Link
                  to="/projects"
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Browse All Projects
                </Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ---------- CREATION FORM ----------
  const inputClass = 'w-full border-b border-gray-300 px-1 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary transition bg-transparent'
  const labelClass = 'block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-gray-900">54<span className="font-extrabold">Devs</span></Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Step {step} of 3: {step === 1 ? 'Core Details' : step === 2 ? 'Team & Stack' : 'Review'}</span>
            <Link to="/projects" className="text-gray-400 hover:text-gray-600"><X size={20} /></Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${
                s <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
              }`}>{s}</div>
              {i < 2 && <div className={`w-32 h-0.5 mx-2 ${s < step ? 'bg-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-10 shadow-sm">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-6">{error}</div>}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Launch Your Initiative</h2>
              <p className="text-gray-500 mb-8">Tell us what you're building. Every unicorn starts with a single line of code and a clear mission.</p>

              <div className="mb-8">
                <label className={labelClass}>Project Type</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button type="button" onClick={() => set('type', 'open-source')}
                    className={`p-5 rounded-xl border-2 text-left transition ${form.type === 'open-source' ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Code size={20} className={form.type === 'open-source' ? 'text-primary mb-3' : 'text-gray-400 mb-3'} />
                    <h4 className="font-semibold text-gray-900 text-sm">Open Source</h4>
                    <p className="text-gray-500 text-xs mt-1">Public repository for community collaboration.</p>
                  </button>
                  <button type="button" onClick={() => set('type', 'startup-lab')}
                    className={`p-5 rounded-xl border-2 text-left transition ${form.type === 'startup-lab' ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-gray-300'}`}>
                    <Rocket size={20} className={form.type === 'startup-lab' ? 'text-primary mb-3' : 'text-gray-400 mb-3'} />
                    <h4 className="font-semibold text-gray-900 text-sm">Startup Lab</h4>
                    <p className="text-gray-500 text-xs mt-1">Proprietary venture seeking co-founders.</p>
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Project Name</label>
                <input value={form.nom} onChange={e => set('nom', e.target.value)} placeholder="e.g. NilePay, SaharaAI..." className={inputClass} required />
              </div>

              <div className="mb-6">
                <label className={labelClass}>One-Line Pitch</label>
                <input value={form.pitch} onChange={e => set('pitch', e.target.value)} placeholder="What does it do in 10 words or less?" className={inputClass} />
              </div>

              <div className="mb-8">
                <label className={labelClass}>Deep Dive</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Explain the problem you're solving and why it matters for the continent..."
                  rows={4} className={`${inputClass} resize-none`} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Team & Tech Stack</h2>
              <p className="text-gray-500 mb-8">Define who you need and what tools you'll use.</p>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelClass}>Category</label>
                  <select value={form.categorie} onChange={e => set('categorie', e.target.value)} className={`${inputClass} appearance-none`}>
                    <option value="">Select...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Team Size Needed</label>
                  <input type="number" value={form.nombrePlacesRecherchees} onChange={e => set('nombrePlacesRecherchees', e.target.value)} min={1} max={20} className={inputClass} />
                </div>
              </div>

              <div className="mb-6">
                <label className={labelClass}>Technologies</label>
                <input value={form.technologies} onChange={e => set('technologies', e.target.value)} placeholder="e.g. React, Spring Boot, PostgreSQL" className={inputClass} />
              </div>

              <div className="mb-6">
                <label className={labelClass}>Roles Needed</label>
                <input value={form.rolesRecherches} onChange={e => set('rolesRecherches', e.target.value)} placeholder="e.g. Frontend Dev, Designer, DevOps" className={inputClass} />
              </div>

              <div className="mb-8">
                <label className={labelClass}>Required Skills</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {catalogue.slice(0, 12).map(c => {
                    const selected = form.competencesRecherchees.some(s => s.competenceId === c.id)
                    return (
                      <button key={c.id} type="button" onClick={() => {
                        if (selected) set('competencesRecherchees', form.competencesRecherchees.filter(s => s.competenceId !== c.id))
                        else if (form.competencesRecherchees.length < 15) set('competencesRecherchees', [...form.competencesRecherchees, { competenceId: c.id, obligatoire: false, niveauRequis: 'DEBUTANT' }])
                      }} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                        selected ? 'border-primary bg-primary-light text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>
                        {c.nom}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Submit</h2>
              <p className="text-gray-500 mb-8">Everything looks good? Let's launch your initiative.</p>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Project Name</span>
                  <p className="text-gray-900 font-semibold mt-1">{form.nom || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Pitch</span>
                  <p className="text-gray-900 mt-1">{form.pitch || '—'}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Description</span>
                  <p className="text-gray-600 text-sm mt-1">{form.description || form.pitch || '—'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Category</span>
                    <p className="text-gray-900 mt-1">{form.categorie || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Team Size</span>
                    <p className="text-gray-900 mt-1">{form.nombrePlacesRecherchees}</p>
                  </div>
                </div>
                {form.technologies && (
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Technologies</span>
                    <p className="text-gray-900 mt-1">{form.technologies}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-10 pt-6 border-t border-gray-100">
            {step > 1 ? (
              <button onClick={() => setStep(step - 1)} className="text-gray-600 font-semibold text-sm hover:text-gray-900 transition">
                Back
              </button>
            ) : (
              <button onClick={() => navigate('/projects')} className="text-gray-500 font-semibold text-sm hover:text-gray-700 transition">
                Cancel
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} disabled={step === 1 && !form.nom}
                className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white px-6 py-3 rounded-lg font-semibold text-sm transition">
                Next: {step === 1 ? 'Team & Stack' : 'Review'} <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving || !form.nom}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-40 text-white px-6 py-3 rounded-lg font-semibold text-sm transition">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <><Save size={16} /> Launch Project</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
