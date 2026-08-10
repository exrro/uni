/** Landing page composing all story sections. */

import Navbar from '../components/landing/Navbar'
import Hero from '../components/landing/Hero'
import AboutSection from '../components/landing/AboutSection'
import StatsSection from '../components/landing/StatsSection'
import GallerySection from '../components/landing/GallerySection'
import FeaturesSection from '../components/landing/FeaturesSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
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
