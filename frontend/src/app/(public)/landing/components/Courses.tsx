'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sprout, Rocket, Crown, Star } from 'lucide-react'
import { ShiningText } from '@/components/ui/shining-text'

interface Course {
  id: string
  name: string
  price: string
  period: string
  access: string
  courses: string
  hasCert: boolean
  features: string[]
  popular?: boolean
}

const FEATURES = [
  'Lifetime course access',
  'Completion certificate',
  'Expert instructors',
  'Study materials included',
]

const COURSES: Course[] = [
  {
    id: 'adslite',
    name: 'AdsLite',
    price: '1,495.00',
    period: '/lifetime',
    access: 'Lifetime Access',
    courses: '4 Courses',
    hasCert: true,
    features: FEATURES,
  },
  {
    id: 'adspro',
    name: 'AdsPro',
    price: '2,999.00',
    period: '/lifetime',
    access: 'Lifetime Access',
    courses: '6 Courses',
    hasCert: true,
    popular: true,
    features: FEATURES,
  },
  {
    id: 'adssumo',
    name: 'AdsSupreme',
    price: '5,999.00',
    period: '/lifetime',
    access: 'Lifetime Access',
    courses: '9 Courses',
    hasCert: true,
    features: FEATURES,
  },
  {
    id: 'adspremium',
    name: 'AdsPremium',
    price: '9,999.00',
    period: '/lifetime',
    access: 'Lifetime Access',
    courses: '12 Courses',
    hasCert: true,
    features: FEATURES,
  },
  {
    id: 'adspremiumplus',
    name: 'AdsPremium+',
    price: '15,999.00',
    period: '/lifetime',
    access: 'Lifetime Access',
    courses: '15 Courses',
    hasCert: true,
    features: FEATURES,
  },
]

/* Per-card icon + accent color — matches the pricing reference */
const CARD_META: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
  adslite: {
    color: '#34d399',
    bg: 'rgba(52,211,153,0.15)',
    icon: <Sprout className="w-5 h-5" strokeWidth={2.2} />,
  },
  adspro: {
    color: '#3b8aff',
    bg: 'rgba(59,138,255,0.16)',
    icon: <Rocket className="w-5 h-5" strokeWidth={2.2} />,
  },
  adssumo: {
    color: '#fbbf24',
    bg: 'rgba(251,191,36,0.16)',
    icon: <Crown className="w-5 h-5" strokeWidth={2.2} />,
  },
  adspremium: {
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.16)',
    icon: <Star className="w-5 h-5" strokeWidth={2.2} fill="currentColor" />,
  },
  adspremiumplus: {
    color: '#f472b6',
    bg: 'rgba(244,114,182,0.16)',
    icon: <Star className="w-5 h-5" strokeWidth={2.2} fill="currentColor" />,
  },
}

/* Wired-outline animated user icon for Get Started button */
function AnimatedUserIcon() {
  return (
    <motion.svg
      width="15" height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 20a6.5 6.5 0 0113 0" />
    </motion.svg>
  )
}

export default function Courses() {
  return (
    <section id="courses" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
      {/* Center glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: '50%', top: '-10%', transform: 'translateX(-50%)',
          width: 800, height: 500, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,60,200,0.16) 0%, transparent 65%)',
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
            <span className="text-[#0066ff] text-[11px] font-bold uppercase tracking-[0.18em]">Skill Development</span>
            <span className="block w-7 h-px bg-[#0066ff]" />
          </div>
          <h2 className="text-white font-black text-[clamp(2rem,4.5vw,3rem)] mb-4">Our Courses</h2>
          <p className="text-gray-300 text-[16px] font-medium max-w-[480px] mx-auto leading-[1.75]">
            Choose a plan to unlock premium courses and earn industry-recognized certificates.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-10">
          {COURSES.map((course, i) => {
            const meta = CARD_META[course.id]
            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{
                  scale: 1.04,
                  boxShadow: '0 0 0 2px rgba(0,102,255,0.75), 0 8px 48px rgba(0,102,255,0.22)',
                  transition: { duration: 0.2 },
                }}
                className={`relative rounded-2xl p-6 flex flex-col cursor-pointer ${
                  course.popular ? 'ring-2 ring-[#0066ff] shadow-[0_0_40px_rgba(0,102,255,0.2)]' : ''
                }`}
                style={{
                  background: course.popular
                    ? 'linear-gradient(160deg, #0d2060 0%, #061540 100%)'
                    : 'linear-gradient(160deg, #0a1535 0%, #070f20 100%)',
                  border: course.popular ? 'none' : '1px solid rgba(0,102,255,0.15)',
                  minHeight: 380,
                }}
              >
                {/* Most Popular badge */}
                {course.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#0066ff] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Per-card icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 border"
                  style={{
                    background: meta.bg,
                    borderColor: `${meta.color}40`,
                    color: meta.color,
                  }}
                >
                  {meta.icon}
                </div>

                <p className="text-white font-extrabold text-[18px] mb-2">{course.name}</p>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-gray-400 text-[12px]">₹</span>
                  <span className="text-white font-black text-[24px] mx-0.5">{course.price}</span>
                  <span className="text-gray-400 text-[11px]">{course.period}</span>
                </div>

                {/* Meta tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className="text-[9.5px] font-semibold text-gray-300 bg-[#0a1428] border border-[#0066ff1a] px-2 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                    </svg>
                    {course.access}
                  </span>
                  <span className="text-[9.5px] font-semibold text-gray-300 bg-[#0a1428] border border-[#0066ff1a] px-2 py-1 rounded-full flex items-center gap-1">
                    <svg className="w-2.5 h-2.5 text-[#0066ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    {course.courses}
                  </span>
                  {course.hasCert && (
                    <span className="text-[9.5px] font-semibold text-[#0066ff] bg-[#0066ff10] border border-[#0066ff30] px-2 py-1 rounded-full">
                      Certificate
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-[#0066ff12] mb-4" />

                {/* Features */}
                <ul className="space-y-2 flex-1 mb-5">
                  {course.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-gray-300 text-[12px]">
                      <svg className="w-3.5 h-3.5 text-[#0066ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Get Started button */}
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Link
                    href={`/register?plan=${course.id}`}
                    className="flex items-center justify-center gap-2 bg-[#0066ff] hover:bg-[#0055ee] text-white font-extrabold text-[16px] px-5 py-3.5 rounded-xl transition-all duration-200 shadow-[0_4px_16px_rgba(0,102,255,0.35)]"
                  >
                    <AnimatedUserIcon />
                    <ShiningText text="Get Started" colorBase="#8ab4ff" colorMid="#c0d8ff" colorShine="#ffffff" className="font-extrabold text-[16px]" />
                  </Link>
                </motion.div>
              </motion.div>
            )
          })}
        </div>

        {/* Browse All CTA */}
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
              className="inline-flex items-center gap-2.5 bg-[#0066ff] hover:bg-[#0055ee] text-white font-bold text-[15px] px-8 py-4 rounded-full transition-all duration-200 shadow-[0_4px_24px_rgba(0,102,255,0.4)] group"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Join Now to Browse All Courses
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
