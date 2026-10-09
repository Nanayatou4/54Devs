const stats = [
  { value: '54', label: 'Nations One Voice', accent: false },
  { value: '15k+', label: 'Active Engineers', accent: true },
  { value: '250+', label: 'Projects Built', accent: false },
  { value: '$0', label: 'Barriers to Entry', accent: true },
]

export default function Stats() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-1">{s.value}</div>
                <div className={`text-xs font-bold uppercase tracking-wider ${s.accent ? 'text-primary' : 'text-gray-400'}`}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
