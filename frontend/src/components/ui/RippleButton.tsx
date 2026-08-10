/** Button with click-ripple effect (expanding circle from click point). */

import type { ReactNode } from 'react'
import { useRipple } from '../../hooks/useRipple'

export default function RippleButton({
  children,
  className = '',
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  const { ripples, createRipple } = useRipple()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e)
    onClick?.(e)
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {ripples.map((r) => (
        <span
          key={r.key}
          className="ripple-ink"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </button>
  )
}
