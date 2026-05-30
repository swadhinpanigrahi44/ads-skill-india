'use client'

import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export default function RouteResetter({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <div key={pathname}>
      {children}
    </div>
  )
}
