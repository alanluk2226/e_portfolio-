'use client'
import CabinRoomContent, { ROOM_META } from './CabinRoomContent'
import type { CabinRoom } from '@/app/hooks/useVoyagePhase'

interface Props {
  room: CabinRoom
  onClose: () => void
  onRoom: (room: CabinRoom) => void
}

export default function CabinPanel({ room, onClose, onRoom }: Props) {
  return (
    <div
      className="cabin-panel-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={ROOM_META[room].title}
    >
      <div className="cabin-panel-sheet">
        <header className="cabin-panel-header">
          <div className="cabin-panel-tabs" role="tablist">
            {(Object.keys(ROOM_META) as CabinRoom[]).map(id => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={room === id}
                className={`cabin-panel-tab${room === id ? ' is-active' : ''}`}
                onClick={() => onRoom(id)}
              >
                {ROOM_META[id].eyebrow}
              </button>
            ))}
          </div>
          <button type="button" className="cabin-panel-close" onClick={onClose} aria-label="Close panel">
            <i className="fas fa-times" aria-hidden />
          </button>
        </header>
        <div className="cabin-panel-body">
          <CabinRoomContent room={room} onRoom={onRoom} />
        </div>
      </div>
    </div>
  )
}
