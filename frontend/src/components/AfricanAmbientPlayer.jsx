import { useEffect, useRef } from 'react'

/**
 * Lecteur audio d'ambiance africaine pour la page d'accueil (mode discret en arrière-plan).
 * Joue "Jammu Africa" par Ismaël Lô (« D'ici ou d'ailleurs, nous sommes des enfants d'Afrique... »)
 * sans aucun widget ou élément visuel affiché à l'écran.
 */
export default function AfricanAmbientPlayer() {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = new Audio('/ismael-lo-africa.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    const startAudio = () => {
      audio.play().catch(() => {
        // Autoplay bloqué par le navigateur avant première interaction
      })
    }

    startAudio()

    const handleFirstGesture = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {})
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

  return null
}
