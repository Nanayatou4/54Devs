import StyledSelect from '../components/StyledSelect'
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react'
import { adminChallengesApi, getStoredUser } from '../api'

const TYPES = [
  ['DEBUG', 'Débogage'], ['ALGORITHME', 'Algorithme'], ['SECURITE', 'Sécurité'],
  ['ARCHITECTURE', 'Architecture'], ['TECHNOLOGIE', 'Technologie'], ['AFRIQUE', 'Enjeux africains'],
]
const DIFFICULTIES = [['FACILE', 'Facile · 10 points'], ['MOYEN', 'Intermédiaire · 20 points'], ['DIFFICILE', 'Difficile · 30 points']]

function localDate(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

const fieldClass = 'mt-2 w-full rounded-xl border border-white/10 bg-[#0d2119]/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/55 focus:border-[#c9f06a]/60 focus:ring-2 focus:ring-[#c9f06a]/15'
const labelClass = 'block text-sm font-semibold text-white/85'

export default function AdminChallenges() {
  const user = getStoredUser()
  const [form, setForm] = useState({
    titre: '', enonce: '', extraitCode: '', langage: '', type: 'DEBUG', difficulte: 'FACILE',
    reponsesAcceptees: '', explication: '', nombreEssaisMax: '3', dateDebut: localDate(), dateFin: localDate(7),
  })
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const [saving, setSaving] = useState(false)

  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />

  function update(field, value) {
    setForm(current => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setCreated(null)
    const answers = form.reponsesAcceptees.split('\n').map(answer => answer.trim()).filter(Boolean)
    if (answers.length === 0) {
      setError('Ajoutez au moins une réponse acceptée, une par ligne.')
      return
    }
    if (answers.some(answer => answer.includes('|'))) {
      setError('Le caractère | ne peut pas apparaître dans une réponse.')
      return
    }
    if (answers.length > 10 || answers.some(answer => answer.length > 100) || answers.join('|').length > 500) {
      setError('Ajoutez au maximum 10 réponses, de 100 caractères chacune (500 caractères au total).')
      return
    }

    setSaving(true)
    try {
      const challenge = await adminChallengesApi.creer({
        titre: form.titre.trim(),
        enonce: form.enonce.trim(),
        extraitCode: form.extraitCode.trim() || null,
        langage: form.langage.trim() || null,
        type: form.type,
        difficulte: form.difficulte,
        reponsesAcceptees: answers,
        explication: form.explication.trim() || null,
        nombreEssaisMax: Number(form.nombreEssaisMax),
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
      })
      setCreated(challenge)
      setForm(current => ({ ...current, titre: '', enonce: '', extraitCode: '', langage: '', reponsesAcceptees: '', explication: '' }))
    } catch (err) {
      setError(err.message || 'Impossible de créer le challenge.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_45%_0%,rgba(83,160,104,0.2),transparent_45%),linear-gradient(145deg,#10271d,#123829_52%,#10251c)] px-4 py-8 text-[#f3f0e8] sm:px-6 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition hover:text-[#c9f06a]"><ArrowLeft size={16} /> Retour à l'Administration</Link>
          <span className="text-white/20">·</span>
          <Link to="/challenges" className="text-sm font-semibold text-white/40 transition hover:text-white">Défis publics</Link>
        </div>

        <header className="mb-7 rounded-3xl border border-white/10 bg-white/[0.07] p-6 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-8">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-[#c9f06a]/20 bg-[#c9f06a]/10 text-[#c9f06a]"><ShieldCheck size={23} /></div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9f06a]">Administration · Challenges</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">Créer un challenge</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">Préparez un défi pour la communauté. Les points sont calculés automatiquement selon la difficulté.</p>
        </header>

        {created && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-sm text-emerald-100 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex items-center gap-2"><CheckCircle2 size={18} /> Challenge « {created.titre} » créé.</span>
            <Link to={`/challenges/${created.id}`} className="font-bold text-[#c9f06a] hover:underline">Voir le challenge</Link>
          </div>
        )}
        {error && <div role="alert" className="mb-6 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm text-red-100">{error}</div>}

        <form onSubmit={submit} className="space-y-6 rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>Titre <span className="text-[#c9f06a]">*</span>
              <input required minLength={5} maxLength={150} value={form.titre} onChange={e => update('titre', e.target.value)} className={fieldClass} placeholder="Ex. Trouver l’élément manquant" />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>Énoncé <span className="text-[#c9f06a]">*</span>
              <textarea required maxLength={5000} rows={5} value={form.enonce} onChange={e => update('enonce', e.target.value)} className={`${fieldClass} resize-y`} placeholder="Décrivez le problème à résoudre et les consignes." />
            </label>
            <label className={labelClass}>Type
              <StyledSelect value={form.type} onChange={e => update('type', e.target.value)} className={fieldClass}>{TYPES.map(([value, label]) => <option key={value} value={value} className="bg-[#123326]">{label}</option>)}</StyledSelect>
            </label>
            <label className={labelClass}>Difficulté
              <StyledSelect value={form.difficulte} onChange={e => update('difficulte', e.target.value)} className={fieldClass}>{DIFFICULTIES.map(([value, label]) => <option key={value} value={value} className="bg-[#123326]">{label}</option>)}</StyledSelect>
            </label>
            <label className={labelClass}>Langage (facultatif)
              <input maxLength={50} value={form.langage} onChange={e => update('langage', e.target.value)} className={fieldClass} placeholder="JavaScript, Python…" />
            </label>
            <label className={labelClass}>Nombre d’essais autorisés
              <input required type="number" min="1" max="10" value={form.nombreEssaisMax} onChange={e => update('nombreEssaisMax', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>Date de début
              <input required type="date" value={form.dateDebut} onChange={e => update('dateDebut', e.target.value)} className={fieldClass} />
            </label>
            <label className={labelClass}>Date de fin
              <input required type="date" min={form.dateDebut} value={form.dateFin} onChange={e => update('dateFin', e.target.value)} className={fieldClass} />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>Extrait de code (facultatif)
              <textarea maxLength={5000} rows={5} value={form.extraitCode} onChange={e => update('extraitCode', e.target.value)} className={`${fieldClass} resize-y font-mono`} placeholder="Collez un extrait de code si le défi en nécessite un." />
            </label>
            <label className={`${labelClass} sm:col-span-2`}>Réponses acceptées <span className="text-[#c9f06a]">*</span>
              <textarea required maxLength={1000} rows={3} value={form.reponsesAcceptees} onChange={e => update('reponsesAcceptees', e.target.value)} className={`${fieldClass} resize-y`} placeholder={'Une réponse par ligne\nEx. 42\nquarante-deux'} />
              <span className="mt-1 block text-xs font-normal text-white/60">Jusqu’à 10 variantes, une par ligne. N’utilisez pas le caractère |.</span>
            </label>
            <label className={`${labelClass} sm:col-span-2`}>Explication (facultative, révélée après le challenge)
              <textarea maxLength={2000} rows={3} value={form.explication} onChange={e => update('explication', e.target.value)} className={`${fieldClass} resize-y`} placeholder="Expliquez la solution ou les notions importantes." />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="inline-flex items-center gap-2 text-xs text-white/50"><Sparkles size={15} className="text-[#c9f06a]" /> {form.difficulte === 'FACILE' ? 10 : form.difficulte === 'MOYEN' ? 20 : 30} points seront attribués.</p>
            <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#c9f06a] px-6 text-sm font-bold text-[#102018] transition hover:bg-[#d8fa83] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? <><LoaderCircle size={17} className="animate-spin" /> Création…</> : 'Créer le challenge'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
