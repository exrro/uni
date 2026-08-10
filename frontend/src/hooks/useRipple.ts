/** Ripple effect: injects expanding spans at click coordinates, removes after animation. */

import { useCallback, useRef, useState } from 'react'

export interface Ripple {
  key: number
  x: number
  y: number
  size: number
}

export function useRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const counter = useRef(0)

  const createRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2
    const key = ++counter.current
    setRipples((prev) => [...prev, { key, x, y, size }])
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.key !== key))
    }, 600)
  }, [])

  return { ripples, createRipple }
}
