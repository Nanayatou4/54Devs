import { UserRound, FolderOpen, Lightbulb } from 'lucide-react'

export const FEATURES = [
  {
    icon: UserRound,
    title: 'Présentez votre profil',
    description: 'Partagez votre parcours, vos compétences et ce que vous aimeriez apporter à un projet.',
    link: 'Créer mon profil',
    to: '/profile',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    icon: FolderOpen,
    title: 'Trouvez un projet',
    description: 'Parcourez les idées de la communauté et découvrez les rôles et compétences recherchés.',
    link: 'Explorer les projets',
    to: '/projects',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: Lightbulb,
    title: 'Faites avancer une idée',
    description: 'Publiez votre projet, précisez les compétences recherchées et ouvrez-le aux candidatures.',
    link: 'Publier un projet',
    to: '/projects/create',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
]
