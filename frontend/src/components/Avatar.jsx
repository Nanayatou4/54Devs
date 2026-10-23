import { useState, useEffect } from 'react'

// Teintes harmonisées avec la palette du site (vert/lime/teal…), choisies de façon stable selon le nom
const COLORS = ['#2F6B4F', '#3D7A5C', '#1F5F5B', '#4A6B2A', '#5B4B8A', '#7A4B5C', '#2C5A7A', '#6B5A2A']

export function initialsOf(name) {
  const parts = String(name || '').trim().split(/[\s._-]+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function colorOf(name) {
  let h = 0
  for (const ch of String(name || '')) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return COLORS[h % COLORS.length]
}

/**
 * Avatar façon WhatsApp : la photo choisie par l'utilisateur si elle existe,
 * sinon un rond coloré avec ses initiales.
 */
export default function Avatar({ src, name, className = 'h-8 w-8', textClassName = 'text-xs', title, style }) {
  const [broken, setBroken] = useState(false)
  const label = name || 'Utilisateur'

  useEffect(() => {
    setBroken(false)
  }, [src])

  if (src && !broken) {
    return (
      <img
        src={src}
        alt={label}
        title={title ?? label}
        onError={() => setBroken(true)}
        className={`${className} rounded-full object-cover shrink-0`}
        style={style}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={label}
      title={title ?? label}
      className={`${className} ${textClassName} rounded-full shrink-0 inline-flex items-center justify-center font-bold text-white select-none`}
      style={{ backgroundColor: colorOf(label), ...style }}
    >
      {initialsOf(label)}
    </span>
  )
}
