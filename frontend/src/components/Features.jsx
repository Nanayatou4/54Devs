import { ArrowRight, User, Zap, Layout } from 'lucide-react'

const features = [
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

export default function Features() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The 54Devs Core Ecosystem</h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-14">
          Moving from individual talent to collective creation across 54 nations.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl p-8 text-center group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto ${f.iconBg}`}>
                <f.icon size={24} className={f.iconColor} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 mb-6">{f.description}</p>
              <a href="#" className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                {f.link} <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
