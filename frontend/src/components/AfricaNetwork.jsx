import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const AfricaGlobe = lazy(() => import('./AfricaGlobe'))

export default function AfricaNetwork() {
  const sectionRef = useRef(null)
  const [loadGlobe, setLoadGlobe] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !window.IntersectionObserver) {
      setLoadGlobe(true)
      return undefined
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadGlobe(true)
        observer.disconnect()
      }
    }, { rootMargin: '240px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="overflow-hidden bg-[#E9EDE4] py-16 text-[#18211B] sm:py-24">
      <div className="mx-auto grid max-w-[1320px] items-center gap-8 px-5 sm:px-8 lg:grid-cols-[0.88fr_1.12fr] lg:gap-12 lg:px-12">
        <div className="relative z-10 max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#53702D]"><span className="h-2 w-2 rounded-full bg-[#8DBB43]" /> Une ambition panafricaine</p>
          <h2 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-5xl lg:text-6xl">Les talents sont partout. Les connexions aussi.</h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#59625A]">54Devs veut faciliter les rencontres entre développeurs africains, au-delà des frontières et des réseaux habituels. Le globe illustre cette ambition : relier les personnes, les savoirs et les projets.</p>
          <Link to="/developers" className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#17221B] px-6 text-sm font-bold text-white transition hover:bg-[#2A3A2E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#53702D] motion-reduce:transition-none">
            Explorer les développeurs <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-[580px]">
          {loadGlobe ? <Suspense fallback={<GlobePlaceholder />}><AfricaGlobe /></Suspense> : <GlobePlaceholder />}
        </div>
      </div>
    </section>
  )
}

function GlobePlaceholder() {
  return <div aria-hidden="true" className="absolute inset-[10%] animate-pulse rounded-full bg-[radial-gradient(circle_at_36%_30%,#536B4B_0%,#26392D_52%,#142119_76%)] shadow-[0_30px_60px_-35px_rgba(0,0,0,0.5)]" />
}
