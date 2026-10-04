import { CheckCircle, Shield } from 'lucide-react'

export default function PlanApproval() {
  return (
    <section id="plans" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="text-blue-500" size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Collaborative Plan Approval
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Streamline your team formation. Our intuitive review process allows project leads and mentors to approve
              development plans, ensuring every project is set for success in the CADEV 2026 competition.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                'Real-time status indicators (Approved, Pending, Rejected)',
                'Direct feedback loops for plan refinement',
                'One-click approval for seamless team onboarding',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-600">
                  <CheckCircle className="text-accent shrink-0 mt-0.5" size={20} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-dark-1 hover:bg-dark-3 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              <Shield size={18} />
              Start Review Process
            </a>
          </div>

          <div className="bg-dark-1 rounded-2xl p-6 border border-dark-border shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-semibold">
                Project Proposal: "Smart Grid Lagos"
              </h3>
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
                PENDING REVIEW
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Plan Completeness</span>
                <span className="text-white font-medium">85%</span>
              </div>
              <div className="h-2 bg-dark-input rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="bg-dark-input rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  M
                </div>
                <span className="text-white text-sm font-medium">Mentor Sarah</span>
                <span className="text-gray-500 text-sm">left a comment</span>
              </div>
              <p className="text-gray-400 text-sm">
                "The team matching for the frontend looks great, but let's refine the security architecture before approval."
              </p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-accent hover:bg-accent-hover text-white py-2.5 rounded-lg font-semibold transition">
                Approve Plan
              </button>
              <button className="flex-1 bg-dark-input hover:bg-dark-3 text-white py-2.5 rounded-lg font-semibold transition border border-dark-border">
                Request Edits
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
