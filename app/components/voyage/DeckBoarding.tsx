'use client'
import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { cabinInteract } from '../cabin/cabinInteract'

/** Walkable deck AABB in ship-local / model space — main deck through aft cabin. */
const DECK = {
  minX: -3.35,
  maxX: 2.15,
  minZ: -1.05,
  maxZ: 1.1,
  eyeY: 0.97,
}

function findNamed(root: THREE.Object3D, re: RegExp): THREE.Object3D | undefined {
  let hit: THREE.Object3D | undefined
  root.traverse(obj => {
    if (hit || !obj.name) return
    if (re.test(obj.name)) hit = obj
  })
  return hit
}

/** Glow floating just in front of the captain's cabin door. */
function findCabinFrontGlowLocal(modelRoot: THREE.Object3D, ship: THREE.Object3D): THREE.Vector3 {
  ship.updateMatrixWorld(true)

  const door =
    findNamed(modelRoot, /^Cabin_door\.?003/i) ||
    findNamed(modelRoot, /Cabin_door\.?003/i) ||
    findNamed(modelRoot, /Cabin_door/i)

  if (door) {
    const box = new THREE.Box3().setFromObject(door)
    const world = box.getCenter(new THREE.Vector3())
    world.y = THREE.MathUtils.lerp(box.min.y, box.max.y, 0.45)
    world.x = box.max.x + 0.42
    const local = world.clone()
    ship.worldToLocal(local)
    return local
  }

  const cabin = findNamed(modelRoot, /^Cabin\.?001/i) || findNamed(modelRoot, /^Cabin001/i)
  if (cabin) {
    const box = new THREE.Box3().setFromObject(cabin)
    const front = new THREE.Vector3(box.max.x + 0.4, box.min.y + 0.75, -0.7)
    ship.worldToLocal(front)
    return front
  }

  return new THREE.Vector3(-2.9, 1.05, -0.75)
}

function StairGlow({
  position,
  onEnter,
  enabled,
}: {
  position: [number, number, number]
  onEnter: () => void
  enabled: boolean
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const glowRef = useRef<THREE.MeshBasicMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 2.2
    const pulse = 0.55 + Math.sin(t) * 0.4
    if (matRef.current) matRef.current.opacity = 0.75 + pulse * 0.25
    if (glowRef.current) glowRef.current.opacity = 0.22 + pulse * 0.28
    if (groupRef.current) groupRef.current.scale.setScalar(1 + Math.sin(t) * 0.12)
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh
        renderOrder={10}
        onPointerDown={e => {
          if (!enabled) return
          e.stopPropagation()
          cabinInteract.suppressLook = true
        }}
        onClick={e => {
          if (!enabled) return
          e.stopPropagation()
          onEnter()
        }}
        onPointerOver={e => {
          if (!enabled) return
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'grab'
        }}
      >
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial
          ref={matRef}
          color="#ffd27a"
          transparent
          opacity={0.95}
          depthTest={false}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={2.4} renderOrder={9}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial
          ref={glowRef}
          color="#ffb84a"
          transparent
          opacity={0.35}
          depthTest={false}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <pointLight color="#ffc060" intensity={1.2} distance={2.8} decay={2} />
    </group>
  )
}

interface DeckBoardingProps {
  enabled: boolean
  modelRoot: THREE.Object3D
  onEnterCabin: () => void
}

export default function DeckBoarding({ enabled, modelRoot, onEnterCabin }: DeckBoardingProps) {
  const { camera, scene, gl } = useThree()
  const keys = useRef({ f: 0, s: 0 })
  const localPos = useRef(new THREE.Vector3(0.2, DECK.eyeY, 0.35))
  const walk = useRef({ ...DECK })
  const euler = useRef(new THREE.Euler(0, Math.PI, 0, 'YXZ'))
  const dragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const attached = useRef(false)
  const [glowPos, setGlowPos] = useState<[number, number, number]>([-2.9, 1.05, -0.75])

  // Attach camera + resolve cabin-front glow after ship is in the scene
  useEffect(() => {
    const ship = modelRoot.parent
    if (!ship) return

    if (enabled) {
      ship.add(camera)
      localPos.current.set(0.2, DECK.eyeY, 0.35)
      euler.current.set(0, Math.PI, 0)
      camera.position.copy(localPos.current)
      camera.quaternion.setFromEuler(euler.current)
      attached.current = true
      gl.domElement.style.cursor = 'grab'

      let frames = 0
      let raf = 0
      const place = () => {
        frames += 1
        const p = findCabinFrontGlowLocal(modelRoot, ship)
        setGlowPos([p.x, p.y, p.z])
        const margin = 0.65
        walk.current = {
          minX: Math.min(DECK.minX, p.x - margin),
          maxX: Math.max(DECK.maxX, p.x + margin),
          minZ: Math.min(DECK.minZ, p.z - margin),
          maxZ: Math.max(DECK.maxZ, p.z + margin),
          eyeY: DECK.eyeY,
        }
        if (frames < 4) raf = requestAnimationFrame(place)
      }
      raf = requestAnimationFrame(place)

      return () => {
        cancelAnimationFrame(raf)
        if (attached.current) {
          scene.add(camera)
          attached.current = false
          gl.domElement.style.cursor = ''
        }
      }
    }

    return () => {
      if (attached.current) {
        scene.add(camera)
        attached.current = false
        gl.domElement.style.cursor = ''
      }
    }
  }, [enabled, modelRoot, camera, scene, gl])

  useEffect(() => {
    if (!enabled) return
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

  useEffect(() => {
    if (!enabled) return
    const dom = gl.domElement
    const sens = 0.0035
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return
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
      window.setTimeout(() => {
        cabinInteract.suppressLook = false
      }, 80)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging.current || cabinInteract.suppressLook) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      euler.current.y -= dx * sens
      euler.current.x -= dy * sens
      euler.current.x = THREE.MathUtils.clamp(euler.current.x, -1.1, 1.1)
      camera.quaternion.setFromEuler(euler.current)
    }
    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)
    return () => {
      dom.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
    }
  }, [enabled, gl, camera])

  useFrame((_, dt) => {
    if (!enabled || !attached.current) return
    const b = walk.current
    const { f, s } = keys.current
    if (f || s) {
      const speed = 2.6
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
      forward.y = 0
      if (forward.lengthSq() < 1e-8) forward.set(0, 0, -1)
      forward.normalize()
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
      right.y = 0
      right.normalize()
      const move = new THREE.Vector3().addScaledVector(forward, f).addScaledVector(right, s)
      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * Math.min(dt, 0.05))
        localPos.current.x = THREE.MathUtils.clamp(localPos.current.x + move.x, b.minX, b.maxX)
        localPos.current.z = THREE.MathUtils.clamp(localPos.current.z + move.z, b.minZ, b.maxZ)
      }
    }
    localPos.current.y = b.eyeY
    camera.position.copy(localPos.current)
  })

  if (!enabled) return null

  return (
    <StairGlow
      position={glowPos}
      enabled={enabled}
      onEnter={() => {
        cabinInteract.suppressLook = true
        onEnterCabin()
        window.setTimeout(() => {
          cabinInteract.suppressLook = false
        }, 200)
      }}
    />
  )
}
