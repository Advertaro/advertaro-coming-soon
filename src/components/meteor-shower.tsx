'use client'

import { Meteors } from '@/components/ui/meteors'

interface MeteorShowerProps {
  number?: number
  className?: string
}

export function MeteorShower({ number = 30, className }: MeteorShowerProps) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-105 overflow-hidden"
      aria-hidden="true"
    >
      <Meteors number={number} className={className} />
    </div>
  )
}

export default MeteorShower
