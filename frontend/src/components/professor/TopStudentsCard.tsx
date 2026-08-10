/** Top students ranked cards with gold/silver/bronze accents. */

import { motion } from 'framer-motion'
import { Trophy, Medal } from 'lucide-react'

interface TopStudent {
  student_number: string
  full_name: string
  average_grade: number
}

const MEDALS = [
  { border: 'border-amber-400', text: 'text-amber-500', label: 'رتبه اول', icon: Trophy },
  { border: 'border-slate-400', text: 'text-slate-500', label: 'رتبه دوم', icon: Medal },
  { border: 'border-orange-300', text: 'text-orange-500', label: 'رتبه سوم', icon: Medal },
]

export default function TopStudentsCard({ students }: { students: TopStudent[] }) {
  if (!students.length) {
    return <div className="text-center text-sm text-slate-400 py-8">هنوز نمره‌ای ثبت نشده است</div>
  }
  return (
    <div className="space-y-3">
      {students.map((s, i) => {
        const medal = MEDALS[i] ?? MEDALS[2]
        return (
          <motion.div
            key={s.student_number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className={`rounded-2xl border-2 ${medal.border} bg-white/50 dark:bg-white/5 p-4 flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <medal.icon className={`h-6 w-6 ${medal.text}`} />
              <div>
                <div className="font-bold">{s.full_name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{medal.label}</div>
              </div>
            </div>
            <div className="text-xl font-black text-primary dark:text-accent">
              {s.average_grade.toLocaleString('fa-IR')}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
