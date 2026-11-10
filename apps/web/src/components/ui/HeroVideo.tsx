'use client'

import Image from 'next/image'
import { useState, useSyncExternalStore } from 'react'

const motionQuery = '(prefers-reduced-motion: no-preference)'
const poster = '/video/hero-reel-poster.jpg'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(motionQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

function motionAllowed() {
  return window.matchMedia(motionQuery).matches
}

function serverSnapshot() {
  return false
}

/** Decorative reel. The server and reduced-motion users receive only the poster. */
export function HeroVideo() {
  const canAnimate = useSyncExternalStore(subscribe, motionAllowed, serverSnapshot)
  const [failed, setFailed] = useState(false)

  return (
    <>
      <Image src={poster} alt="" width={1920} height={1080} preload unoptimized />
      {canAnimate && !failed && (
        <video
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          poster={poster}
          tabIndex={-1}
          aria-hidden="true"
          onError={() => setFailed(true)}
        >
          <source src="/video/hero-reel.webm" type="video/webm" />
          <source src="/video/hero-reel.mp4" type="video/mp4" />
        </video>
      )}
    </>
  )
}
