import { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Play, Pause, Music2 } from 'lucide-react'

/**
 * Lecteur audio d'ambiance africaine pour la page d'accueil.
 * Joue "Kaira", chef-d'œuvre traditionnel de la Kora mandingue par le maître Mamadou Sidiki Diabaté.
 * - Démarrage automatique au chargement (avec gestion des politiques des navigateurs via premier clic)
 * - Volume doux et progressif (0.35) pour un accueil immersif sans être agressif
 * - Arrêt propre dès qu'on quitte la page d'accueil
 * - Widget flottant élégant aux couleurs de 54Devs avec visualiseur animé et contrôle lecture/pause
 */
export default function AfricanAmbientPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const audio = new Audio('/kora-welcome.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    // Tentative d'autoplay au montage
    const startAudio = () => {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasInteracted(true)
        })
        .catch(() => {
          // Si le navigateur bloque l'autoplay sans interaction préalable,
          // on écoute le premier clic ou appui de touche de l'utilisateur sur la page
          setIsPlaying(false)
        })
    }

    startAudio()

    // Gestionnaire de premier geste utilisateur si l'autoplay initial a été bloqué
    const handleFirstGesture = () => {
      if (!audioRef.current) return
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasInteracted(true)
        })
        .catch(() => {})
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

  function togglePlay(e) {
    e?.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setHasInteracted(true)
        })
        .catch(() => {})
    }
  }

  function toggleMute(e) {
    e?.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  return (
    <aside
      aria-label="Ambiance musicale africaine"
      className="fixed bottom-5 right-5 z-40 select-none font-body transition-all duration-300"
    >
      <div className="relative group">
        {/* Glow ambient background */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C9F06A]/30 to-[#22c55e]/30 blur-md opacity-70 group-hover:opacity-100 transition duration-500" />

        <div className="relative flex items-center gap-2.5 rounded-full bg-[#16221C]/95 border border-[#C9F06A]/40 px-3.5 py-2 text-white shadow-2xl backdrop-blur-xl">
          {/* Animated Equalizer Wave / Icon */}
          <button
            type="button"
            onClick={togglePlay}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#C9F06A]/15 text-[#C9F06A] hover:bg-[#C9F06A] hover:text-black transition-all shrink-0 cursor-pointer"
            title={isPlaying ? 'Mettre la musique en pause' : 'Lancer la musique d\'accueil'}
            aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la musique'}
          >
            {isPlaying ? (
              <div className="flex items-end justify-center gap-0.5 h-3.5 w-3.5">
                <span className="w-0.5 bg-current rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
                <span className="w-0.5 bg-current rounded-full animate-[bounce_1s_infinite_300ms] h-2/3" />
                <span className="w-0.5 bg-current rounded-full animate-[bounce_1s_infinite_200ms] h-5/6" />
              </div>
            ) : (
              <Play size={14} className="ml-0.5" />
            )}
          </button>

          {/* Track Info (Desktop / Expanded) */}
          <div
            onClick={() => setCollapsed(prev => !prev)}
            className="flex flex-col cursor-pointer min-w-0 pr-1"
          >
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C9F06A] animate-pulse" />
              <p className="text-[11px] font-bold tracking-wider uppercase text-white font-display truncate">
                Ambiance Kora
              </p>
            </div>
            <p className="text-[9px] font-mono tracking-tight text-white/60 truncate max-w-[140px] sm:max-w-[190px]">
              {isPlaying ? 'Mamadou S. Diabaté — Kaira' : 'Cliquer pour écouter'}
            </p>
          </div>

          {/* Volume Mute Toggle */}
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-full text-white/60 hover:text-[#C9F06A] hover:bg-white/5 transition shrink-0"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </aside>
  )
}
