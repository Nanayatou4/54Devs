import {
  Briefcase,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Rocket,
  Sparkles,
  Trophy,
  User,
  Users,
} from 'lucide-react'

export const appNavItems = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'projects', label: 'Projets & Équipes', icon: Rocket, path: '/projects' },
  { key: 'developers', label: 'Développeurs & Mentors', icon: Users, path: '/developers' },
  { key: 'smart-match', label: 'Appariement intelligent', icon: Sparkles, path: '/smart-match' },
  { key: 'questions', label: 'Questions & Entraide', icon: HelpCircle, path: '/questions' },
  { key: 'mentorship', label: 'Mentorat', icon: GraduationCap, path: '/mentorship' },
  { key: 'challenges', label: 'Défis & Compétitions', icon: Trophy, path: '/challenges' },
  { key: 'job-board', label: 'Opportunités & Emploi', icon: Briefcase, path: '/job-board' },
  { key: 'profile', label: 'Mon Profil & Compétences', icon: User, path: '/profile' },
]
