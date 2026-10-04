import CTA from './components/CTA'
import Ecosystem from './components/Ecosystem'
import Footer from './components/Footer'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import PlanApproval from './components/PlanApproval'
import Projects from './components/Projects'
import Stats from './components/Stats'
import Testimonials from './components/Testimonials'

export default function App() {
  return (
    <div className="min-h-screen bg-dark-1">
      <Navbar />
      <Hero />
      <PlanApproval />
      <Ecosystem />
      <Projects />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
