export default function Footer() {
  return (
    <footer className="bg-dark-1 border-t border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <a href="#" className="flex items-center gap-2 text-xl font-bold text-white mb-4">
              <span className="text-accent">●</span>
              <span>54Devs</span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The definitive pan-African developer ecosystem. Connecting talent across 54 nations for the 2026 Coupe
              d'Afrique des Développeurs.
            </p>
            <div className="flex gap-3">
              {['X', 'in', 'GH'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-9 h-9 bg-dark-card hover:bg-dark-input rounded-lg flex items-center justify-center text-gray-400 hover:text-white text-xs font-bold transition"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">
              Platform
            </h4>
            <ul className="space-y-3">
              {['Developer Profile', 'Project Discovery', 'Smart Matching', 'Technical Q&A'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 tracking-wider text-sm uppercase">
              CADEV 2026
            </h4>
            <ul className="space-y-3">
              {['Competition Rules', 'Review Plans', 'Hall of Fame', 'Sponsors'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white text-sm transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; 2026 54Devs. All rights reserved. Built for CADEV.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Accessibility'].map((item) => (
              <a key={item} href="#" className="text-gray-500 hover:text-gray-300 text-sm transition">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
