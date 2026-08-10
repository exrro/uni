/** Stats section with animated count-up on scroll into view. */

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import GlassCard from '../ui/GlassCard'

const STATS = [
  { value: 15000, suffix: ' نفر', label: 'دانشجو' },
  { value: 500, suffix: ' نفر', label: 'عضو هیأت علمی' },
  { value: 80, suffix: ' رشته', label: 'رشته تحصیلی' },
  { value: 1369, suffix: '', label: 'سال تأسیس' },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const duration = 1500
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <span ref={ref}>
      {display.toLocaleString('fa-IR')}
      {suffix}
    </span>
  )
}

export default function StatsSection() {
  return (
    <section id="stats" className="py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-5">
        {STATS.map((s, i) => (
          <GlassCard key={i} className="text-center py-8">
            <div className="text-3xl sm:text-4xl font-black text-primary dark:text-accent">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{s.label}</div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
