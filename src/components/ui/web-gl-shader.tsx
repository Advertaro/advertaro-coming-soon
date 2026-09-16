'use client'

import { memo, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { cn } from '@/lib/utils'

const DEFAULT_COLOR_1: [number, number, number] = [0.855, 0.271, 0.086] // #DA4516 (Advertaro Brand Orange)
const DEFAULT_COLOR_2: [number, number, number] = [0.953, 0.455, 0.09] // #F37417 (Warm Amber Orange)
const DEFAULT_COLOR_3: [number, number, number] = [0.486, 0.227, 0.929] // #7C3AED (Violet)

export interface WebGLShaderProps {
  className?: string
  /**
   * Primary brand color (Advertaro Orange #DA4516 default)
   */
  color1?: [number, number, number]
  /**
   * Secondary brand accent color (Warm Amber/Peach #F37417 default)
   */
  color2?: [number, number, number]
  /**
   * Violet accent color (#7C3AED / #8B5CF6 default)
   */
  color3?: [number, number, number]
  xScale?: number
  yScale?: number
  distortion?: number
  speed?: number
}

export const WebGLShader = memo(function WebGLShader({
  className,
  color1 = DEFAULT_COLOR_1,
  color2 = DEFAULT_COLOR_2,
  color3 = DEFAULT_COLOR_3,
  xScale = 1.0,
  yScale = 0.5,
  distortion = 0.05,
  speed = 0.008,
}: WebGLShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const speedRef = useRef(speed)
  speedRef.current = speed

  const propsRef = useRef({ color1, color2, color3, xScale, yScale, distortion })
  propsRef.current = { color1, color2, color3, xScale, yScale, distortion }

  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: {
      resolution: { value: [number, number] }
      time: { value: number }
      xScale: { value: number }
      yScale: { value: number }
      distortion: { value: number }
      color1: { value: [number, number, number] }
      color2: { value: [number, number, number] }
      color3: { value: [number, number, number] }
      [key: string]: THREE.IUniform
    } | null
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  // Keep uniforms up to date if props change without restarting the WebGL scene
  useEffect(() => {
    if (!sceneRef.current.uniforms) return
    sceneRef.current.uniforms.xScale.value = xScale
    sceneRef.current.uniforms.yScale.value = yScale
    sceneRef.current.uniforms.distortion.value = distortion
    sceneRef.current.uniforms.color1.value = color1
    sceneRef.current.uniforms.color2.value = color2
    sceneRef.current.uniforms.color3.value = color3
  }, [color1, color2, color3, xScale, yScale, distortion])

  // Initialize WebGL scene once on mount
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 color3;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        vec3 col = r * color1 + g * color2 + b * color3;
        gl_FragColor = vec4(col, 1.0);
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      refs.renderer.setClearColor(new THREE.Color(0x050505), 1.0)

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: propsRef.current.xScale },
        yScale: { value: propsRef.current.yScale },
        distortion: { value: propsRef.current.distortion },
        color1: { value: propsRef.current.color1 },
        color2: { value: propsRef.current.color2 },
        color3: { value: propsRef.current.color3 },
      }

      const position = [
        -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, 1.0,
        0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += speedRef.current
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms || !canvasRef.current) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    animate()
    window.addEventListener('resize', handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener('resize', handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn('pointer-events-none fixed inset-0 block h-full w-full', className)}
    />
  )
})
