'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { sampleOcean, wrapOceanTime } from './oceanMath'
import DeckBoarding from './DeckBoarding'

const MODEL_URL = '/models/pirate-ship.glb'

const HIDE_NAME =
  /boney|armature|skeleton|spine|pelvis|thigh|shin|shoulder|forearm|upper_arm|hand\.|foot\.|heel|breast|toe\.|GLTF_created_0|Blunderbuss/i

type SailRoot = {
  obj: THREE.Object3D
  rx: number
  rz: number
  sx: number
  sy: number
  sz: number
}

function isSailObject(obj: THREE.Object3D): boolean {
  let cur: THREE.Object3D | null = obj
  while (cur) {
    if (/sail/i.test(cur.name)) return true
    cur = cur.parent
  }
  return false
}

/** Soft cloth billow for low-poly sail meshes (keeps MeshStandardMaterial lighting). */
function applySailWind(
  mat: THREE.MeshStandardMaterial,
  uSailTime: { value: number },
  uSailWind: { value: number }
) {
  mat.side = THREE.DoubleSide
  mat.onBeforeCompile = shader => {
    shader.uniforms.uSailTime = uSailTime
    shader.uniforms.uSailWind = uSailWind
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      /* glsl */ `
      uniform float uSailTime;
      uniform float uSailWind;
      void main() {
      `
    )
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      /* glsl */ `
      #include <begin_vertex>
      {
        float fill = sin(transformed.y * 0.45 + uSailTime * 0.85) * 0.5 + 0.5;
        float flutter = sin(transformed.y * 1.35 + transformed.z * 0.9 + uSailTime * 2.1)
                      * cos(transformed.x * 0.7 - uSailTime * 1.4);
        float edge = smoothstep(0.0, 0.35, abs(transformed.y) * 0.08 + 0.2);
        float wind = (fill * 0.11 + flutter * 0.045) * edge * uSailWind;
        transformed += normalize(objectNormal) * wind;
      }
      `
    )
  }
  mat.customProgramCacheKey = () => 'pirate-sail-wind-v2'
  mat.needsUpdate = true
}

interface PirateShipProps {
  sailing?: boolean
  boarding?: boolean
  amp?: number
  onEnterCabin?: () => void
}

