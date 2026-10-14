import {
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  Rocket,
  Settings,
  Sparkles,
  Users,
} from 'lucide-react'

export const appNavItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { key: 'projects', label: 'Projects', icon: Rocket, path: '/projects' },
  { key: 'smart-match', label: 'Smart Match', icon: Sparkles, path: '/smart-match' },
  { key: 'community', label: 'Community', icon: Users, path: '/community' },
  { key: 'mentorship', label: 'Mentorship', icon: GraduationCap, path: '/mentorship' },
  { key: 'job-board', label: 'Job Board', icon: Briefcase, path: '/job-board' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/profile' },
]
