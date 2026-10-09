import { useState } from 'react'
import { Shield, Brain, Users, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const MASTERY = [
  { icon: Shield, label: 'Architecture' },
  { icon: Shield, label: 'Security' },
  { icon: Brain, label: 'AI / ML' },
  { icon: Users, label: 'Leadership' },
]

export default function Mentorship() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-dark rounded-b-3xl mx-4 sm:mx-6 lg:mx-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-green text-white text-xs font-bold px-3 py-1 rounded-full mb-4">Expert Mentorship</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
              Elevate Your Career with 1-on-1 Mentorship
            </h1>
            <p className="text-gray-400 mb-8">
              Access world-class engineers who have built products for Google, Stripe, Jumia, and more. Bridge the gap from talent to elite expertise.
            </p>
            <div className="flex gap-3">
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-semibold transition">Find a Mentor</button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition">Become a Mentor</button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-green/20 rounded-2xl flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-primary/30 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Empty State */}
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center mb-8">
          <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <GraduationCap size={32} className="text-green" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Mentors coming soon</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            The mentorship program is being set up. Once mentors join the platform, they will appear here with their profiles, expertise, and booking options.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="bg-green hover:bg-green-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
              Become a Mentor
            </Link>
            <Link to="/community" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
              Browse Community
            </Link>
          </div>
        </div>

        {/* Explore by Mastery */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Explore by Mastery</h2>
          <div className="grid grid-cols-4 gap-4">
            {MASTERY.map(m => (
              <button key={m.label} className="bg-gray-50 rounded-xl p-5 text-center hover:bg-gray-100 transition">
                <m.icon size={24} className="text-gray-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-green rounded-3xl py-14 px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to share your expertise?</h2>
          <p className="text-white/80 max-w-md mx-auto mb-6">
            Join our elite group of mentors and help shape the next generation of African tech leaders.
          </p>
          <button className="bg-dark text-white px-6 py-3 rounded-lg font-semibold hover:bg-dark-2 transition">
            Become a Mentor
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
