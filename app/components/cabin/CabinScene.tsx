'use client'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import CabinInterior, { CABIN_BOUNDS } from './CabinInterior'
import { cabinInteract } from './cabinInteract'
import type { CabinRoom } from '@/app/hooks/useVoyagePhase'

type Bounds = typeof CABIN_BOUNDS

function normalizeBounds(b: Bounds): Bounds {
  const pad = 0.35
  let minX = b.minX
  let maxX = b.maxX
  let minZ = b.minZ
  let maxZ = b.maxZ
  if (!(maxX - minX > 1.2)) {
    minX = -2.8
    maxX = 2.8
  } else {
    minX += pad
    maxX -= pad
  }
  if (!(maxZ - minZ > 1.2)) {
    minZ = -2.4
    maxZ = 2.4
  } else {
    minZ += pad
    maxZ -= pad
  }
  if (minX > maxX) [minX, maxX] = [-2.8, 2.8]
  if (minZ > maxZ) [minZ, maxZ] = [-2.4, 2.4]
  return {
    minX,
    maxX,
    minZ,
    maxZ,
    eyeY: Number.isFinite(b.eyeY) ? THREE.MathUtils.clamp(b.eyeY, 1.2, 1.85) : 1.5,
  }
}

function FirstPersonRig({ enabled, bounds }: { enabled: boolean; bounds: Bounds }) {
  const { camera, gl } = useThree()
  const keys = useRef({ f: 0, s: 0 })
  const boundsRef = useRef(bounds)
  boundsRef.current = bounds
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'))
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const spawned = useRef(false)

  const applySpawn = (b: Bounds) => {
    camera.position.set((b.minX + b.maxX) * 0.5, b.eyeY, (b.minZ + b.maxZ) * 0.5)
    euler.current.set(0, 0, 0)
    camera.quaternion.setFromEuler(euler.current)
  }

  useEffect(() => {
    if (!spawned.current) {
      spawned.current = true
      applySpawn(bounds)
      return
    }
    // Keep player inside updated walkable area
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, bounds.minX, bounds.maxX)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, bounds.minZ, bounds.maxZ)
    camera.position.y = bounds.eyeY
  }, [camera, bounds])

  // WASD — capture phase so nothing swallows the keys
  useEffect(() => {
    const down = new Set<string>()
    const sync = () => {
      keys.current.f =
        (down.has('KeyW') || down.has('ArrowUp') || down.has('w') ? 1 : 0) -
        (down.has('KeyS') || down.has('ArrowDown') || down.has('s') ? 1 : 0)
      keys.current.s =
        (down.has('KeyD') || down.has('ArrowRight') || down.has('d') ? 1 : 0) -
        (down.has('KeyA') || down.has('ArrowLeft') || down.has('a') ? 1 : 0)
    }

    const onDown = (e: KeyboardEvent) => {
      if (!enabled) return
      const code = e.code
      const key = e.key.toLowerCase()
      const isMove =
        code === 'KeyW' ||
        code === 'KeyA' ||
        code === 'KeyS' ||
        code === 'KeyD' ||
        code.startsWith('Arrow') ||
        key === 'w' ||
        key === 'a' ||
        key === 's' ||
        key === 'd'
      if (!isMove) return
      e.preventDefault()
      down.add(code)
      down.add(key)
      sync()
    }
    const onUp = (e: KeyboardEvent) => {
      down.delete(e.code)
      down.delete(e.key.toLowerCase())
      sync()
    }
    const clear = () => {
      down.clear()
      keys.current.f = 0
      keys.current.s = 0
    }

    window.addEventListener('keydown', onDown, true)
    window.addEventListener('keyup', onUp, true)
    window.addEventListener('blur', clear)
    return () => {
      window.removeEventListener('keydown', onDown, true)
      window.removeEventListener('keyup', onUp, true)
      window.removeEventListener('blur', clear)
    }
  }, [enabled])

  // Drag to look only — never pointer-lock
  useEffect(() => {
    const dom = gl.domElement
    const sens = 0.004

    const onDown = (e: PointerEvent) => {
      if (!enabled || e.button !== 0) return
      requestAnimationFrame(() => {
        if (cabinInteract.suppressLook) return
        dragging.current = true
        last.current = { x: e.clientX, y: e.clientY }
        dom.style.cursor = 'grabbing'
      })
    }
    const onUp = () => {
      dragging.current = false
      dom.style.cursor = 'grab'
    }
    const onMove = (e: PointerEvent) => {
      if (!enabled || !dragging.current || cabinInteract.suppressLook) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      if (!dx && !dy) return
      euler.current.y -= dx * sens
      euler.current.x -= dy * sens
      euler.current.x = THREE.MathUtils.clamp(euler.current.x, -1.2, 1.2)
      camera.quaternion.setFromEuler(euler.current)
    }

    dom.style.cursor = 'grab'
    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)

    return () => {
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
      dom.style.cursor = ''
    }
  }, [enabled, gl, camera])

  useFrame((_, dt) => {
    if (!enabled) return
    const b = boundsRef.current
    const { f, s } = keys.current
    if (!f && !s) return

    const speed = 4.5
    const dir = new THREE.Vector3()
    camera.getWorldDirection(dir)
    dir.y = 0
    if (dir.lengthSq() < 1e-8) dir.set(0, 0, -1)
    dir.normalize()
    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize()

    const move = new THREE.Vector3().addScaledVector(dir, f).addScaledVector(right, s)
    if (move.lengthSq() > 0) move.normalize().multiplyScalar(speed * Math.min(dt, 0.05))

    camera.position.x = THREE.MathUtils.clamp(camera.position.x + move.x, b.minX, b.maxX)
    camera.position.z = THREE.MathUtils.clamp(camera.position.z + move.z, b.minZ, b.maxZ)
    camera.position.y = b.eyeY
  })

  return null
}

