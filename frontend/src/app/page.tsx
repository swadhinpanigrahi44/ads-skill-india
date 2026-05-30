import Navbar       from './(public)/landing/components/Navbar'
import Hero         from './(public)/landing/components/Hero'
import About        from './(public)/landing/components/About'
import HowItWorks   from './(public)/landing/components/HowItWorks'
import WhyChooseUs  from './(public)/landing/components/WhyChooseUs'
import Benefits     from './(public)/landing/components/Benefits'
import Testimonials from './(public)/landing/components/Testimonials'
import Monetize     from './(public)/landing/components/Monetize'
import FAQ          from './(public)/landing/components/FAQ'
import Partners     from './(public)/landing/components/Partners'
import Courses      from './(public)/landing/components/Courses'
import Contact      from './(public)/landing/components/Contact'
import Footer       from './(public)/landing/components/Footer'

export const metadata = {
  title:       'ADS Skill India — Global Affiliate Marketing Platform',
  description: 'Grow your business & earn passive income through affiliate marketing with ADS Skill India.',
}

export default function Home() {
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
