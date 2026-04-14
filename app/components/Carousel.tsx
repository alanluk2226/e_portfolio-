'use client'
import { useState } from 'react'
import ImageModal, { ModalImage } from './ImageModal'

interface Props { images: ModalImage[]; single?: boolean }

export default function Carousel({ images, single = false }: Props) {
  const [current, setCurrent] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalIdx, setModalIdx] = useState(0)

  const openModal = (i: number) => { setModalIdx(i); setModalOpen(true) }

  if (single || images.length === 1) {
    return (
      <div className="project-img-carousel">
        <div className="single-image-container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0].src} alt={images[0].alt} className="project-image" onClick={() => openModal(0)} />
        </div>
        <button className="zoom-btn" onClick={() => openModal(0)} title="Zoom">
          <i className="fas fa-expand-alt" />
        </button>
        {modalOpen && (
          <ImageModal images={images} index={modalIdx} onClose={() => setModalOpen(false)} onPrev={() => {}} onNext={() => {}} />
        )}
      </div>
    )
  }

  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length)
  const next = () => setCurrent(i => (i + 1) % images.length)

  return (
    <div className="project-img-carousel">
      <div className="carousel-container">
        <div
          className="carousel-slides"
          style={{ width: `${images.length * 100}%`, transform: `translateX(-${current * (100 / images.length)}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="carousel-slide" style={{ width: `${100 / images.length}%` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.src} alt={img.alt} className="carousel-image" onClick={() => openModal(i)} />
            </div>
          ))}
        </div>
        <button className="carousel-prev" onClick={prev}>&#10094;</button>
        <button className="carousel-next" onClick={next}>&#10095;</button>
        <div className="carousel-dots">
          {images.map((_, i) => (
            <button key={i} className={`dot${i === current ? ' active' : ''}`} onClick={() => setCurrent(i)} />
          ))}
        </div>
      </div>
      <button className="zoom-btn" onClick={() => openModal(current)} title="Zoom">
        <i className="fas fa-expand-alt" />
      </button>
      {modalOpen && (
        <ImageModal
          images={images}
          index={modalIdx}
          onClose={() => setModalOpen(false)}
          onPrev={() => setModalIdx(i => (i - 1 + images.length) % images.length)}
          onNext={() => setModalIdx(i => (i + 1) % images.length)}
        />
      )}
    </div>
  )
}
