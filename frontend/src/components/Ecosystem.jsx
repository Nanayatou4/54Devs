import { Users, GraduationCap, Code } from 'lucide-react'

export default function Ecosystem() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-4" style={{ gridTemplateRows: 'auto auto' }}>

          {/* Connect — left column, spans 2 rows */}
          <div className="md:row-span-2 bg-dark rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[420px]">
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                <Users size={20} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Connect</h3>
              <p className="text-gray-300 text-sm max-w-xs">
                Network with elite developers across all 54 African countries. Find your tribe, share knowledge, and grow together.
              </p>
            </div>
            {/* Africa map with glowing dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 400 450" className="w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </radialGradient>
                  <filter id="blur">
                    <feGaussianBlur stdDeviation="2" />
                  </filter>
                </defs>
                {/* Africa outline simplified */}
                <path d="M200,30 C160,30 140,50 130,70 C120,90 100,100 90,120 C80,140 70,170 65,200 C60,230 65,260 70,280 C75,300 80,320 100,340 C120,360 130,380 150,400 C170,420 190,430 200,430 C210,430 220,420 240,400 C260,380 280,360 290,340 C300,320 310,300 315,280 C320,260 325,230 320,200 C315,170 310,140 300,120 C290,100 280,90 270,70 C260,50 240,30 200,30Z"
                  fill="none" stroke="#1e40af" strokeWidth="0.5" opacity="0.3" />
                {/* Connection lines */}
                <line x1="180" y1="100" x2="250" y2="140" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="250" y1="140" x2="280" y2="200" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="180" y1="100" x2="150" y2="180" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="150" y1="180" x2="200" y2="240" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="200" y1="240" x2="280" y2="200" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="200" y1="240" x2="160" y2="300" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="200" y1="240" x2="250" y2="310" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="160" y1="300" x2="250" y2="310" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="120" y1="150" x2="150" y2="180" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="120" y1="150" x2="180" y2="100" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="250" y1="140" x2="300" y2="160" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="300" y1="160" x2="280" y2="200" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="160" y1="300" x2="200" y2="360" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                <line x1="250" y1="310" x2="200" y2="360" stroke="#3B82F6" strokeWidth="0.5" opacity="0.4" />
                {/* Glowing dots — major African cities */}
                {/* Cairo */}
                <circle cx="280" cy="90" r="6" fill="url(#glow)" /><circle cx="280" cy="90" r="2.5" fill="#60A5FA" />
                {/* Casablanca */}
                <circle cx="150" cy="75" r="6" fill="url(#glow)" /><circle cx="150" cy="75" r="2" fill="#60A5FA" />
                {/* Dakar */}
                <circle cx="100" cy="150" r="6" fill="url(#glow)" /><circle cx="100" cy="150" r="2.5" fill="#60A5FA" />
                {/* Lagos */}
                <circle cx="170" cy="200" r="8" fill="url(#glow)" /><circle cx="170" cy="200" r="3" fill="#93C5FD" />
                {/* Nairobi */}
                <circle cx="290" cy="230" r="8" fill="url(#glow)" /><circle cx="290" cy="230" r="3" fill="#93C5FD" />
                {/* Accra */}
                <circle cx="155" cy="215" r="5" fill="url(#glow)" /><circle cx="155" cy="215" r="2" fill="#60A5FA" />
                {/* Addis Ababa */}
                <circle cx="295" cy="185" r="6" fill="url(#glow)" /><circle cx="295" cy="185" r="2.5" fill="#60A5FA" />
                {/* Kigali */}
                <circle cx="265" cy="255" r="5" fill="url(#glow)" /><circle cx="265" cy="255" r="2" fill="#60A5FA" />
                {/* Johannesburg */}
                <circle cx="240" cy="350" r="7" fill="url(#glow)" /><circle cx="240" cy="350" r="2.5" fill="#93C5FD" />
                {/* Tunis */}
                <circle cx="195" cy="60" r="5" fill="url(#glow)" /><circle cx="195" cy="60" r="2" fill="#60A5FA" />
                {/* Kinshasa */}
                <circle cx="210" cy="265" r="6" fill="url(#glow)" /><circle cx="210" cy="265" r="2.5" fill="#60A5FA" />
                {/* Dar es Salaam */}
                <circle cx="285" cy="275" r="5" fill="url(#glow)" /><circle cx="285" cy="275" r="2" fill="#60A5FA" />
                {/* Cape Town */}
                <circle cx="195" cy="380" r="5" fill="url(#glow)" /><circle cx="195" cy="380" r="2" fill="#60A5FA" />
                {/* Abuja */}
                <circle cx="190" cy="185" r="5" fill="url(#glow)" /><circle cx="190" cy="185" r="2" fill="#60A5FA" />
                {/* Luanda */}
                <circle cx="185" cy="290" r="5" fill="url(#glow)" /><circle cx="185" cy="290" r="2" fill="#60A5FA" />
              </svg>
            </div>
          </div>

          {/* Learn — top-right, green/mint */}
          <div className="bg-green/80 rounded-2xl p-8 text-white min-h-[200px] flex flex-col justify-between relative">
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <GraduationCap size={20} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Learn</h3>
              <p className="text-white/80 text-sm">
                Access expert mentorship and cutting-edge resources designed to elevate your engineering skills.
              </p>
            </div>
            <div className="flex -space-x-2 mt-4">
              {['A', 'B', 'C', 'D'].map((l, i) => (
                <div key={i} className="w-9 h-9 rounded-full bg-white/30 border-2 border-green/80 flex items-center justify-center text-xs font-bold text-white">
                  {l}
                </div>
              ))}
              <div className="w-9 h-9 rounded-full bg-white/20 border-2 border-green/80 flex items-center justify-center text-[10px] font-bold text-white">+2k</div>
            </div>
          </div>

          {/* Build — bottom-right, blue */}
          <div className="bg-primary rounded-2xl p-8 text-white min-h-[200px] flex flex-col justify-between relative">
            <div>
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Code size={20} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Build</h3>
              <p className="text-white/80 text-sm">
                Collaborate on real-world, high-impact projects that solve meaningful problems across the continent.
              </p>
            </div>
            <div className="mt-4 bg-white/10 rounded-lg px-3 py-2.5 flex items-center gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-md shrink-0" />
              <span className="text-white/70 text-xs">Open-source fintech toolkit launching soon...</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
