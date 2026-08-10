/** CSS-only slowly shifting gradient backdrop. */

export default function AnimatedGradientBackground({ className = '' }: { className?: string }) {
  return (
    <div
      className={`fixed inset-0 -z-10 gradient-bg opacity-20 dark:opacity-30 ${className}`}
      aria-hidden="true"
    />
  )
}