export default function PirateShip({
  sailing = true,
  boarding = false,
  amp = 0.4,
  onEnterCabin,
}: PirateShipProps) {
  const ref = useRef<THREE.Group>(null)
  const smooth = useRef({ y: 0, pitch: 0, roll: 0 })
  const sailTime = useRef({ value: 0 })
  const sailWind = useRef({ value: 1 })
  const sailRoots = useRef<SailRoot[]>([])
  const { scene } = useGLTF(MODEL_URL)

  const model = useMemo(() => {
    const clone = scene.clone(true)
    const toRemove: THREE.Object3D[] = []
    const roots: SailRoot[] = []
    const rootSeen = new Set<THREE.Object3D>()
    const uTime = sailTime.current
    const uWind = sailWind.current

    clone.traverse(obj => {
      if (HIDE_NAME.test(obj.name)) {
        toRemove.push(obj)
        return
      }
      if (!(obj as THREE.Mesh).isMesh) return

      const mesh = obj as THREE.Mesh
      mesh.castShadow = true
      mesh.receiveShadow = true

      const sail = isSailObject(mesh)
      const srcMats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      const nextMats = srcMats.map(m => {
        if (!m) return m
        if (!sail) {
          m.side = THREE.FrontSide
          m.needsUpdate = true
          return m
        }
        const cloned = m.clone() as THREE.MeshStandardMaterial
        applySailWind(cloned, uTime, uWind)
        return cloned
      })
      mesh.material = Array.isArray(mesh.material) ? (nextMats as THREE.Material[]) : nextMats[0]

      if (sail) {
        let root: THREE.Object3D | null = mesh
        while (root?.parent && !/^Sail/i.test(root.name)) root = root.parent
        if (root && /^Sail/i.test(root.name) && !rootSeen.has(root)) {
          rootSeen.add(root)
          roots.push({
            obj: root,
            rx: root.rotation.x,
            rz: root.rotation.z,
            sx: root.scale.x,
            sy: root.scale.y,
            sz: root.scale.z,
          })
        }
      }
    })

    toRemove.forEach(obj => {
      obj.parent?.remove(obj)
    })

    sailRoots.current = roots
    return clone
  }, [scene])

  useFrame(({ clock }, dt) => {
    const g = ref.current
    if (!g) return

    const t = clock.elapsedTime
    // Calm baseline amp ~0.38; rain pushes this higher → stronger sails + rock
    const weatherScale = THREE.MathUtils.clamp(amp / 0.38, 0.75, 2.35)
    sailTime.current.value = wrapOceanTime(t) * (0.85 + weatherScale * 0.45)
    sailWind.current.value = (boarding ? 0.35 : 1) * weatherScale

    const wind = sailWind.current.value
    sailRoots.current.forEach((sail, i) => {
      const phase = i * 1.37
      sail.obj.rotation.x = sail.rx + Math.sin(t * (0.95 + weatherScale * 0.35) + phase) * 0.018 * wind
      sail.obj.rotation.z = sail.rz + Math.cos(t * (0.72 + weatherScale * 0.28) + phase * 1.2) * 0.014 * wind
      const inflate = 1 + Math.sin(t * 0.8 + phase) * 0.012 * wind
      sail.obj.scale.set(sail.sx * inflate, sail.sy, sail.sz * inflate)
    })

    const baseX = sailing && !boarding ? Math.sin(t * 0.05) * 0.45 : g.position.x * 0.92
    const baseZ = sailing && !boarding ? Math.cos(t * 0.04) * 0.25 : g.position.z * 0.92

    const halfL = 1.6
    const halfW = 0.7
    const yaw = Math.PI * 0.65
    const c = Math.cos(yaw)
    const s = Math.sin(yaw)

    const localPts: [number, number][] = [
      [0, 0],
      [halfL, 0],
      [-halfL, 0],
      [0, halfW],
      [0, -halfW],
    ]

    const heights: number[] = []
    for (const [lx, lz] of localPts) {
      const wx = baseX + lx * c - lz * s
      const wz = baseZ + lx * s + lz * c
      heights.push(sampleOcean(wx, wz, t, amp).height)
    }

    // Rock harder when wave amp rises (rain) — calm baseline ~0.38
    const rock = (boarding ? 0.08 : 0.22) * weatherScale
    const hCenter = heights[0]
    const targetPitch = Math.atan2(heights[1] - heights[2], halfL * 2) * rock
    const targetRoll = Math.atan2(heights[3] - heights[4], halfW * 2) * rock
    const targetY = 1.15 + hCenter

    const k = 1 - Math.exp(-3.2 * Math.min(dt, 0.05))
    smooth.current.y += (targetY - smooth.current.y) * k
    smooth.current.pitch += (targetPitch - smooth.current.pitch) * k
    smooth.current.roll += (targetRoll - smooth.current.roll) * k

    g.position.x = boarding ? THREE.MathUtils.lerp(g.position.x, 0, 0.08) : baseX
    g.position.z = boarding ? THREE.MathUtils.lerp(g.position.z, 0, 0.08) : baseZ
    g.position.y = smooth.current.y
    g.rotation.set(smooth.current.pitch, yaw, smooth.current.roll)
  })

  return (
    <group ref={ref} scale={1.35}>
      <primitive object={model} />
      {boarding && onEnterCabin && (
        <DeckBoarding enabled={boarding} modelRoot={model} onEnterCabin={onEnterCabin} />
      )}
    </group>
  )
}

useGLTF.preload(MODEL_URL)
