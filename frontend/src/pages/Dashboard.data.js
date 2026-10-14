import { LayoutDashboard, MessageCircle, Rocket, Trophy, UsersRound } from 'lucide-react'

export const navItems = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'projects', label: 'Projets', icon: Rocket },
  { key: 'questions', label: 'Questions & réponses', icon: MessageCircle },
  { key: 'challenges', label: 'Challenges', icon: Trophy },
  { key: 'developers', label: 'Développeurs', icon: UsersRound },
]

export const niveauLabels = { DEBUTANT: 'Débutant', INTERMEDIAIRE: 'Intermédiaire', AVANCE: 'Avancé' }

export const typeLabels = { MAITRISE: 'Je maîtrise', APPRENDRE: 'Je veux apprendre', ENSEIGNER: 'Je peux enseigner' }

export const typeColors = {
  MAITRISE: 'bg-green-50 text-green-700 border-green-200',
  APPRENDRE: 'bg-blue-50 text-blue-700 border-blue-200',
  ENSEIGNER: 'bg-purple-50 text-purple-700 border-purple-200',
}

export const STATUT_LABELS = {
  IDEE: 'Idée', EN_DEVELOPPEMENT: 'En développement', EN_LANCEMENT: 'En cours de lancement',
  TERMINE: 'Terminé', EN_PAUSE: 'En pause',
}

export const STATUT_COLORS = {
  IDEE: 'bg-blue-50 text-blue-700 border-blue-200',
  EN_DEVELOPPEMENT: 'bg-blue-50 text-blue-700 border-blue-200',
  EN_LANCEMENT: 'bg-purple-50 text-purple-700 border-purple-200',
  TERMINE: 'bg-green-50 text-green-700 border-green-200',
  EN_PAUSE: 'bg-slate-100 text-slate-600 border-slate-200',
}

export const ROLE_LABELS = {
  CREATEUR: 'Créateur',
  MEMBRE: 'Membre',
}

export const STATUT_DEMANDE_LABELS = {
  EN_ATTENTE: 'En attente',
  ACCEPTEE: 'Acceptée',
  REFUSEE: 'Refusée',
}

export const STATUT_DEMANDE_COLORS = {
  EN_ATTENTE: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  ACCEPTEE: 'bg-green-50 text-green-700 border-green-200',
  REFUSEE: 'bg-red-50 text-red-700 border-red-200',
}
