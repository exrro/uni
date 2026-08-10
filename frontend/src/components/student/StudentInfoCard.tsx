/** Student info card: number, major, total units. */

import { BadgeCheck, BookOpen, Hash } from 'lucide-react'

export default function StudentInfoCard({
  studentNumber,
  major,
  totalUnits,
}: {
  studentNumber: string
  major: string
  totalUnits: number
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <Hash className="h-5 w-5 text-primary dark:text-accent" />
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">شماره دانشجویی</div>
          <div className="font-bold" dir="ltr">{studentNumber}</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <BadgeCheck className="h-5 w-5 text-primary dark:text-accent" />
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">رشته تحصیلی</div>
          <div className="font-bold">{major}</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <BookOpen className="h-5 w-5 text-primary dark:text-accent" />
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">واحدهای ترم</div>
          <div className="font-bold">{totalUnits.toLocaleString('fa-IR')} واحد</div>
        </div>
      </div>
    </div>
  )
}
