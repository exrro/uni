/** Step 1: role selection with animated highlight. */

import { motion } from 'framer-motion'
import { GraduationCap, UserRound, ShieldCheck } from 'lucide-react'

const ROLES = [
  { key: 'student', label: 'دانشجو', icon: GraduationCap },
  { key: 'professor', label: 'استاد', icon: UserRound },
  { key: 'admin', label: 'ادمین', icon: ShieldCheck },
]

export default function RoleSelector({
  value,
  onSelect,
}: {
  value: string
  onSelect: (role: string) => void
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {ROLES.map((r) => {
        const selected = value === r.key
        return (
          <motion.button
            key={r.key}
            type="button"
            onClick={() => onSelect(r.key)}
            whileTap={{ scale: 0.95 }}
            animate={{ scale: selected ? 1.05 : 1 }}
            className={`flex flex-col items-center gap-2 rounded-2xl p-4 border-2 transition-colors ${
              selected
                ? 'border-primary dark:border-accent bg-primary/10 dark:bg-accent/10'
                : 'border-slate-200 dark:border-slate-700 hover:border-primary/40'
            }`}
          >
            <r.icon className={`h-8 w-8 ${selected ? 'text-primary dark:text-accent' : 'text-slate-400'}`} />
            <span className="font-bold text-sm">{r.label}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
