import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, LoaderCircle, Pencil, ShieldCheck, Trash2, X } from 'lucide-react'
import { adminCompetitionsApi, getStoredUser } from '../api'

function localDateTime(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}
function dateInput(value) {
  if (!value) return ''
  const date = new Date(value)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
  return date.toISOString().slice(0, 16)
}
const field = 'mt-2 w-full rounded-xl border border-white/10 bg-[#0d2119]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[#c9f06a]/60 focus:ring-2 focus:ring-[#c9f06a]/15'
const label = 'block text-sm font-semibold text-white/85'
const emptyForm = () => ({ titre: '', description: '', theme: '', type: 'SOLO', dateDebut: localDateTime(1), dateFin: localDateTime(8), pointsMaximum: '100' })

export default function AdminCompetitions() {
  const user = getStoredUser()
  const [form, setForm] = useState(emptyForm)
  const [competitions, setCompetitions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [created, setCreated] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />

  async function load() {
    setError('')
    try { setCompetitions(await adminCompetitionsApi.lister()) }
    catch (err) { setError(err.message || 'Impossible de charger les compétitions.') }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  function update(key, value) { setForm(current => ({ ...current, [key]: value })) }
  function edit(item) {
    setEditingId(item.id)
    setForm({ titre: item.titre, description: item.description, theme: item.theme, type: item.type, dateDebut: dateInput(item.dateDebut), dateFin: dateInput(item.dateFin), pointsMaximum: String(item.pointsMaximum) })
    setCreated('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  function cancelEdit() { setEditingId(null); setForm(emptyForm()); setError('') }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setCreated('')
    if (new Date(form.dateFin) <= new Date(form.dateDebut)) {
      setError('La date de fin doit être postérieure à la date de début.')
      return
    }
    setSaving(true)
    try {
      const payload = { titre: form.titre.trim(), description: form.description.trim(), theme: form.theme.trim(), type: form.type, dateDebut: form.dateDebut, dateFin: form.dateFin, pointsMaximum: Number(form.pointsMaximum) }
      if (editingId) {
        await adminCompetitionsApi.modifier(editingId, payload)
        setCreated('Compétition modifiée avec succès.')
      } else {
        const result = await adminCompetitionsApi.creer(payload)
        setCreated('Compétition « ' + result.titre + ' » créée et publiée.')
      }
      setEditingId(null)
      setForm(emptyForm())
      await load()
    } catch (err) { setError(err.message || 'Enregistrement impossible.') }
    finally { setSaving(false) }
  }

  async function remove(item) {
    const confirmed = window.confirm('Supprimer définitivement « ' + item.titre + ' » ? Cette action est irréversible. Les compétitions avec des soumissions ne peuvent pas être supprimées.')
    if (!confirmed) return
    setDeleting(item.id); setError(''); setCreated('')
    try {
      await adminCompetitionsApi.supprimer(item.id)
      setCreated('Compétition supprimée.')
      if (editingId === item.id) cancelEdit()
      await load()
    } catch (err) { setError(err.message || 'Suppression impossible.') }
    finally { setDeleting(null) }
  }

  return <main className="min-h-screen bg-[radial-gradient(ellipse_at_45%_0%,rgba(83,160,104,0.2),transparent_45%),linear-gradient(145deg,#10271d,#123829_52%,#10251c)] px-4 py-8 text-[#f3f0e8] sm:px-6 lg:px-10 lg:py-10">
    <div className="mx-auto max-w-5xl">
      <div className="mb-6"><Link to="/admin?tab=challenges" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-[#c9f06a]"><ArrowLeft size={16}/> Retour à l'administration</Link></div>
      <header className="mb-7 rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-[#c9f06a]/20 bg-[#c9f06a]/10 text-[#c9f06a]"><ShieldCheck size={23}/></div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9f06a]">Administration · Compétitions</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{editingId ? 'Modifier une compétition' : 'Créer une compétition'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">Créez, mettez à jour et gérez vos compétitions hebdomadaires.</p>
      </header>
      {created && <div role="status" className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100"><CheckCircle2 size={18}/>{created}</div>}
      {error && <div role="alert" className="mb-6 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</div>}
      <form onSubmit={submit} className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label + ' sm:col-span-2'}>Titre de la compétition *
            <input required minLength={5} maxLength={150} value={form.titre} onChange={e => update('titre', e.target.value)} className={field} placeholder="Ex. Construire une API de gestion de tâches"/>
          </label>
          <label className={label + ' sm:col-span-2'}>Description et consignes *
            <textarea required maxLength={5000} rows={5} value={form.description} onChange={e => update('description', e.target.value)} className={field + ' resize-y'} placeholder="Présentez le problème, les fonctionnalités attendues, les contraintes et les critères de réussite."/>
          </label>
          <label className={label}>Thème *
            <input required maxLength={80} value={form.theme} onChange={e => update('theme', e.target.value)} className={field} placeholder="Backend, IA, Web, Mobile…"/>
          </label>
          <label className={label}>Format
            <select value={form.type} onChange={e => update('type', e.target.value)} className={field}><option value="SOLO" className="bg-[#123326]">Solo</option><option value="EQUIPE" className="bg-[#123326]">Équipe (bientôt disponible)</option></select>
          </label>
          <label className={label}>Date et heure de début *
            <input required type="datetime-local" value={form.dateDebut} onChange={e => update('dateDebut', e.target.value)} className={field}/>
          </label>
          <label className={label}>Date et heure de clôture *
            <input required type="datetime-local" min={form.dateDebut} value={form.dateFin} onChange={e => update('dateFin', e.target.value)} className={field}/>
          </label>
          <label className={label}>Score maximum
            <input required type="number" min="1" max="1000" value={form.pointsMaximum} onChange={e => update('pointsMaximum', e.target.value)} className={field}/>
          </label>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/50">Les soumissions Solo sont des liens vers des dépôts GitHub.</p>
          <div className="flex gap-2">
            {editingId && <button type="button" onClick={cancelEdit} className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-white"><X size={16}/> Annuler</button>}
            <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#c9f06a] px-6 text-sm font-bold text-[#102018] transition hover:bg-[#d8fa83] disabled:cursor-not-allowed disabled:opacity-60">{saving ? <><LoaderCircle size={17} className="animate-spin"/> Enregistrement…</> : editingId ? 'Enregistrer les modifications' : 'Créer la compétition'}</button>
          </div>
        </div>
      </form>
      <section className="mt-9">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9f06a]">Gestion</p><h2 className="mt-1 text-2xl font-bold text-white">Compétitions existantes</h2></div><span className="text-sm text-white/50">{competitions.length} compétition(s)</span></div>
        {loading ? <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center text-sm text-white/50"><LoaderCircle className="mr-2 inline animate-spin"/>Chargement…</p>
          : competitions.length === 0 ? <p className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 text-center text-sm text-white/50">Aucune compétition pour le moment.</p>
          : <div className="space-y-3">{competitions.map(item => <article key={item.id} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0"><h3 className="font-bold text-white">{item.titre}</h3><p className="mt-1 text-xs text-white/50">{item.theme} · {item.type} · {item.pointsMaximum} points · {item.statut}</p><p className="mt-1 text-xs text-white/40">{new Date(item.dateDebut).toLocaleString('fr-FR')} → {new Date(item.dateFin).toLocaleString('fr-FR')}</p></div>
            <div className="flex shrink-0 gap-2"><button type="button" onClick={() => edit(item)} className="inline-flex items-center gap-2 rounded-xl border border-[#c9f06a]/30 px-3 py-2 text-xs font-bold text-[#c9f06a] hover:bg-[#c9f06a]/10"><Pencil size={14}/> Modifier</button><button type="button" disabled={deleting === item.id} onClick={() => remove(item)} className="inline-flex items-center gap-2 rounded-xl border border-red-300/25 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-400/10 disabled:opacity-50">{deleting === item.id ? <LoaderCircle size={14} className="animate-spin"/> : <Trash2 size={14}/>} Supprimer</button></div>
          </article>)}</div>}
      </section>
    </div>
  </main>
}
