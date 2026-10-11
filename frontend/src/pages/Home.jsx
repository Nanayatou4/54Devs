import CTA from '../components/CTA'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import Projects from '../components/Projects'
import PublicStats from '../components/PublicStats'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Projects />
      <PublicStats />
      <CTA />
      <Footer />
    </div>
  )
}
