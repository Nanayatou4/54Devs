import { useState, useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'

export default function SplashIntroGate() {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isFadingOut, setIsFadingOut] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    // Check if user already entered in this tab session
    return sessionStorage.getItem('54devs_entered') === 'true'
  })

  useEffect(() => {
    if (dismissed) return

    // Smooth luxury progress countdown 0% -> 100%
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 14) + 6
        if (next >= 100) {
          clearInterval(timer)
          setIsReady(true)
          return 100
        }
        return next
      })
    }, 60)

    return () => clearInterval(timer)
  }, [dismissed])

  function handleEnter() {
    setIsFadingOut(true)
    sessionStorage.setItem('54devs_entered', 'true')
    setTimeout(() => {
      setDismissed(true)
    }, 700)
  }

  // Keyboard shortcut: Pressing Enter or Space triggers entry when ready
  useEffect(() => {
    if (dismissed) return
    function handleKeyDown(e) {
      if ((e.key === 'Enter' || e.key === ' ') && !isFadingOut) {
        handleEnter()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [dismissed, isFadingOut])

  if (dismissed) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#101915] text-white px-4 select-none transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div className="absolute h-[450px] w-[450px] rounded-full bg-[#C9F06A]/10 blur-[150px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto flex flex-col items-center">
        {/* Main Title (Stark, Bold Luxury Typography) */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.2em] font-display text-white">
          54DEVS
        </h1>

        {/* Subtitle 1 */}
        <p className="text-[11px] sm:text-xs text-white/55 tracking-[0.3em] uppercase font-mono mt-3.5">
          CONSTRUISONS L'AFRIQUE DU CODE
        </p>

        {/* Subtitle 2: Signature Cyber Emerald Tagline */}
        <p className="text-xs sm:text-sm text-[#C9F06A] font-bold tracking-[0.25em] uppercase font-mono mt-3">
          COLLECTIF TECH & MENTORAT PANAFRICAIN
        </p>

        {/* Glowing Progress Bar */}
        <div className="w-48 sm:w-60 h-[2px] bg-white/10 rounded-full mx-auto mt-8 mb-3 overflow-hidden relative">
          <div
            className="h-full bg-[#C9F06A] shadow-[0_0_12px_#C9F06A] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <span className="text-[11px] font-mono tracking-widest text-white/40">
          {progress}%
        </span>

        {/* Enter Button */}
        <button
          type="button"
          onClick={handleEnter}
          disabled={!isReady && progress < 100}
          className={`group mt-8 inline-flex items-center gap-2 rounded-full border px-8 py-3 text-xs font-bold uppercase tracking-[0.22em] font-mono transition-all duration-300 shadow-2xl ${
            isReady
              ? 'border-[#C9F06A] bg-[#16221C] text-white hover:bg-[#C9F06A] hover:text-black shadow-[0_0_25px_rgba(201,240,106,0.35)] hover:shadow-[0_0_35px_rgba(201,240,106,0.6)] cursor-pointer hover:scale-105'
              : 'border-white/20 bg-[#16221C]/60 text-white/50 cursor-wait'
          }`}
        >
          <span>ENTRER</span>
          <ArrowUpRight
            size={14}
            className={`stroke-[3] transition-transform duration-300 ${
              isReady ? 'text-[#C9F06A] group-hover:text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : 'text-white/30'
            }`}
          />
        </button>

        {/* Key Hint */}
        <span className="text-[10px] text-white/30 font-mono tracking-wider mt-4">
          {isReady ? 'Cliquez ou appuyez sur Entrée' : 'Initialisation du réseau...'}
        </span>
      </div>
    </div>
  )
}
