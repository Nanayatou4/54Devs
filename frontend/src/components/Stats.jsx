const stats = [
  { value: '54', label: 'Nations, One Voice' },
  { value: '15k+', label: 'Active Engineers' },
  { value: '250+', label: 'Projects Built' },
  { value: '$0', label: 'Barriers to Entry' },
]

export default function Stats() {
  return (
    <section className="bg-dark-1 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{s.value}</div>
              <div className="text-accent text-sm font-semibold tracking-wider uppercase">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
