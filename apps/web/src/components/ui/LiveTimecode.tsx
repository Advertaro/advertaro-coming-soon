'use client'

import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

/** Running 24fps timecode for the hero REC badge. */
export function LiveTimecode({ prefix = 'REC' }: { prefix?: string }) {
  const [frame, setFrame] = useState(14 * 60 * 24 + 8 * 24)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setFrame((f) => f + 1), 42)
    return () => window.clearInterval(id)
  }, [])

  const frames = frame % 24
  const secs = Math.floor(frame / 24) % 60
  const mins = Math.floor(frame / (24 * 60)) % 60

  return (
    <span suppressHydrationWarning>
      {prefix} 00:{pad(mins)}:{pad(secs)}:{pad(frames)}
    </span>
  )
}
