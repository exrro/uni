/**
 * AmbientBackground — layered "depth" system for the landing page (light-first).
 *
 * Three purely decorative layers, all aria-hidden + pointer-events:none:
 *  1. Ambient radial glows  — large, very soft indigo/blue blurred glows that
 *     sit behind the major sections, giving the white surface a premium, deep
 *     academic feel without a flat #FFFFFF look.
 *  2. Topographic linework — ultra-thin abstract contour lines inspired by
 *     Lorestan's mountains / university architecture. Kept in the background.
 *  3. Grain / noise        — an inline SVG turbulence texture at ~3% opacity to
 *     give the surface a subtle paper-like quality.
 *
 * Light theme is the priority; every color is a CSS variable so the existing
 * dark-mode toggle re-themes these automatically (see globals.css).
 */

import { useEffect, useRef } from 'react'

// Sections whose ambient glow should "activate" (brighten) on scroll into view.
const SECTIONS = ['about', 'stats', 'gallery', 'features', 'contact']

export default function AmbientBackground() {
  const glowRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Brighten the ambient glow behind a section when it enters the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = SECTIONS.indexOf(entry.target.id)
          if (idx === -1) return
          glowRefs.current.forEach((el, i) => {
            el?.classList.toggle('is-active', i === idx)
          })
        })
      },
      { rootMargin: '0px 0px -20% 0px' },
    )
    const targets = SECTIONS.map((id) => document.getElementById(id)).filter(
      Boolean,
    ) as HTMLElement[]
    targets.forEach((t) => observer.observe(t))

    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="ambient-background absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* 1. Ambient radial glows (one per major section) */}
      <div className="ambient-glow ambient-glow--hero" />
      {SECTIONS.map((id, i) => (
        <div
          key={id}
          ref={(el) => {
            glowRefs.current[i] = el
          }}
          className="ambient-glow"
          data-section={id}
        />
      ))}

      {/* 2. Topographic / academic contour linework */}
      <svg
        className="topographic-lines absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g className="topo-g topo-g--1">
          <path d="M-40 120 C 180 40, 320 210, 540 150 C 760 90, 920 260, 1140 190 C 1300 142, 1420 170, 1540 140" />
          <path d="M-40 170 C 180 96, 320 250, 540 198 C 760 146, 920 300, 1140 240 C 1300 200, 1420 224, 1540 200" opacity="0.7" />
        </g>
        <g className="topo-g topo-g--2">
          <path d="M-40 420 C 200 340, 420 500, 640 430 C 860 360, 1060 520, 1280 450 C 1360 420, 1420 440, 1540 410" />
          <path d="M-40 470 C 200 396, 420 540, 640 478 C 860 416, 1060 560, 1280 498 C 1360 472, 1420 490, 1540 464" opacity="0.7" />
        </g>
        <g className="topo-g topo-g--3">
          <path d="M-40 720 C 220 640, 440 790, 660 720 C 880 650, 1080 810, 1300 740 C 1380 712, 1440 730, 1540 700" />
          <path d="M-40 770 C 220 696, 440 830, 660 768 C 880 706, 1080 850, 1300 788 C 1380 764, 1440 780, 1540 754" opacity="0.7" />
        </g>
      </svg>

      {/* 3. Grain / noise texture (inline SVG turbulence, ~3% opacity) */}
      <div className="grain-overlay" />
    </div>
  )
}
