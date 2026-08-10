/** Composed magnetic + ripple button for primary CTAs. */

import type { ReactNode } from 'react'
import MagneticButton from './MagneticButton'
import RippleButton from './RippleButton'

export default function MagneticRippleButton({
  children,
  className = '',
  onClick,
  disabled,
}: {
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  disabled?: boolean
}) {
  return (
    <MagneticButton className={className}>
      <RippleButton
        disabled={disabled}
        className="rounded-2xl bg-primary text-white dark:bg-accent dark:text-surface-dark px-8 py-3.5 text-base font-bold shadow-lg shadow-primary/30 transition-colors hover:bg-primary-light dark:hover:bg-accent-light"
        onClick={onClick}
      >
        {children}
      </RippleButton>
    </MagneticButton>
  )
}
