'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

/* ── Animated wired-outline icons (lordicon-style) ───────────────── */

function RocketIcon() {
  return (
    <motion.svg
      className="w-10 h-10"
      viewBox="0 0 64 64"
      fill="none"
      stroke="#22c55e"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Rocket body */}
      <path d="M32 6 c8 8 12 18 12 28 v8 H20 v-8 c0-10 4-20 12-28 z" />
      {/* Window */}
      <circle cx="32" cy="26" r="4.5" />
      {/* Side fins */}
      <path d="M20 36 L12 44 L12 50 L20 46" />
      <path d="M44 36 L52 44 L52 50 L44 46" />
      {/* Bottom */}
      <path d="M26 50 H38" />
      {/* Animated flames */}
      <motion.path
        d="M28 52 L30 58 M32 52 L32 60 M36 52 L34 58"
        stroke="#facc15"
        animate={{ opacity: [0.5, 1, 0.5], pathLength: [0.6, 1, 0.6] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}

function HeadsetIcon() {
  return (
    <motion.svg
      className="w-10 h-10"
      viewBox="0 0 64 64"
      fill="none"
      stroke="#f97316"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: [-3, 3, -3] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Head outline */}
      <circle cx="32" cy="28" r="12" />
      {/* Headset band */}
      <path d="M14 30 v-2 a18 18 0 0 1 36 0 v2" />
      {/* Left earpiece */}
      <rect x="10" y="30" width="8" height="12" rx="2" />
      {/* Right earpiece */}
      <rect x="46" y="30" width="8" height="12" rx="2" />
      {/* Mic boom */}
      <path d="M50 42 v6 a4 4 0 0 1 -4 4 H36" />
      {/* Mic dot */}
      <motion.circle
        cx="34"
        cy="52"
        r="2"
        fill="#f97316"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Smile */}
      <path d="M28 30 q4 4 8 0" />
    </motion.svg>
  )
}

function CommissionIcon() {
  return (
    <motion.svg
      className="w-10 h-10"
      viewBox="0 0 64 64"
      fill="none"
      stroke="#facc15"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Hand */}
      <path d="M6 46 H40 a6 6 0 0 0 6 -6 v-2 a4 4 0 0 0 -4 -4 H30" />
      <path d="M6 46 v6 H42 a8 8 0 0 0 8 -8 v-4" />
      {/* Coin with percent */}
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="40" cy="20" r="10" />
        <circle cx="36" cy="16" r="1.6" fill="#facc15" />
        <circle cx="44" cy="24" r="1.6" fill="#facc15" />
        <path d="M36 24 L44 16" />
      </motion.g>
    </motion.svg>
  )
}

const FEATURES = [
  {
    icon: <RocketIcon />,
    accent: '#22c55e',
    title: 'Fast paid',
    desc: 'Commission fast paid',
  },
  {
    icon: <HeadsetIcon />,
    accent: '#f97316',
    title: 'Dedicated support',
    desc: '24/7 Customer Support',
  },
  {
    icon: <CommissionIcon />,
    accent: '#facc15',
    title: 'High commission',
    desc: 'We offer high rate for CPA',
  },
]

const LEFT_IMAGES = [
  { src: '/images/why-choose/685d2127286681750933799.png', className: 'col-span-2 row-span-1' },
  { src: '/images/why-choose/685d21273aea41750933799.png', className: 'col-span-1 row-span-1' },
  { src: '/images/why-choose/685d21273428a1750933799.png', className: 'col-span-1 row-span-1' },
]

export default function WhyChooseUs() {
  return (
    <section id="why-choose-us" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      {/* Right glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-8%', top: '20%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,80,220,0.22) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT — image collage */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="flex-1 relative"
          >
            <div className="grid grid-cols-2 gap-3 max-w-[460px]">
              <div className="col-span-2 rounded-xl overflow-hidden h-[200px]">
                <Image
                  src="/images/why-choose/685d2127286681750933799.png"
                  alt="Team working"
                  width={460}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden h-[160px]">
                <Image
                  src="/images/why-choose/685d21273aea41750933799.png"
                  alt="Team meeting"
                  width={220}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden h-[160px] relative">
                <Image
                  src="/images/why-choose/685d21273428a1750933799.png"
                  alt="Presentation"
                  width={220}
                  height={160}
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-[#0066ff] flex items-center justify-center shadow-[0_4px_20px_rgba(0,102,255,0.5)] cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — text content */}
          <div className="flex-1 max-w-[520px]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="block w-7 h-px bg-[#0066ff]" />
              <span className="text-[#0066ff] text-[11px] font-bold uppercase tracking-[0.18em]">Why Choose Us</span>
              <span className="block w-7 h-px bg-[#0066ff]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-white font-black text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] mb-5"
            >
              Why you should choose us for Affiliate
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-gray-300 text-[16px] font-medium leading-[1.8] mb-8"
            >
              Affiliate is perfect for grow your business &amp; you can earn lot of money by
              affiliate marketing, we all time ready for you.
            </motion.p>

            <div className="space-y-5">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
                  className="relative"
                >
                  {/* Notched card */}
                  <div
                    className="relative flex items-center gap-5 px-7 py-6 backdrop-blur-sm transition-colors duration-200"
                    style={{
                      background:
                        'linear-gradient(135deg, #0a1428 0%, #0c1730 60%, #0a1428 100%)',
                      border: '1px solid rgba(0,102,255,0.18)',
                      borderRadius: '18px',
                      clipPath:
                        'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 22px) calc(100% - 14px), calc(100% - 30px) 100%, 0 100%)',
                      boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.02), 0 8px 30px rgba(0,0,0,0.35)`,
                    }}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                      {f.icon}
                    </div>

                    {/* Vertical dotted divider */}
                    <span
                      className="flex-shrink-0 self-stretch"
                      style={{
                        width: 1,
                        backgroundImage:
                          'linear-gradient(to bottom, rgba(255,255,255,0.25) 50%, transparent 50%)',
                        backgroundSize: '1px 6px',
                      }}
                    />

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-extrabold text-[19px] leading-tight mb-1.5">
                        {f.title}
                      </p>
                      <p className="text-gray-300 font-medium text-[14.5px] leading-snug">
                        {f.desc}
                      </p>
                    </div>
                  </div>

                  {/* Accent glow line at bottom */}
                  <span
                    className="absolute left-6 right-12 bottom-0 h-px pointer-events-none"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${f.accent}66, transparent)`,
                      filter: 'blur(0.5px)',
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
