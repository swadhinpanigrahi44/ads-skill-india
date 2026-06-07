'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { ShiningText } from '@/components/ui/shining-text'

/* ── constants ───────────────────────────────────────────────── */
const EASE_OUT = 'easeOut' as const

const TICKER_ITEMS = [
  'SECURE MONEY', 'PASSIVE INCOME', 'EASY TO EARN',
  'PASSIVE INCOME', 'SECURE MONEY', 'EASY TO EARN',
  'PASSIVE INCOME', 'SECURE MONEY', 'EASY TO EARN',
]

const BADGE_ITEMS = ['SECURE MONEY', 'PASSIVE INCOME', 'EASY TO EARN']

import React from 'react'

const RIGHT_FLOAT_CARDS = [
  {
    text: 'EASY TO EARN',
    bg: 'rgba(0,102,255,0.18)',   border: 'rgba(0,102,255,0.5)',
    glow: '0 0 14px rgba(0,102,255,0.45)', color: '#93c5fd',
    floatY: -8, dur: 3.0, delay: 0,
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 2L4.09 12.26A1 1 0 005 14h6v8l8.91-10.26A1 1 0 0019 10h-6V2z"/>
      </svg>
    ),
  },
  {
    text: 'PASSIVE INCOME',
    bg: 'rgba(6,182,212,0.18)',   border: 'rgba(6,182,212,0.5)',
    glow: '0 0 14px rgba(6,182,212,0.45)', color: '#67e8f9',
    floatY: -10, dur: 2.8, delay: 0.9,
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
  {
    text: 'SECURE MONEY',
    bg: 'rgba(34,197,94,0.18)',   border: 'rgba(34,197,94,0.5)',
    glow: '0 0 14px rgba(34,197,94,0.45)', color: '#86efac',
    floatY: -9, dur: 3.4, delay: 0.5,
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 6v6c0 5.25 3.41 10.15 8 11.32C16.59 22.15 20 17.25 20 12V6l-8-4zm-1 13l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z"/>
      </svg>
    ),
  },
  {
    text: 'FLEXIBLE WORK',
    bg: 'rgba(249,115,22,0.18)',  border: 'rgba(249,115,22,0.5)',
    glow: '0 0 14px rgba(249,115,22,0.45)', color: '#fdba74',
    floatY: -7, dur: 3.2, delay: 1.3,
    icon: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
]

