/** Landing page composing all story sections. */

import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import AboutSection from '../components/landing/AboutSection'
import StatsSection from '../components/landing/StatsSection'
import GallerySection from '../components/landing/GallerySection'
import FeaturesSection from '../components/landing/FeaturesSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'
import KnowledgeJourneyBackground from '../components/landing/KnowledgeJourneyBackground'
import AmbientBackground from '../components/landing/AmbientBackground'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Ambient depth layers: radial glows + topographic linework + grain. */}
      <AmbientBackground />
      {/* Persistent decorative "knowledge journey" background behind everything. */}
      <KnowledgeJourneyBackground />
      <Navbar />
      <Hero />
      <AboutSection />
      <StatsSection />
      <GallerySection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  )
}
