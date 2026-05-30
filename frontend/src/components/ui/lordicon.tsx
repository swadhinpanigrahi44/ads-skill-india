'use client'

import { useEffect } from 'react'

interface LordiconProps {
  src: string
  trigger?: 'hover' | 'click' | 'loop' | 'morph' | 'intro'
  size?: number | string
  className?: string
  colors?: string
  strokeWidth?: string
}

const sizeMap: Record<string, string> = {
  sm: '20px',
  md: '32px',
  lg: '48px',
  xl: '64px',
}

export function Lordicon({
  src,
  trigger = 'hover',
  size = 'md',
  className = '',
  colors = 'primary:#ffffff,secondary:#0066ff',
  strokeWidth = 'bold',
}: LordiconProps) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.lordicon.com/lordicon.js'
    script.async = true
    document.head.appendChild(script)
  }, [])

  const sizeValue = typeof size === 'string' ? sizeMap[size] || size : `${size}px`

  return (
    <lord-icon
      src={src}
      trigger={trigger}
      colors={colors}
      stroke={strokeWidth}
      style={{
        width: sizeValue,
        height: sizeValue,
      }}
      className={className}
    />
  )
}
