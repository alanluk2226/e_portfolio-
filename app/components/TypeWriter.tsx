'use client'
import { useEffect, useState } from 'react'

interface Props { text: string; speed?: number; className?: string }

export default function TypeWriter({ text, speed = 60, className = '' }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typewriter-cursor">|</span>}
    </span>
  )
}
