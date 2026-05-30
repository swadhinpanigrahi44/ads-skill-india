'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const PARTNER_IMAGES = [
  '/images/partners/685d30c129d8d1750937793.png',
  '/images/partners/685d30bb7feeb1750937787.png',
  '/images/partners/685d315f21c491750937951.png',
  '/images/partners/685d31658419a1750937957.png',
  '/images/partners/685d31f36707a1750938099.png',
  '/images/partners/685d31fa51e061750938106.png',
  '/images/partners/685d3201076bd1750938113.png',
  '/images/partners/685d32113bd2f1750938129.png',
  '/images/partners/685d32171f0c51750938135.png',
  '/images/partners/685d321da58951750938141.png',
  '/images/partners/685d322544a581750938149.png',
  '/images/partners/685d324d81a5d1750938189.png',
]

export default function Partners() {
  return (
    <section id="partners" className="relative bg-[#050b18] overflow-hidden py-20 lg:py-28">
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
            <span className="text-[#0066ff] text-[11px] font-bold uppercase tracking-[0.18em]">Our Partners</span>
            <span className="block w-7 h-px bg-[#0066ff]" />
          </div>
          <h2 className="text-white font-black text-[clamp(2rem,4.5vw,3rem)] mb-4">
            Trusted partners
          </h2>
          <p className="text-gray-200 text-[14px] max-w-[500px] mx-auto leading-[1.7]">
            Trusted partners in affiliate marketing refer to reliable affiliate networks, programs,
            or individual affiliates who consistently deliver quality traffic, maintain transparent
            reporting, and uphold ethical marketing standards.
          </p>
        </motion.div>

        {/* Partners grid card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #0a1535 0%, #0c1a3a 50%, #081228 100%)',
            border: '1px solid rgba(0,102,255,0.15)',
          }}
        >
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
            {PARTNER_IMAGES.map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-center justify-center p-5 border border-[#0066ff10] hover:bg-[#0066ff08] transition-colors duration-200 cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Partner ${i + 1}`}
                  width={110}
                  height={40}
                  className="w-full max-w-[110px] h-10 object-contain filter brightness-90 hover:brightness-110 transition-all duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
