/**
 * Refined scroll hint for the hero — a small "knowledge path" node with a
 * gently moving glow dot and a minimal Persian label. It fades out once the
 * user scrolls, and is fully disabled under prefers-reduced-motion.
 */

import { useEffect, useState } from 'react'

export default function HeroScrollHint() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setHidden(window.scrollY > 40)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      className={`hero-scroll-hint ${hidden ? 'is-hidden' : ''}`}
      aria-hidden="true"
    >
      <span className="hero-scroll-hint__line">
        <span className="hero-scroll-hint__dot" />
      </span>
      <span className="hero-scroll-hint__label">مسیر یادگیری را دنبال کنید</span>
    </div>
  )
}
