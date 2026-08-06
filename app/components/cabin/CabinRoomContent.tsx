'use client'
import type { CabinRoom } from '@/app/hooks/useVoyagePhase'
import ProjectCard from '../ProjectCard'
import { myProjects, otherProjects, certificates, workExperience } from '@/app/data'

export const TECH = [
  { icon: 'fas fa-cube', label: 'Three.js' },
  { icon: 'fab fa-react', label: 'React' },
  { icon: 'fas fa-server', label: 'Next.js' },
  { icon: 'fab fa-js', label: 'TypeScript' },
  { icon: 'fab fa-node-js', label: 'Node.js' },
  { icon: 'fas fa-robot', label: 'AI APIs' },
  { icon: 'fas fa-leaf', label: 'MongoDB' },
  { icon: 'fab fa-git-alt', label: 'Git' },
]

export const ROOM_META: Record<CabinRoom, { eyebrow: string; title: string }> = {
  quarters: { eyebrow: "Captain's Quarters", title: 'Who I Am' },
  gallery: { eyebrow: 'Cargo Hold', title: 'Featured Projects' },
  charts: { eyebrow: 'Chart Table', title: 'Certificates & Stack' },
  contact: { eyebrow: "Crow's Nest", title: 'Get in Touch' },
}

interface Props {
  room: CabinRoom
  onRoom?: (room: CabinRoom) => void
}

export default function CabinRoomContent({ room, onRoom }: Props) {
  if (room === 'quarters') {
    return (
      <section className="cabin-room" id="cabin-quarters">
        <p className="cabin-eyebrow">{ROOM_META.quarters.eyebrow}</p>
        <h1 className="cabin-title">{ROOM_META.quarters.title}</h1>
        <p className="cabin-lead">
          Computer Science student focused on AI automation and full-stack development.
          During my internship I shipped dashboard features and localization, supported content
          production, and built the company landing page — always aiming to ship end-to-end.
        </p>
        <ul className="about-points">
          <li>
            <i className="fas fa-robot" />
            <div>
              <strong>AI &amp; content tooling</strong>
              <span>AI-assisted production workflows and social operations</span>
            </div>
          </li>
          <li>
            <i className="fas fa-code" />
            <div>
              <strong>Full-stack engineering</strong>
              <span>Node.js, TypeScript, APIs, React / Next.js, databases</span>
            </div>
          </li>
          <li>
            <i className="fas fa-plug" />
            <div>
              <strong>API integration</strong>
              <span>External services, media tooling, production workflows</span>
            </div>
          </li>
        </ul>

        <h2 className="cabin-subtitle">Work Experience</h2>
        {workExperience.map(job => (
          <article key={job.company} className="cabin-panel">
            <h3>{job.role}</h3>
            <div className="meta">
              <span>{job.company}</span>
              <span>{job.period}</span>
              <span>{job.location}</span>
            </div>
            <ul>
              {job.bullets.map(b => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            {job.relatedHref && (
              <a
                className="inline-link"
                href={job.relatedHref}
                {...(job.relatedHref.startsWith('http')
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
                onClick={e => {
                  if (job.relatedHref === '#projects') {
                    e.preventDefault()
                    onRoom?.('gallery')
                  }
                }}
              >
                {job.relatedLabel ?? 'View related'} <i className="fas fa-arrow-right" />
              </a>
            )}
          </article>
        ))}
      </section>
    )
  }

  if (room === 'gallery') {
    return (
      <section className="cabin-room" id="cabin-gallery">
        <p className="cabin-eyebrow">{ROOM_META.gallery.eyebrow}</p>
        <h1 className="cabin-title">{ROOM_META.gallery.title}</h1>
        <p className="cabin-lead">
          Selected work from internships, full-stack builds, and mobile experiments.
        </p>
        <div className="cabin-grid">
          {myProjects.map(p => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
        <h2 className="cabin-subtitle">Experience &amp; Research</h2>
        <div className="cabin-grid">
          {otherProjects.map(p => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </section>
    )
  }

  if (room === 'charts') {
    return (
      <section className="cabin-room" id="cabin-charts">
        <p className="cabin-eyebrow">{ROOM_META.charts.eyebrow}</p>
        <h1 className="cabin-title">{ROOM_META.charts.title}</h1>
        <p className="cabin-lead">
          Navigation charts for the tools I sail with — plus NVIDIA credentials from Talent Foundry.
        </p>
        <div className="tech-chip-row" aria-label="Technology stack">
          {TECH.map(t => (
            <span key={t.label} className="tech-chip">
              <i className={t.icon} aria-hidden />
              {t.label}
            </span>
          ))}
        </div>
        <h2 className="cabin-subtitle">Certificates</h2>
        <div className="cabin-grid">
          {certificates.map(c => (
            <ProjectCard key={c.title} {...c} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="cabin-room" id="cabin-contact">
      <p className="cabin-eyebrow">{ROOM_META.contact.eyebrow}</p>
      <h1 className="cabin-title">{ROOM_META.contact.title}</h1>
      <p className="cabin-lead">
        Signal the ship — open to internships and junior roles in AI &amp; full-stack.
      </p>
      <div className="contact-grid">
        <a
          className="contact-card"
          href="https://www.linkedin.com/in/alan-luk-ho-lung-803ba7302/"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-linkedin" />
          <strong>LinkedIn</strong>
          <span>Professional profile</span>
        </a>
        <a
          className="contact-card"
          href="https://github.com/alanluk2226"
          target="_blank"
          rel="noreferrer"
        >
          <i className="fab fa-github" />
          <strong>GitHub</strong>
          <span>Source code &amp; projects</span>
        </a>
        <a className="contact-card" href="mailto:alanluk2226@gmail.com">
          <i className="fas fa-envelope" />
          <strong>Email</strong>
          <span>alanluk2226@gmail.com</span>
        </a>
      </div>
    </section>
  )
}
