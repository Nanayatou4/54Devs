import StyledSelect from '../components/StyledSelect'
import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  Code2,
  HelpCircle,
  Info,
  LoaderCircle,
  Plus,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
} from 'lucide-react'
import { adminChallengesApi, adminApi, challengesApi, getStoredUser } from '../api'

const TYPES = [
  ['DEBUG', 'Débogage & Correction'],
  ['ALGORITHME', 'Algorithme & Logique'],
  ['SECURITE', 'Cybersécurité'],
  ['ARCHITECTURE', 'Architecture logicielle'],
  ['TECHNOLOGIE', 'Technologie & Frameworks'],
  ['AFRIQUE', 'Enjeux technologiques africains'],
]

const DIFFICULTIES = [
  ['FACILE', 'Facile · 10 points'],
  ['MOYEN', 'Intermédiaire · 20 points'],
  ['DIFFICILE', 'Difficile · 30 points'],
]

function localDate(offset = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 10)
}

const fieldClass =
  'mt-2 w-full rounded-xl border border-white/15 bg-[#18251E] px-4 py-3 text-sm text-white placeholder-white/35 outline-none transition focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20'
const labelClass = 'block text-xs font-bold uppercase tracking-wider text-white/80'

export default function AdminChallenges() {
  const { id } = useParams()
  const editing = Boolean(id)
  const user = getStoredUser()

  const [form, setForm] = useState({
    titre: '',
    enonce: '',
    extraitCode: '',
    langage: '',
    type: 'DEBUG',
    difficulte: 'FACILE',
    reponsesAcceptees: '',
    explication: '',
    nombreEssaisMax: '3',
    dateDebut: localDate(),
    dateFin: localDate(7),
  })

  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(editing)

  useEffect(() => {
    if (!editing) return
    let active = true
    Promise.all([challengesApi.getById(id), adminApi.challenges({ page: 0, taille: 50 })])
      .then(([detail, adminList]) => {
        if (!active) return
        const adminChallenge = (adminList.contenu || []).find((item) => String(item.id) === String(id))
        if (!adminChallenge) throw new Error('Challenge introuvable dans la banque.')
        setForm({
          titre: detail.titre || '',
          enonce: detail.enonce || '',
          extraitCode: detail.extraitCode || '',
          langage: detail.langage || '',
          type: detail.type || 'DEBUG',
          difficulte: detail.difficulte || 'FACILE',
          reponsesAcceptees: (adminChallenge.reponsesAcceptees || []).join('\n'),
          explication: detail.explication || '',
          nombreEssaisMax: String(detail.nombreEssaisMax || 3),
          dateDebut: detail.dateDebut,
          dateFin: detail.dateFin,
        })
      })
      .catch((err) => setError(err.message || 'Impossible de charger ce challenge.'))
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [editing, id])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setCreated(null)
    const answers = form.reponsesAcceptees
      .split('\n')
      .map((answer) => answer.trim())
      .filter(Boolean)

    if (answers.length === 0) {
      setError('Ajoutez au moins une réponse acceptée, une par ligne.')
      return
    }
    if (answers.some((answer) => answer.includes('|'))) {
      setError('Le caractère | ne peut pas apparaître dans une réponse.')
      return
    }
    if (answers.length > 10 || answers.some((answer) => answer.length > 100) || answers.join('|').length > 500) {
      setError('Ajoutez au maximum 10 réponses, de 100 caractères chacune (500 caractères au total).')
      return
    }

    setSaving(true)
    try {
      const payload = {
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
      }
      const challenge = editing
        ? await adminApi.modifierChallenge(id, payload)
        : await adminChallengesApi.creer(payload)
      setCreated(challenge)
      if (!editing) {
        setForm((current) => ({
          ...current,
          titre: '',
          enonce: '',
          extraitCode: '',
          langage: '',
          reponsesAcceptees: '',
          explication: '',
        }))
      }
    } catch (err) {
      setError(err.message || 'Impossible d’enregistrer le challenge.')
    } finally {
      setSaving(false)
    }
  }

  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />

  const answersList = form.reponsesAcceptees
    .split('\n')
    .map((a) => a.trim())
    .filter(Boolean)

  const points = form.difficulte === 'FACILE' ? 10 : form.difficulte === 'MOYEN' ? 20 : 30

  return (
    <main className="min-h-screen bg-[#101915] px-4 py-8 text-white sm:px-6 lg:px-8 md:py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation retour */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin?tab=challenges"
            className="inline-flex items-center gap-2 text-xs font-bold text-white/60 hover:text-[#C9F06A] transition uppercase tracking-wider"
          >
            <ArrowLeft size={16} /> Retour au Panneau d'Administration
          </Link>
          <span className="text-xs text-white/40">Zone Administration Sécurisée</span>
        </div>

        {/* En-tête */}
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#16221C] via-[#101915] to-[#16221C] p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C9F06A]/10 text-[#C9F06A] border border-[#C9F06A]/30">
              <ShieldCheck size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C9F06A] font-mono">
              Console Auteur · Mini-Challenges
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            {editing ? 'Modifier le challenge existant' : 'Créer un nouveau mini-challenge'}
          </h1>
          <p className="mt-2 text-sm text-white/65 max-w-2xl leading-relaxed">
            Rédigez un défi technique (débogage, algorithme, sécurité) avec évaluation automatique des réponses des développeurs.
          </p>
        </header>

        {/* Alerte succès */}
        {created && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-emerald-200 shadow-xl">
            <span className="inline-flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
              Challenge « {created.titre} » {editing ? 'mis à jour' : 'créé'} avec succès !
            </span>
            <Link
              to={`/admin/challenges/${created.id}`}
              className="font-bold text-[#C9F06A] hover:underline shrink-0"
            >
              Prévisualiser le challenge ↗
            </Link>
          </div>
        )}

        {/* Alerte erreur */}
        {error && (
          <div role="alert" className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200 shadow-xl">
            {error}
          </div>
        )}

        {/* Formulaire principal */}
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#16221C]/80 p-12 text-center text-white/60">
            <LoaderCircle className="mr-2 inline animate-spin text-[#C9F06A]" size={20} />
            Chargement du challenge…
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="space-y-6 rounded-3xl border border-white/10 bg-[#16221C]/90 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
          >
            {/* Section 1 : Informations Générales */}
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 text-[#C9F06A]">
                <Info size={16} /> 1. Métadonnées du défi
              </h3>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    Titre du challenge <span className="text-[#C9F06A]">*</span>
                  </label>
                  <input
                    required
                    minLength={5}
                    maxLength={150}
                    value={form.titre}
                    onChange={(e) => update('titre', e.target.value)}
                    className={fieldClass}
                    placeholder="Ex. Trouver la boucle infinie dans le script"
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Énoncé complet & Consignes <span className="text-[#C9F06A]">*</span>
                  </label>
                  <textarea
                    required
                    maxLength={5000}
                    rows={4}
                    value={form.enonce}
                    onChange={(e) => update('enonce', e.target.value)}
                    className={`${fieldClass} resize-y`}
                    placeholder="Expliquez clairement le contexte, le comportement attendu et la question exacte à laquelle le développeur doit répondre."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Domaine / Type</label>
                    <StyledSelect
                      value={form.type}
                      onChange={(e) => update('type', e.target.value)}
                      className={fieldClass}
                    >
                      {TYPES.map(([val, label]) => (
                        <option key={val} value={val} className="bg-[#18251E]">
                          {label}
                        </option>
                      ))}
                    </StyledSelect>
                  </div>

                  <div>
                    <label className={labelClass}>Difficulté & Barème</label>
                    <StyledSelect
                      value={form.difficulte}
                      onChange={(e) => update('difficulte', e.target.value)}
                      className={fieldClass}
                    >
                      {DIFFICULTIES.map(([val, label]) => (
                        <option key={val} value={val} className="bg-[#18251E]">
                          {label}
                        </option>
                      ))}
                    </StyledSelect>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Langage concerné (facultatif)</label>
                    <input
                      maxLength={50}
                      value={form.langage}
                      onChange={(e) => update('langage', e.target.value)}
                      className={fieldClass}
                      placeholder="JavaScript, Python, Java, SQL, Rust…"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Nombre d'essais max par participant</label>
                    <input
                      required
                      type="number"
                      min="1"
                      max="10"
                      value={form.nombreEssaisMax}
                      onChange={(e) => update('nombreEssaisMax', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Date de publication</label>
                    <input
                      required
                      type="date"
                      value={form.dateDebut}
                      onChange={(e) => update('dateDebut', e.target.value)}
                      className={fieldClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Date de clôture</label>
                    <input
                      required
                      type="date"
                      min={form.dateDebut}
                      value={form.dateFin}
                      onChange={(e) => update('dateFin', e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 : Extrait de code (Terminal Dark) */}
            <div className="border-b border-white/10 pb-6">
              <div className="flex items-center justify-between mb-2">
                <label className={`${labelClass} flex items-center gap-2`}>
                  <Terminal size={15} className="text-[#C9F06A]" /> Extrait de code source (Optionnel)
                </label>
                <span className="text-[11px] font-mono text-white/50">Éditeur Monospace</span>
              </div>
              <textarea
                maxLength={5000}
                rows={6}
                value={form.extraitCode}
                onChange={(e) => update('extraitCode', e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-[#0C130F] p-4 text-xs font-mono text-[#C9F06A] placeholder-white/30 outline-none transition focus:border-[#C9F06A] focus:ring-2 focus:ring-[#C9F06A]/20 resize-y"
                placeholder="// Collez ici l'extrait de code avec le bug ou la fonction à analyser..."
              />
            </div>

            {/* Section 3 : Réponses acceptées & Explication */}
            <div className="space-y-4">
              <div>
                <label className={labelClass}>
                  Réponses acceptées <span className="text-[#C9F06A]">*</span> (Une par ligne)
                </label>
                <textarea
                  required
                  maxLength={1000}
                  rows={3}
                  value={form.reponsesAcceptees}
                  onChange={(e) => update('reponsesAcceptees', e.target.value)}
                  className={`${fieldClass} resize-y font-mono`}
                  placeholder={'NaN\nundefined\nErreur de syntaxe'}
                />
                <span className="mt-1.5 block text-xs text-white/50">
                  L'évaluation comparera la saisie de l'utilisateur à ces variantes (insensible à la casse).
                </span>

                {/* Badges d'aperçu des réponses */}
                {answersList.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-white/40">Variantes détectées ({answersList.length}) :</span>
                    {answersList.map((ans, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg border border-[#C9F06A]/30 bg-[#C9F06A]/10 px-2.5 py-1 text-xs font-mono font-bold text-[#C9F06A]"
                      >
                        {ans}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className={labelClass}>Explication pédagogique (Révélée après résolution)</label>
                <textarea
                  maxLength={2000}
                  rows={3}
                  value={form.explication}
                  onChange={(e) => update('explication', e.target.value)}
                  className={`${fieldClass} resize-y`}
                  placeholder="Donnez l'explication technique détaillée pour faire progresser les développeurs qui ont échoué ou réussi."
                />
              </div>
            </div>

            {/* Boutons et Résumé */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-6">
              <div className="inline-flex items-center gap-2 text-xs text-white/60">
                <Sparkles size={16} className="text-[#C9F06A]" />
                Ce défi récompensera le vainqueur de <span className="font-bold text-[#C9F06A]">{points} points</span>.
              </div>

              <div className="flex items-center gap-3">
                <Link
                  to="/admin?tab=challenges"
                  className="rounded-xl border border-white/15 px-4 py-3 text-xs font-semibold text-white/70 hover:bg-white/5 transition"
                >
                  Annuler
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9F06A] hover:bg-[#D8F87C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-all shadow-lg shadow-[#C9F06A]/20 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" /> Enregistrement…
                    </>
                  ) : editing ? (
                    'Enregistrer les modifications'
                  ) : (
                    'Publier le challenge'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </main>
  )
}
