import SplashIntroGate from '../components/SplashIntroGate'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import MentorsOrbitalTurntable from '../components/MentorsOrbitalTurntable'
import AfricaMapSection from '../components/AfricaMapSection'
import ProjectsCoverflow from '../components/ProjectsCoverflow'
import Features from '../components/Features'
import PlanApproval from '../components/PlanApproval'
import PublicStats from '../components/PublicStats'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#101915] text-slate-100 flex flex-col selection:bg-[#C9F06A] selection:text-black">
      {/* Intro Gate Preloader inspired by innovateiq */}
      <SplashIntroGate />

      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Capture 1: L'ADN de 54Devs & Défilement Orbital des Développeurs Mentors */}
        <MentorsOrbitalTurntable />

        {/* Capture 2: Le Collectif 54Devs, Carte Lumineuse d'Afrique & Défilement des 54 États */}
        <AfricaMapSection />

        {/* Capture 3: Coverflow 3D Perspective des Projets Publiés */}
        <ProjectsCoverflow />

        {/* Écosystème Central & Piliers */}
        <Features />

        {/* Approbation collaborative du plan */}
        <PlanApproval />

        {/* Statistiques publiques d'impact */}
        <PublicStats />

        {/* Appel à l'action */}
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
