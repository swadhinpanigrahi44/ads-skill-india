'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Transition } from 'framer-motion'
import { LogIn, UserPlus } from 'lucide-react'

const EASE_OUT = 'easeOut' as const
const NAV_T: Transition      = { duration: 0.6, ease: EASE_OUT }
const DROPDOWN_T: Transition = { duration: 0.2, ease: EASE_OUT }

const NAV_LINKS = [
  { label: 'Home',    href: '#home'    },
  { label: 'About',   href: '#about'   },
  { label: 'Courses', href: '#courses' },
  { label: 'FAQ',     href: '#faq'     },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={NAV_T}
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-5 pt-5"
    >
      {/* ── Pill container ──────────────────────────────────── */}
      <div
        className={`
          max-w-[1280px] mx-auto
          flex items-center justify-between
          px-4 sm:px-6 py-2.5 rounded-[30px]
          border transition-all duration-300
          ${scrolled
            ? 'bg-gradient-to-r from-black/95 via-[#071c48]/95 to-[#020510]/95 backdrop-blur-xl border-[#0055dd35] shadow-[0_4px_40px_rgba(0,40,140,0.45),inset_0_1px_0_rgba(0,102,255,0.1)]'
            : 'bg-gradient-to-r from-black/88 via-[#071535]/85 to-[#020510]/88 backdrop-blur-md  border-[#0055dd22] shadow-[0_2px_24px_rgba(0,20,80,0.35)]'}
        `}
      >
        {/* Logo */}
        <Link href="#home" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="ADS Skill India"
            width={152}
            height={44}
            priority
            className="h-[38px] w-auto object-contain"
          />
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13px] font-medium text-gray-300 hover:text-white transition-colors duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Login — solid blue */}
          <motion.a
            href="/login"
            whileHover={{ scale: 1.04 }}
            whileTap={{   scale: 0.96 }}
            className="flex items-center gap-2 bg-[#0066ff] hover:bg-[#0055ee] text-white text-[14px] font-bold px-5 py-2.5 rounded-full transition-colors duration-150 shadow-[0_2px_12px_rgba(0,102,255,0.4)]"
          >
            <LogIn size={17} strokeWidth={2.5} />
            Login
          </motion.a>

          {/* Register — outlined */}
          <motion.a
            href="/register"
            whileHover={{ scale: 1.04, backgroundColor: 'rgba(0,102,255,0.12)' }}
            whileTap={{   scale: 0.96 }}
            className="flex items-center gap-2 border border-[#0066ff] text-white text-[14px] font-bold px-5 py-2.5 rounded-full transition-all duration-150"
          >
            <UserPlus size={17} strokeWidth={2.5} className="text-[#3b8aff]" />
            Register
          </motion.a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col justify-center gap-[5px] p-1 text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-[22px] h-[2px] bg-white rounded-full origin-center transition-all duration-250 ${
              mobileOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-white rounded-full transition-all duration-250 ${
              mobileOpen ? 'opacity-0 scale-x-0' : ''
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-white rounded-full origin-center transition-all duration-250 ${
              mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8,  scaleY: 0.94 }}
            animate={{ opacity: 1, y: 0,   scaleY: 1    }}
            exit={{    opacity: 0, y: -8,  scaleY: 0.94 }}
            transition={DROPDOWN_T}
            className="md:hidden max-w-[1280px] mx-auto mt-2 bg-gradient-to-b from-black/98 via-[#071535]/98 to-[#020510]/98 backdrop-blur-xl border border-[#0055dd28] rounded-[28px] px-6 py-5 origin-top shadow-[0_8px_32px_rgba(0,20,80,0.5)]"
          >
            <nav className="flex flex-col gap-4 mb-5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] font-medium text-gray-300 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2.5">
              <a
                href="/login"
                className="flex items-center justify-center gap-2 bg-[#0066ff] text-white text-[14px] font-bold px-5 py-2.5 rounded-full"
              >
                <LogIn size={17} strokeWidth={2.5} />
                Login
              </a>
              <a
                href="/register"
                className="flex items-center justify-center gap-2 border border-[#0066ff] text-white text-[14px] font-bold px-5 py-2.5 rounded-full"
              >
                <UserPlus size={17} strokeWidth={2.5} className="text-[#3b8aff]" />
                Register
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
