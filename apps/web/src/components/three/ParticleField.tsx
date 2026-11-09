'use client'

import { useEffect, useRef } from 'react'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'

const COUNT = 1400

/** Soft round sprite so points render as dots rather than squares. */
function dotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.45, 'rgba(255,255,255,0.85)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  return new CanvasTexture(canvas)
}

/**
 * Hero particle field: brand-orange points that tighten and rotate as the
 * hero scrolls away. Pauses when off-screen; never mounted for reduced motion.
 */
export default function ParticleField() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return

    let renderer: WebGLRenderer
    try {
      renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' })
    } catch {
      return // No WebGL — the film-still canvas underneath is enough.
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    host.appendChild(renderer.domElement)

    const scene = new Scene()
    const camera = new PerspectiveCamera(60, 1, 0.1, 100)
    camera.position.z = 9

    const positions = new Float32Array(COUNT * 3)
    const base = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const r = 3 + Math.random() * 6
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 7
      base[i * 3] = Math.cos(theta) * r
      base[i * 3 + 1] = y
      base[i * 3 + 2] = Math.sin(theta) * r
    }
    positions.set(base)

    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new BufferAttribute(positions, 3))
    const sprite = dotTexture()
    const material = new PointsMaterial({
      map: sprite,
      alphaTest: 0.01,
      color: new Color('#ff4d00'),
      size: 0.07,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const points = new Points(geometry, material)
    scene.add(points)

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      renderer.setSize(w, h, false)
      camera.aspect = w / Math.max(h, 1)
      camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)

    let visible = true
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false
      if (visible) frame = requestAnimationFrame(tick)
    })
    visibility.observe(host)

    let pointerX = 0
    let pointerY = 0
    const onPointer = (e: PointerEvent) => {
      pointerX = e.clientX / window.innerWidth - 0.5
      pointerY = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onPointer, { passive: true })

    let frame = 0
    let t = 0
    const attr = geometry.getAttribute('position') as BufferAttribute
    const tick = () => {
      if (!visible) return
      t += 0.0035
      const progress = Math.min(window.scrollY / Math.max(host.clientHeight, 1), 1)
      const spread = 1 - progress * 0.55
      for (let i = 0; i < COUNT; i++) {
        positions[i * 3] = (base[i * 3] ?? 0) * spread
        positions[i * 3 + 1] = (base[i * 3 + 1] ?? 0) * spread + Math.sin(t * 2 + i) * 0.02
        positions[i * 3 + 2] = (base[i * 3 + 2] ?? 0) * spread
      }
      attr.needsUpdate = true
      points.rotation.y = t + progress * 1.2
      points.rotation.x += (pointerY * 0.25 - points.rotation.x) * 0.04
      camera.position.x += (pointerX * 1.2 - camera.position.x) * 0.04
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      visibility.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointer)
      geometry.dispose()
      material.dispose()
      sprite.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={ref} className="particle-field" aria-hidden="true" />
}
