/** Magnetic effect: element shifts toward the cursor, springed back on leave. */

import { useEffect, useRef } from 'react'
import { useSpring, useMotionValue } from 'framer-motion'

export function useMagnetic(maxOffset = 15) {
  const ref = useRef<HTMLDivElement | null>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 })
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(hover: hover)').matches) return // touch: degrade gracefully

    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const radius = Math.max(rect.width, rect.height) * 1.5
      if (dist > radius) {
        x.set(0)
        y.set(0)
        return
      }
      const strength = 1 - dist / radius
      x.set(dx * strength * (maxOffset / Math.max(rect.width, 50)))
      y.set(dy * strength * (maxOffset / Math.max(rect.height, 50)))
    }
    const leave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => {
      el.removeEventListener('mousemove', move)
      el.removeEventListener('mouseleave', leave)
    }
  }, [x, y, maxOffset])

  return { ref, x: springX, y: springY }
}
