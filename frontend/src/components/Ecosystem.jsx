import { ArrowRight, Cpu, Rocket, Users } from 'lucide-react'

const features = [
  {
    icon: Cpu,
    title: 'Developer Identity',
    description:
      'Create a rich profile that showcases your skills, collaborations, and verified reputation across the continent.',
    link: 'Build Profile',
    color: 'bg-blue-50 text-blue-500',
  },
  {
    icon: Rocket,
    title: 'Smart Matching',
    description:
      'Find projects and collaborators with complementary skills. Our AI ensures the right fit for your team.',
    link: 'Find Matches',
    color: 'bg-orange-50 text-accent',
  },
  {
    icon: Users,
    title: 'Project Space',
    description:
      'A dedicated environment for teams to collaborate, track progress, and contribute to real-world solutions.',
    link: 'View Spaces',
    color: 'bg-green-50 text-green-500',
  },
]

export default function Ecosystem() {
  return (
    <section id="ecosystem" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          The 54Devs Core Ecosystem
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-14">
          Moving from individual talent to collective creation across 54 nations.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-8 text-center group"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 mx-auto ${f.color}`}>
                <f.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 mb-6">{f.description}</p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-accent font-semibold group-hover:gap-3 transition-all"
              >
                {f.link} <ArrowRight size={16} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
