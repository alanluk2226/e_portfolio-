import Carousel from './Carousel'
import SpotlightCard from './SpotlightCard/SpotlightCard'
import { ModalImage } from './ImageModal'
import type { ProjectCategory } from '@/app/data'

interface Link {
  label: string
  href: string
}

interface Props {
  title: string
  category?: ProjectCategory
  tags: string[]
  images: ModalImage[]
  description: string
  credentials?: string | null
  links: Link[]
}

export default function ProjectCard({
  title,
  category,
  tags,
  images,
  description,
  credentials,
  links,
}: Props) {
  return (
    <SpotlightCard className="project-spotlight" spotlightColor="rgba(212, 165, 116, 0.28)">
      <div className="project-card">
        {category && (
          <div className={`project-category project-category--${category.toLowerCase()}`}>
            {category}
          </div>
        )}
        <Carousel images={images} single={images.length === 1} />
        <div className="project-info">
          <h3>{title}</h3>
          {tags.length > 0 && (
            <div className="project-tags">
              {tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <p>{description}</p>
          {credentials && (
            <div className="credentials-box">
              {credentials.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
          {links.length > 0 && (
            <div className="card-links">
              {links.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  className="btn btn-ghost btn-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </SpotlightCard>
  )
}
