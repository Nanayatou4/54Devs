import { Link } from 'react-router-dom'

export default function CTA() {
  return (
    <section className="bg-primary py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Build for Africa?
        </h2>
        <p className="text-white/70 max-w-lg mx-auto mb-10">
          Join the CADEV 2026 movement today. Create your Identity and find your team.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/register"
            className="border-2 border-white text-white hover:bg-white hover:text-primary px-6 py-3 rounded-lg font-semibold transition"
          >
            Join 54Devs
          </Link>
          <Link
            to="/projects"
            className="bg-dark hover:bg-dark-2 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Review Active Plans
          </Link>
        </div>
      </div>
    </section>
  )
}
