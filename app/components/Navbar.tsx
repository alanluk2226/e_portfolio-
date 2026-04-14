'use client'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const scroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="navbar-wrap">
      <nav className="navbar">
        <a href="#home" className="logo" onClick={(e) => scroll(e, '#home')}>
          Alan<span>Luk</span>
        </a>
        <button className="menu-toggle" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          <i className={`fas ${open ? 'fa-times' : 'fa-bars'}`} />
        </button>
        <ul className={`nav-links${open ? ' active' : ''}`}>
          {[['#home','Home'],['#projects','Projects'],['#other-projects','Other Projects'],['#links','Connect']].map(([id, label]) => (
            <li key={id}><a href={id} onClick={(e) => scroll(e, id)}>{label}</a></li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
