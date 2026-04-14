import Carousel from './Carousel'
import { ModalImage } from './ImageModal'

interface Link { label: string; href: string }
interface Props {
  title: string
  tags: string[]
  images: ModalImage[]
  description: string
  credentials?: string | null
  links: Link[]
}

export default function ProjectCard({ title, tags, images, description, credentials, links }: Props) {
  return (
    <div className="project-card">
      <Carousel images={images} single={images.length === 1} />
      <div className="project-info">
        <h3>{title}</h3>
        <div className="project-tags">
          {tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <p>{description}</p>
        {credentials && (
          <div className="credentials-box">
            {credentials.split('\n').map((line, i) => <div key={i}>{line}</div>)}
          </div>
        )}
        <div className="card-links">
          {links.map(link => (
            <a key={link.href} href={link.href} className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
