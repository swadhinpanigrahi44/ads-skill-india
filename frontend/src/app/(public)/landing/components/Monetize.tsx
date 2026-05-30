'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShiningText } from '@/components/ui/shining-text'
import { CpuArchitecture } from '@/components/ui/cpu-architecture'

export default function Monetize() {
  return (
    <section id="monetize" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      {/* Background shape */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="/images/shapes/bs-2.png"
          alt=""
          fill
          className="object-cover object-right opacity-30"
        />
      </div>

      {/* Blue glow right */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-5%', top: '10%',
          width: 540, height: 540, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,70,220,0.25) 0%, transparent 65%)',
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
              className="mb-5"
            >
              <span className="inline-block bg-[#0044cc]/20 border border-[#0066ff]/30 text-[#4d9fff] text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                Monetize Your Traffic
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className="text-white font-black text-[clamp(2rem,5vw,3.4rem)] leading-[1.08] mb-5"
            >
              Become an Affiliate
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="text-gray-400 text-[14px] leading-[1.78] mb-8 max-w-[460px]"
            >
              Over 50,000+ affiliates choose Ads Skill India as their preferred marketplace,
              and for a good reason. We paid over ₹5+ Crore in commissions on time within 2
              years. Join our growing affiliate network and start earning today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.24 }}
            >
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2.5 bg-[#0066ff] hover:bg-[#0055ee] text-white font-extrabold text-[15px] px-8 py-4 rounded-full transition-all duration-200 shadow-[0_4px_28px_rgba(0,102,255,0.45)] group"
                >
                  <ShiningText text="Become an Affiliate" colorBase="#8ab4ff" colorMid="#c0d8ff" colorShine="#ffffff" className="font-extrabold" />
                  <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT — CPU Architecture + CTA */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="flex-1 relative flex flex-col items-center lg:items-end gap-6"
          >
            {/* Circuit diagram */}
            <div
              className="w-full max-w-[520px] rounded-2xl p-6"
              style={{
                background: 'linear-gradient(145deg,#0a1535 0%,#071228 100%)',
                border: '1px solid rgba(0,102,255,0.2)',
                boxShadow: '0 0 60px rgba(0,60,200,0.18)',
                color: 'rgba(0,102,255,0.7)',
              }}
            >
              <CpuArchitecture width="100%" height="220px" text="ADS" />
            </div>

            {/* Become an Affiliate button below the diagram */}
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 bg-[#0066ff] hover:bg-[#0055ee] text-white font-extrabold text-[15px] px-8 py-4 rounded-full transition-all duration-200 shadow-[0_4px_28px_rgba(0,102,255,0.45)] group"
              >
                <ShiningText text="Become an Affiliate" colorBase="#8ab4ff" colorMid="#c0d8ff" colorShine="#ffffff" className="font-extrabold" />
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
