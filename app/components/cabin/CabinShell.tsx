'use client'
import { useEffect } from 'react'
import CabinNav from './CabinNav'
import CabinRoomContent from './CabinRoomContent'
import type { CabinRoom } from '@/app/hooks/useVoyagePhase'

interface Props {
  room: CabinRoom
  onRoom: (room: CabinRoom) => void
  onBack: () => void
  compact?: boolean
}

export default function CabinShell({ room, onRoom, onBack, compact = false }: Props) {
  useEffect(() => {
    document.getElementById('cabin-main-scroll')?.scrollTo(0, 0)
  }, [room])

  return (
    <div
      className={`cabin-shell${compact ? ' is-compact' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Ship cabin portfolio"
    >
      <CabinNav room={room} onRoom={onRoom} onBack={onBack} compact={compact} />
      <main className="cabin-main" id="cabin-main-scroll">
        <CabinRoomContent room={room} onRoom={onRoom} />
      </main>
    </div>
  )
}
