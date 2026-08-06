'use client'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useVoyagePhase } from './hooks/useVoyagePhase'
import CabinShell from './components/cabin/CabinShell'
import CabinPanel from './components/cabin/CabinPanel'
import {
  WEATHER_OPTIONS,
  type WeatherKind,
} from './components/voyage/weatherTypes'

const VoyageScene = dynamic(() => import('./components/voyage/VoyageScene'), { ssr: false })
const CabinScene = dynamic(() => import('./components/cabin/CabinScene'), { ssr: false })

export default function Home() {
  const {
    phase,
    room,
    setRoom,
    panelOpen,
    openPanel,
    closePanel,
    reduceMotion,
    htmlCabinOnly,
    scenePhase,
    sceneActive,
    goBoard,
    enterCabin,
    backToSea,
    backToDeck,
    openLogbook,
  } = useVoyagePhase()

  const [weather, setWeather] = useState<WeatherKind>('clear')

  const showHero = phase === 'voyage'
  const showDeck = phase === 'deck'
  const showCabin3d = phase === 'cabin' && !htmlCabinOnly
  const showCabinHtml = phase === 'cabin' && htmlCabinOnly
  // Weather / orbit controls are desktop voyage toys
  const showWeather = !htmlCabinOnly && (phase === 'voyage' || phase === 'deck')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (phase === 'deck') {
        backToSea()
        return
      }
      if (phase !== 'cabin') return
      if (panelOpen) {
        closePanel()
        return
      }
      backToDeck()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, panelOpen, closePanel, backToSea, backToDeck])

  return (
    <div className={`voyage-app${htmlCabinOnly ? ' touch-ui' : ''}`}>
      <a
        className="skip-link"
        href="#cabin-main-skip"
        onClick={e => {
          e.preventDefault()
          openLogbook('quarters')
        }}
      >
        Skip to cabin content
      </a>

      {/* Touch / reduced-motion: skip loading the sea canvas until they return from the logbook */}
      {(!htmlCabinOnly || sceneActive) && (
        <VoyageScene
          phase={scenePhase === 'cabin' ? 'deck' : scenePhase}
          active={sceneActive && phase !== 'cabin'}
          reduceMotion={reduceMotion || htmlCabinOnly}
          weather={weather}
          onEnterCabin={enterCabin}
        />
      )}

      {!htmlCabinOnly && (
        <CabinScene active={showCabin3d} panelOpen={panelOpen} onSelect={openPanel} />
      )}

      {showWeather && (
        <div className="weather-switch" role="group" aria-label="Weather">
          {WEATHER_OPTIONS.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={weather === opt.id ? 'is-active' : undefined}
              aria-pressed={weather === opt.id}
              onClick={() => setWeather(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {showHero && (
        <header className="voyage-hero">
          <h1 className="voyage-brand">
            Alan <em>Luk</em>
          </h1>
          <p className="voyage-tagline">
            {htmlCabinOnly
              ? 'Computer Science student · AI & Full-stack. Open the logbook to explore projects and experience.'
              : 'Computer Science student · AI & Full-stack. Board the pirate ship to explore the logbook.'}
          </p>
          {!htmlCabinOnly && <p className="voyage-hint">Drag to orbit · Scroll to zoom</p>}
          <div className="voyage-actions">
            {htmlCabinOnly ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => openLogbook('quarters')}
              >
                <i className="fas fa-book-open" aria-hidden /> View logbook
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-primary" onClick={goBoard}>
                  <i className="fas fa-anchor" aria-hidden /> Board the ship
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => openLogbook('gallery')}
                >
                  <i className="fas fa-book-open" aria-hidden /> View logbook
                </button>
              </>
            )}
          </div>
          <p className="asset-credit">
            Ship model:{' '}
            <a
              href="https://sketchfab.com/3d-models/pirate-ship-10f35a6dd2c24ac6a27330ebc3ecf356"
              target="_blank"
              rel="noreferrer"
            >
              &ldquo;Pirate_ship&rdquo;
            </a>{' '}
            by{' '}
            <a href="https://sketchfab.com/Kimagure_Cookie" target="_blank" rel="noreferrer">
              Kimagure_Cookie
            </a>{' '}
            ·{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">
              CC BY 4.0
            </a>
          </p>
        </header>
      )}

      {showDeck && (
        <div className="cabin-hud">
          <p className="cabin-hud-hint">
            Hold &amp; drag to look · WASD to walk the deck · Click the glow by the bell to enter · Esc to sea
          </p>
        </div>
      )}

      {showCabin3d && (
        <div className="cabin-hud">
          <p className="cabin-hud-hint">
            Hold &amp; drag to look · WASD to move · Click the map glow · Esc back to deck
          </p>
          <p className="cabin-hud-credit">
            Cabin:{' '}
            <a
              href="https://sketchfab.com/3d-models/captains-cabin-sketchfab-96056ccf72014b7eb91d4a6dbef69540"
              target="_blank"
              rel="noreferrer"
            >
              Captains Cabin Sketchfab
            </a>{' '}
            by{' '}
            <a href="https://sketchfab.com/KlGrimm" target="_blank" rel="noreferrer">
              KlGrimm
            </a>{' '}
            (CC BY)
          </p>
        </div>
      )}

      {showCabin3d && panelOpen && (
        <CabinPanel room={room} onClose={closePanel} onRoom={setRoom} />
      )}

      {showCabinHtml && (
        <div id="cabin-main-skip">
          <CabinShell
            room={room}
            onRoom={setRoom}
            onBack={backToSea}
            compact={htmlCabinOnly}
          />
        </div>
      )}
    </div>
  )
}
