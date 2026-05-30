"use client"

import { motion } from "framer-motion"

interface ShiningTextProps {
  text: string
  className?: string
  colorBase?:  string
  colorMid?:   string
  colorShine?: string
  /** Set to 0 (or omit) to get shine-only with no horizontal float. */
  floatPx?: number
}

export function ShiningText({
  text,
  className  = "",
  colorBase  = "#b8860b",
  colorMid   = "#FFD600",
  colorShine = "#fff8c0",
  floatPx    = 0,
}: ShiningTextProps) {
  const animateProps = floatPx
    ? {
        backgroundPosition: ["-200% 0", "200% 0"] as string[],
        x: [-floatPx, floatPx, -floatPx],
      }
    : { backgroundPosition: ["-200% 0", "200% 0"] as string[] }

  const transitionProps = floatPx
    ? {
        backgroundPosition: { repeat: Infinity, duration: 2.8, ease: "linear" as const },
        x:                   { repeat: Infinity, duration: 3.6, ease: "easeInOut" as const },
      }
    : { backgroundPosition: { repeat: Infinity, duration: 2.8, ease: "linear" as const } }

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(110deg, ${colorBase} 25%, ${colorMid} 40%, ${colorShine} 50%, ${colorMid} 60%, ${colorBase} 75%)`,
        backgroundSize: "200% 100%",
      }}
      initial={{ backgroundPosition: "200% 0" }}
      animate={animateProps}
      transition={transitionProps}
    >
      {text}
    </motion.span>
  )
}
