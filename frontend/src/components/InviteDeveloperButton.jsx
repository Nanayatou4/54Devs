import { useEffect, useState } from 'react'
import { Loader2, Send, X } from 'lucide-react'
import { projetsApi } from '../api'

function normalizeList(value) {
  if (Array.isArray(value)) return value
  return value?.contenu || value?.content || []
}

export default function InviteDeveloperButton({ developer, className = '' }) {
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [projectId, setProjectId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (!open || projects.length) return
    setLoading(true)
    projetsApi.mesProjets()
      .then(result => {
        const eligible = normalizeList(result).filter(p => p.roleMembre === 'CREATEUR' && p.ouvertAuxDemandes)
        setProjects(eligible)
        setProjectId(String(eligible[0]?.id || ''))
      })
      .catch(err => setError(err.message || 'Impossible de charger vos projets.'))
      .finally(() => setLoading(false))
  }, [open, projects.length])

  async function submit(event) {
    event.preventDefault()
    if (!projectId) return
    setSending(true)
    setError('')
    setSuccess('')
    try {
      await projetsApi.inviter(projectId, {
        utilisateurId: developer.utilisateurId,
        ...(message.trim() ? { message: message.trim() } : {}),
      })
      setSuccess('Invitation envoyée.')
      setMessage('')
    } catch (err) {
      setError(err.message || 'Impossible d’envoyer cette invitation.')
    } finally {
      setSending(false)
    }
  }

  return <>
    <button type="button" onClick={() => { setOpen(true); setError(''); setSuccess('') }} className={className || 'inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2 text-xs font-bold text-black hover:bg-[#D8F87C]'}>
      <Send size={14} /> Inviter
    </button>
    {open && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 p-4" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setOpen(false) }}>
      <section role="dialog" aria-modal="true" aria-labelledby="invite-title" className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111A15] p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div><p className="text-xs font-mono uppercase tracking-widest text-[#C9F06A]">Invitation de projet</p><h2 id="invite-title" className="mt-1 text-xl font-bold text-white">Inviter {developer.pseudo || developer.prenom || 'ce développeur'}</h2></div>
          <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white"><X size={18} /></button>
        </div>
        {loading ? <div className="py-8 text-center text-sm text-white/60"><Loader2 className="mr-2 inline animate-spin" size={18} />Chargement des projets…</div> : projects.length ? <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm font-semibold text-white">Projet
            <select value={projectId} onChange={e => setProjectId(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#18251E] px-4 py-3 text-sm text-white outline-none focus:border-[#C9F06A]/50">
              {projects.map(project => <option key={project.id} value={project.id}>{project.nom}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-white">Message <span className="font-normal text-white/40">(facultatif)</span>
            <textarea value={message} onChange={e => setMessage(e.target.value)} maxLength={500} rows={4} placeholder="Présentez le projet et expliquez pourquoi son profil vous intéresse…" className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#18251E] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#C9F06A]/50" />
            <span className="mt-1 block text-right text-xs text-white/40">{message.length}/500</span>
          </label>
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">{error}</p>}
          {success && <p role="status" className="rounded-xl border border-[#C9F06A]/20 bg-[#C9F06A]/10 p-3 text-sm text-[#C9F06A]">{success}</p>}
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70">Fermer</button><button disabled={sending || !projectId} className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2.5 text-sm font-bold text-black disabled:opacity-50">{sending && <Loader2 size={15} className="animate-spin" />}Envoyer l’invitation</button></div>
        </form> : <div><p className="text-sm text-white/60">Vous devez être créateur d’au moins un projet ouvert pour envoyer une invitation.</p>{error && <p role="alert" className="mt-3 text-sm text-red-300">{error}</p>}<button type="button" onClick={() => setOpen(false)} className="mt-5 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70">Fermer</button></div>}
      </section>
    </div>}
  </>
}