interface CabinSceneProps {
  active: boolean
  panelOpen: boolean
  onSelect: (room: CabinRoom) => void
}

export default function CabinScene({ active, panelOpen, onSelect }: CabinSceneProps) {
  const interactive = active && !panelOpen
  const [bounds, setBounds] = useState<Bounds>(CABIN_BOUNDS)
  const wrapRef = useRef<HTMLDivElement>(null)

  const onBounds = useCallback((b: Bounds) => {
    setBounds(normalizeBounds(b))
  }, [])

  useEffect(() => {
    if (!active) return
    // Focus shell so keyboard reaches us reliably
    wrapRef.current?.focus({ preventScroll: true })
  }, [active, panelOpen])

  // Defer Canvas one frame so the wrap has layout before R3F connects events
  const [canvasReady, setCanvasReady] = useState(false)
  useEffect(() => {
    if (!active) {
      setCanvasReady(false)
      return
    }
    const id = requestAnimationFrame(() => setCanvasReady(true))
    return () => cancelAnimationFrame(id)
  }, [active])

  const handleSelect = (room: CabinRoom) => {
    cabinInteract.suppressLook = true
    onSelect(room)
    window.setTimeout(() => {
      cabinInteract.suppressLook = false
    }, 200)
  }

  return (
    <div
      ref={wrapRef}
      className={`cabin-canvas-wrap${active ? '' : ' is-hidden'}`}
      aria-hidden={!active}
      tabIndex={active ? 0 : -1}
    >
      {active && canvasReady && (
        <Canvas
          dpr={[1, 1.75]}
          camera={{ fov: 70, near: 0.08, far: 40, position: [0, bounds.eyeY, 0] }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          shadows
          onCreated={({ gl }) => {
            gl.setClearColor('#1a100c')
            gl.domElement.tabIndex = 0
          }}
        >
          <color attach="background" args={['#1a100c']} />
          <ambientLight intensity={0.32} />
          <directionalLight
            castShadow
            position={[2.2, 3.8, 1.2]}
            intensity={0.75}
            color="#ffe0b8"
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[0, 2.2, 0]} intensity={0.7} distance={9} color="#ffb060" />
          <hemisphereLight args={['#4a3020', '#120c08', 0.3]} />

          <Suspense fallback={null}>
            <CabinInterior onSelect={handleSelect} interactive={interactive} onBounds={onBounds} />
          </Suspense>
          <FirstPersonRig enabled={interactive} bounds={bounds} />
        </Canvas>
      )}
    </div>
  )
}
