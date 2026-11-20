'use client'

import { useEffect, useRef } from 'react'

/**
 * Liquid morph filter for the hero's rotating word: noise ripples the blurred words, then an
 * alpha threshold melts them into one shape.
 */
export function HeroMorphFilter() {
  const svgRef = useRef<SVGSVGElement>(null)

  // The SMIL ripple and the CSS hero-morph-filter animation start on different clocks, so the
  // ripple would peak off-beat. Aligning the SVG clock to the CSS one keeps it mid-morph.
  useEffect(() => {
    const syncClock = () => {
      const morph = document
        .getAnimations()
        .find((a) => a instanceof CSSAnimation && a.animationName === 'hero-morph-filter')
      const cssTime = morph?.currentTime
      if (typeof cssTime === 'number') svgRef.current?.setCurrentTime(cssTime / 1000)
    }
    syncClock()
    document.addEventListener('visibilitychange', syncClock)
    return () => document.removeEventListener('visibilitychange', syncClock)
  }, [])

  return (
    <svg ref={svgRef} aria-hidden="true" className="absolute size-0">
      <filter id="hero-morph" x="-10%" y="-50%" width="120%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves={2} seed={4}>
          <animate
            attributeName="baseFrequency"
            dur="2.5s"
            values="0.012 0.05;0.018 0.07;0.012 0.05"
            repeatCount="indefinite"
          />
        </feTurbulence>
        {/* NOTE: 2.5s loop mirrors hero-morph-filter: ripple peaks mid-morph and is 0 when the filter toggles. */}
        <feDisplacementMap in="SourceGraphic" scale={0} xChannelSelector="R" yChannelSelector="G">
          <animate
            attributeName="scale"
            dur="2.5s"
            keyTimes="0;0.15;0.3;1"
            values="0;14;0;0"
            calcMode="spline"
            keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0 0 1 1"
            repeatCount="indefinite"
          />
        </feDisplacementMap>
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -90" />
      </filter>
    </svg>
  )
}
