'use client'
import { useEffect, useRef } from 'react'

export default function ScrollReveal({ children, className = '', delay = 0, type = 'up' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect() } },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const typeClass = {
    up: 'reveal',
    scale: 'reveal-scale',
    left: 'reveal-left',
    right: 'reveal-right',
  }[type] || 'reveal'

  return (
    <div ref={ref} className={`${typeClass} ${delay ? `reveal-delay-${delay}` : ''} ${className}`}>
      {children}
    </div>
  )
}
