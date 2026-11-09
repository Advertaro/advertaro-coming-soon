/**
 * Procedural "film stills" — ported from the prototype's drawFilmStill().
 * They stand in for photography and screen recordings until real project
 * media exists, and keep every frame on-palette.
 */

export type StillMode =
  | 'landscape'
  | 'timeline'
  | 'reels-trio'
  | 'color-grade'
  | 'kinetic-wave'
  | 'nodes'
  | 'growth'

type RoundRectCtx = CanvasRenderingContext2D & {
  roundRect: (x: number, y: number, w: number, h: number, r: number) => void
}

export function drawFilmStill(
  canvas: HTMLCanvasElement,
  colorA: string,
  colorB: string,
  labelText: string,
  mode: StillMode = 'landscape',
) {
  const ctx = canvas.getContext('2d') as RoundRectCtx | null
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  ctx.clearRect(0, 0, w, h)

  const grad = ctx.createLinearGradient(0, 0, w, h)
  grad.addColorStop(0, '#06080d')
  grad.addColorStop(0.52, colorA)
  grad.addColorStop(1, '#08090c')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  // Ambient anamorphic rim glow
  const glow = ctx.createRadialGradient(w * 0.56, h * 0.42, 10, w * 0.56, h * 0.42, w * 0.52)
  glow.addColorStop(0, `${colorB}99`)
  glow.addColorStop(0.45, `${colorB}24`)
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  if (mode === 'timeline') {
    // Layout blocks — page sections stacked like an NLE timeline
    const tracks: { y: number; blocks: [number, number, string][] }[] = [
      {
        y: h * 0.25,
        blocks: [
          [0.08, 0.28, '#ff4d00'],
          [0.38, 0.22, '#fb923c'],
          [0.62, 0.26, '#ff4d00'],
        ],
      },
      {
        y: h * 0.43,
        blocks: [
          [0.14, 0.34, '#3b82f6'],
          [0.5, 0.32, '#60a5fa'],
        ],
      },
      { y: h * 0.61, blocks: [[0.08, 0.8, '#1e293b']] },
    ]
    for (const track of tracks) {
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      ctx.fillRect(w * 0.06, track.y, w * 0.88, h * 0.12)
      for (const [x, bw, color] of track.blocks) {
        ctx.fillStyle = `${color}cc`
        ctx.beginPath()
        ctx.roundRect(w * x, track.y + 3, w * bw, h * 0.12 - 6, 5)
        ctx.fill()
      }
    }
    ctx.strokeStyle = '#ff4d00'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.46, h * 0.14)
    ctx.lineTo(w * 0.46, h * 0.84)
    ctx.stroke()
  } else if (mode === 'reels-trio') {
    // Three vertical 9:16 frames
    const cardW = w * 0.21
    const cardH = h * 0.72
    ;[0.16, 0.4, 0.64].forEach((xPct, i) => {
      ctx.fillStyle = i === 1 ? 'rgba(255,77,0,0.22)' : 'rgba(255,255,255,0.07)'
      ctx.strokeStyle = i === 1 ? '#ff4d00' : 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(w * xPct, h * 0.14, cardW, cardH, 10)
      ctx.fill()
      ctx.stroke()
    })
  } else if (mode === 'color-grade') {
    // Split before / after
    ctx.fillStyle = 'rgba(140, 148, 160, 0.18)'
    ctx.fillRect(w * 0.06, h * 0.14, w * 0.42, h * 0.68)
    const warm = ctx.createLinearGradient(w * 0.48, h * 0.14, w * 0.94, h * 0.82)
    warm.addColorStop(0, 'rgba(255, 77, 0, 0.42)')
    warm.addColorStop(1, 'rgba(14, 116, 144, 0.42)')
    ctx.fillStyle = warm
    ctx.fillRect(w * 0.48, h * 0.14, w * 0.46, h * 0.68)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.48, h * 0.12)
    ctx.lineTo(w * 0.48, h * 0.84)
    ctx.stroke()
  } else if (mode === 'kinetic-wave') {
    // Translucent harmonic waves
    for (let k = 0; k < 6; k++) {
      ctx.strokeStyle = `rgba(255, 122, 46, ${0.22 + k * 0.11})`
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let x = 0; x <= w; x += 12) {
        const y = h * 0.5 + Math.sin((x / w) * Math.PI * 2.5 + k * 0.45) * (h * 0.18 - k * 6)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  } else if (mode === 'nodes') {
    // Workflow graph — connected system nodes
    const nodes: [number, number][] = [
      [0.14, 0.32],
      [0.14, 0.68],
      [0.42, 0.5],
      [0.68, 0.28],
      [0.68, 0.72],
      [0.88, 0.5],
    ]
    const links: [number, number][] = [
      [0, 2],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 5],
      [4, 5],
    ]
    ctx.lineWidth = 1.5
    for (const [a, b] of links) {
      const [ax, ay] = nodes[a] as [number, number]
      const [bx, by] = nodes[b] as [number, number]
      ctx.strokeStyle = 'rgba(96, 165, 250, 0.55)'
      ctx.beginPath()
      ctx.moveTo(w * ax, h * ay)
      ctx.bezierCurveTo(w * (ax + bx) * 0.5, h * ay, w * (ax + bx) * 0.5, h * by, w * bx, h * by)
      ctx.stroke()
    }
    nodes.forEach(([x, y], i) => {
      ctx.fillStyle = i === 2 ? 'rgba(255,77,0,0.3)' : 'rgba(255,255,255,0.08)'
      ctx.strokeStyle = i === 2 ? '#ff4d00' : 'rgba(255,255,255,0.3)'
      ctx.beginPath()
      ctx.roundRect(w * x - w * 0.06, h * y - h * 0.07, w * 0.12, h * 0.14, 8)
      ctx.fill()
      ctx.stroke()
    })
  } else if (mode === 'growth') {
    // Campaign bars with a rising trend line
    const bars = [0.22, 0.3, 0.28, 0.4, 0.46, 0.52, 0.6, 0.7]
    const bw = (w * 0.8) / bars.length
    bars.forEach((v, i) => {
      ctx.fillStyle = i === bars.length - 1 ? 'rgba(255,77,0,0.75)' : 'rgba(255,255,255,0.1)'
      ctx.beginPath()
      ctx.roundRect(w * 0.1 + i * bw + 4, h * (0.82 - v), bw - 8, h * v, 4)
      ctx.fill()
    })
    ctx.strokeStyle = '#f59e0b'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    bars.forEach((v, i) => {
      const x = w * 0.1 + i * bw + bw / 2
      const y = h * (0.78 - v)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.stroke()
  } else {
    // Anamorphic horizontal streak
    const streak = ctx.createLinearGradient(0, h * 0.46, w, h * 0.46)
    streak.addColorStop(0, 'transparent')
    streak.addColorStop(0.5, `${colorB}77`)
    streak.addColorStop(1, 'transparent')
    ctx.fillStyle = streak
    ctx.fillRect(0, h * 0.45, w, h * 0.018)

    // Architectural horizon silhouette
    ctx.fillStyle = 'rgba(6, 7, 10, 0.78)'
    ctx.beginPath()
    ctx.moveTo(0, h)
    ctx.lineTo(0, h * 0.66)
    ctx.lineTo(w * 0.28, h * 0.54)
    ctx.lineTo(w * 0.54, h * 0.62)
    ctx.lineTo(w * 0.78, h * 0.49)
    ctx.lineTo(w, h * 0.6)
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
  }

  // Frame guide border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
  ctx.lineWidth = 1
  ctx.strokeRect(20, 20, w - 40, h - 40)

  if (labelText) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.28)'
    ctx.font = "500 12px 'JetBrains Mono', monospace"
    ctx.fillText(labelText, 34, h - 32)
  }
}
