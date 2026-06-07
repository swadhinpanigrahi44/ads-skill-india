'use client'

import { motion } from 'framer-motion'
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1'
import type { Testimonial } from '@/components/ui/testimonials-columns-1'

/* ─── Edit testimonials data here ──────────────────────────────────────
   Each entry: text, image (URL), name, role
   Images below use randomuser.me — swap with real photos anytime.
──────────────────────────────────────────────────────────────────────── */
const testimonials: Testimonial[] = [
  {
    text: "ADS Skill India transformed my income. Within 60 days of joining I was earning consistent commissions every week.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    name: "Priya Sharma",
    role: "Affiliate Marketer",
  },
  {
    text: "The platform is incredibly easy to navigate. I got my affiliate link approved in less than 24 hours and started earning right away.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    name: "Rahul Verma",
    role: "Digital Creator",
  },
  {
    text: "Fast payouts, transparent tracking, and a support team that actually responds — this is the gold standard for affiliate networks.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    name: "Anita Desai",
    role: "Content Strategist",
  },
  {
    text: "I've tried 6 different affiliate platforms. ADS Skill India pays the highest CPA rates and the dashboard is beautiful.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    name: "Vikram Nair",
    role: "Performance Marketer",
  },
  {
    text: "The courses I purchased helped me understand affiliate funnels from scratch. Worth every rupee.",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    name: "Sneha Patel",
    role: "Freelance Blogger",
  },
  {
    text: "Low startup cost, huge earning potential. I recommend ADS Skill India to every aspiring passive income earner.",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    name: "Amir Khan",
    role: "YouTube Creator",
  },
  {
    text: "The referral commission structure is the most generous I've seen. My team of 10 affiliates now earns collectively.",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    name: "Kavya Reddy",
    role: "Team Lead, Affiliate Club",
  },
  {
    text: "Smooth onboarding, clean UI, and real-time earnings dashboard. I check my commissions every morning with a smile.",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    name: "Deepak Joshi",
    role: "Social Media Manager",
  },
  {
    text: "ADS Skill India's support team guided me through every step. Even as a complete beginner I felt confident.",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    name: "Meera Singh",
    role: "Part-time Affiliate",
  },
]

const firstColumn  = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn  = testimonials.slice(6, 9)

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      {/* Blue glow — bottom left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-5%', bottom: '0',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,60,200,0.18) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center max-w-[540px] mx-auto mb-14"
        >
          {/* Label pill */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-3">
              <span className="block w-7 h-px bg-[#0066ff]" />
              <span className="text-[#0066ff] text-[11px] font-bold uppercase tracking-[0.18em]">
                Testimonials
              </span>
              <span className="block w-7 h-px bg-[#0066ff]" />
            </div>
          </div>

          <h2 className="text-white font-black text-[clamp(1.9rem,4.5vw,3rem)] leading-[1.1] mb-4">
            Over 10,000+ clients trust our service and support
          </h2>
          <p className="text-gray-300 text-[16px] font-medium leading-[1.75]">
            Real results from real affiliates — see what our community says about earning with ADS Skill India.
          </p>
        </motion.div>

        {/* ── Scrolling columns ── */}
        <div className="flex justify-center gap-5 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={15}
          />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={19}
            className="hidden md:block"
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            duration={17}
            className="hidden lg:block"
          />
        </div>

      </div>
    </section>
  )
}
