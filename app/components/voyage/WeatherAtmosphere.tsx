'use client'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { WeatherKind } from './weatherTypes'

export type { WeatherKind } from './weatherTypes'
export { WEATHER_OPTIONS } from './weatherTypes'

type WeatherPalette = {
  zenith: THREE.Color
  mid: THREE.Color
  horizon: THREE.Color
  clear: THREE.Color
  ambient: number
  sun: number
  sunColor: THREE.Color
  hemiSky: THREE.Color
  hemiGround: THREE.Color
  hemi: number
  amp: number
  sunPos: THREE.Vector3
  rain: number
  stars: number
}

const PALETTES: Record<WeatherKind, WeatherPalette> = {
  clear: {
    zenith: new THREE.Color('#1a7a96'),
    mid: new THREE.Color('#3a9aad'),
    horizon: new THREE.Color('#a8c8c4'),
    clear: new THREE.Color('#1e6a80'),
    ambient: 0.62,
    sun: 1.75,
    sunColor: new THREE.Color('#fff2d6'),
    hemiSky: new THREE.Color('#7ec0d0'),
    hemiGround: new THREE.Color('#1a3a38'),
    hemi: 0.55,
    amp: 1,
    sunPos: new THREE.Vector3(22, 32, 12),
    rain: 0,
    stars: 0,
  },
  rain: {
    zenith: new THREE.Color('#1a2830'),
    mid: new THREE.Color('#2a3a42'),
    horizon: new THREE.Color('#3a4848'),
    clear: new THREE.Color('#182428'),
    ambient: 0.4,
    sun: 0.55,
    sunColor: new THREE.Color('#c8d4d8'),
    hemiSky: new THREE.Color('#5a7078'),
    hemiGround: new THREE.Color('#0a1214'),
    hemi: 0.5,
    amp: 1.95,
    sunPos: new THREE.Vector3(8, 18, 6),
    rain: 1,
    stars: 0,
  },
  night: {
    zenith: new THREE.Color('#050814'),
    mid: new THREE.Color('#0c1428'),
    horizon: new THREE.Color('#1a2438'),
    clear: new THREE.Color('#070c18'),
    ambient: 0.22,
    sun: 0.28,
    sunColor: new THREE.Color('#c8d8f0'),
    hemiSky: new THREE.Color('#2a3a58'),
    hemiGround: new THREE.Color('#04060c'),
    hemi: 0.28,
    amp: 0.85,
    sunPos: new THREE.Vector3(-16, 14, -10),
    rain: 0,
    stars: 1,
  },
}

