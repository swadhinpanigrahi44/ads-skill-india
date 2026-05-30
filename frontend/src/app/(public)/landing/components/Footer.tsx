'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, FormEvent } from 'react'
import { motion } from 'framer-motion'

const QUICK_LINKS = [
  { label: 'Home',           href: '#home'    },
  { label: 'Courses',        href: '#courses' },
  { label: 'Contact',        href: '#contact' },
  { label: 'Join As Affiliate', href: '#'    },
]

const USEFUL_LINKS = [
  { label: 'Privacy Policy',   href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Refund Policy',    href: '#' },
  { label: 'Disclaimer',       href: '#' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    if (email.trim() && /\S+@\S+\.\S+/.test(email)) setSubscribed(true)
  }

  return (
    <footer className="relative bg-[#030810] overflow-hidden">
      {/* Blue glow bottom-left */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '-5%', bottom: '0%',
          width: 400, height: 300, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,50,200,0.22) 0%, transparent 65%)',
        }}
      />

      <div className="relative z-10 max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Col 1 — Brand */}
          <div className="lg:col-span-1">
            <Link href="#home" className="inline-block mb-5">
              <Image
                src="/images/logo.png"
                alt="ADS Skill India"
                width={140}
                height={44}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-400 text-[13px] leading-[1.75] max-w-[240px]">
              Our platform is an all-in-one affiliate network platform that helps advertisers
              launch campaigns and allows affiliates to earn by promoting products through
              referral links.
            </p>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 className="text-white font-bold text-[14px] mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((l, i) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white text-[13px] transition-colors duration-200 group"
                  >
                    <lord-icon
                      src={[
                        'https://cdn.lordicon.com/kbtmeyae.json',
                        'https://cdn.lordicon.com/eszltkdh.json',
                        'https://cdn.lordicon.com/dmvvtziq.json',
                        'https://cdn.lordicon.com/osunyyww.json',
                      ][i]}
                      trigger="hover"
                      colors="primary:#0066ff"
                      style={{ width: '14px', height: '14px' }}
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Useful Links */}
          <div>
            <h4 className="text-white font-bold text-[14px] mb-6">Useful Links</h4>
            <ul className="space-y-3">
              {USEFUL_LINKS.map((l, i) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="flex items-center gap-2.5 text-gray-400 hover:text-white text-[13px] transition-colors duration-200 group"
                  >
                    <lord-icon
                      src={[
                        'https://cdn.lordicon.com/bhrnlfqh.json',
                        'https://cdn.lordicon.com/kffoyeua.json',
                        'https://cdn.lordicon.com/xfftupgo.json',
                        'https://cdn.lordicon.com/iykgtsdc.json',
                      ][i]}
                      trigger="hover"
                      colors="primary:#0066ff"
                      style={{ width: '14px', height: '14px' }}
                    />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Newsletter */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-[#0066ff] text-white text-[9.5px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                Newsletter
              </span>
            </div>
            <h4 className="text-white font-bold text-[15px] mb-5">Subscribe Newsletter</h4>

            {subscribed ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-[13px]"
              >
                Thank you for subscribing!
              </motion.p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 min-w-0 bg-[#080f20] border border-[#0066ff20] rounded-xl px-4 py-2.5 text-white text-[12.5px] placeholder:text-gray-600 focus:outline-none focus:border-[#0066ff50] transition-colors duration-200"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#0066ff] hover:bg-[#0055ee] flex items-center justify-center transition-colors duration-200 shadow-[0_4px_16px_rgba(0,102,255,0.4)]"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Copyright bar */}
      <div className="relative z-10 border-t border-[#0066ff0f]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-4">
          <p className="text-gray-500 text-[12.5px] text-center">
            Copyright © 2026{' '}
            <Link href="#" className="text-[#0066ff] hover:text-blue-400 transition-colors">
              Ads Skill India
            </Link>{' '}
            All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
