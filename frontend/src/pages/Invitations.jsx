import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock3, FolderGit2, Loader2, Mail, MessageSquare, ShieldCheck, Sparkles, XCircle } from 'lucide-react'
import { invitationsApi } from '../api'
import Avatar from '../components/Avatar'

function dateLabel(value) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(date)
}

export default function Invitations() {
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [errors, setErrors] = useState({})
  const [accepted, setAccepted] = useState({})
  const [busy, setBusy] = useState({})

  const load = useCallback(() => {
    setLoading(true)
    setPageError('')
    invitationsApi
      .mesInvitations('EN_ATTENTE')
      .then((data) => setInvitations(Array.isArray(data) ? data : []))
      .catch((err) => setPageError(err.message || 'Impossible de charger vos invitations.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function respond(invitation, decision) {
    const id = invitation.id
    setErrors((old) => ({ ...old, [id]: '' }))
    setBusy((old) => ({ ...old, [id]: true }))
    try {
      await invitationsApi.repondre(id, decision, accepted[id])
      setInvitations((old) => old.filter((item) => item.id !== id))
    } catch (err) {
      setErrors((old) => ({ ...old, [id]: err.message || 'Impossible de répondre à cette invitation.' }))
    } finally {
      setBusy((old) => ({ ...old, [id]: false }))
    }
  }

  const count = invitations.length

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C9F06A]/30 bg-[#C9F06A]/10 text-xs font-bold uppercase tracking-[0.2em] text-[#C9F06A] mb-3">
              <Sparkles size={12} />
              <span>// Collaborations</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Mes invitations
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Découvrez les propositions reçues de la part des porteurs de projets et rejoignez les équipes de la communauté.
            </p>
          </div>

          {!loading && count > 0 && (
            <div className="rounded-2xl border border-[#C9F06A]/30 bg-[#16221C] px-5 py-3 text-right shadow-lg">
              <span className="text-2xl font-black text-[#C9F06A] font-display block">
                {count}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-white/50 font-mono">
                Invitation{count > 1 ? 's' : ''} en attente
              </span>
            </div>
          )}
        </div>
      </header>

      {pageError && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200"
        >
          <span>{pageError}</span>
          <button onClick={load} className="font-semibold underline hover:text-white transition">
            Réessayer
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-24 text-center text-sm text-white/50 font-mono">
          <Loader2 className="mr-2 inline animate-spin text-[#C9F06A]" size={22} />
          Chargement de vos invitations...
        </div>
      ) : count > 0 ? (
        <div className="space-y-5">
          {invitations.map((invitation) => {
            const unavailable = !invitation.ouvertAuxDemandes
            const inviterName =
              invitation.invitePar?.pseudo ||
              [invitation.invitePar?.prenom, invitation.invitePar?.nom].filter(Boolean).join(' ') ||
              'Porteur de projet'

            return (
              <article
                key={invitation.id}
                className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#141B18] via-[#111714] to-[#0D1210] p-6 sm:p-7 shadow-xl transition-all duration-300 hover:border-[#C9F06A]/30"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-white/10 pb-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#C9F06A]/10 border border-[#C9F06A]/30 flex items-center justify-center text-[#C9F06A] shrink-0">
                      <FolderGit2 size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#C9F06A] font-semibold">
                          Reçu le {dateLabel(invitation.dateInvitation) || 'récemment'}
                        </span>
                        {invitation.statut && (
                          <span className="rounded-full bg-[#C9F06A]/20 px-2.5 py-0.5 text-[10px] font-bold uppercase text-[#C9F06A] border border-[#C9F06A]/40">
                            En attente
                          </span>
                        )}
                      </div>
                      <h2 className="mt-1 text-xl sm:text-2xl font-bold text-white font-display">
                        {invitation.projetNom || 'Projet 54Devs'}
                      </h2>
                      <div className="mt-1 flex items-center gap-2 text-xs text-white/60">
                        <Avatar
                          src={invitation.invitePar?.avatarUrl}
                          name={inviterName}
                          className="w-5 h-5 rounded-full text-[10px]"
                        />
                        <span>
                          Invité par <strong className="text-white font-semibold">{inviterName}</strong>
                          {invitation.invitePar?.pays && ` (${invitation.invitePar.pays})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {unavailable && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-3.5 py-1 text-xs font-semibold text-amber-200">
                      <Clock3 size={14} />
                      {invitation.statutProjet === 'TERMINE' ? 'Projet terminé' : 'Projet complet'}
                    </span>
                  )}
                </div>

                {/* Message from Creator */}
                {invitation.message && (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-[#16201B]/80 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C9F06A] mb-1.5">
                      <MessageSquare size={13} />
                      <span>Message du porteur</span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/85 font-body">
                      « {invitation.message} »
                    </p>
                  </div>
                )}

                {/* Engagement conditions */}
                {invitation.conditionsEngagement && (
                  <div className="mt-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-300 mb-1">
                      <ShieldCheck size={14} />
                      <span>Charte et conditions d’engagement</span>
                    </div>
                    <p className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-white/75 font-body">
                      {invitation.conditionsEngagement}
                    </p>
                  </div>
                )}

                {/* Checkbox confirmation */}
                <label
                  className={`mt-5 flex items-start gap-3 rounded-xl border border-white/5 bg-black/20 p-3 text-sm cursor-pointer transition ${
                    unavailable ? 'opacity-40 cursor-not-allowed' : 'hover:border-white/20'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(accepted[invitation.id])}
                    disabled={unavailable}
                    onChange={(e) =>
                      setAccepted((old) => ({ ...old, [invitation.id]: e.target.checked }))
                    }
                    className="mt-0.5 h-4 w-4 rounded accent-[#C9F06A]"
                  />
                  <span className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    Je m’engage à contribuer activement à ce projet et à respecter l'équipe jusqu’à sa finalisation.
                  </span>
                </label>

                {errors[invitation.id] && (
                  <p role="alert" className="mt-3 text-xs text-red-300">
                    {errors[invitation.id]}
                  </p>
                )}

                {/* Actions row */}
                <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={() => respond(invitation, 'ACCEPTEE')}
                    disabled={busy[invitation.id] || unavailable || !accepted[invitation.id]}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_4px_16px_rgba(201,240,106,0.35)] transition hover:bg-[#D8F87C] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {busy[invitation.id] ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <CheckCircle2 size={16} />
                    )}
                    <span>Accepter l'invitation</span>
                  </button>

                  <button
                    onClick={() => respond(invitation, 'REFUSEE')}
                    disabled={busy[invitation.id]}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-white/70 hover:bg-white/10 transition disabled:opacity-40"
                  >
                    <XCircle size={15} />
                    <span>Décliner</span>
                  </button>

                  {invitation.projetId && (
                    <Link
                      to={`/projects/${invitation.projetId}`}
                      className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#C9F06A] hover:underline"
                    >
                      <span>Découvrir la fiche projet</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        !pageError && (
          <div className="rounded-3xl border border-dashed border-white/15 bg-[#12161A]/50 p-16 text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-4">
              <Mail size={26} />
            </div>
            <h3 className="text-lg font-bold text-white font-display">
              Aucune invitation en attente
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              Lorsqu'un créateur de projet recherche vos compétences et souhaite vous intégrer à son équipe, son invitation apparaîtra ici.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black hover:bg-[#D8F87C]"
              >
                <span>Explorer les projets</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )
      )}
    </main>
  )
}
