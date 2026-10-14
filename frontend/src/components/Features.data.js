import { UserCheck, Sparkles, Rocket } from 'lucide-react'

export const FEATURES = [
  {
    icon: UserCheck,
    title: 'Identité du développeur',
    description: 'Créez un profil riche qui met en avant vos compétences, vos collaborations et votre réputation vérifiée à travers le continent.',
    link: 'Créer mon profil',
    to: '/profile',
    iconBg: 'bg-[#C9F06A]/15 border border-[#C9F06A]/30',
    iconColor: 'text-[#C9F06A]',
  },
  {
    icon: Sparkles,
    title: 'Appariement intelligent',
    description: 'Trouvez des projets et des collaborateurs avec des compétences complémentaires. Notre algorithme garantit le bon choix pour votre équipe.',
    link: 'Trouver des matches',
    to: '/smart-match',
    iconBg: 'bg-[#C9F06A]/15 border border-[#C9F06A]/30',
    iconColor: 'text-[#C9F06A]',
  },
  {
    icon: Rocket,
    title: 'Espace de projet',
    description: 'Un environnement dédié pour que les équipes collaborent, suivent les progrès et contribuent à des solutions concrètes.',
    link: 'Explorer les espaces',
    to: '/projects',
    iconBg: 'bg-emerald-500/15 border border-emerald-500/30',
    iconColor: 'text-emerald-400',
  },
]
