'use client'

import { cn } from '@advertaro/ui'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

// Optical sizes balance artwork area and density, rather than equalizing logo heights.
const clients = [
  { name: 'DAE', file: 'dae', width: 512, height: 171, size: 'w-32' },
  { name: 'GHR', file: 'ghr', width: 512, height: 474, size: 'w-18' },
  { name: 'HQ', file: 'hq', width: 512, height: 78, size: 'w-40' },
  { name: 'LRI PLC', file: 'lri-plc', width: 512, height: 512, size: 'w-18' },
  { name: 'Rapid', file: 'rapid', width: 136, height: 48, size: 'w-32' },
  { name: 'SCI', file: 'sci', width: 512, height: 512, size: 'w-15' },
  { name: 'Tropical House', file: 'tropical-house', width: 512, height: 592, size: 'w-18' },
  { name: 'W15 Collection', file: 'w15-collection', width: 512, height: 221, size: 'w-28' },
] as const

export function ClientMarquee() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let isIntersecting = false
    const updateActivity = () => setIsActive(isIntersecting && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return
      isIntersecting = entry.isIntersecting
      updateActivity()
    })

    observer.observe(container)
    document.addEventListener('visibilitychange', updateActivity)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateActivity)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="group/clients col-full mb-18 min-w-0"
      data-running={isActive}
    >
      <div className="overflow-hidden py-6 [mask-image:linear-gradient(to_right,transparent_8%,var(--color-ink)_25%,var(--color-ink)_75%,transparent_92%)] motion-reduce:[mask-image:none]">
        <div className="flex w-max min-w-full animate-client-marquee group-hover/clients:[animation-play-state:paused] group-data-[running=false]/clients:[animation-play-state:paused] motion-reduce:block motion-reduce:w-full motion-reduce:animate-none">
          {[false, true].map((isDuplicate) => (
            <ul
              key={String(isDuplicate)}
              aria-label={isDuplicate ? undefined : 'Our clients'}
              aria-hidden={isDuplicate || undefined}
              className={cn(
                'flex min-w-screen shrink-0 items-center justify-around gap-6 pr-6 motion-reduce:grid motion-reduce:min-w-0 motion-reduce:grid-cols-2 motion-reduce:gap-4 motion-reduce:px-shell sm:motion-reduce:grid-cols-4',
                isDuplicate && 'motion-reduce:hidden',
              )}
            >
              {clients.map((client) => (
                <li
                  key={client.file}
                  className="flex h-28 w-44 shrink-0 items-center justify-center motion-reduce:w-auto"
                >
                  <Image
                    src={`/logos/clients/${client.file}-logo.svg`}
                    alt={isDuplicate ? '' : client.name}
                    width={client.width}
                    height={client.height}
                    unoptimized
                    className={cn('h-auto max-w-full object-contain', client.size)}
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  )
}
