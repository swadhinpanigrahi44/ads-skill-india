'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShiningText } from '@/components/ui/shining-text'

interface FAQItem {
  q: string
  a: string
}

const FAQS: FAQItem[] = [
  {
    q: 'How does Ads Skill India work for affiliates?',
    a: 'Sign up as an affiliate, choose a plan, get your unique referral link, and start promoting. You earn commission on every successful referral.',
  },
  {
    q: 'Can I do affiliate marketing for free?',
    a: 'Yes, you can start with our basic Ads.lite plan which has a low entry cost, and upgrade as you grow.',
  },
  {
    q: 'How long does it take to see results?',
    a: 'Most affiliates see their first commissions within 30–60 days depending on their promotional activity and audience size.',
  },
  {
    q: 'Is affiliate marketing profitable?',
    a: 'Absolutely. Our top affiliates earn lakhs per month. With consistent effort and the right strategy, affiliate marketing can be highly profitable.',
  },
  {
    q: 'What mistakes should I avoid?',
    a: 'Avoid spamming, promoting irrelevant products, ignoring analytics, and not engaging your audience. Focus on genuine recommendations.',
  },
  {
    q: 'How do affiliates get paid?',
    a: 'Commissions are paid directly to your bank account or UPI. Payments are processed every month on the 5th for the previous month\'s earnings.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => setOpen(prev => prev === i ? null : i)

  return (
    <section id="faq" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      {/* Center glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%', top: '-5%', transform: 'translateX(-50%)',
          width: 700, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,60,200,0.18) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-7 h-px bg-[#0066ff]" />
            <span className="text-[#0066ff] text-[11px] font-bold uppercase tracking-[0.18em]">FAQ</span>
            <span className="block w-7 h-px bg-[#0066ff]" />
          </div>
          <h2 className="text-white font-black text-[clamp(2rem,4.5vw,3rem)] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-[14px] max-w-[440px] mx-auto leading-[1.7]">
            Get quick answers to common questions about affiliate marketing and how our
            platform works.
          </p>
        </motion.div>

        {/* Grid of FAQ items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-12">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-xl overflow-hidden border border-[#0066ff1a] hover:border-[#0066ff30] transition-colors duration-200"
              style={{ background: '#080f22' }}
            >
              <button
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                onClick={() => toggle(i)}
                aria-expanded={open === i}
              >
                <span className="text-white text-[13.5px] font-semibold leading-snug">{faq.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex-shrink-0 w-7 h-7 rounded-full bg-[#0d1e44] border border-[#0066ff25] flex items-center justify-center"
                >
                  <svg className="w-3.5 h-3.5 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-4 text-gray-400 text-[13px] leading-[1.7]">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              href="#"
              className="inline-flex items-center gap-2.5 bg-[#0066ff] hover:bg-[#0055ee] text-white font-extrabold text-[15px] px-8 py-4 rounded-full transition-all duration-200 shadow-[0_4px_24px_rgba(0,102,255,0.4)] group"
            >
              <ShiningText text="Know More" colorBase="#8ab4ff" colorMid="#c0d8ff" colorShine="#ffffff" className="font-extrabold" />
              <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
