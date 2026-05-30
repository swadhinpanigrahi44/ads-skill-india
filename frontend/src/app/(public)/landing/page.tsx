import Navbar       from './components/Navbar'
import Hero         from './components/Hero'
import About        from './components/About'
import HowItWorks   from './components/HowItWorks'
import WhyChooseUs  from './components/WhyChooseUs'
import Benefits     from './components/Benefits'
import Testimonials from './components/Testimonials'
import Monetize     from './components/Monetize'
import FAQ          from './components/FAQ'
import Partners     from './components/Partners'
import Courses      from './components/Courses'
import Contact      from './components/Contact'
import Footer       from './components/Footer'

export const metadata = {
  title:       'ADS Skill India — Global Affiliate Marketing Platform',
  description: 'Grow your business & earn passive income through affiliate marketing with ADS Skill India.',
}

export default function LandingPage() {
  return (
    <main className="bg-[#050b18] min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <HowItWorks />
      <WhyChooseUs />
      <Benefits />
      <Testimonials />
      <Monetize />
      <FAQ />
      <Partners />
      <Courses />
      <Contact />
      <Footer />
    </main>
  )
}
