'use client'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import Water from './Water'
import PirateShip from './PirateShip'
import WeatherAtmosphere from './WeatherAtmosphere'
import type { WeatherKind } from './weatherTypes'
import type { VoyagePhase } from '@/app/hooks/useVoyagePhase'

const CAM: Record<VoyagePhase, { pos: [number, number, number]; look: [number, number, number] }> = {
  voyage: { pos: [10, 5.2, 14], look: [0, 1.2, 0] },
  deck: { pos: [3.4, 3.2, 6.2], look: [0, 1.6, 0] },
  cabin: { pos: [1.2, 2.4, 3.2], look: [0, 1.4, 0] },
}

function CameraRig({
  phase,
  reduceMotion,
  orbitEnabled,
  onDeckReady,
}: {
  phase: VoyagePhase
  reduceMotion: boolean
  orbitEnabled: boolean
  onDeckReady?: () => void
}) {
  const { camera } = useThree()
  const lookTarget = useRef(new THREE.Vector3(...CAM.voyage.look))
  const lastPhase = useRef<VoyagePhase | null>(null)
  const controls = useThree(s => s.controls) as OrbitControlsImpl | null

  useEffect(() => {
    if (phase === 'deck') {
      lastPhase.current = phase
      return
    }
    if (lastPhase.current === phase) return
    lastPhase.current = phase

    const dest = CAM[phase]
    if (reduceMotion) {
      camera.position.set(...dest.pos)
      lookTarget.current.set(...dest.look)
      camera.lookAt(lookTarget.current)
      if (controls) {
        controls.target.copy(lookTarget.current)
        controls.update()
      }
      return
    }

    const pos = { x: camera.position.x, y: camera.position.y, z: camera.position.z }
    const look = { x: lookTarget.current.x, y: lookTarget.current.y, z: lookTarget.current.z }

    const tl = gsap.timeline()

    tl.to(
      pos,
      {
        x: dest.pos[0],
        y: dest.pos[1],
        z: dest.pos[2],
        duration: phase === 'cabin' ? 1.4 : 2.2,
        ease: 'power2.inOut',
        onUpdate: () => camera.position.set(pos.x, pos.y, pos.z),
      },
      0
    )

    tl.to(
      look,
      {
        x: dest.look[0],
        y: dest.look[1],
        z: dest.look[2],
        duration: phase === 'cabin' ? 1.4 : 2.2,
        ease: 'power2.inOut',
        onUpdate: () => {
          lookTarget.current.set(look.x, look.y, look.z)
          if (controls) {
            controls.target.set(look.x, look.y, look.z)
            controls.update()
          } else {
            camera.lookAt(lookTarget.current)
          }
        },
      },
      0
    )

    return () => {
      tl.kill()
    }
  }, [phase, camera, reduceMotion, onDeckReady, controls])

  useFrame(() => {
    if (!orbitEnabled && !controls) {
      camera.lookAt(lookTarget.current)
    }
  })

  return null
}

function SceneContent({
  phase,
  reduceMotion,
  weather,
  onDeckReady,
  onEnterCabin,
}: {
  phase: VoyagePhase
  reduceMotion: boolean
  weather: WeatherKind
  onDeckReady?: () => void
  onEnterCabin?: () => void
}) {
  const boarding = phase === 'deck'
  const orbitEnabled = phase === 'voyage'
  const controlsRef = useRef<OrbitControlsImpl>(null)
  const baseAmp = reduceMotion ? 0.28 : 0.38
  const [ampMul, setAmpMul] = useState(1)
  const amp = baseAmp * (reduceMotion ? 1 : ampMul)

  return (
    <>
      <WeatherAtmosphere weather={weather} reduceMotion={reduceMotion} onAmp={setAmpMul} />

      <Water segments={reduceMotion ? 110 : 256} amp={amp} />
      <PirateShip
        sailing={phase === 'voyage'}
        boarding={boarding}
        amp={amp}
        onEnterCabin={onEnterCabin}
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={orbitEnabled && !reduceMotion}
        enablePan
        enableZoom
        enableRotate
        minDistance={4}
        maxDistance={36}
        maxPolarAngle={Math.PI * 0.49}
        minPolarAngle={0.15}
        target={[0, 1.2, 0]}
        enableDamping
        dampingFactor={0.06}
      />

      <CameraRig
        phase={phase}
        reduceMotion={reduceMotion}
        orbitEnabled={orbitEnabled && !reduceMotion}
        onDeckReady={onDeckReady}
      />
    </>
  )
}

interface VoyageSceneProps {
  phase: VoyagePhase
  active: boolean
  reduceMotion: boolean
  weather: WeatherKind
  onDeckReady?: () => void
  onEnterCabin?: () => void
}

export default function VoyageScene({
  phase,
  active,
  reduceMotion,
  weather,
  onDeckReady,
  onEnterCabin,
}: VoyageSceneProps) {
  return (
    <div
      className={`voyage-canvas-wrap${active ? '' : ' is-hidden'}`}
      aria-hidden={!active}
    >
      <Canvas
        dpr={reduceMotion ? [1, 1] : [1, 2]}
        camera={{ position: CAM.voyage.pos, fov: boardingFov(phase), near: 0.1, far: 280 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows={!reduceMotion}
        frameloop={active ? 'always' : 'never'}
        onCreated={({ gl }) => {
          gl.setClearColor('#1e6a80')
        }}
      >
        <Suspense fallback={null}>
          <SceneContent
            phase={phase}
            reduceMotion={reduceMotion}
            weather={weather}
            onDeckReady={onDeckReady}
            onEnterCabin={onEnterCabin}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

function boardingFov(phase: VoyagePhase) {
  return phase === 'deck' ? 65 : 45
}
