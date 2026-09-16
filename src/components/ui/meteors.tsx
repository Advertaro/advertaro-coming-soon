'use client'

import { type CSSProperties, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface MeteorsProps {
  number?: number
  minDelay?: number
  maxDelay?: number
  minDuration?: number
  maxDuration?: number
  angle?: number
  className?: string
}

interface MeteorItem {
  id: string
  style: CSSProperties
}

export const Meteors = ({
  number = 20,
  minDelay = 0.2,
  maxDelay = 1.2,
  minDuration = 2,
  maxDuration = 10,
  angle = 215,
  className,
}: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<MeteorItem[]>([])

  useEffect(() => {
    const styles = [...new Array(number)].map((_, idx) => ({
      id: `meteor-${idx}-${Math.random().toString(36).slice(2, 7)}`,
      style: {
        '--angle': `${-angle}deg`,
        top: '-5%',
        left: `calc(0% + ${Math.floor(Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800))}px)`,
        animationDelay: `${Math.random() * (maxDelay - minDelay) + minDelay}s`,
        animationDuration: `${Math.floor(Math.random() * (maxDuration - minDuration) + minDuration)}s`,
      } as CSSProperties,
    }))
    setMeteorStyles(styles)
  }, [number, minDelay, maxDelay, minDuration, maxDuration, angle])

  return (
    <>
      {meteorStyles.map((item) => (
        // Meteor Head
        <span
          key={item.id}
          style={item.style}
          className={cn(
            'animate-meteor pointer-events-none absolute size-0.5 rotate-(--angle) rounded-full bg-zinc-500 shadow-[0_0_0_1px_#ffffff10]',
            className,
          )}
        >
          {/* Meteor Tail */}
          <div className="pointer-events-none absolute top-1/2 -z-10 h-px w-12.5 -translate-y-1/2 bg-linear-to-r from-zinc-500 to-transparent" />
        </span>
      ))}
    </>
  )
}
