'use client'
import type { CabinRoom } from '@/app/hooks/useVoyagePhase'

const ROOMS: { id: CabinRoom; label: string; short: string; icon: string }[] = [
  { id: 'quarters', label: "Captain's Quarters", short: 'Quarters', icon: 'fas fa-compass' },
  { id: 'gallery', label: 'Cargo Gallery', short: 'Gallery', icon: 'fas fa-boxes-stacked' },
  { id: 'charts', label: 'Chart Table', short: 'Charts', icon: 'fas fa-scroll' },
  { id: 'contact', label: "Crow's Nest", short: 'Contact', icon: 'fas fa-envelope' },
]

interface Props {
  room: CabinRoom
  onRoom: (room: CabinRoom) => void
  onBack: () => void
  compact?: boolean
}

export default function CabinNav({ room, onRoom, onBack, compact = false }: Props) {
  return (
    <nav className={`cabin-nav${compact ? ' is-compact' : ''}`} aria-label="Cabin rooms">
      <div className="cabin-nav-brand">
        Alan<span>Luk</span>
      </div>
      <div className="cabin-nav-label">Ship log</div>
      <div className="cabin-nav-rooms" role="tablist" aria-label="Log sections">
        {ROOMS.map(r => (
          <button
            key={r.id}
            type="button"
            role="tab"
            className={`cabin-nav-btn${room === r.id ? ' is-active' : ''}`}
            onClick={() => onRoom(r.id)}
            aria-current={room === r.id ? 'page' : undefined}
            aria-selected={room === r.id}
          >
            <i className={r.icon} aria-hidden />
            <span className="cabin-nav-full">{r.label}</span>
            <span className="cabin-nav-short">{r.short}</span>
          </button>
        ))}
      </div>
      <button type="button" className="cabin-nav-btn cabin-back btn-ghost" onClick={onBack}>
        <i className="fas fa-sailboat" aria-hidden />
        <span className="cabin-nav-full">Return to sea</span>
        <span className="cabin-nav-short">Sea</span>
      </button>
      <p className="cabin-credit">
        Ship:{' '}
        <a
          href="https://sketchfab.com/3d-models/pirate-ship-10f35a6dd2c24ac6a27330ebc3ecf356"
          target="_blank"
          rel="noreferrer"
        >
          Pirate_ship
        </a>{' '}
        by{' '}
        <a href="https://sketchfab.com/Kimagure_Cookie" target="_blank" rel="noreferrer">
          Kimagure_Cookie
        </a>{' '}
        (CC BY)
      </p>
    </nav>
  )
}
