/**
 * Knowledge Journey background — a subtle, scroll-linked academic "path" that
 * runs down the side of the landing page and connects its sections.
 *
 * It is purely decorative (aria-hidden, pointer-events: none) and lives behind
 * all content. A thin base path + a scroll-progress highlight + a glowing
 * progress node + milestone dots create the "following a journey" feel.
 *
 * Customization points:
 *  - PATH_D / VIEW_H : path geometry (viewBox units). VIEW_H maps to 100%.
 *  - MILESTONE_FRACTIONS : where along the path the milestone dots sit.
 *  - Colors: CSS variables on `.knowledge-journey` (see globals.css).
 */

import { useEffect, useRef } from 'react'

// Vertical path geometry, viewBox "0 0 100 4000" with preserveAspectRatio="none",
// so it stretches to the real document height. The path sits on the left edge
// and winds gently between x≈2 and x≈15.
const VIEW_H = 4000
const PATH_D =
  'M 6 140 C 10 320, 2 470, 6 640 C 10 830, 2 980, 7 1180 C 12 1380, 3 1540, 8 1760 C 13 1960, 4 2140, 9 2360 C 14 2560, 5 2740, 10 2960 C 15 3160, 6 3340, 11 3560 C 15 3720, 8 3800, 9 3900'

// Fraction of the path at which each milestone dot sits.
const MILESTONE_FRACTIONS = [0.1, 0.34, 0.54, 0.74, 0.9]

// Map landing sections (by id) to a milestone index. When a section enters the
// viewport, its milestone (and every earlier one) lights up.
const SECTIONS: { id: string; milestone: number }[] = [
  { id: 'about', milestone: 0 },
  { id: 'stats', milestone: 1 },
  { id: 'gallery', milestone: 2 },
  { id: 'features', milestone: 3 },
  { id: 'contact', milestone: 4 },
]

// Lorestan identity — faint, abstract, always decorative.
// A minimal stepped tower outline inspired by Falak-ol-Aflak Castle.
const CASTLE_D = 'M42 3755 L42 3730 L46 3730 L46 3720 L51 3720 L51 3730 L55 3730 L55 3755 Z'
// Minimal oak leaf silhouettes.
const LEAF_1_D = 'M30 1180 C 37 1166, 37 1148, 30 1140 C 23 1148, 23 1166, 30 1180 Z'
const LEAF_2_D = 'M33 2960 C 40 2946, 40 2928, 33 2920 C 26 2928, 26 2946, 33 2960 Z'

export default function KnowledgeJourneyBackground() {
  const basePathRef = useRef<SVGPathElement>(null)
  const highlightRef = useRef<SVGPathElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const milestonesRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const base = basePathRef.current
    const highlight = highlightRef.current
    const node = nodeRef.current
    if (!base || !highlight || !node) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Cache the path length in user (viewBox) units; dash metrics use the same
    // space, so they stay consistent regardless of the non-uniform SVG scale.
    const length = base.getTotalLength()
    highlight.style.strokeDasharray = String(length)

    // Place milestone dots at fixed points along the path (user units → %).
    const milestonePoints = MILESTONE_FRACTIONS.map((f) =>
      base.getPointAtLength(length * f),
    )
    milestonesRef.current.forEach((el, i) => {
      if (el && milestonePoints[i]) {
        el.style.left = `${milestonePoints[i].x}%`
        el.style.top = `${(milestonePoints[i].y / VIEW_H) * 100}%`
      }
    })

    let raf = 0
    let lastProgress = -1

    const update = () => {
      raf = 0
      const doc = document.documentElement
      const max = doc.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      // Round to a few decimals so we skip redundant writes during fast scroll.
      const p = Math.round(progress * 1000) / 1000
      if (p === lastProgress) return
      lastProgress = p

      // Advance the highlighted segment along the path.
      highlight.style.strokeDashoffset = String(length * (1 - p))
      // Move the glowing node to the current position on the path.
      const pt = base.getPointAtLength(length * p)
      node.style.left = `${pt.x}%`
      node.style.top = `${(pt.y / VIEW_H) * 100}%`
      // Fade the node/highlight in only as the user actually scrolls.
      node.style.opacity = String(0.35 + p * 0.65)
    }

    const onScroll = () => {
      if (reduceMotion) return
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    // Light up milestones as their section enters the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const match = SECTIONS.find((s) => document.getElementById(s.id) === entry.target)
          if (!match) return
          milestonesRef.current.forEach((el, i) => {
            el?.classList.toggle('is-active', i <= match.milestone)
          })
        })
      },
      { rootMargin: '0px 0px -25% 0px' },
    )
    const targets = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean,
    ) as HTMLElement[]
    targets.forEach((t) => observer.observe(t))

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <div
      className="knowledge-journey absolute inset-0 pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* The winding path + Lorestan identity (scales with the document height). */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 100 ${VIEW_H}`}
        preserveAspectRatio="none"
      >
        {/* Base path — thin, neutral */}
        <path
          ref={basePathRef}
          d={PATH_D}
          fill="none"
          vectorEffect="non-scaling-stroke"
          stroke="var(--kj-base)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Progress highlight — filled in as the user scrolls */}
        <path
          ref={highlightRef}
          d={PATH_D}
          fill="none"
          vectorEffect="non-scaling-stroke"
          stroke="var(--kj-highlight)"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ strokeDashoffset: 0 }}
        />

        {/* Subtle mountain contours near the bottom */}
        <g stroke="var(--kj-muted)" fill="none" vectorEffect="non-scaling-stroke" strokeWidth="1.2" opacity="0.5">
          <path d="M0 3850 C 22 3818, 42 3882, 62 3842 C 82 3802, 92 3866, 100 3834" />
          <path d="M0 3885 C 20 3856, 38 3908, 56 3876 C 74 3844, 86 3896, 100 3862" opacity="0.6" />
        </g>

        {/* Faint Falak-ol-Aflak castle silhouette */}
        <path d={CASTLE_D} fill="var(--kj-muted)" opacity="0.35" />

        {/* Minimal oak-leaf motifs */}
        <path d={LEAF_1_D} fill="var(--kj-muted)" opacity="0.4" />
        <path d={LEAF_2_D} fill="var(--kj-muted)" opacity="0.4" />
      </svg>

      {/* Milestone dots (HTML so they stay perfect circles at any scale) */}
      {MILESTONE_FRACTIONS.map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            milestonesRef.current[i] = el
          }}
          className="kj-milestone"
        />
      ))}

      {/* Glowing progress node */}
      <div ref={nodeRef} className="kj-node" style={{ opacity: 0 }} />
    </div>
  )
}
