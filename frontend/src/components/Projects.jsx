const projects = [
  {
    title: 'AgroTech Hub Kenya',
    description: 'Connecting small-scale farmers with direct markets using blockchain transparency.',
    status: 'IN DEVELOPMENT',
    statusColor: 'bg-green-500/20 text-green-400',
    tags: ['REACT', 'DJANGO', 'PYTHON'],
    avatars: 3,
    action: 'Request to Join',
  },
  {
    title: 'EduFree Pan-Africa',
    description: 'Offline-first learning management system for rural African schools.',
    status: 'IDEA STAGE',
    statusColor: 'bg-blue-500/20 text-blue-400',
    tags: ['FLUTTER', 'GO'],
    avatars: 2,
    action: 'Support Idea',
  },
  {
    title: 'SolarPay Nigeria',
    description: 'Micro-payment infrastructure for residential solar panel installations.',
    status: 'LAUNCHING',
    statusColor: 'bg-accent/20 text-accent',
    tags: ['JAVA', 'AWS'],
    avatars: 4,
    action: 'Explore Jobs',
  },
]

export default function Projects() {
  return (
    <section id="projects" className="bg-dark-1 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Discover Real Projects
            </h2>
            <p className="text-gray-400 text-lg">
              Browse challenges, join teams, and start building. From Idea to Launching, every stage is supported.
            </p>
          </div>
          <a
            href="#"
            className="mt-4 sm:mt-0 border border-accent text-accent hover:bg-accent hover:text-white px-5 py-2.5 rounded-lg font-semibold transition text-center whitespace-nowrap"
          >
            View All Projects
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div
              key={p.title}
              className="bg-dark-card rounded-2xl p-6 border border-dark-border flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${p.statusColor}`}>
                  {p.status}
                </span>
                <div className="flex -space-x-2">
                  {Array.from({ length: p.avatars }).map((_, i) => (
                    <div
                      key={i}
                      className="w-7 h-7 rounded-full bg-dark-3 border-2 border-dark-card flex items-center justify-center text-xs text-gray-400"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
              <p className="text-gray-400 text-sm mb-4 flex-1">{p.description}</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-dark-input text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button className="w-full bg-dark-input hover:bg-dark-3 text-white py-2.5 rounded-lg font-semibold transition border border-dark-border">
                {p.action}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
