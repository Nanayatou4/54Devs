import { User, Zap, Layout } from 'lucide-react'

export const FEATURES = [
  {
    icon: User,
    title: 'Developer Identity',
    description: 'Create a rich profile that showcases real skills, verified reputation across the continent.',
    link: 'Build Profile',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    icon: Zap,
    title: 'Smart Matching',
    description: 'Find projects and collaborators with complementary skills. Our AI ensures the right fit for your team.',
    link: 'Find Matches',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    icon: Layout,
    title: 'Project Space',
    description: 'A dedicated environment for teams to collaborate, track progress, and contribute to real-world solutions.',
    link: 'View Spaces',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
  },
]
