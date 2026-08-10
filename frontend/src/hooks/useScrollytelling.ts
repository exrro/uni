/** Lazy-loads GSAP + ScrollTrigger once and returns a registry to register pins. */

import { useEffect, useRef } from 'react'

export function useScrollytelling() {
  const loadedRef = useRef<boolean>(false)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (cancelled) return
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      loadedRef.current = true
      ScrollTrigger.refresh()
    }

    // Load when the about section nears the viewport.
    const aboutEl = document.getElementById('about')
    if (!aboutEl) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadedRef.current) {
          load()
          io.disconnect()
        }
      },
      { rootMargin: '400px' },
    )
    io.observe(aboutEl)

    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [])

  return { isLoaded: () => loadedRef.current }
}
