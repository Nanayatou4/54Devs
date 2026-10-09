import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-green/20 text-green text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
              Built for Africa, by Africa
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Connect. Learn.
              <br />
              <span className="text-primary">Build across
              Africa.</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md mb-8">
              The pan-African ecosystem where developers move from individual talent to collective creation. Join 54 nations in building the future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/register"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                Create Identity
              </Link>
              <Link
                to="/projects"
                className="bg-dark-2 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition border border-white/10"
              >
                Explore Projects
              </Link>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="/image.png"
              alt="African developers collaborating"
              className="w-full rounded-2xl object-cover max-h-[420px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
