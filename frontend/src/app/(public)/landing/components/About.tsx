'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShiningText } from '@/components/ui/shining-text'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'

const EASE_OUT = 'easeOut' as const

const BULLETS = [
  'No customer support needed',
  'Flexible work schedule',
  'Low startup cost',
  'Passive income potential',
]

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 40 },
  whileInView:{ opacity: 1, y: 0  },
  viewport:   { once: true, margin: '-80px' as const },
  transition: { duration: 0.65, delay, ease: EASE_OUT } as Transition,
})

export default function About() {
  return (
    <section id="about" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      {/* Blue glow left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-10%', top: '20%',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,80,220,0.28) 0%, rgba(0,40,140,0.12) 50%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* LEFT — image with floating badges */}
          <motion.div
            {...fadeUp(0)}
            className="flex-1 relative flex justify-center"
          >
            {/* Floating badge cards */}
            {([
              {
                text: 'EASY TO EARN',   top: '12%', left: '2%',
                bg: 'rgba(0,102,255,0.18)',    border: 'rgba(0,102,255,0.5)',
                glow: '0 0 14px rgba(0,102,255,0.45)', color: '#93c5fd',
                floatY: -9, dur: 3.0, delay: 0,
                icon: (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L4.09 12.26A1 1 0 005 14h6v8l8.91-10.26A1 1 0 0019 10h-6V2z"/>
                  </svg>
                ),
              },
              {
                text: 'PASSIVE INCOME', top: '12%', right: '2%',
                bg: 'rgba(6,182,212,0.18)',    border: 'rgba(6,182,212,0.5)',
                glow: '0 0 14px rgba(6,182,212,0.45)', color: '#67e8f9',
                floatY: -10, dur: 2.8, delay: 1.2,
                icon: (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
                    <polyline points="16 7 22 7 22 13"/>
                  </svg>
                ),
              },
              {
                text: 'FLEXIBLE WORK',  top: '64%', left: '4%',
                bg: 'rgba(249,115,22,0.18)',   border: 'rgba(249,115,22,0.5)',
                glow: '0 0 14px rgba(249,115,22,0.45)', color: '#fdba74',
                floatY: -8, dur: 3.2, delay: 0.4,
                icon: (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                ),
              },
              {
                text: 'SECURE MONEY',   top: '64%', right: '2%',
                bg: 'rgba(34,197,94,0.18)',    border: 'rgba(34,197,94,0.5)',
                glow: '0 0 14px rgba(34,197,94,0.45)', color: '#86efac',
                floatY: -9, dur: 3.6, delay: 1.0,
                icon: (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4 6v6c0 5.25 3.41 10.15 8 11.32C16.59 22.15 20 17.25 20 12V6l-8-4zm-1 13l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z"/>
                  </svg>
                ),
              },
            ] as Array<{
              text: string; top: string; left?: string; right?: string;
              bg: string; border: string; glow: string; color: string;
              floatY: number; dur: number; delay: number;
              icon: React.ReactNode;
            }>).map((b, i) => (
              /* outer: entrance fade-in */
              <motion.div
                key={b.text}
                initial={{ opacity: 0, scale: 0.75 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.3 + i * 0.1 }}
                className="absolute z-20"
                style={{ top: b.top, left: b.left, right: b.right }}
              >
                {/* inner: continuous float */}
                <motion.span
                  animate={{ y: [0, b.floatY, 0] }}
                  transition={{ duration: b.dur, repeat: Infinity, ease: 'easeInOut', delay: b.delay }}
                  className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{
                    background: b.bg,
                    border: `1px solid ${b.border}`,
                    boxShadow: b.glow,
                    color: b.color,
                  }}
                >
                  <span style={{ color: b.color }}>{b.icon}</span>
                  {b.text}
                </motion.span>
              </motion.div>
            ))}

            <div className="relative w-full max-w-[460px]">
              <Image
                src="/images/about/685cf57e672481750922622.png"
                alt="Person using laptop"
                width={460}
                height={500}
                className="w-full h-auto object-contain"
                style={{ filter: 'drop-shadow(0 12px 32px rgba(0,40,200,0.3))' }}
              />
            </div>
          </motion.div>

          {/* RIGHT — text content */}
          <div className="flex-1 max-w-[560px]">
            {/* Badge */}
            <motion.div {...fadeUp(0.1)} className="mb-5">
              <span className="inline-block bg-[#0a2a1a] border border-green-600/40 text-green-400 text-[10px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                Over 500+ Client
              </span>
            </motion.div>

            <motion.h2
              {...fadeUp(0.18)}
              className="text-white font-black text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.08] mb-5"
            >
              We are world best affiliate marketing platform
            </motion.h2>

            <motion.p
              {...fadeUp(0.25)}
              className="text-gray-300 text-[16px] font-medium leading-[1.8] mb-7 max-w-[460px]"
            >
              Affiliate is perfect for grow your business &amp; you can earn a lot of
              money by affiliate marketing, we all time ready for you
            </motion.p>

            <motion.ul {...fadeUp(0.3)} className="space-y-3 mb-8">
              {BULLETS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-300 text-[13.5px]">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-[#0066ff]/20 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </motion.ul>

            <motion.div {...fadeUp(0.38)}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link
                  href="/#courses"
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

        </div>
      </div>
    </section>
  )
}
