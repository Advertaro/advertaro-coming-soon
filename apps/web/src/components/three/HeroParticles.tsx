'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const ParticleField = dynamic(() => import('./ParticleField'), { ssr: false })

/** Lazy-loads Three.js only when motion is allowed. */
export function HeroParticles() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  return enabled ? <ParticleField /> : null
}
