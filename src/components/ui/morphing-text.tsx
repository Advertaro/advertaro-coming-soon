'use client'

import { useCallback, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const DEFAULT_MORPH_TIME = 1.5
const DEFAULT_COOLDOWN_TIME = 7.0

export interface MorphingTitleItem {
  line1: string
  line2?: string
}

export interface MorphingTextProps {
  className?: string
  texts?: string[]
  items?: MorphingTitleItem[]
  morphTime?: number
  cooldownTime?: number
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div' | 'span'
  line1ClassName?: string
  line2ClassName?: string
}

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0 pointer-events-none"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
)

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  items,
  className,
  morphTime = DEFAULT_MORPH_TIME,
  cooldownTime = DEFAULT_COOLDOWN_TIME,
  as: Component = 'div',
  line1ClassName,
  line2ClassName,
}) => {
  const normalizedItems: MorphingTitleItem[] =
    items ?? (texts ? texts.map((t) => ({ line1: t, line2: '' })) : [])
  const hasTwoLines = normalizedItems.some((item) => Boolean(item.line2))

  const itemsRef = useRef(normalizedItems)
  itemsRef.current = normalizedItems

  const textIndexRef = useRef(0)
  const morphRef = useRef(0)
  const cooldownRef = useRef(cooldownTime)
  const timeRef = useRef(new Date())

  // Line 1 refs
  const line1Text1Ref = useRef<HTMLSpanElement>(null)
  const line1Text2Ref = useRef<HTMLSpanElement>(null)

  // Line 2 refs
  const line2Text1Ref = useRef<HTMLSpanElement>(null)
  const line2Text2Ref = useRef<HTMLSpanElement>(null)

  const setStyles = useCallback((fraction: number) => {
    const currentItems = itemsRef.current
    if (currentItems.length === 0) return

    const l1Current1 = line1Text1Ref.current
    const l1Current2 = line1Text2Ref.current
    const l2Current1 = line2Text1Ref.current
    const l2Current2 = line2Text2Ref.current

    const invertedFraction = 1 - fraction
    const blur1 = Math.min(8 / invertedFraction - 8, 100)
    const blur2 = Math.min(8 / fraction - 8, 100)
    const opacity1 = `${invertedFraction ** 0.4 * 100}%`
    const opacity2 = `${fraction ** 0.4 * 100}%`

    const currentIndex = textIndexRef.current % currentItems.length
    const nextIndex = (textIndexRef.current + 1) % currentItems.length

    if (l1Current1 && l1Current2) {
      l1Current1.style.filter = `blur(${blur1}px)`
      l1Current1.style.opacity = opacity1
      l1Current2.style.filter = `blur(${blur2}px)`
      l1Current2.style.opacity = opacity2
      l1Current1.textContent = currentItems[currentIndex].line1
      l1Current2.textContent = currentItems[nextIndex].line1
    }

    if (l2Current1 && l2Current2) {
      l2Current1.style.filter = `blur(${blur1}px)`
      l2Current1.style.opacity = opacity1
      l2Current2.style.filter = `blur(${blur2}px)`
      l2Current2.style.opacity = opacity2
      l2Current1.textContent = currentItems[currentIndex].line2 ?? ''
      l2Current2.textContent = currentItems[nextIndex].line2 ?? ''
    }
  }, [])

  const doMorph = useCallback(() => {
    morphRef.current -= cooldownRef.current
    cooldownRef.current = 0

    let fraction = morphRef.current / morphTime

    if (fraction > 1) {
      cooldownRef.current = cooldownTime
      fraction = 1
    }

    setStyles(fraction)

    if (fraction === 1) {
      textIndexRef.current++
    }
  }, [setStyles, morphTime, cooldownTime])

  const doCooldown = useCallback(() => {
    morphRef.current = 0
    const currentItems = itemsRef.current
    if (currentItems.length === 0) return

    const currentIndex = textIndexRef.current % currentItems.length

    const l1Current1 = line1Text1Ref.current
    const l1Current2 = line1Text2Ref.current
    if (l1Current1 && l1Current2) {
      l1Current2.style.filter = 'none'
      l1Current2.style.opacity = '0%'
      l1Current1.style.filter = 'none'
      l1Current1.style.opacity = '100%'
      l1Current1.textContent = currentItems[currentIndex].line1
    }

    const l2Current1 = line2Text1Ref.current
    const l2Current2 = line2Text2Ref.current
    if (l2Current1 && l2Current2) {
      l2Current2.style.filter = 'none'
      l2Current2.style.opacity = '0%'
      l2Current1.style.filter = 'none'
      l2Current1.style.opacity = '100%'
      l2Current1.textContent = currentItems[currentIndex].line2 ?? ''
    }
  }, [])

  useEffect(() => {
    let animationFrameId: number

    // Initialize texts on mount
    const currentItems = itemsRef.current
    if (currentItems.length > 0) {
      if (line1Text1Ref.current) {
        line1Text1Ref.current.textContent = currentItems[0].line1
        line1Text1Ref.current.style.opacity = '100%'
        line1Text1Ref.current.style.filter = 'none'
      }
      if (line1Text2Ref.current && currentItems.length > 1) {
        line1Text2Ref.current.textContent = currentItems[1].line1
        line1Text2Ref.current.style.opacity = '0%'
        line1Text2Ref.current.style.filter = 'none'
      }

      if (line2Text1Ref.current) {
        line2Text1Ref.current.textContent = currentItems[0].line2 ?? ''
        line2Text1Ref.current.style.opacity = '100%'
        line2Text1Ref.current.style.filter = 'none'
      }
      if (line2Text2Ref.current && currentItems.length > 1) {
        line2Text2Ref.current.textContent = currentItems[1].line2 ?? ''
        line2Text2Ref.current.style.opacity = '0%'
        line2Text2Ref.current.style.filter = 'none'
      }
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const newTime = new Date()
      const dt = (newTime.getTime() - timeRef.current.getTime()) / 1000
      timeRef.current = newTime

      cooldownRef.current -= dt

      if (cooldownRef.current <= 0) doMorph()
      else doCooldown()
    }

    animate()
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [doMorph, doCooldown])

  const initialItem = normalizedItems[0]
  const nextItem = normalizedItems[1] ?? normalizedItems[0]

  return (
    <Component
      className={cn(
        'relative mx-auto w-full max-w-4xl text-center font-sans leading-tight filter-[url(#threshold)_blur(0.6px)]',
        className,
      )}
      style={{ filter: 'url(#threshold) blur(0.6px)' }}
    >
      <div className="relative flex w-full flex-col items-center justify-center">
        {/* Line 1 */}
        <div className="relative h-[1.15em] w-full flex items-center justify-center">
          <span
            className={cn('absolute inset-x-0 top-0 m-auto inline-block w-full', line1ClassName)}
            ref={line1Text1Ref}
          >
            {initialItem?.line1 ?? ''}
          </span>
          <span
            className={cn(
              'absolute inset-x-0 top-0 m-auto inline-block w-full opacity-0',
              line1ClassName,
            )}
            ref={line1Text2Ref}
          >
            {nextItem?.line1 ?? ''}
          </span>
        </div>

        {/* Line 2 (rendered if two lines present) */}
        {hasTwoLines && (
          <div className="relative h-[1.15em] w-full flex items-center justify-center">
            <span
              className={cn('absolute inset-x-0 top-0 m-auto inline-block w-full', line2ClassName)}
              ref={line2Text1Ref}
            >
              {initialItem?.line2 ?? ''}
            </span>
            <span
              className={cn(
                'absolute inset-x-0 top-0 m-auto inline-block w-full opacity-0',
                line2ClassName,
              )}
              ref={line2Text2Ref}
            >
              {nextItem?.line2 ?? ''}
            </span>
          </div>
        )}
      </div>
      <SvgFilters />
    </Component>
  )
}
