import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, FolderGit2, Loader2, Send, Sparkles, UserPlus, X, AlertCircle } from 'lucide-react'
import { getStoredUser, projetsApi } from '../api'
import Avatar from './Avatar'

function normalizeList(value) {
  if (Array.isArray(value)) return value
  return value?.contenu || value?.content || []
}

function getDeveloperName(dev) {
  return dev?.pseudo || [dev?.prenom, dev?.nom].filter(Boolean).join(' ') || 'Développeur'
}

export default function InviteDeveloperButton({
  developer,
  className = '',
  defaultProjectId = null,
  onSuccess = null,
  label = 'Inviter',
  compact = false,
}) {
  const [open, setOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [projectId, setProjectId] = useState(defaultProjectId ? String(defaultProjectId) : '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const me = getStoredUser()
  const targetId = developer?.utilisateurId || developer?.id

  // Don't allow inviting oneself
  if (me && targetId && String(me.id) === String(targetId)) {
    return null
  }

  const devName = getDeveloperName(developer)
  const devSkills = developer?.competencesMaitrisees || (developer?.competences || []).map((c) => c.nom || c)

  useEffect(() => {
    if (!open || projects.length) return
    setLoading(true)
    setError('')
    projetsApi
      .mesProjets()
      .then((result) => {
        const list = normalizeList(result)
        const eligible = list.filter((p) => p.roleMembre === 'CREATEUR' && p.ouvertAuxDemandes)
        setProjects(eligible)
        if (defaultProjectId && eligible.some((p) => String(p.id) === String(defaultProjectId))) {
          setProjectId(String(defaultProjectId))
        } else if (eligible.length > 0) {
          setProjectId(String(eligible[0].id))
        }
      })
      .catch((err) => setError(err.message || 'Impossible de charger vos projets.'))
      .finally(() => setLoading(false))
  }, [open, projects.length, defaultProjectId])

  async function submit(event) {
    event.preventDefault()
    if (!projectId || !targetId) return
    setSending(true)
    setError('')
    setSuccess('')
    try {
      await projetsApi.inviter(projectId, {
        utilisateurId: Number(targetId),
        ...(message.trim() ? { message: message.trim() } : {}),
      })
      const selectedProj = projects.find((p) => String(p.id) === String(projectId))
      setSuccess(`Invitation envoyée avec succès à ${devName} pour rejoindre "${selectedProj?.nom || 'votre projet'}" !`)
      setMessage('')
      if (onSuccess) onSuccess()
      setTimeout(() => {
        setOpen(false)
        setSuccess('')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Impossible d’envoyer cette invitation.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
          setError('')
          setSuccess('')
        }}
        className={
          className ||
          (compact
            ? 'inline-flex items-center gap-1.5 rounded-xl border border-[#C9F06A]/30 bg-[#C9F06A]/10 px-3 py-1.5 text-xs font-bold text-[#C9F06A] transition hover:bg-[#C9F06A] hover:text-black'
            : 'inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_4px_16px_rgba(201,240,106,0.35)] transition-all hover:bg-[#D8F87C] hover:scale-[1.02]')
        }
      >
        <UserPlus size={compact ? 13 : 15} />
        <span>{label}</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/80 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !sending) setOpen(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invite-title"
            className="w-full max-w-3xl rounded-3xl border border-white/10 bg-[#12161A] p-5 sm:p-7 shadow-2xl relative my-auto"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between gap-4 border-b border-white/10 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C9F06A]/10 border border-[#C9F06A]/30 flex items-center justify-center text-[#C9F06A]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#C9F06A]">
                    Proposition de collaboration
                  </p>
                  <h2 id="invite-title" className="text-lg sm:text-xl font-bold text-white font-display">
                    Inviter {devName} dans un projet
                  </h2>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={sending}
                aria-label="Fermer"
                className="rounded-xl p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-sm text-white/60 font-mono">
                <Loader2 className="mr-2 inline animate-spin text-[#C9F06A]" size={20} />
                Vérification de vos projets ouverts...
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-start">
                
                {/* Left Column: Developer Summary (2 cols) */}
                <div className="md:col-span-2 rounded-2xl border border-white/10 bg-[#18201D] p-4 flex flex-col justify-between self-stretch">
                  <div>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={developer.avatarUrl || developer.photoUrl}
                        name={devName}
                        className="w-12 h-12 rounded-xl text-sm shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white truncate text-base font-display">
                          {devName}
                        </h3>
                        {developer.pays && (
                          <span className="text-xs text-white/50 font-mono flex items-center gap-1">
                            🌍 {developer.pays}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40 uppercase font-mono text-[10px]">Niveau</span>
                        <span className="font-bold text-[#C9F06A] font-mono uppercase text-[11px]">
                          {developer.niveau || 'Intermédiaire'}
                        </span>
                      </div>
                      {developer.disponibilite && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-white/40 uppercase font-mono text-[10px]">Disponibilité</span>
                          <span className="text-white/80 font-mono text-[11px]">
                            {developer.disponibilite}
                          </span>
                        </div>
                      )}
                    </div>

                    {devSkills && devSkills.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-[10px] uppercase font-mono text-white/40 mb-1.5">Compétences</p>
                        <div className="flex flex-wrap gap-1">
                          {devSkills.slice(0, 5).map((s) => (
                            <span
                              key={s}
                              className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-mono text-white/80 border border-white/10"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 rounded-xl bg-white/5 border border-white/5 p-2.5">
                    <p className="text-[11px] text-white/50 leading-relaxed">
                      💡 Le développeur recevra votre invitation et pourra l'accepter ou la décliner depuis son espace.
                    </p>
                  </div>
                </div>

                {/* Right Column: Input Fields (3 cols) */}
                <form onSubmit={submit} className="md:col-span-3 space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                      Projet d'accueil
                    </label>
                    <div className="relative">
                      <select
                        value={projectId}
                        onChange={(e) => setProjectId(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-white/15 bg-[#171D1B] px-3.5 py-2.5 text-sm text-white outline-none focus:border-[#C9F06A] focus:ring-1 focus:ring-[#C9F06A]"
                      >
                        {projects.map((project) => (
                          <option key={project.id} value={project.id} className="bg-[#12161A] text-white">
                            {project.nom} ({project.nombrePlacesRestantes != null ? `${project.nombrePlacesRestantes} places dispo` : 'Ouvert'})
                          </option>
                        ))}
                      </select>
                      <FolderGit2
                        size={15}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-white/70">
                        Message personnalisé <span className="font-normal lowercase text-white/40">(facultatif)</span>
                      </label>
                      <span className="text-[10px] font-mono text-white/40">{message.length}/500</span>
                    </div>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={500}
                      rows={3}
                      placeholder={`Bonjour ${devName}, je souhaiterais t'inviter à collaborer sur ce projet...`}
                      className="w-full resize-none rounded-xl border border-white/15 bg-[#171D1B] p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#C9F06A] focus:ring-1 focus:ring-[#C9F06A]"
                    />
                  </div>

                  {error && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-200"
                    >
                      <AlertCircle size={15} className="shrink-0 text-red-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div
                      role="status"
                      className="flex items-center gap-2 rounded-xl border border-[#C9F06A]/30 bg-[#C9F06A]/10 p-3 text-xs text-[#C9F06A] font-semibold"
                    >
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      disabled={sending}
                      className="rounded-xl border border-white/15 px-3.5 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 transition"
                    >
                      Fermer
                    </button>
                    <button
                      type="submit"
                      disabled={sending || !projectId}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2 text-xs font-bold uppercase tracking-wider text-black shadow-lg hover:bg-[#D8F87C] disabled:opacity-40 transition"
                    >
                      {sending ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Envoi...</span>
                        </>
                      ) : (
                        <>
                          <Send size={13} />
                          <span>Envoyer l’invitation</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

              </div>
            ) : (
              /* Empty state */
              <div className="rounded-2xl border border-dashed border-white/15 bg-[#171D1B] p-6 text-center">
                <FolderGit2 className="mx-auto text-white/40 mb-3" size={32} />
                <h4 className="text-sm font-bold text-white font-display">
                  Aucun projet ouvert disponible
                </h4>
                <p className="text-xs text-white/60 mt-1.5 leading-relaxed">
                  Pour inviter un développeur, vous devez être le créateur d'au moins un projet ouvert aux nouvelles candidatures.
                </p>
                {error && <p className="mt-3 text-xs text-red-300">{error}</p>}
                <div className="mt-5 flex justify-center gap-3">
                  <Link
                    to="/projects/new"
                    onClick={() => setOpen(false)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2 text-xs font-bold text-black hover:bg-[#D8F87C]"
                  >
                    <Sparkles size={13} />
                    <span>Créer un projet</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/15 px-4 py-2 text-xs text-white/70 hover:bg-white/10"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}
