'use client'

import type { StillTheme } from '@advertaro/content'
import { cn } from '@advertaro/ui'
import { useEffect, useRef } from 'react'
import { drawFilmStill, type StillMode } from '@/lib/film-still'

type FilmStillProps = {
  theme: StillTheme
  mode?: StillMode
  width?: number
  height?: number
  className?: string
}

/** Canvas "film still" used wherever the prototype had imagery. Decorative only. */
export function FilmStill({
  theme,
  mode = 'landscape',
  width = 1280,
  height = 720,
  className,
}: FilmStillProps) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    drawFilmStill(ref.current, theme.base, theme.glow, mode)
  }, [theme.base, theme.glow, mode])

  return (
    // biome-ignore lint/a11y/noAriaHiddenOnFocusable: canvas is decorative and not focusable
    <canvas
      ref={ref}
      width={width}
      height={height}
      aria-hidden="true"
      className={cn('media-fill', className)}
    />
  )
}
