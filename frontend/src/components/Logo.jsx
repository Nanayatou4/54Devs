import { Link } from 'react-router-dom'

/**
 * Composant Logo officiel 54Devs
 * Intègre le logo officiel de la marque :
 * - </> en vert néon (#C9F06A)
 * - 54 en blanc
 * - Devs en vert néon avec l'arche continentale africaine
 * - Tagline : CONNECT . LEARN . BUILD .
 *
 * @param {'full'|'icon'|'compact'} variant - Type d'affichage
 * @param {string} className - Classes Tailwind additionnelles
 * @param {string} [to] - Lien de redirection optionnel (ex: '/' ou '/dashboard')
 * @param {boolean} [withLink=true] - Entourer d'un lien <Link>
 */
export default function Logo({
  variant = 'full',
  className = '',
  to = '/',
  withLink = true,
  alt = '54Devs · Connect. Learn. Build.',
  ...props
}) {
  const content = (() => {
    if (variant === 'icon') {
      return (
        <div className={`relative inline-flex items-center justify-center shrink-0 ${className || 'h-9 w-9'}`} {...props}>
          <img
            src="/logo-icon.png"
            alt={alt}
            className="h-full w-full object-contain filter drop-shadow-[0_2px_8px_rgba(201,240,106,0.3)] transition-transform group-hover:scale-105"
            loading="eager"
          />
        </div>
      )
    }

    // Default: 'full' ou 'compact'
    return (
      <div className={`relative inline-flex items-center shrink-0 select-none ${className || 'h-9 sm:h-10'}`} {...props}>
        <img
          src="/logo-54devs.png"
          alt={alt}
          className="h-full w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(201,240,106,0.2)] transition-transform duration-200 group-hover:scale-[1.02]"
          loading="eager"
        />
      </div>
    )
  })()

  if (withLink && to) {
    return (
      <Link
        to={to}
        className="group inline-flex items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C9F06A] rounded-lg transition-opacity hover:opacity-95"
        aria-label="54Devs Accueil"
      >
        {content}
      </Link>
    )
  }

  return content
}
