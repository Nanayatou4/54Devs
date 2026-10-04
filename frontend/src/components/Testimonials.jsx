const testimonials = [
  {
    quote:
      "54Devs isn't just a site; it's our digital home. I found my team for the CADEV 2026 challenge here, and we're building something that actually matters.",
    name: 'Amara Diallo',
    role: 'Frontend Lead',
    country: 'Senegal',
    initials: 'AD',
    color: 'bg-blue-500',
  },
  {
    quote:
      "The smart matching is a game changer. I was recommended a project in Nairobi that matched my skills 95%. We're now launching our MVP.",
    name: 'Kwame Mensah',
    role: 'Backend Expert',
    country: 'Ghana',
    initials: 'KM',
    color: 'bg-accent',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          African Identity, Global Quality
        </h2>
        <p className="text-gray-500 text-lg mb-14">
          Connecting the continent through technical excellence.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-left"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
                >
                  {t.initials}
                </div>
                <p className="text-gray-600 leading-relaxed">"{t.quote}"</p>
              </div>
              <div className="mt-5">
                <div className="text-gray-900 font-semibold">{t.name}</div>
                <div className="text-accent text-sm font-medium">
                  {t.role} &bull; {t.country}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
