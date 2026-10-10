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
  IDEE: 'bg-primary/10 text-primary',
  EN_DEVELOPPEMENT: 'bg-green/10 text-green',
  EN_LANCEMENT: 'bg-purple-100 text-purple-600',
  TERMINE: 'bg-gray-100 text-gray-600',
  EN_PAUSE: 'bg-yellow-100 text-yellow-700',
}
