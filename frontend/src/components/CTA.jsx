export default function CTA() {
  return (
    <section id="join" className="bg-dark-3 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Ready to Build for Africa?
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
          Join the CADEV 2026 movement today. Create your Identity and find your team.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/login"
            className="border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3.5 rounded-lg font-semibold transition text-lg"
          >
            Join 54Devs
          </a>
          <a
            href="#"
            className="bg-dark-input hover:bg-dark-2 text-white px-8 py-3.5 rounded-lg font-semibold transition text-lg border border-dark-border"
          >
            Review Active Plans
          </a>
        </div>
      </div>
    </section>
  )
}
