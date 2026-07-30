'use client'
import Navbar from './components/Navbar'
import ProjectSlider from './components/ProjectSlider'
import ScrollReveal from './components/ScrollReveal'
import TypeWriter from './components/TypeWriter'
import ProjectCard from './components/ProjectCard'
import HeroBouncePreview from './components/HeroBouncePreview'
import { myProjects, otherProjects, certificates, workExperience } from './data'

const techStack = [
  { icon: 'fas fa-cube', label: 'Three.js' },
  { icon: 'fab fa-node-js', label: 'Node.js' },
  { icon: 'fab fa-js', label: 'TypeScript' },
  { icon: 'fab fa-react', label: 'React' },
  { icon: 'fas fa-server', label: 'Next.js' },
  { icon: 'fas fa-robot', label: 'AI APIs' },
  { icon: 'fas fa-plug', label: 'API Integration' },
  { icon: 'fas fa-film', label: 'Media tooling' },
  { icon: 'fas fa-leaf', label: 'MongoDB' },
  { icon: 'fab fa-git-alt', label: 'Git' },
]

export default function Home() {
  return (
    <div className="page-wrapper">
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>
            Hi, I&apos;m <span className="name"><TypeWriter text="Alan Luk" speed={95} /></span>
            <span className="tagline">Computer Science student · AI &amp; Full-stack</span>
          </h1>
          <p className="hero-desc">
            I build AI-powered automation and full-stack products — from API integrations
            and content pipelines to clean, usable interfaces. Open to internships and junior roles.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn btn-primary">
              <i className="fas fa-briefcase" /> View Projects
            </a>
            <a href="#links" className="btn btn-ghost">
              <i className="fas fa-envelope" /> Contact
            </a>
          </div>
          <HeroBouncePreview />
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── ABOUT ── */}
      <section className="section-wrap about-section" id="about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">About</span>
            <h2 className="section-title">Who I <span>Am</span></h2>
            <div className="section-line" />
          </div>
          <div className="about-grid">
            <ScrollReveal>
              <div className="about-copy">
                <p>
                  I&apos;m a Computer Science student focused on AI automation and full-stack development.
                  During my internship I shipped dashboard features and localization, supported content
                  production, and ran social channels — alongside building the company landing page.
                </p>
                <p>
                  I care about shipping end-to-end: reliable backends, practical product UI,
                  and clear documentation so teammates can move fast.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <ul className="about-focus">
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
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── EXPERIENCE ── */}
      <section className="section-wrap experience-section" id="experience">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Career</span>
            <h2 className="section-title">Work <span>Experience</span></h2>
            <div className="section-line" />
          </div>
          <div className="experience-list">
            {workExperience.map((job, i) => (
              <ScrollReveal key={job.company} delay={i * 80}>
                <article className="experience-card">
                  <div className="experience-top">
                    <div>
                      <h3 className="experience-role">{job.role}</h3>
                      <p className="experience-company">{job.company}</p>
                    </div>
                    <div className="experience-meta">
                      <span>{job.period}</span>
                      <span>{job.location}</span>
                    </div>
                  </div>
                  <ul className="experience-bullets">
                    {job.bullets.map(bullet => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  {job.relatedHref && (
                    <a
                      href={job.relatedHref}
                      className="experience-link"
                      {...(job.relatedHref.startsWith('http')
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      {job.relatedLabel ?? 'View related project'} <i className="fas fa-arrow-right" />
                    </a>
                  )}
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── TECH MARQUEE ── */}
      <section className="marquee-section" aria-label="Technology stack">
        <div className="marquee-outer">
          {[0, 1].map(copy => (
            <div key={copy} className="marquee-track" aria-hidden={copy === 1}>
              {techStack.map((item, i) => (
                <div key={`${copy}-${i}`} className="marquee-item">
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── MY PROJECTS ── */}
      <section className="section-wrap" id="projects">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Selected Work</span>
            <h2 className="section-title">Featured <span>Projects</span></h2>
            <div className="section-line" />
          </div>
          <ScrollReveal>
            <ProjectSlider projects={myProjects} />
          </ScrollReveal>
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── OTHER PROJECTS ── */}
      <section className="section-wrap" id="other-projects">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Additional</span>
            <h2 className="section-title">Experience &amp; <span>Research</span></h2>
            <div className="section-line" />
          </div>
          <div className="project-grid">
            {otherProjects.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 70}>
                <ProjectCard {...p} />
              </ScrollReveal>
            ))}
          </div>
          <h3 className="section-subtitle-head">Certificates</h3>
          <div className="project-grid">
            {certificates.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 70}>
                <ProjectCard {...c} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── CONNECT ── */}
      <section className="links-section" id="links">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Contact</span>
            <h2 className="section-title">Get in <span>Touch</span></h2>
            <div className="section-line" />
          </div>
          <div className="links-container">
            {[
              { href: 'https://www.linkedin.com/in/alan-luk-ho-lung-803ba7302/', icon: 'fab fa-linkedin', label: 'LinkedIn', sub: 'Professional profile' },
              { href: 'https://github.com/alanluk2226', icon: 'fab fa-github', label: 'GitHub', sub: 'Source code & projects' },
              { href: 'mailto:alanluk2226@gmail.com', icon: 'fas fa-envelope', label: 'Email', sub: 'alanluk2226@gmail.com' },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 60}>
                <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="link-card">
                  <div className="link-icon"><i className={item.icon} /></div>
                  <h3>{item.label}</h3>
                  <p>{item.sub}</p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">Alan<span>Luk</span></div>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#links">Contact</a></li>
            </ul>
            <div className="copyright">
              <p>&copy; 2026 Alan Luk</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
