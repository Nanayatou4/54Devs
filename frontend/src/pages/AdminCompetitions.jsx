import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  Layers,
  LoaderCircle,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Trophy,
  Users,
  X,
} from 'lucide-react'
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

const field =
  'mt-2 w-full rounded-xl border border-white/15 bg-[#18251E] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20'
const label = 'block text-xs font-bold uppercase tracking-wider text-white/80'

const emptyForm = () => ({
  titre: '',
  description: '',
  theme: '',
  type: 'SOLO',
  dateDebut: localDateTime(1),
  dateFin: localDateTime(8),
  pointsMaximum: '100',
})

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
    try {
      setCompetitions(await adminCompetitionsApi.lister())
    } catch (err) {
      setError(err.message || 'Impossible de charger les compétitions.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function edit(item) {
    setEditingId(item.id)
    setForm({
      titre: item.titre,
      description: item.description,
      theme: item.theme,
      type: item.type,
      dateDebut: dateInput(item.dateDebut),
      dateFin: dateInput(item.dateFin),
      pointsMaximum: String(item.pointsMaximum),
    })
    setCreated('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm())
    setError('')
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setCreated('')
    if (new Date(form.dateFin) <= new Date(form.dateDebut)) {
      setError('La date de clôture doit être postérieure à la date de début.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        titre: form.titre.trim(),
        description: form.description.trim(),
        theme: form.theme.trim(),
        type: form.type,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
        pointsMaximum: Number(form.pointsMaximum),
      }
      if (editingId) {
        await adminCompetitionsApi.modifier(editingId, payload)
        setCreated('Compétition modifiée avec succès.')
      } else {
        await adminCompetitionsApi.creer(payload)
        setCreated('Nouvelle compétition créée avec succès.')
      }
      setEditingId(null)
      setForm(emptyForm())
      await load()
    } catch (err) {
      setError(err.message || 'Enregistrement impossible.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(item) {
    const confirmed = window.confirm(
      'Supprimer définitivement « ' +
        item.titre +
        ' » ? Cette action est irréversible. Les compétitions avec des soumissions ne peuvent pas être supprimées.'
    )
    if (!confirmed) return
    setDeleting(item.id)
    setError('')
    setCreated('')
    try {
      await adminCompetitionsApi.supprimer(item.id)
      setCreated('Compétition supprimée avec succès.')
      if (editingId === item.id) cancelEdit()
      await load()
    } catch (err) {
      setError(err.message || 'Suppression impossible.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <main className="min-h-screen bg-[#101915] px-4 py-8 text-white sm:px-6 lg:px-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation retour */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin?tab=challenges"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-[#C9F06A] transition uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Retour au Panneau d'Administration
          </Link>
          <Link
            to="/admin/competitions"
            className="text-xs font-bold text-[#C9F06A] hover:underline flex items-center gap-1.5"
          >
            <Trophy size={14} /> Aller à la Console d'Évaluation du Jury ↗
          </Link>
        </div>

        {/* En-tête */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#16221C] via-[#101915] to-[#16221C] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9F06A]/10 text-[#C9F06A] border border-[#C9F06A]/30">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9F06A] font-mono">
              Console Organisateur · Compétitions
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {editingId ? 'Modifier la compétition' : 'Créer une compétition hebdomadaire ou hackathon'}
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-2xl leading-relaxed">
            Configurez les défis GitHub avec date limite, thème sectoriel (AgriTech, FinTech, Santé) et barème de notation.
          </p>
        </header>

        {/* Notifications */}
        {created && (
          <div role="status" className="flex items-center gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200 shadow-xl">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            {created}
          </div>
        )}
        {error && (
          <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200 shadow-xl">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form
          onSubmit={submit}
          className="space-y-6 rounded-3xl border border-white/10 bg-[#16221C]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={label}>
                Titre de la compétition <span className="text-[#C9F06A]">*</span>
              </label>
              <input
                required
                minLength={5}
                maxLength={150}
                value={form.titre}
                onChange={(e) => update('titre', e.target.value)}
                className={field}
                placeholder="Ex. Sprint #5 : Concevoir une API REST sécurisée de gestion de trésorerie"
              />
            </div>

            <div className="sm:col-span-2">
              <label className={label}>
                Cahier des charges & Consignes détaillées <span className="text-[#C9F06A]">*</span>
              </label>
              <textarea
                required
                maxLength={5000}
                rows={5}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className={`${field} resize-y`}
                placeholder="Expliquez la problématique africaine à résoudre, les critères de notation, les attentes sur le README GitHub et les contraintes de déploiement..."
              />
            </div>

            <div>
              <label className={label}>
                Thématique / Secteur <span className="text-[#C9F06A]">*</span>
              </label>
              <input
                required
                maxLength={80}
                value={form.theme}
                onChange={(e) => update('theme', e.target.value)}
                className={field}
                placeholder="FinTech, AgriTech, Santé, Cloud, DevOps..."
              />
            </div>

            <div>
              <label className={label}>Format de compétition</label>
              <select
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                className={field}
              >
                <option value="SOLO" className="bg-[#18251E]">
                  Sprint Individuel (Solo)
                </option>
                <option value="EQUIPE" className="bg-[#18251E]">
                  Hackathon Collectif (Équipe)
                </option>
              </select>
            </div>

            <div>
              <label className={label}>
                Date et heure d'ouverture <span className="text-[#C9F06A]">*</span>
              </label>
              <input
                required
                type="datetime-local"
                value={form.dateDebut}
                onChange={(e) => update('dateDebut', e.target.value)}
                className={field}
              />
            </div>

            <div>
              <label className={label}>
                Date et heure de clôture <span className="text-[#C9F06A]">*</span>
              </label>
              <input
                required
                type="datetime-local"
                min={form.dateDebut}
                value={form.dateFin}
                onChange={(e) => update('dateFin', e.target.value)}
                className={field}
              />
            </div>

            <div>
              <label className={label}>Points maximum accordés</label>
              <input
                required
                type="number"
                min="1"
                max="1000"
                value={form.pointsMaximum}
                onChange={(e) => update('pointsMaximum', e.target.value)}
                className={field}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-6">
            <p className="text-xs text-white/50">
              Les participants soumettent leur URL de dépôt GitHub public et leurs explications.
            </p>
            <div className="flex items-center gap-3">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9F06A] hover:bg-[#D8F87C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all shadow-lg shadow-[#C9F06A]/20 disabled:opacity-50 cursor-pointer"
              >
                {saving ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" /> Enregistrement…
                  </>
                ) : editingId ? (
                  'Mettre à jour la compétition'
                ) : (
                  'Publier la compétition'
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Section Compétitions existantes */}
        <section className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#C9F06A] font-mono">
                Catalogue
              </p>
              <h2 className="text-xl font-bold text-white">Compétitions créées</h2>
            </div>
            <span className="text-xs text-white/50 font-mono">{competitions.length} au total</span>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#16221C] p-8 text-center text-xs text-white/50">
              <LoaderCircle className="mr-2 inline animate-spin text-[#C9F06A]" size={16} />
              Chargement des compétitions…
            </div>
          ) : competitions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#16221C] p-8 text-center text-xs text-white/50">
              Aucune compétition enregistrée pour le moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {competitions.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-[#16221C] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-white/20 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="rounded-md border border-[#C9F06A]/30 bg-[#C9F06A]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#C9F06A]">
                        {item.theme}
                      </span>
                      <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/60">
                        {item.type === 'SOLO' ? 'Solo Hebdo' : 'Hackathon Équipe'}
                      </span>
                      <span className="text-xs text-[#C9F06A] font-bold font-mono">
                        {item.pointsMaximum} pts max
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base truncate">{item.titre}</h3>
                    <p className="mt-1 text-xs text-white/50 flex items-center gap-2">
                      <CalendarDays size={13} className="text-white/40" />
                      {new Date(item.dateDebut).toLocaleString('fr-FR')} →{' '}
                      {new Date(item.dateFin).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => edit(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#C9F06A]/30 bg-[#C9F06A]/10 hover:bg-[#C9F06A]/20 px-3 py-2 text-xs font-bold text-[#C9F06A] transition cursor-pointer"
                    >
                      <Pencil size={13} /> Modifier
                    </button>
                    <button
                      type="button"
                      disabled={deleting === item.id}
                      onClick={() => remove(item)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 text-xs font-bold text-rose-300 transition disabled:opacity-50 cursor-pointer"
                    >
                      {deleting === item.id ? (
                        <LoaderCircle size={13} className="animate-spin" />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Supprimer
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
