/** Shared Gerstner wave field — keep in sync with Water.tsx shader. */
export type WaveSample = { height: number; normal: [number, number, number] }

type Wave = { dir: [number, number]; steep: number; len: number; speed: number }

/**
 * Wrap ocean clock so GLSL mediump sin/cos keep precision.
 * GPU float loses phase after a few minutes of raw elapsedTime → sea looks frozen
 * while JS (ship buoyancy) still animates.
 */
export const OCEAN_TIME_WRAP = 1800

export function wrapOceanTime(elapsed: number): number {
  const t = elapsed % OCEAN_TIME_WRAP
  return t < 0 ? t + OCEAN_TIME_WRAP : t
}

/** Calm sea — low steepness, longer wavelengths */
const WAVES: Wave[] = [
  { dir: [1.0, 0.15], steep: 0.12, len: 36, speed: 0.75 },
  { dir: [0.7, 0.7], steep: 0.09, len: 22, speed: 0.9 },
  { dir: [-0.4, 0.9], steep: 0.07, len: 12, speed: 1.05 },
  { dir: [0.2, -1.0], steep: 0.05, len: 7, speed: 1.2 },
]

function norm2(x: number, y: number): [number, number] {
  const l = Math.hypot(x, y) || 1
  return [x / l, y / l]
}

/** Sample ocean surface height + normal at world XZ. */
export function sampleOcean(x: number, z: number, time: number, amp = 1): WaveSample {
  const t = wrapOceanTime(time)
  let hx = 0
  let hy = 0
  let hz = 0
  let tx = 1
  let ty = 0
  let tz = 0
  let bx = 0
  let by = 0
  let bz = 1

  for (const w of WAVES) {
    const [dx, dz] = norm2(w.dir[0], w.dir[1])
    const k = (Math.PI * 2) / w.len
    const c = Math.sqrt(9.8 / k) * w.speed
    const f = k * (dx * x + dz * z - c * t)
    const a = (w.steep / k) * amp
    const cosf = Math.cos(f)
    const sinf = Math.sin(f)

    hx += dx * a * cosf
    hy += a * sinf
    hz += dz * a * cosf

    tx += -dx * dx * w.steep * sinf
    ty += dx * w.steep * cosf
    tz += -dx * dz * w.steep * sinf

    bx += -dx * dz * w.steep * sinf
    by += dz * w.steep * cosf
    bz += -dz * dz * w.steep * sinf
  }

  const chop = Math.sin(x * 2.4 + t * 2.2) * Math.cos(z * 2.1 - t * 1.8) * 0.012 * amp
  hy += chop

  const nx = by * tz - bz * ty
  const ny = bz * tx - bx * tz
  const nz = bx * ty - by * tx
  const nl = Math.hypot(nx, ny, nz) || 1

  return { height: hy, normal: [nx / nl, ny / nl, nz / nl] }
}
