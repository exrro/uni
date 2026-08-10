/** Professor info card: department and personnel code. */

import { Building2, Hash } from 'lucide-react'

export default function ProfessorInfoCard({
  personnelCode,
  department,
}: {
  personnelCode: string
  department: string
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <Building2 className="h-5 w-5 text-primary dark:text-accent" />
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">گروه آموزشی</div>
          <div className="font-bold">{department}</div>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 flex items-center gap-3">
        <Hash className="h-5 w-5 text-primary dark:text-accent" />
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">کد استادی</div>
          <div className="font-bold" dir="ltr">{personnelCode}</div>
        </div>
      </div>
    </div>
  )
}
