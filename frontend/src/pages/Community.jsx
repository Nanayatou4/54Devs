import { useState } from 'react'
import { Search, UserPlus, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Community() {
  const [search, setSearch] = useState('')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Connect with Africa's <span className="text-primary">Elite</span>
            </h1>
            <p className="text-gray-500 max-w-lg">
              Discover and network with top-tier software engineers across 54 nations. Collaborate, share insights, and grow together.
            </p>
          </div>
          <Link to="/register" className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
            <UserPlus size={16} /> Invite a Peer
          </Link>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-8 flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, role, or stack..."
              className="w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none" />
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none">
            <option>All Countries</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 focus:outline-none">
            <option>Specialization</option>
          </select>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-5">
            <Users size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">The community is growing</h2>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Members will appear here as developers join the platform. Be among the first to create your profile and connect with others.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/register" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition">
              Join the Community
            </Link>
            <Link to="/register" className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
              Invite a Peer
            </Link>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Live Insights</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Engineers Online</span><span className="text-primary font-bold">—</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Open Collaborations</span><span className="text-primary font-bold">—</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Active Countries</span><span className="text-gray-900 font-bold">54</span></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Trending Tech</h3>
            <div className="flex flex-wrap gap-2">
              {['#Web3Africa', '#AIinLagos', '#RustLang', '#CloudNative'].map(t => (
                <span key={t} className="bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-lg font-medium">{t}</span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">How it works</h3>
            <p className="text-gray-500 text-sm">
              Once your backend adds a user listing endpoint, profiles will automatically appear here with real data.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
