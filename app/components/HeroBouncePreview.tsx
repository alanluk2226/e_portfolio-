'use client'
import BounceCards from './BounceCards/BounceCards'
import { myProjects, otherProjects, certificates } from '../data'

type PreviewItem = { src: string; target: string; label: string }

/** One card each from featured, other work, and certificates — mixed fan */
const PREVIEW_ITEMS: PreviewItem[] = [
  { src: myProjects[0].images[0].src, target: '#projects', label: myProjects[0].title },
  { src: myProjects[1].images[0].src, target: '#projects', label: myProjects[1].title },
  { src: otherProjects[0].images[0].src, target: '#other-projects', label: otherProjects[0].title },
  { src: certificates[0].images[0].src, target: '#other-projects', label: certificates[0].title },
  { src: otherProjects[1].images[0].src, target: '#other-projects', label: otherProjects[1].title },
  { src: certificates[1].images[0].src, target: '#other-projects', label: certificates[1].title },
  { src: myProjects[2].images[0].src, target: '#projects', label: myProjects[2].title },
]

const TRANSFORM_STYLES = [
  'rotate(10deg) translate(-195px)',
  'rotate(6deg) translate(-130px)',
  'rotate(2deg) translate(-65px)',
  'rotate(-2deg)',
  'rotate(-6deg) translate(65px)',
  'rotate(-10deg) translate(130px)',
  'rotate(4deg) translate(195px)',
]

export default function HeroBouncePreview() {
  const images = PREVIEW_ITEMS.map(item => item.src)

  const handleClick = (index: number) => {
    const target = PREVIEW_ITEMS[index]?.target ?? '#projects'
    document.querySelector(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="hero-bounce-wrap">
      <BounceCards
        className="hero-bounce-cards"
        images={images}
        containerWidth={640}
        containerHeight={230}
        animationDelay={0.55}
        animationStagger={0.06}
        easeType="power3.out"
        transformStyles={TRANSFORM_STYLES}
        enableHover
        onCardClick={handleClick}
      />
      <p className="hero-bounce-hint">Projects · Experience · Certificates</p>
    </div>
  )
}
