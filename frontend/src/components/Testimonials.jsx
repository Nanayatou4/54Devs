import { ArrowRight } from 'lucide-react'

export default function Testimonials() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="overflow-hidden">
              <img
                src="/landing-photo.png"
                alt="Developer Spotlight"
                className="w-full h-full object-cover min-h-[320px]"
              />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <span className="text-primary text-xs font-bold uppercase tracking-wider mb-2">Developer Spotlight</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Meet Amina Diallo</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Amina leveraged the 54Devs mentorship program to scale her AI startup from idea to a funded product serving thousands. Her story embodies the power of our community.
              </p>
              <a href="#" className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-primary transition underline underline-offset-4">
                Read her full story <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
