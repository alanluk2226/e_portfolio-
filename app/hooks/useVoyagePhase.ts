'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export type VoyagePhase = 'voyage' | 'deck' | 'cabin'
export type CabinRoom = 'quarters' | 'gallery' | 'charts' | 'contact'

/** Phones + iPads / touch tablets — skip FPS deck/cabin, use HTML logbook. */
function detectTouchUi(): boolean {
  if (typeof window === 'undefined') return false
  const narrow = window.matchMedia('(max-width: 900px)').matches
  const tabletWidth = window.matchMedia('(max-width: 1180px)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const noHover = window.matchMedia('(hover: none)').matches
  const multiTouch = navigator.maxTouchPoints > 1
  const iPadLike =
    /iPad|Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints > 1
  return narrow || iPadLike || (tabletWidth && (coarse || noHover || multiTouch))
}

export function useVoyagePhase() {
  const [phase, setPhase] = useState<VoyagePhase>('voyage')
  const [room, setRoom] = useState<CabinRoom>('quarters')
  const [panelOpen, setPanelOpen] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scenePhase, setScenePhase] = useState<VoyagePhase>('voyage')
  const [sceneActive, setSceneActive] = useState(true)
  const didAutoLogbook = useRef(false)

  const htmlCabinOnly = reduceMotion || isMobile

  useEffect(() => {
    const mqMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      const motion = mqMotion.matches
      const touch = detectTouchUi()
      setReduceMotion(motion)
      setIsMobile(touch)

      // Phone / iPad / reduced-motion: land directly in the HTML logbook once
      if (!didAutoLogbook.current && (motion || touch)) {
        didAutoLogbook.current = true
        setPhase('cabin')
        setRoom('quarters')
        setPanelOpen(false)
        setSceneActive(false)
      }
    }
    sync()
    mqMotion.addEventListener('change', sync)
    window.addEventListener('resize', sync)
    window.addEventListener('orientationchange', sync)
    return () => {
      mqMotion.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
      window.removeEventListener('orientationchange', sync)
    }
  }, [])

  const goBoard = useCallback(() => {
    if (htmlCabinOnly) {
      setPhase('cabin')
      setRoom('quarters')
      setPanelOpen(false)
      setSceneActive(false)
      return
    }
    setPhase('deck')
    setScenePhase('deck')
    setSceneActive(true)
    setPanelOpen(false)
  }, [htmlCabinOnly])

  const enterCabin = useCallback(() => {
    if (htmlCabinOnly) {
      setPhase('cabin')
      setPanelOpen(false)
      setSceneActive(false)
      return
    }
    setPhase('cabin')
    setScenePhase('cabin')
    setSceneActive(false)
    setPanelOpen(false)
  }, [htmlCabinOnly])

  const backToSea = useCallback(() => {
    setPhase('voyage')
    setScenePhase('voyage')
    setSceneActive(true)
    setRoom('quarters')
    setPanelOpen(false)
  }, [])

  const backToDeck = useCallback(() => {
    if (htmlCabinOnly) {
      backToSea()
      return
    }
    setPhase('deck')
    setScenePhase('deck')
    setSceneActive(true)
    setPanelOpen(false)
  }, [htmlCabinOnly, backToSea])

  const openLogbook = useCallback(
    (target: CabinRoom = 'gallery') => {
      setRoom(target)
      setPhase('cabin')
      if (htmlCabinOnly) {
        setSceneActive(false)
        setPanelOpen(false)
      } else {
        setScenePhase('cabin')
        setSceneActive(false)
        setPanelOpen(true)
      }
    },
    [htmlCabinOnly]
  )

  const openPanel = useCallback((target: CabinRoom) => {
    setRoom(target)
    setPanelOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
  }, [])

  return {
    phase,
    room,
    setRoom,
    panelOpen,
    openPanel,
    closePanel,
    reduceMotion,
    isMobile,
    htmlCabinOnly,
    scenePhase,
    sceneActive,
    goBoard,
    enterCabin,
    backToSea,
    backToDeck,
    openLogbook,
  }
}
