export default function Hero() {
  return (
    <section className="bg-dark-1 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-accent/20 text-accent text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full mb-6">
              Built for Africa, by Africa
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Connect. Learn.{' '}
              <span className="text-accent">Build across Africa.</span>
            </h1>
            <p className="text-gray-400 text-lg mt-6 max-w-lg">
              The pan-African ecosystem where developers move from individual talent to collective creation. Join 54
              nations in building the future.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <a
                href="/register"
                className="bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Create Identity
              </a>
              <a
                href="#projects"
                className="bg-dark-input hover:bg-dark-3 text-white px-6 py-3 rounded-lg font-semibold transition border border-dark-border"
              >
                Explore Projects
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop"
                alt="African developers collaborating"
                className="w-full h-80 object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-dark-1/90 backdrop-blur-sm rounded-lg p-3 border border-dark-border">
                <div className="w-40 h-24 bg-gradient-to-br from-green-400 via-yellow-400 to-orange-400 rounded opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
