/** Magnetic button: shifts toward cursor on hover, springs back on leave. */

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useMagnetic } from '../../hooks/useMagnetic'

export default function MagneticButton({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}) {
  const { ref, x, y } = useMagnetic(15)

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
