'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const TAGS = [
  'BRAND AWARENESS',
  'TRAFFIC BENEFITS & SEO',
  'HIGH ROI',
  'LOW RISK',
  'DIVERSE INCOME STREAMS',
  'INCREASED REACH',
  'SCALABILITY',
  'LOW STARTUP COSTS',
  'PASSIVE INCOME',
]

export default function Benefits() {
  return (
    <section id="benefits" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      {/* Left glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-6%', top: '25%',
          width: 460, height: 460, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,80,220,0.22) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT — text content */}
          <div className="flex-1 max-w-[560px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="block w-7 h-px bg-[#0066ff]" />
              <span className="text-[#0066ff] text-[11px] font-bold uppercase tracking-[0.18em]">Benefit</span>
              <span className="block w-7 h-px bg-[#0066ff]" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="text-white font-black text-[clamp(1.8rem,4vw,2.8rem)] leading-[1.1] mb-5"
            >
              What is benefit of affiliate marketing
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-gray-400 text-[14px] leading-[1.75] mb-8"
            >
              Affiliate marketing offers several benefits, making it an attractive way to
              earn money online. Here are some key advantages:
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.22 }}
              className="flex flex-wrap gap-2.5"
            >
              {TAGS.map((tag, i) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.3 + i * 0.06 }}
                  className="text-[10px] font-bold text-white/80 uppercase tracking-widest border border-[#0066ff]/30 bg-[#0b1b3a]/80 px-3.5 py-1.5 rounded-full"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex-1 relative flex justify-center lg:justify-end"
          >
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0a1535 0%, #0d1e44 100%)',
                border: '1px solid rgba(0,102,255,0.12)',
              }}
            >
              <Image
                src="/images/benefit/685d22b68802a1750934198.png"
                alt="Affiliate marketer"
                width={460}
                height={480}
                className="w-full max-w-[460px] h-auto object-cover rounded-2xl"
                style={{ filter: 'drop-shadow(0 12px 32px rgba(0,40,200,0.25))' }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
