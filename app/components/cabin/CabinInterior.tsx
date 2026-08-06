'use client'
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { CabinRoom } from '@/app/hooks/useVoyagePhase'
import { cabinInteract } from './cabinInteract'

/** Fallback walkable AABB — refined after cabin.glb loads */
export const CABIN_BOUNDS = {
  minX: -2.6,
  maxX: 2.6,
  minZ: -2.2,
  maxZ: 2.2,
  eyeY: 1.55,
}

export const HOTSPOTS: {
  id: CabinRoom
  position: [number, number, number]
}[] = [{ id: 'quarters', position: [0, 1.1, 0] }]

const CABIN_URL = '/models/cabin.glb'

const HIDE_NAME = /sky|camera|spot001|^Object_14[023]$/i
const WINDOW_NAME = /glass|window|pane|porthole|Box011|Box012|Material #61|Material_61/i

function findByName(root: THREE.Object3D, re: RegExp): THREE.Object3D | null {
  let hit: THREE.Object3D | null = null
  root.traverse(obj => {
    if (hit) return
    if (re.test(obj.name)) hit = obj
  })
  return hit
}

function prepareCabin(root: THREE.Object3D) {
  const toRemove: THREE.Object3D[] = []

  root.traverse(obj => {
    if (HIDE_NAME.test(obj.name)) {
      toRemove.push(obj)
      return
    }
    if (!(obj as THREE.Mesh).isMesh) return

    const mesh = obj as THREE.Mesh
    mesh.castShadow = true
    mesh.receiveShadow = true

    const nameHit = WINDOW_NAME.test(mesh.name)
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]

    mats.forEach(raw => {
      if (!raw) return
      const m = raw as THREE.MeshStandardMaterial
      const matName = (m.name || '').toLowerCase()
      const looksGlass =
        nameHit ||
        /61|glass|window/.test(matName) ||
        m.transparent === true ||
        (typeof m.opacity === 'number' && m.opacity < 0.95)

      if (looksGlass) {
        m.transparent = false
        m.opacity = 1
        m.depthWrite = true
        if ('color' in m && m.color) m.color.set('#2a1c14')
        if ('emissive' in m && m.emissive) m.emissive.set('#080604')
        if ('roughness' in m) m.roughness = 0.92
        if ('metalness' in m) m.metalness = 0.08
        if ('map' in m) m.map = null
        if ('envMap' in m) m.envMap = null
        m.side = THREE.DoubleSide
        m.needsUpdate = true
      }
    })
  })

  toRemove.forEach(obj => obj.parent?.remove(obj))
}

function fitCabinToOrigin(root: THREE.Object3D) {
  let box = new THREE.Box3().setFromObject(root)
  const size = box.getSize(new THREE.Vector3())
  const longest = Math.max(size.x, size.z, 0.001)
  root.scale.multiplyScalar(7.2 / longest)

  box = new THREE.Box3().setFromObject(root)
  const center = box.getCenter(new THREE.Vector3())
  root.position.x -= center.x
  root.position.z -= center.z
  root.position.y -= box.min.y
  root.updateMatrixWorld(true)

  box = new THREE.Box3().setFromObject(root)
  return {
    minX: box.min.x,
    maxX: box.max.x,
    minZ: box.min.z,
    maxZ: box.max.z,
    eyeY: Math.min(1.65, Math.max(1.35, box.max.y * 0.42)),
  }
}

/** One glow point on the treasure map — opens Captain's Quarters by default */
function placeMapGlow(
  root: THREE.Object3D,
  bounds: typeof CABIN_BOUNDS
): [number, number, number] {
  const map =
    findByName(root, /^map$/i) ||
    findByName(root, /map_map/i) ||
    findByName(root, /desk \(map/i) ||
    findByName(root, /desk with map/i)

  if (map) {
    map.updateWorldMatrix(true, false)
    const box = new THREE.Box3().setFromObject(map)
    const c = box.getCenter(new THREE.Vector3())
    return [c.x, box.max.y + 0.04, c.z]
  }

  return [0, bounds.eyeY * 0.65, (bounds.minZ + bounds.maxZ) * 0.15]
}

function GlowDot({
  position,
  onSelect,
  interactive,
}: {
  position: [number, number, number]
  onSelect: () => void
  interactive: boolean
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const glowRef = useRef<THREE.MeshStandardMaterial>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * 2.2
    const pulse = 0.55 + Math.sin(t) * 0.35
    if (matRef.current) matRef.current.emissiveIntensity = 0.6 + pulse * 0.9
    if (glowRef.current) glowRef.current.opacity = 0.12 + pulse * 0.18
    if (groupRef.current) {
      const s = 1 + Math.sin(t) * 0.12
      groupRef.current.scale.setScalar(s)
    }
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh
        onPointerDown={e => {
          if (!interactive) return
          e.stopPropagation()
          cabinInteract.suppressLook = true
        }}
        onClick={e => {
          if (!interactive) return
          e.stopPropagation()
          onSelect()
        }}
        onPointerOver={e => {
          if (!interactive) return
          e.stopPropagation()
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'grab'
        }}
      >
        <sphereGeometry args={[0.032, 16, 16]} />
        <meshStandardMaterial
          ref={matRef}
          color="#ffe6a8"
          emissive="#ffb84a"
          emissiveIntensity={1}
          transparent
          opacity={0.95}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={2.2}>
        <sphereGeometry args={[0.032, 12, 12]} />
        <meshStandardMaterial
          ref={glowRef}
          color="#ffc866"
          emissive="#ffaa33"
          emissiveIntensity={1.2}
          transparent
          opacity={0.2}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

interface CabinInteriorProps {
  onSelect: (room: CabinRoom) => void
  interactive: boolean
  onBounds?: (bounds: typeof CABIN_BOUNDS) => void
}

export default function CabinInterior({ onSelect, interactive, onBounds }: CabinInteriorProps) {
  const { scene } = useGLTF(CABIN_URL)

  const { model, glowPos, bounds } = useMemo(() => {
    const clone = scene.clone(true)
    prepareCabin(clone)
    const nextBounds = fitCabinToOrigin(clone)
    const pos = placeMapGlow(clone, nextBounds)
    return { model: clone, glowPos: pos, bounds: nextBounds }
  }, [scene])

  useEffect(() => {
    onBounds?.(bounds)
  }, [bounds, onBounds])

  return (
    <group>
      <primitive object={model} />
      <GlowDot
        position={glowPos}
        onSelect={() => onSelect('quarters')}
        interactive={interactive}
      />
    </group>
  )
}

useGLTF.preload(CABIN_URL)