function RainField({ amount }: { amount: { value: number } }) {
  const ref = useRef<THREE.Points>(null)
  const count = 3500
  const geometry = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 90
      arr[i * 3 + 1] = Math.random() * 40
      arr[i * 3 + 2] = (Math.random() - 0.5) * 90
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return geo
  }, [])

  useFrame((_, dt) => {
    const pts = ref.current
    if (!pts) return
    const a = amount.value
    pts.visible = a > 0.05
    if (!pts.visible) return
    const mat = pts.material as THREE.PointsMaterial
    mat.opacity = 0.15 + a * 0.45
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const fall = (18 + a * 22) * Math.min(dt, 0.05)
    const drift = 4 * Math.min(dt, 0.05)
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] -= fall
      arr[i * 3] -= drift
      if (arr[i * 3 + 1] < -2) {
        arr[i * 3 + 1] = 28 + Math.random() * 12
        arr[i * 3] = (Math.random() - 0.5) * 90
        arr[i * 3 + 2] = (Math.random() - 0.5) * 90
      }
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#b8d4de"
        size={0.085}
        transparent
        opacity={0.55}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function StarField({ amount }: { amount: { value: number } }) {
  const ref = useRef<THREE.Points>(null)
  const count = 900
  const geometry = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = 160 + Math.random() * 40
      const y = Math.abs(Math.cos(phi)) * r
      arr[i * 3] = Math.sin(phi) * Math.cos(theta) * r
      arr[i * 3 + 1] = 20 + y * 0.85
      arr[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return geo
  }, [])

  useFrame(({ clock }) => {
    const pts = ref.current
    if (!pts) return
    const a = amount.value
    pts.visible = a > 0.05
    if (!pts.visible) return
    const twinkle = 0.55 + Math.sin(clock.elapsedTime * 1.7) * 0.2
    ;(pts.material as THREE.PointsMaterial).opacity = a * twinkle
  })

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color="#e8f0ff"
        size={0.55}
        transparent
        opacity={0.8}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

interface WeatherAtmosphereProps {
  weather: WeatherKind
  reduceMotion?: boolean
  onAmp?: (ampMul: number) => void
}

/** Manual weather: Clear / Rain / Night — sky, lights, rain, stars, wave amp. */
export default function WeatherAtmosphere({ weather, reduceMotion, onAmp }: WeatherAtmosphereProps) {
  const ambient = useRef<THREE.AmbientLight>(null)
  const sun = useRef<THREE.DirectionalLight>(null)
  const hemi = useRef<THREE.HemisphereLight>(null)
  const moon = useRef<THREE.DirectionalLight>(null)
  const bg = useRef(new THREE.Color('#1e6a80'))
  const ampRef = useRef(1)
  const rainAmt = useRef({ value: 0 })
  const starAmt = useRef({ value: 0 })
  const cur = useRef({
    zenith: PALETTES.clear.zenith.clone(),
    mid: PALETTES.clear.mid.clone(),
    horizon: PALETTES.clear.horizon.clone(),
    clear: PALETTES.clear.clear.clone(),
    sunColor: PALETTES.clear.sunColor.clone(),
    hemiSky: PALETTES.clear.hemiSky.clone(),
    hemiGround: PALETTES.clear.hemiGround.clone(),
    ambient: PALETTES.clear.ambient,
    sun: PALETTES.clear.sun,
    hemi: PALETTES.clear.hemi,
    amp: PALETTES.clear.amp,
    sunPos: PALETTES.clear.sunPos.clone(),
    rain: 0,
    stars: 0,
  })

  const uniforms = useMemo(
    () => ({
      uZenith: { value: PALETTES.clear.zenith.clone() },
      uMid: { value: PALETTES.clear.mid.clone() },
      uHorizon: { value: PALETTES.clear.horizon.clone() },
    }),
    []
  )

  useFrame(({ scene }, dt) => {
    const target = PALETTES[weather]
    const k = reduceMotion ? 1 : 1 - Math.exp(-2.2 * Math.min(dt, 0.05))
    const c = cur.current

    c.zenith.lerp(target.zenith, k)
    c.mid.lerp(target.mid, k)
    c.horizon.lerp(target.horizon, k)
    c.clear.lerp(target.clear, k)
    c.sunColor.lerp(target.sunColor, k)
    c.hemiSky.lerp(target.hemiSky, k)
    c.hemiGround.lerp(target.hemiGround, k)
    c.ambient = THREE.MathUtils.lerp(c.ambient, target.ambient, k)
    c.sun = THREE.MathUtils.lerp(c.sun, target.sun, k)
    c.hemi = THREE.MathUtils.lerp(c.hemi, target.hemi, k)
    c.amp = THREE.MathUtils.lerp(c.amp, target.amp, k)
    c.sunPos.lerp(target.sunPos, k)
    c.rain = THREE.MathUtils.lerp(c.rain, target.rain, k)
    c.stars = THREE.MathUtils.lerp(c.stars, target.stars, k)

    uniforms.uZenith.value.copy(c.zenith)
    uniforms.uMid.value.copy(c.mid)
    uniforms.uHorizon.value.copy(c.horizon)
    bg.current.copy(c.clear)
    scene.background = bg.current

    rainAmt.current.value = reduceMotion ? 0 : c.rain
    starAmt.current.value = c.stars

    if (ambient.current) ambient.current.intensity = c.ambient
    if (sun.current) {
      sun.current.intensity = c.sun
      sun.current.position.copy(c.sunPos)
      sun.current.color.copy(c.sunColor)
    }
    if (hemi.current) {
      hemi.current.intensity = c.hemi
      hemi.current.color.copy(c.hemiSky)
      hemi.current.groundColor.copy(c.hemiGround)
    }
    if (moon.current) {
      moon.current.intensity = c.stars * 0.55
      moon.current.visible = c.stars > 0.08
    }

    if (Math.abs(c.amp - ampRef.current) > 0.03) {
      ampRef.current = c.amp
      onAmp?.(c.amp)
    }
  })

  return (
    <>
      <ambientLight ref={ambient} intensity={0.62} />
      <directionalLight
        ref={sun}
        castShadow
        position={[22, 32, 12]}
        intensity={1.75}
        color="#fff2d6"
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight ref={moon} position={[-20, 24, -12]} intensity={0} color="#b8c8e8" />
      <hemisphereLight ref={hemi} args={['#7ec0d0', '#1a3a38', 0.55]} />

      <mesh>
        <sphereGeometry args={[220, 32, 16]} />
        <shaderMaterial
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={`
            varying vec3 vPos;
            void main() {
              vPos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uZenith;
            uniform vec3 uMid;
            uniform vec3 uHorizon;
            varying vec3 vPos;
            void main() {
              float h = normalize(vPos).y;
              vec3 col = mix(uHorizon, uMid, smoothstep(-0.05, 0.4, h));
              col = mix(col, uZenith, smoothstep(0.25, 0.95, h));
              gl_FragColor = vec4(col, 1.0);
            }
          `}
        />
      </mesh>

      <StarField amount={starAmt.current} />
      {!reduceMotion && <RainField amount={rainAmt.current} />}
    </>
  )
}
