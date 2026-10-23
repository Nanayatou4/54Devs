import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Clock3, Loader2, XCircle } from 'lucide-react'
import { invitationsApi } from '../api'

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
    invitationsApi.mesInvitations('EN_ATTENTE')
      .then(data => setInvitations(Array.isArray(data) ? data : []))
      .catch(err => setPageError(err.message || 'Impossible de charger vos invitations.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  async function respond(invitation, decision) {
    const id = invitation.id
    setErrors(old => ({ ...old, [id]: '' }))
    setBusy(old => ({ ...old, [id]: true }))
    try {
      await invitationsApi.repondre(id, decision, accepted[id])
      setInvitations(old => old.filter(item => item.id !== id))
    } catch (err) {
      setErrors(old => ({ ...old, [id]: err.message || 'Impossible de répondre à cette invitation.' }))
    } finally {
      setBusy(old => ({ ...old, [id]: false }))
    }
  }

  return <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
    <header className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#C9F06A]">Collaborations</p>
      <h1 className="mt-2 text-3xl font-extrabold text-white">Mes invitations</h1>
      <p className="mt-2 text-sm text-white/55">Les créateurs de projet peuvent vous proposer de rejoindre leur équipe.</p>
    </header>
    {pageError && <div role="alert" className="mb-5 flex items-center justify-between rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300"><span>{pageError}</span><button onClick={load} className="font-semibold underline">Réessayer</button></div>}
    {loading ? <div className="py-20 text-center text-sm text-white/50"><Loader2 className="mr-2 inline animate-spin" size={18} />Chargement…</div> : invitations.length ? <div className="space-y-4">
      {invitations.map(invitation => {
        const unavailable = !invitation.ouvertAuxDemandes
        return <article key={invitation.id} className="rounded-3xl border border-white/10 bg-[#141E19] p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-mono text-[#C9F06A]">Invitation reçue{invitation.dateInvitation ? ` · ${dateLabel(invitation.dateInvitation)}` : ''}</p>
              <h2 className="mt-2 text-xl font-bold text-white">{invitation.projetNom || 'Projet'}</h2>
              <p className="mt-1 text-sm text-white/55">Proposé par {invitation.invitePar?.pseudo || [invitation.invitePar?.prenom, invitation.invitePar?.nom].filter(Boolean).join(' ') || 'un membre'}{invitation.invitePar?.pays ? ` · ${invitation.invitePar.pays}` : ''}</p>
            </div>
            {unavailable && <span className="inline-flex items-center gap-1 self-start rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200"><Clock3 size={13} />{invitation.statutProjet === 'TERMINE' ? 'Terminé' : 'Complet'}</span>}
          </div>
          {invitation.message && <div className="mt-5 rounded-2xl border border-white/5 bg-black/15 p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-white/40">Message du créateur</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">{invitation.message}</p></div>}
          {invitation.conditionsEngagement && <div className="mt-4 rounded-2xl border border-[#C9F06A]/15 bg-[#C9F06A]/5 p-4"><p className="text-[11px] font-bold uppercase tracking-wider text-[#C9F06A]">Conditions d’engagement</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/75">{invitation.conditionsEngagement}</p></div>}
          <label className={`mt-4 flex items-start gap-3 text-sm ${unavailable ? 'text-white/30' : 'text-white/70'}`}>
            <input type="checkbox" checked={Boolean(accepted[invitation.id])} disabled={unavailable} onChange={e => setAccepted(old => ({ ...old, [invitation.id]: e.target.checked }))} className="mt-0.5 accent-[#C9F06A]" />
            <span>Je m’engage à contribuer à ce projet jusqu’à sa fin.</span>
          </label>
          {errors[invitation.id] && <p role="alert" className="mt-3 text-sm text-red-300">{errors[invitation.id]}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button onClick={() => respond(invitation, 'ACCEPTEE')} disabled={busy[invitation.id] || unavailable || !accepted[invitation.id]} className="inline-flex items-center gap-2 rounded-xl bg-[#C9F06A] px-4 py-2.5 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-40">{busy[invitation.id] ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle size={15} />}Accepter</button>
            <button onClick={() => respond(invitation, 'REFUSEE')} disabled={busy[invitation.id]} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/5 disabled:opacity-40"><XCircle size={15} />Refuser</button>
            {invitation.projetId && <Link to={`/projects/${invitation.projetId}`} className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-[#C9F06A]">Voir le projet <ArrowRight size={14} /></Link>}
          </div>
        </article>
      })}
    </div> : !pageError && <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center"><p className="text-white font-semibold">Aucune invitation en attente</p><p className="mt-2 text-sm text-white/45">Les invitations reçues apparaîtront ici.</p></div>}
  </main>
}
