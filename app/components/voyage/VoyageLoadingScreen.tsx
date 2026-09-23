'use client'

import { useEffect, useRef, useState } from 'react'
import { useGLTF } from '@react-three/drei'

const SHIP_URL = '/models/pirate-ship.glb'
const WATER_URL = '/textures/waternormals.jpg'
const LOGO_URL = '/assets/images/pirates-port-logo.jpg'

const STAGES = [
  { at: 0, label: 'Charting the course…' },
  { at: 12, label: 'Hauling cargo aboard…' },
  { at: 35, label: 'Raising the sails…' },
  { at: 65, label: 'Plotting the horizon…' },
  { at: 88, label: 'Casting off…' },
  { at: 100, label: 'Ready to sail' },
]

function detectLightBoot(): boolean {
  if (typeof window === 'undefined') return false
  const narrow = window.matchMedia('(max-width: 900px)').matches
  const tabletWidth = window.matchMedia('(max-width: 1180px)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const noHover = window.matchMedia('(hover: none)').matches
  const multiTouch = navigator.maxTouchPoints > 1
  const iPadLike =
    /iPad|Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return (
    reduceMotion ||
    narrow ||
    iPadLike ||
    (tabletWidth && (coarse || noHover || multiTouch))
  )
}

function stageLabel(p: number) {
  let label = STAGES[0].label
  for (const s of STAGES) {
    if (p >= s.at) label = s.label
  }
  return label
}

function loadImage(url: string) {
  return new Promise<void>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => reject(new Error(`Failed to load ${url}`))
    img.src = url
  })
}

function withTimeout<T>(promise: PromiseLike<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const t = window.setTimeout(() => reject(new Error(`${label} timed out`)), ms)
    Promise.resolve(promise).then(
      v => {
        window.clearTimeout(t)
        resolve(v)
      },
      e => {
        window.clearTimeout(t)
        reject(e)
      }
    )
  })
}

export function useVoyageBoot() {
  const [progress, setProgress] = useState(4)
  const [ready, setReady] = useState(false)
  const [fading, setFading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSkip, setCanSkip] = useState(false)
  const finished = useRef(false)
  const assetsDone = useRef(false)
  const displayProgress = useRef(4)
  const targetProgress = useRef(8)

  const finish = () => {
    if (finished.current) return
    finished.current = true
    displayProgress.current = 100
    targetProgress.current = 100
    setProgress(100)
    setFading(true)
    window.setTimeout(() => setReady(true), 650)
  }

  const skip = () => finish()

  useEffect(() => {
    let cancelled = false
    const isLight = detectLightBoot()
    const minUntil = performance.now() + (isLight ? 750 : 1100)

    const skipTimer = window.setTimeout(() => {
      if (!cancelled) setCanSkip(true)
    }, 1600)

    // Never leave visitors trapped on the gate
    const hardTimer = window.setTimeout(() => {
      if (!cancelled) finish()
    }, isLight ? 4000 : 12000)

    const tick = window.setInterval(() => {
      if (cancelled || finished.current) return

      // Ease the bar toward the target so it never looks frozen
      const target = targetProgress.current
      const cur = displayProgress.current
      if (cur < target) {
        const step = Math.max(0.6, (target - cur) * 0.12)
        displayProgress.current = Math.min(target, cur + step)
        setProgress(displayProgress.current)
      } else if (!assetsDone.current && cur < 92) {
        // Slow creep while assets are still resolving
        displayProgress.current = Math.min(92, cur + 0.15)
        setProgress(displayProgress.current)
      }

      if (assetsDone.current && performance.now() >= minUntil) {
        finish()
      }
    }, 40)

    ;(async () => {
      try {
        await loadImage(LOGO_URL)
        if (cancelled) return
        targetProgress.current = Math.max(targetProgress.current, 18)

        if (isLight) {
          assetsDone.current = true
          targetProgress.current = 100
          return
        }

        targetProgress.current = 35

        // Warm HTTP cache + drei cache. Never block forever on either.
        const shipWarm = (async () => {
          try {
            await withTimeout(fetch(SHIP_URL).then(r => {
              if (!r.ok) throw new Error('Ship HTTP ' + r.status)
              return r.arrayBuffer()
            }), 10000, 'Ship fetch')
          } catch {
            /* allow enter even if model is slow; canvas will retry */
          }
          try {
            useGLTF.preload(SHIP_URL)
          } catch {
            /* ignore */
          }
        })()

        await Promise.all([
          withTimeout(shipWarm, 11000, 'Ship warm').catch(() => undefined),
          withTimeout(loadImage(WATER_URL), 8000, 'Water texture').catch(() => undefined),
        ])

        if (cancelled) return
        assetsDone.current = true
        targetProgress.current = 100
      } catch (e) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : 'Could not load voyage assets')
        assetsDone.current = true
        targetProgress.current = 100
        setCanSkip(true)
      }
    })()

    return () => {
      cancelled = true
      window.clearTimeout(skipTimer)
      window.clearTimeout(hardTimer)
      window.clearInterval(tick)
    }
  }, [])

  return {
    progress,
    ready,
    fading,
    error,
    canSkip,
    label: stageLabel(progress),
    skip,
  }
}

interface Props {
  progress: number
  label: string
  fading: boolean
  error: string | null
  canSkip: boolean
  onSkip: () => void
}

export default function VoyageLoadingScreen({
  progress,
  label,
  fading,
  error,
  canSkip,
  onSkip,
}: Props) {
  const pct = Math.round(Math.min(100, Math.max(0, progress)))

  return (
    <div
      className={`voyage-boot${fading ? ' is-fading' : ''}`}
      role="status"
      aria-live="polite"
      aria-busy={!fading}
    >
      <div className="voyage-boot-sky" aria-hidden />
      <div className="voyage-boot-horizon" aria-hidden />
      <div className="voyage-boot-waves" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="voyage-boot-glow" aria-hidden />

      <div className="voyage-boot-card">
        <div className="voyage-boot-seal">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_URL} alt="" width={112} height={112} />
          <div className="voyage-boot-ring" />
        </div>

        <p className="voyage-boot-eyebrow">The Pirate&apos;s Port</p>
        <h1 className="voyage-boot-title">
          Alan <em>Luk</em>
        </h1>
        <p className="voyage-boot-status">{error ? 'Signal lost — you may continue ashore.' : label}</p>

        <div className="voyage-boot-bar" aria-hidden>
          <div className="voyage-boot-bar-fill" style={{ width: `${pct}%` }} />
          <div className="voyage-boot-bar-sheen" />
        </div>
        <div className="voyage-boot-meta">
          <span>{pct}%</span>
          <span>Preparing the voyage</span>
        </div>

        <button type="button" className="voyage-boot-skip" onClick={onSkip}>
          {error ? 'Enter anyway' : canSkip ? 'Skip & enter' : 'Enter now'}
        </button>
      </div>
    </div>
  )
}
