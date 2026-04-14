'use client'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export interface ModalImage { src: string; alt: string }

interface Props {
  images: ModalImage[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function ImageModal({ images, index, onClose, onPrev, onNext }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  const toggleZoom = () => imgRef.current?.classList.toggle('zoomed')

  const modal = (
    <div className="modal open" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <button className="modal-close" onClick={onClose}>&times;</button>
      <button className="modal-nav modal-prev" onClick={(e) => { e.stopPropagation(); onPrev() }}>&#10094;</button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="modal-img"
        ref={imgRef}
        src={images[index]?.src}
        alt={images[index]?.alt}
        onClick={(e) => { e.stopPropagation(); toggleZoom() }}
      />
      <button className="modal-nav modal-next" onClick={(e) => { e.stopPropagation(); onNext() }}>&#10095;</button>
      <div className="modal-caption">
        <span className="modal-counter">{index + 1} / {images.length}</span>
        <p>{images[index]?.alt}</p>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}
