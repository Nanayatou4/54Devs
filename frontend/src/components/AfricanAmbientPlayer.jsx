import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

/**
 * Bouton discret de contrôle audio pour la page d'accueil.
 * Joue "Jammu Africa" par Ismaël Lô (« D'ici ou d'ailleurs, nous sommes des enfants d'Afrique... »).
 * Permet d'arrêter ou de relancer le son en 1 clic via un bouton minimaliste.
 */
export default function AfricanAmbientPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio('/ismael-lo-africa.mp3?v=2')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    const startAudio = () => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false))
    }

    startAudio()

    const handleFirstGesture = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {})
      }
      window.removeEventListener('pointerdown', handleFirstGesture)
      window.removeEventListener('keydown', handleFirstGesture)
    }

    window.addEventListener('pointerdown', handleFirstGesture)
    window.addEventListener('keydown', handleFirstGesture)

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture)
      window.removeEventListener('keydown', handleFirstGesture)
      audio.pause()
      audio.src = ''
    }
  }, [])

  function toggleSound(e) {
    e?.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {})
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      <button
        type="button"
        onClick={toggleSound}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#16221C]/90 border border-white/15 text-white shadow-2xl backdrop-blur-xl hover:border-[#C9F06A]/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        title={isPlaying ? 'Arrêter le son' : 'Activer le son'}
        aria-label={isPlaying ? 'Arrêter le son' : 'Activer le son'}
      >
        {/* Glow discret quand la musique est active */}
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-[#C9F06A]/20 blur-md pointer-events-none" />
        )}

        {/* Infobulle discrète au survol */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[#16221C]/95 border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 shadow-xl opacity-0 group-hover:opacity-100 transition duration-200">
          {isPlaying ? 'Arrêter le son' : 'Activer le son'}
        </span>

        <div className="relative z-10 flex items-center justify-center">
          {isPlaying ? (
            <div className="flex items-center gap-1 text-[#C9F06A]">
              <Volume2 size={19} className="shrink-0" />
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-[#C9F06A] rounded-full animate-[bounce_0.8s_infinite_100ms]" />
                <span className="w-0.5 h-1.5 bg-[#C9F06A] rounded-full animate-[bounce_0.8s_infinite_300ms]" />
                <span className="w-0.5 h-2.5 bg-[#C9F06A] rounded-full animate-[bounce_0.8s_infinite_200ms]" />
              </div>
            </div>
          ) : (
            <div className="flex items-center text-white/40 group-hover:text-white transition">
              <VolumeX size={19} />
            </div>
          )}
        </div>
      </button>
    </div>
  )
}
