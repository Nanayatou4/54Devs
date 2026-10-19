export const STATUT_OPTIONS = [
  { value: '', label: 'Tous' },
  { value: 'IDEE', label: 'Idée' },
  { value: 'EN_DEVELOPPEMENT', label: 'En développement' },
  { value: 'EN_LANCEMENT', label: 'En cours de lancement' },
  { value: 'TERMINE', label: 'Terminé' },
  { value: 'EN_PAUSE', label: 'En pause' },
]

export { STATUT_PROJET as STATUT_LABELS } from '../lib/libelles'

export const STATUT_COLORS = {
  IDEE: 'border border-sky-300/20 bg-sky-300/10 text-sky-200',
  EN_DEVELOPPEMENT: 'border border-emerald-300/20 bg-emerald-300/10 text-emerald-200',
  EN_LANCEMENT: 'border border-violet-300/20 bg-violet-300/10 text-violet-200',
  TERMINE: 'border border-white/10 bg-white/[0.07] text-white/55',
  EN_PAUSE: 'border border-amber-300/20 bg-amber-300/10 text-amber-200',
}
