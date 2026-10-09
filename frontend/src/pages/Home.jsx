import CTA from '../components/CTA'
import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Navbar from '../components/Navbar'
import PlanApproval from '../components/PlanApproval'
import Projects from '../components/Projects'
import Stats from '../components/Stats'
import TestimonialQuotes from '../components/TestimonialQuotes'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PlanApproval />
      <Features />
      <Projects />
      <Stats />
      <TestimonialQuotes />
      <CTA />
      <Footer />
    </div>
  )
}
