'use client'
import Navbar from './components/Navbar'
import ProjectSlider from './components/ProjectSlider'
import ScrollReveal from './components/ScrollReveal'
import TypeWriter from './components/TypeWriter'
import CursorGlow from './components/CursorGlow'
import ProjectCard from './components/ProjectCard'
import { myProjects, otherProjects, certificates } from './data'

export default function Home() {
  return (
    <div className="page-wrapper">
      <CursorGlow />
      <Navbar />

      {/* ── HERO ── */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>
            Hi, I&apos;m <span className="name"><TypeWriter text="Alan Luk" speed={80} /></span>
            <span className="tagline">Computer Science student building things that matter.</span>
          </h1>
          <p className="hero-desc">
            Passionate about game development, machine learning, full-stack &amp; UI/UX design,
            and mobile app development. Turning ideas into real experiences.
          </p>
          <div className="hero-btns">
            <a href="#projects" className="btn btn-primary">
              <i className="fas fa-rocket" /> View My Work
            </a>
            <a href="#links" className="btn btn-ghost">
              <i className="fas fa-paper-plane" /> Get In Touch
            </a>
          </div>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── INTERESTS ── */}
      <section className="interests-section">
        <div className="container">
          <div className="interests-grid">
            <ScrollReveal delay={0}><div className="interest-card"><i className="fas fa-gamepad" /><span>Game Development</span></div></ScrollReveal>
            <ScrollReveal delay={100}><div className="interest-card"><i className="fas fa-brain" /><span>Machine Learning</span></div></ScrollReveal>
            <ScrollReveal delay={200}><div className="interest-card"><i className="fas fa-layer-group" /><span>Full-Stack &amp; UI/UX</span></div></ScrollReveal>
            <ScrollReveal delay={300}><div className="interest-card"><i className="fas fa-mobile-alt" /><span>Mobile App Dev</span></div></ScrollReveal>
          </div>
        </div>
      </section>

      <div className="sky-divider" />

      {/* ── TECH MARQUEE ── */}
      <section className="marquee-section">
        <div className="marquee-outer">
          {[0, 1].map(copy => (
            <div key={copy} className="marquee-track" aria-hidden={copy === 1}>
              {[
                { icon: 'fab fa-react',    label: 'React' },
                { icon: 'fab fa-node-js',  label: 'Node.js' },
                { icon: 'fas fa-n',        label: 'Next.js' },
                { icon: 'fas fa-leaf',     label: 'MongoDB' },
                { img: '/assets/images/Render.png',   label: 'Render' },
                { img: '/assets/images/Manus.jpeg',   label: 'Manus AI' },
                { img: '/assets/images/Cursor.png',   label: 'Cursor' },
                { icon: 'fas fa-plug',     label: 'MCP' },
                { img: '/assets/images/Kiro.jpeg',    label: 'Kiro' },
                { img: '/assets/images/Deepseek.png', label: 'DeepSeek' },
                { img: '/assets/images/Genmini.png',  label: 'Gemini' },
              ].map((item, i) => (
                <div key={i} className="marquee-item">
                  {'img' in item
                    ? <img src={item.img} alt={item.label} className="marquee-logo" />
                    : <i className={item.icon} />
                  }
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
            <span className="section-label">Featured Work</span>
            <h2 className="section-title">My <span>Projects</span></h2>
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
            <span className="section-label">Beyond the Horizon</span>
            <h2 className="section-title">Other <span>Experience</span></h2>
            <div className="section-line" />
          </div>
          <div className="project-grid">
            {otherProjects.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 120}>
                <ProjectCard {...p} />
              </ScrollReveal>
            ))}
          </div>
          <h3 className="section-subtitle-head">
            <i className="fas fa-certificate" style={{ color: '#f0c060', marginRight: '10px' }} />
            Certificates
          </h3>
          <div className="project-grid">
            {certificates.map((c, i) => (
              <ScrollReveal key={c.title} delay={i * 120}>
                <ProjectCard {...c} />
              </ScrollReveal>
            ))}
          </div>        </div>
      </section>

      <div className="sky-divider" />

      {/* ── CONNECT ── */}
      <section className="links-section" id="links">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Let&apos;s Talk</span>
            <h2 className="section-title">Connect <span>With Me</span></h2>
            <div className="section-line" />
          </div>
          <div className="links-container">
            {[
              { href: 'https://www.linkedin.com/in/alan-luk-ho-lung-803ba7302/', icon: 'fab fa-linkedin', label: 'LinkedIn', sub: 'Connect professionally' },
              { href: 'https://github.com/alanluk2226', icon: 'fab fa-github', label: 'GitHub', sub: 'View my repositories' },
              { href: 'mailto:alanluk2226@gmail.com', icon: 'fas fa-envelope', label: 'Email', sub: 'Get in touch directly' },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 100}>
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
              <li><a href="#projects">Projects</a></li>
              <li><a href="#other-projects">Other Projects</a></li>
              <li><a href="#links">Connect</a></li>
            </ul>
            <div className="copyright">
              <p>&copy; 2026 Alan Luk &mdash; In the clouds, you can decide anything.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
