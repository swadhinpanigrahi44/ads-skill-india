'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '1',
    icon: (
      <svg className="w-8 h-8 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: 'Approved request',
    desc: 'You get a mail after approved your request & start your work',
  },
  {
    num: '2',
    icon: (
      <svg className="w-8 h-8 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    title: 'Request for permission',
    desc: 'Choose affiliate plan & request to admin for affiliate permission',
  },
  {
    num: '3',
    icon: (
      <svg className="w-8 h-8 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
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
          <p className="text-gray-400 text-[14px] max-w-[460px] mx-auto leading-[1.7]">
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
                {/* Connector arrow between steps */}
                {i < STEPS.length - 1 && (
                  <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 items-center gap-1 z-10 pr-0 translate-x-1/2">
                    <div className="flex gap-1">
                      {[0,1,2,3,4].map(d => (
                        <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#0066ff]/40" />
                      ))}
                    </div>
                    <svg className="w-4 h-4 text-[#0066ff]/60" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Number badge */}
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-full bg-[#0066ff]/10 border border-[#0066ff]/25 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#0066ff] text-white text-[10px] font-black flex items-center justify-center">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-white font-bold text-[15px] mb-2">{step.title}</h3>
                <p className="text-gray-400 text-[13px] leading-[1.65]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
