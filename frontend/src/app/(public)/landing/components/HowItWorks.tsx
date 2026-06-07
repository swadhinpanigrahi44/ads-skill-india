'use client'

import { motion } from 'framer-motion'
import { ClipboardList, Send, UserPlus } from 'lucide-react'

const STEPS = [
  {
    num: '1',
    icon: <ClipboardList className="w-9 h-9 text-[#3b8aff]" strokeWidth={1.8} />,
    title: 'Approved request',
    desc: 'You get a mail after approved your request & start your work',
  },
  {
    num: '2',
    icon: <Send className="w-9 h-9 text-[#3b8aff]" strokeWidth={1.8} />,
    title: 'Request for permission',
    desc: 'Choose affiliate plan & request to admin for affiliate permission',
  },
  {
    num: '3',
    icon: <UserPlus className="w-9 h-9 text-[#3b8aff]" strokeWidth={1.8} />,
    title: 'Sign up account',
    desc: 'Sign up your new account & complete your profile',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-8 h-px bg-[#0066ff]" />
            <span className="text-[#0066ff] text-[11px] font-bold uppercase tracking-[0.18em]">Work Process</span>
            <span className="block w-8 h-px bg-[#0066ff]" />
          </div>
          <h2 className="text-white font-black text-[clamp(2rem,4.5vw,3rem)] mb-4">How to work</h2>
          <p className="text-gray-300 text-[16px] font-medium max-w-[480px] mx-auto leading-[1.75]">
            A simple three-step process explaining how users can sign up, promote, and earn commissions.
          </p>
        </motion.div>

        {/* Steps card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0a1535 0%, #0d1e44 50%, #0a1535 100%)',
            border: '1px solid rgba(0,102,255,0.15)',
          }}
        >
          {/* Subtle glow inside card */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at 50% 120%, rgba(0,80,220,0.18) 0%, transparent 60%)',
          }} />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-0 p-8 md:p-14">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2 + i * 0.15 }}
                className="relative flex flex-col items-center text-center px-6 py-8"
              >
                {/* Curved dashed connector arrow between steps */}
                {i < STEPS.length - 1 && (
                  <svg
                    className="hidden md:block absolute top-[44px] left-1/2 z-10 text-[#3b8aff]/45 overflow-visible"
                    width="180" height="60" viewBox="0 0 180 60" fill="none"
                    style={{ transform: 'translateX(40px)' }}
                  >
                    <path d="M2 12 C 60 56, 120 56, 174 16" stroke="currentColor" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" />
                    <path d="M168 6 L 176 16 L 164 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                )}

                {/* Big ring + top-left number badge */}
                <div className="relative mb-6">
                  <div className="w-[88px] h-[88px] rounded-full bg-[#0066ff]/10 border-2 border-[#0066ff]/35 flex items-center justify-center shadow-[0_0_30px_rgba(0,102,255,0.18)]">
                    {step.icon}
                  </div>
                  <span className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-[#0066ff] text-white text-[12px] font-black flex items-center justify-center shadow-[0_0_14px_rgba(0,102,255,0.6)]">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-white font-extrabold text-[20px] mb-2.5">{step.title}</h3>
                <p className="text-gray-300 text-[15px] font-medium leading-[1.6] max-w-[230px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
