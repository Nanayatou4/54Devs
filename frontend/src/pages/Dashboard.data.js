import {
  LayoutDashboard, Rocket, Zap, Users, GraduationCap, Briefcase,
} from 'lucide-react'

export const navItems = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'projects', label: 'Projets', icon: Rocket },
  { key: 'smart-match', label: 'Smart Match', icon: Zap },
  { key: 'community', label: 'Communauté', icon: Users },
  { key: 'mentorship', label: 'Mentorat', icon: GraduationCap },
  { key: 'job-board', label: 'Offres', icon: Briefcase },
]

export const niveauLabels = { DEBUTANT: 'Débutant', INTERMEDIAIRE: 'Intermédiaire', AVANCE: 'Avancé' }

export const typeLabels = { MAITRISE: 'Je maîtrise', APPRENDRE: 'Je veux apprendre', ENSEIGNER: 'Je peux enseigner' }

export const typeColors = {
  MAITRISE: 'bg-green-500/20 text-green-400 border-green-500/30',
  APPRENDRE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ENSEIGNER: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

export const STATUT_LABELS = {
  IDEE: 'Idée', EN_DEVELOPPEMENT: 'En développement', EN_LANCEMENT: 'En cours de lancement',
  TERMINE: 'Terminé', EN_PAUSE: 'En pause',
}

export const STATUT_COLORS = {
  IDEE: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  EN_DEVELOPPEMENT: 'bg-accent/20 text-accent border-accent/30',
  EN_LANCEMENT: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  TERMINE: 'bg-green-500/20 text-green-400 border-green-500/30',
  EN_PAUSE: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
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
  EN_ATTENTE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  ACCEPTEE: 'bg-green-500/20 text-green-400 border-green-500/30',
  REFUSEE: 'bg-red-500/20 text-red-400 border-red-500/30',
}
