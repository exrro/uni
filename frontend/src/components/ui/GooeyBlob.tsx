/** Gooey blob: overlapping blurred circles animated with Framer Motion, merged via SVG filter. */

import { motion } from 'framer-motion'

const COLORS = ['#1E3A5F', '#C9A227', '#2C5A8C']

export default function GooeyBlob({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 600 600" aria-hidden="true">
      <defs>
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -15"
            result="goo"
          />
        </filter>
      </defs>
      <g filter="url(#gooey)">
        {COLORS.map((color, i) => (
          <motion.circle
            key={i}
            cx={300}
            cy={300}
            r={80 + i * 25}
            fill={color}
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{
              duration: 9 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ opacity: 0.5 }}
          />
        ))}
      </g>
    </svg>
  )
}