/* ── animation helper ────────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 32 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.65, delay, ease: EASE_OUT } as Transition,
})

/* ──────────────────────────────────────────────────────────────
   HERO
────────────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section
      id="home"
      className="relative bg-[#060c1e] overflow-hidden flex flex-col"
      style={{ minHeight: '100dvh' }}
    >
      {/* ── Large blue radial glow — left center ─────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-8%',
          top: '15%',
          width: 660,
          height: 660,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,80,220,0.38) 0%, rgba(0,40,140,0.18) 45%, transparent 70%)',
        }}
      />

      {/* ── Secondary glow — far right ───────────────────────── */}
      <div
        className="absolute pointer-events-none"
        style={{
          right: '-5%',
          top: '10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(0,40,160,0.25) 0%, transparent 65%)',
        }}
      />

      {/* ── Background right-side stage shape ────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <Image
          src="/images/shapes/bs-2.png"
          alt=""
          fill
          className="object-cover object-right opacity-55"
          priority
        />
      </div>

      {/* ── Bottom-left floating shape ────────────────────────── */}
      <motion.div
        className="absolute bottom-20 left-6 pointer-events-none select-none"
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Image
          src="/images/shapes/bs-3.png"
          alt=""
          width={220}
          height={220}
          className="opacity-30"
        />
      </motion.div>

      {/* ────────────────────────────────────────────────────────
          MAIN CONTENT
      ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 pt-28 pb-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 min-h-[78vh]">

            {/* ══ LEFT COL ═══════════════════════════════════════ */}
            <div className="flex-1 flex flex-col justify-center max-w-[580px]">

              {/* Sub-label */}
              <motion.div
                {...fadeUp(0)}
                className="flex items-center gap-3 mb-5"
              >
                <span className="block flex-shrink-0 w-8 h-px bg-blue-500" />
                <span className="text-gray-300 text-[13px] font-medium tracking-wide">
                  Our Global Affiliate Marketing Platform
                </span>
                <span className="block flex-shrink-0 w-8 h-px bg-blue-500" />
              </motion.div>

              {/* Heading line 1 */}
              <motion.h1
                {...fadeUp(0.1)}
                className="font-black text-white uppercase tracking-[-0.01em] leading-[0.95]"
                style={{ fontSize: 'clamp(2.8rem, 6.8vw, 5.6rem)' }}
              >
                INCOME WITH THE
              </motion.h1>

              {/* Heading line 2 — AFFILIATE (white) + MARKETING (shining yellow) + ⭐ */}
              <motion.h1
                {...fadeUp(0.2)}
                className="font-black uppercase tracking-[-0.01em] leading-[0.95] mb-5 flex items-center flex-wrap"
                style={{ fontSize: 'clamp(2.8rem, 6.8vw, 5.6rem)' }}
              >
                <span className="text-white">AFFILIATE&nbsp;</span>
                <ShiningText
                  text="MARKETING"
                  colorBase="#b8860b"
                  colorMid="#FFD600"
                  colorShine="#fffde0"
                  floatPx={5}
                />
              </motion.h1>

              {/* Description */}
              <motion.p
                {...fadeUp(0.28)}
                className="text-gray-300 text-[16px] font-medium leading-[1.8] max-w-[440px] mb-6"
              >
                Affiliate is perfect for grow your business &amp; you can earn a
                lot of money by affiliate marketing, we all time ready for you
              </motion.p>

              {/* Badge pills */}
              <motion.div
                {...fadeUp(0.35)}
                className="flex flex-wrap gap-2 mb-7"
              >
                {BADGE_ITEMS.map((badge) => (
                  <span
                    key={badge}
                    className="text-[10px] font-bold text-white/85 uppercase tracking-widest border border-blue-700/40 bg-[#0b1b3a]/80 px-3.5 py-1.5 rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </motion.div>

              {/* CTA button */}
              <motion.div {...fadeUp(0.42)}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block"
                >
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2.5 bg-[#0066ff] hover:bg-[#0055ee] text-white font-extrabold text-[17px] px-9 py-4 rounded-full transition-all duration-200 shadow-[0_4px_28px_rgba(0,102,255,0.45)] hover:shadow-[0_6px_36px_rgba(0,102,255,0.65)] group"
                  >
                    <ShiningText text="Become an Affiliate" colorBase="#8ab4ff" colorMid="#c0d8ff" colorShine="#ffffff" className="font-extrabold text-[17px]" />
                    <svg
                      className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.8}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* ══ RIGHT COL ══════════════════════════════════════ */}
            <div className="flex-1 relative flex justify-center lg:justify-end items-end lg:items-center self-end lg:self-auto">

              {/* 3D blue coin / barrel decoration — far left of image area */}
              <motion.div
                className="absolute left-[-30px] top-1/2 -translate-y-1/2 z-20 hidden lg:block"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Image
                  src="/images/shapes/bs-1.png"
                  alt=""
                  width={100}
                  height={100}
                  className="opacity-95"
                />
              </motion.div>

              {/* Small star sparkle top-right */}
              <motion.div
                className="absolute top-6 right-10 z-20"
                animate={{ y: [-6, 6, -6], rotate: [0, 20, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
              >
                <Image
                  src="/images/shapes/st.png"
                  alt=""
                  width={32}
                  height={32}
                  className="opacity-90"
                />
              </motion.div>

              {/* Floating label badges on the right */}
              <div className="absolute left-0 top-0 bottom-0 z-20 hidden lg:flex flex-col justify-center gap-2 pointer-events-none">
                {RIGHT_FLOAT_CARDS.map((card, i) => (
                  /* outer: entrance */
                  <motion.div
                    key={card.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.12, ease: EASE_OUT } as Transition}
                  >
                    {/* inner: continuous y-float */}
                    <motion.span
                      animate={{ y: [0, card.floatY, 0] }}
                      transition={{ duration: card.dur, repeat: Infinity, ease: 'easeInOut', delay: card.delay }}
                      className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full backdrop-blur-sm w-fit"
                      style={{
                        background: card.bg,
                        border: `1px solid ${card.border}`,
                        boxShadow: card.glow,
                        color: card.color,
                      }}
                    >
                      <span>{card.icon}</span>
                      {card.text}
                    </motion.span>
                  </motion.div>
                ))}
              </div>

              {/* Hero person image */}
              <motion.div
                initial={{ opacity: 0, x: 60, scale: 0.96 }}
                animate={{ opacity: 1, x: 0,  scale: 1    }}
                transition={{ duration: 0.9, delay: 0.22, ease: EASE_OUT } as Transition}
                className="relative w-full max-w-[530px] lg:max-w-[580px]"
              >
                <Image
                  src="/images/banner/685cda0398c0c1750915587.png"
                  alt="Affiliate Marketer"
                  width={640}
                  height={700}
                  priority
                  className="w-full h-auto object-contain"
                  style={{
                    filter: 'drop-shadow(0 16px 40px rgba(0,40,200,0.35))',
                  }}
                />
              </motion.div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Full-width scrolling ticker at bottom ─────────────── */}
      <div className="relative z-10 bg-[#07101f] border-t border-[#0066ff1a] py-4 overflow-hidden">
        <div className="animate-marquee">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center mx-3 px-5 py-2 rounded-md bg-[#0066ff] text-white text-[12px] font-bold tracking-[0.18em] uppercase select-none whitespace-nowrap flex-shrink-0 shadow-[0_4px_18px_rgba(0,102,255,0.35)]"
              style={{ transform: 'skewX(-12deg)' }}
            >
              <span style={{ transform: 'skewX(12deg)', display: 'inline-block' }}>{item}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
