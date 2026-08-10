/** Glass card: blurred translucent surface with gradient border and hover lift. */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function GlassCard({
  children,
  className = '',
  hover = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative rounded-3xl p-6 glass shadow-xl shadow-slate-900/5 dark:shadow-black/30 ${className}`}
    >
      {children}
    </motion.div>
  )
}
