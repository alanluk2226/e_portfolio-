'use client'
import { useRef, useState, useCallback } from 'react'
import ProjectCard from './ProjectCard'
import { ModalImage } from './ImageModal'

interface Link { label: string; href: string }
interface Project {
  title: string
  tags: string[]
  images: ModalImage[]
  description: string
  credentials?: string | null
  links: Link[]
}

interface Props { projects: Project[] }

export default function ProjectSlider({ projects }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(0)

  const total = projects.length

  const goTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, total - 1))
    setCurrent(clamped)
    trackRef.current?.style.setProperty('--slide', String(clamped))
  }, [total])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1))
  }

  return (
    <div className="project-slider">
      <div
        className="project-slider-track"
        ref={trackRef}
        style={{ transform: `translateX(calc(-${current} * (var(--card-w) + var(--card-gap))))` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {projects.map((p, i) => (
          <div key={i} className="project-slider-item">
            <ProjectCard {...p} />
          </div>
        ))}
      </div>

      {current > 0 && (
        <button className="slider-btn slider-btn-prev" onClick={() => goTo(current - 1)} aria-label="Previous">
          &#10094;
        </button>
      )}
      {current < total - 1 && (
        <button className="slider-btn slider-btn-next" onClick={() => goTo(current + 1)} aria-label="Next">
          &#10095;
        </button>
      )}

      <div className="slider-dots">
        {projects.map((_, i) => (
          <button key={i} className={`slider-dot${i === current ? ' active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to project ${i + 1}`} />
        ))}
      </div>
    </div>
  )
}
